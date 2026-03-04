import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

const asNumber = (val, fallback = 0) => {
  const num = Number(val);
  return isNaN(num) ? fallback : num;
};

const toDateValue = (val) => {
  if (!val) return null;
  if (val.toDate) return val.toDate(); // Firestore timestamp
  if (typeof val === 'number') return new Date(val); // JS timestamp
  if (typeof val === 'string') {
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
};

const startOfToday = () => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
};

const monthKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
const monthLabel = (key) => {
  const [y, m] = key.split('-');
  const d = new Date(parseInt(y), parseInt(m) - 1, 1);
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

// Internal function to fetch raw data from Client SDK
const getRawAdminData = async () => {
  const showsSnap = await getDocs(collection(db, 'shows')).catch(e => {
    console.error('Failed to fetch shows:', e);
    return { docs: [] };
  });
  const shows = showsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  const paymentsSnap = await getDocs(collection(db, 'payments')).catch(e => {
    console.error('Failed to fetch payments:', e);
    return { docs: [] };
  });

  const paymentRows = [];
  paymentsSnap.docs.forEach(doc => {
    const p = doc.data();
    if (p.status !== 'paid') return;

    p.id = doc.id;
    p.createdAtDate = toDateValue(p.createdAt);
    p.amountValue = asNumber(p.amount, 0);
    p.seatCountValue = Math.max(asNumber(p.seatCount, 0), 0);
    paymentRows.push(p);
  });

  const showsWithDerived = shows.map(show => {
    let bookedSeats = Array.isArray(show.bookedSeats) ? show.bookedSeats : [];
    bookedSeats = bookedSeats.map(s => parseInt(s)).filter(s => !isNaN(s) && s > 0);

    const configuredSeatsRaw = show.totalSeats || show.available_seats;
    const configuredSeats = asNumber(configuredSeatsRaw, 0);
    const ticketsLeft = Math.max(asNumber(show.ticketsLeft, 0), 0);
    const totalSeats = configuredSeats > 0 ? configuredSeats : Math.max(ticketsLeft + bookedSeats.length, 0);

    const soldSeats = bookedSeats.length;
    const occupancyRate = totalSeats > 0 ? (soldSeats / totalSeats) * 100 : 0;

    return {
      ...show,
      totalSeats,
      soldSeats,
      ticketsLeft,
      occupancyRate,
      showDate: toDateValue(show.date),
      createdAtDate: toDateValue(show.createdAt)
    };
  });

  return { paymentRows, showsWithDerived };
};

export const fetchAdminDashboardData = async () => {
  try {
    const { paymentRows, showsWithDerived } = await getRawAdminData();

    const todayStart = startOfToday();
    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);

    const todaysPayments = paymentRows.filter(p => p.createdAtDate && p.createdAtDate >= todayStart && p.createdAtDate < tomorrowStart);

    const totalRevenue = paymentRows.reduce((sum, p) => sum + p.amountValue, 0);
    const totalTicketsSold = paymentRows.reduce((sum, p) => sum + p.seatCountValue, 0);
    const todayRevenue = todaysPayments.reduce((sum, p) => sum + p.amountValue, 0);
    const bookingsToday = todaysPayments.length;

    const totalCapacity = showsWithDerived.reduce((sum, s) => sum + s.totalSeats, 0);
    const totalBookedSeats = showsWithDerived.reduce((sum, s) => sum + s.soldSeats, 0);
    const conversionRate = totalCapacity > 0 ? (totalBookedSeats / totalCapacity) * 100 : 0;

    const uniqueUsers = new Set();
    paymentRows.forEach(p => p.email && uniqueUsers.add(String(p.email).toLowerCase()));
    showsWithDerived.forEach(s => s.adminEmail && uniqueUsers.add(String(s.adminEmail).toLowerCase()));

    const nowStart = startOfToday();
    const upcomingShows = showsWithDerived.filter(s => s.showDate && s.showDate >= nowStart).length;

    const sortedShows = [...showsWithDerived].sort((a, b) => b.soldSeats - a.soldSeats).slice(0, 5);
    const topShows = sortedShows.map(s => ({
      id: s.id,
      title: s.title || 'Untitled Show',
      soldSeats: s.soldSeats,
      totalSeats: s.totalSeats,
      occupancyRate: s.occupancyRate,
      ticketsLeft: s.ticketsLeft,
      date: s.date || 'TBA'
    }));

    const activityList = [];
    paymentRows.forEach(p => {
      activityList.push({
        id: `payment-${p.id}`,
        type: 'payment',
        status: 'success',
        action: 'Payment received',
        user: p.email || 'Unknown customer',
        details: `${p.eventTitle || 'Show booking'} • ${p.seatCountValue} ticket(s)`,
        amount: p.amountValue,
        timestamp: p.createdAtDate
      });
    });

    showsWithDerived.forEach(s => {
      if (s.createdAtDate) {
        activityList.push({
          id: `show-${s.id}`,
          type: 'show',
          status: 'info',
          action: 'Show published',
          user: s.adminEmail || 'Admin',
          details: s.title || 'Untitled show',
          amount: null,
          timestamp: s.createdAtDate
        });
      }
    });

    const validActivity = activityList.filter(a => a.timestamp);
    validActivity.sort((a, b) => b.timestamp - a.timestamp);

    // JS dates to timestamps
    validActivity.forEach(a => {
      a.timestamp = a.timestamp.getTime();
    });

    return {
      kpis: {
        totalRevenue,
        activeUsers: uniqueUsers.size,
        bookingsToday,
        conversionRate,
        totalTicketsSold,
        totalShows: showsWithDerived.length,
        todayRevenue,
        upcomingShows
      },
      topShows,
      recentActivity: validActivity.slice(0, 8)
    };
  } catch (error) {
    console.error("Dashboard Service Error:", error);
    throw new Error("Failed to load dashboard data from Firebase.");
  }
};

