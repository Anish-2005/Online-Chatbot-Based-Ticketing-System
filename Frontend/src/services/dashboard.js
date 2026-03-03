import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

const asNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toDateValue = (value) => {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value?.toDate === 'function') return value.toDate();

  if (typeof value === 'string') {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return new Date(`${value}T00:00:00`);
    }

    const ddmmyyyy = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (ddmmyyyy) {
      const [, day, month, year] = ddmmyyyy;
      return new Date(`${year}-${month}-${day}T00:00:00`);
    }

    const genericDate = new Date(value);
    return Number.isNaN(genericDate.getTime()) ? null : genericDate;
  }

  return null;
};

const startOfToday = () => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
};

const monthKey = (dateValue) => {
  const year = dateValue.getFullYear();
  const month = String(dateValue.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

const monthLabel = (key) => {
  const [year, month] = key.split('-').map(Number);
  return new Date(year, month - 1, 1).toLocaleString('en-US', { month: 'short', year: 'numeric' });
};

const getRawAdminData = async () => {
  const [showsSnapshot, paymentsSnapshot] = await Promise.all([
    getDocs(collection(db, 'shows')),
    getDocs(collection(db, 'payments')),
  ]);

  const shows = showsSnapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
  const paidPayments = paymentsSnapshot.docs
    .map((item) => ({ id: item.id, ...item.data() }))
    .filter((payment) => payment.status === 'paid');

  const paymentRows = paidPayments.map((payment) => {
    const createdAt = toDateValue(payment.createdAt);
    return {
      ...payment,
      createdAtDate: createdAt,
      amountValue: asNumber(payment.amount, 0),
      seatCountValue: Math.max(asNumber(payment.seatCount, 0), 0),
    };
  });

  const showsWithDerived = shows.map((show) => {
    const bookedSeats = Array.isArray(show.bookedSeats)
      ? show.bookedSeats.map((seat) => asNumber(seat, NaN)).filter((seat) => Number.isInteger(seat) && seat > 0)
      : [];

    const configuredSeatsRaw = show.totalSeats ?? show.available_seats;
    const configuredSeats = asNumber(configuredSeatsRaw, NaN);
    const ticketsLeft = Math.max(asNumber(show.ticketsLeft, 0), 0);
    const totalSeats = Number.isInteger(configuredSeats) && configuredSeats > 0
      ? configuredSeats
      : Math.max(ticketsLeft + bookedSeats.length, 0);

    const soldSeats = bookedSeats.length;
    const occupancyRate = totalSeats > 0 ? (soldSeats / totalSeats) * 100 : 0;
    const showDate = toDateValue(show.date);

    return {
      ...show,
      totalSeats,
      soldSeats,
      ticketsLeft,
      occupancyRate,
      showDate,
      createdAtDate: toDateValue(show.createdAt),
    };
  });

  return {
    paymentRows,
    showsWithDerived,
  };
};

export const fetchAdminDashboardData = async () => {
  const { paymentRows, showsWithDerived } = await getRawAdminData();

  const todayStart = startOfToday();
  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setDate(tomorrowStart.getDate() + 1);

  const todaysPayments = paymentRows.filter((payment) => {
    if (!payment.createdAtDate) return false;
    return payment.createdAtDate >= todayStart && payment.createdAtDate < tomorrowStart;
  });

  const totalRevenue = paymentRows.reduce((sum, payment) => sum + payment.amountValue, 0);
  const totalTicketsSold = paymentRows.reduce((sum, payment) => sum + payment.seatCountValue, 0);
  const todayRevenue = todaysPayments.reduce((sum, payment) => sum + payment.amountValue, 0);
  const bookingsToday = todaysPayments.length;

  const totalCapacity = showsWithDerived.reduce((sum, show) => sum + show.totalSeats, 0);
  const totalBookedSeats = showsWithDerived.reduce((sum, show) => sum + show.soldSeats, 0);
  const conversionRate = totalCapacity > 0 ? (totalBookedSeats / totalCapacity) * 100 : 0;

  const uniqueUsers = new Set();
  paymentRows.forEach((payment) => {
    if (payment.email) uniqueUsers.add(String(payment.email).toLowerCase());
  });
  showsWithDerived.forEach((show) => {
    if (show.adminEmail) uniqueUsers.add(String(show.adminEmail).toLowerCase());
  });

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const upcomingShows = showsWithDerived.filter((show) => show.showDate && show.showDate >= now).length;

  const topShows = [...showsWithDerived]
    .sort((first, second) => second.soldSeats - first.soldSeats)
    .slice(0, 5)
    .map((show) => ({
      id: show.id,
      title: show.title || 'Untitled Show',
      soldSeats: show.soldSeats,
      totalSeats: show.totalSeats,
      occupancyRate: show.occupancyRate,
      ticketsLeft: show.ticketsLeft,
      date: show.date || 'TBA',
    }));

  const paymentActivity = paymentRows.map((payment) => ({
    id: `payment-${payment.id}`,
    type: 'payment',
    status: 'success',
    action: 'Payment received',
    user: payment.email || 'Unknown customer',
    details: `${payment.eventTitle || 'Show booking'} • ${payment.seatCountValue} ticket${payment.seatCountValue === 1 ? '' : 's'}`,
    amount: payment.amountValue,
    timestamp: payment.createdAtDate,
  }));

  const showActivity = showsWithDerived
    .filter((show) => show.createdAtDate)
    .map((show) => ({
      id: `show-${show.id}`,
      type: 'show',
      status: 'info',
      action: 'Show published',
      user: show.adminEmail || 'Admin',
      details: show.title || 'Untitled show',
      amount: null,
      timestamp: show.createdAtDate,
    }));

  const recentActivity = [...paymentActivity, ...showActivity]
    .filter((item) => item.timestamp)
    .sort((first, second) => second.timestamp - first.timestamp)
    .slice(0, 8);

  return {
    kpis: {
      totalRevenue,
      activeUsers: uniqueUsers.size,
      bookingsToday,
      conversionRate,
      totalTicketsSold,
      totalShows: showsWithDerived.length,
      todayRevenue,
      upcomingShows,
    },
    topShows,
    recentActivity,
  };
};

export const fetchAdminAnalyticsData = async () => {
  const { paymentRows, showsWithDerived } = await getRawAdminData();
  const kpis = (await fetchAdminDashboardData()).kpis;

  const today = startOfToday();
  const dayBuckets = [];
  for (let offset = 6; offset >= 0; offset -= 1) {
    const dayStart = new Date(today);
    dayStart.setDate(dayStart.getDate() - offset);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    const dayPayments = paymentRows.filter((payment) => payment.createdAtDate && payment.createdAtDate >= dayStart && payment.createdAtDate < dayEnd);
    dayBuckets.push({
      name: dayStart.toLocaleDateString('en-US', { weekday: 'short' }),
      bookings: dayPayments.length,
      revenue: dayPayments.reduce((sum, payment) => sum + payment.amountValue, 0),
      tickets: dayPayments.reduce((sum, payment) => sum + payment.seatCountValue, 0),
    });
  }

  const showPerformance = [...showsWithDerived]
    .sort((first, second) => second.soldSeats - first.soldSeats)
    .slice(0, 8)
    .map((show) => ({
      name: show.title || 'Untitled',
      sold: show.soldSeats,
      left: show.ticketsLeft,
      occupancy: Number(show.occupancyRate.toFixed(1)),
    }));

  const revenueByShow = {};
  paymentRows.forEach((payment) => {
    const key = payment.eventTitle || 'Unknown show';
    if (!revenueByShow[key]) {
      revenueByShow[key] = { name: key, earnings: 0, tickets: 0, bookings: 0 };
    }
    revenueByShow[key].earnings += payment.amountValue;
    revenueByShow[key].tickets += payment.seatCountValue;
    revenueByShow[key].bookings += 1;
  });

  const financialBreakdown = Object.values(revenueByShow)
    .sort((first, second) => second.earnings - first.earnings)
    .slice(0, 8);

  return {
    kpis,
    bookingTrend: dayBuckets,
    showPerformance,
    financialBreakdown,
  };
};

export const fetchTotalEarningsData = async () => {
  const { paymentRows } = await getRawAdminData();

  const totalRevenue = paymentRows.reduce((sum, payment) => sum + payment.amountValue, 0);
  const totalBookings = paymentRows.length;
  const totalTickets = paymentRows.reduce((sum, payment) => sum + payment.seatCountValue, 0);

  const categoryBuckets = {};
  paymentRows.forEach((payment) => {
    const category = payment.eventTitle || 'Unknown Show';
    if (!categoryBuckets[category]) {
      categoryBuckets[category] = {
        key: category,
        name: category,
        value: 0,
      };
    }
    categoryBuckets[category].value += payment.amountValue;
  });

  const categories = Object.values(categoryBuckets)
    .sort((first, second) => second.value - first.value)
    .slice(0, 8);

  const monthlyBuckets = {};
  paymentRows.forEach((payment) => {
    if (!payment.createdAtDate) return;
    const key = monthKey(payment.createdAtDate);
    if (!monthlyBuckets[key]) {
      monthlyBuckets[key] = {
        key,
        month: monthLabel(key),
        revenue: 0,
        bookings: 0,
      };
    }
    monthlyBuckets[key].revenue += payment.amountValue;
    monthlyBuckets[key].bookings += 1;
  });

  const monthlyRevenue = Object.values(monthlyBuckets)
    .sort((first, second) => first.key.localeCompare(second.key))
    .slice(-6);

  return {
    summary: {
      totalRevenue,
      totalBookings,
      totalTickets,
      averageOrderValue: totalBookings > 0 ? totalRevenue / totalBookings : 0,
    },
    categories,
    monthlyRevenue,
  };
};

