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

export const fetchAdminDashboardData = async () => {
  const [showsSnapshot, paymentsSnapshot] = await Promise.all([
    getDocs(collection(db, 'shows')),
    getDocs(collection(db, 'payments')),
  ]);

  const shows = showsSnapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
  const paidPayments = paymentsSnapshot.docs
    .map((item) => ({ id: item.id, ...item.data() }))
    .filter((payment) => payment.status === 'paid');

  const todayStart = startOfToday();
  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setDate(tomorrowStart.getDate() + 1);

  const paymentRows = paidPayments.map((payment) => {
    const createdAt = toDateValue(payment.createdAt);
    return {
      ...payment,
      createdAtDate: createdAt,
      amountValue: asNumber(payment.amount, 0),
      seatCountValue: Math.max(asNumber(payment.seatCount, 0), 0),
    };
  });

  const todaysPayments = paymentRows.filter((payment) => {
    if (!payment.createdAtDate) return false;
    return payment.createdAtDate >= todayStart && payment.createdAtDate < tomorrowStart;
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
    };
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
    .filter((show) => toDateValue(show.createdAt))
    .map((show) => ({
      id: `show-${show.id}`,
      type: 'show',
      status: 'info',
      action: 'Show published',
      user: show.adminEmail || 'Admin',
      details: show.title || 'Untitled show',
      amount: null,
      timestamp: toDateValue(show.createdAt),
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