export const fetchAdminAnalyticsData = async () => {
  try {
    const { paymentRows, showsWithDerived } = await getRawAdminData();

    const totalRevenue = paymentRows.reduce((sum, p) => sum + p.amountValue, 0);
    const totalTicketsSold = paymentRows.reduce((sum, p) => sum + p.seatCountValue, 0);
    const totalCapacity = showsWithDerived.reduce((sum, s) => sum + s.totalSeats, 0);
    const totalBookedSeats = showsWithDerived.reduce((sum, s) => sum + s.soldSeats, 0);
    const conversionRate = totalCapacity > 0 ? (totalBookedSeats / totalCapacity) * 100 : 0;

    const today = startOfToday();
    const dayBuckets = [];
    for (let offset = 6; offset >= 0; offset--) {
      const dayStart = new Date(today);
      dayStart.setDate(dayStart.getDate() - offset);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);

      const dayPayments = paymentRows.filter(p => p.createdAtDate && p.createdAtDate >= dayStart && p.createdAtDate < dayEnd);

      dayBuckets.push({
        name: dayStart.toLocaleDateString('en-US', { weekday: 'short' }),
        bookings: dayPayments.length,
        revenue: dayPayments.reduce((sum, p) => sum + p.amountValue, 0),
        tickets: dayPayments.reduce((sum, p) => sum + p.seatCountValue, 0)
      });
    }

    const showPerformance = [...showsWithDerived].sort((a, b) => b.soldSeats - a.soldSeats).slice(0, 8).map(s => ({
      name: s.title || 'Untitled',
      sold: s.soldSeats,
      left: s.ticketsLeft,
      occupancy: Number(s.occupancyRate.toFixed(1))
    }));

    const revenueByShow = {};
    paymentRows.forEach(p => {
      const key = p.eventTitle || 'Unknown show';
      if (!revenueByShow[key]) {
        revenueByShow[key] = { name: key, earnings: 0, tickets: 0, bookings: 0 };
      }
      revenueByShow[key].earnings += p.amountValue;
      revenueByShow[key].tickets += p.seatCountValue;
      revenueByShow[key].bookings += 1;
    });

    const financialBreakdown = Object.values(revenueByShow).sort((a, b) => b.earnings - a.earnings).slice(0, 8);

    return {
      kpis: {
        totalRevenue,
        totalTicketsSold,
        conversionRate
      },
      bookingTrend: dayBuckets,
      showPerformance,
      financialBreakdown
    };
  } catch (error) {
    console.error("Analytics Service Error:", error);
    throw new Error("Failed to load analytics data from Firebase.");
  }
};

export const fetchTotalEarningsData = async () => {
  try {
    const { paymentRows } = await getRawAdminData();

    const totalRevenue = paymentRows.reduce((sum, p) => sum + p.amountValue, 0);
    const totalBookings = paymentRows.length;
    const totalTickets = paymentRows.reduce((sum, p) => sum + p.seatCountValue, 0);

    const categoryBuckets = {};
    paymentRows.forEach(p => {
      const cat = p.eventTitle || 'Unknown Show';
      if (!categoryBuckets[cat]) {
        categoryBuckets[cat] = { key: cat, name: cat, value: 0 };
      }
      categoryBuckets[cat].value += p.amountValue;
    });

    const categories = Object.values(categoryBuckets).sort((a, b) => b.value - a.value).slice(0, 8);

    const monthlyBuckets = {};
    paymentRows.forEach(p => {
      if (!p.createdAtDate) return;
      const k = monthKey(p.createdAtDate);
      if (!monthlyBuckets[k]) {
        monthlyBuckets[k] = { key: k, month: monthLabel(k), revenue: 0, bookings: 0 };
      }
      monthlyBuckets[k].revenue += p.amountValue;
      monthlyBuckets[k].bookings += 1;
    });

    const monthlyRevenue = Object.values(monthlyBuckets).sort((a, b) => a.key.localeCompare(b.key)).slice(-6);

    return {
      summary: {
        totalRevenue,
        totalBookings,
        totalTickets,
        averageOrderValue: totalBookings > 0 ? (totalRevenue / totalBookings) : 0
      },
      categories,
      monthlyRevenue
    };
  } catch (error) {
    console.error("Earnings Service Error:", error);
    throw new Error("Failed to load earnings data from Firebase.");
  }
};
