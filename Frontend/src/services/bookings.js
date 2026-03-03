import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  runTransaction,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import { auth, db } from './firebase';

export const getShowById = async (showId) => {
  const showRef = doc(db, 'shows', showId);
  const showSnapshot = await getDoc(showRef);

  if (!showSnapshot.exists()) {
    throw new Error('Show not found');
  }

  return { id: showSnapshot.id, ...showSnapshot.data() };
};

export const getTicketsLeft = async (showId) => {
  const show = await getShowById(showId);
  return Number(show.ticketsLeft || 0);
};

export const getShowSeatState = async (showId) => {
  const show = await getShowById(showId);
  const bookedSeats = Array.isArray(show.bookedSeats)
    ? show.bookedSeats.map((seat) => Number(seat)).filter((seat) => Number.isInteger(seat) && seat > 0)
    : [];

  const configuredSeatsRaw = show.available_seats ?? show.totalSeats;
  const configuredSeats = Number(configuredSeatsRaw);
  const totalSeats = Number.isInteger(configuredSeats) && configuredSeats > 0
    ? configuredSeats
    : Math.max(Number(show.ticketsLeft || 0) + bookedSeats.length, 1);

  const ticketsLeft = Math.max(
    Number((show.ticketsLeft ?? (totalSeats - bookedSeats.length)) || 0),
    0
  );

  return {
    id: show.id,
    totalSeats,
    ticketsLeft,
    bookedSeats,
  };
};

export const processShowPayment = async ({
  eventId,
  selectedSeats,
  seatCount,
  email,
  amount,
  eventTitle,
}) => {
  const showRef = doc(db, 'shows', eventId);
  const paymentRef = doc(collection(db, 'payments'));
  const sanitizedSelectedSeats = Array.isArray(selectedSeats)
    ? [...new Set(selectedSeats.map((seat) => Number(seat)).filter((seat) => Number.isInteger(seat) && seat > 0))]
    : [];

  if (sanitizedSelectedSeats.length !== Number(seatCount)) {
    throw new Error('Selected seats count mismatch. Please reselect seats and try again.');
  }

  const ticketCode = `TKT-${paymentRef.id.slice(0, 10).toUpperCase()}`;
  const qrData = JSON.stringify({
    type: 'museum_ticket',
    ticketCode,
    paymentId: paymentRef.id,
    eventId,
    eventTitle,
    seatCount,
    selectedSeats: sanitizedSelectedSeats,
    email,
  });

  const result = await runTransaction(db, async (transaction) => {
    const showSnapshot = await transaction.get(showRef);

    if (!showSnapshot.exists()) {
      throw new Error('Show not found');
    }

    const currentData = showSnapshot.data();
    const currentBookedSeats = Array.isArray(currentData.bookedSeats)
      ? currentData.bookedSeats.map((seat) => Number(seat)).filter((seat) => Number.isInteger(seat) && seat > 0)
      : [];
    const configuredSeatsRaw = currentData.available_seats ?? currentData.totalSeats;
    const configuredSeats = Number(configuredSeatsRaw);
    const totalSeats = Number.isInteger(configuredSeats) && configuredSeats > 0
      ? configuredSeats
      : Math.max(Number(currentData.ticketsLeft || 0) + currentBookedSeats.length, 1);
    const currentTicketsLeft = Math.max(
      Number((currentData.ticketsLeft ?? (totalSeats - currentBookedSeats.length)) || 0),
      0
    );

    if (currentTicketsLeft < seatCount) {
      throw new Error('Not enough tickets left');
    }

    if (sanitizedSelectedSeats.some((seat) => seat > totalSeats)) {
      throw new Error('One or more selected seats are invalid for this show.');
    }

    const bookedSeatSet = new Set(currentBookedSeats);
    const alreadyBooked = sanitizedSelectedSeats.filter((seat) => bookedSeatSet.has(seat));
    if (alreadyBooked.length > 0) {
      throw new Error(`Seat(s) already booked: ${alreadyBooked.join(', ')}`);
    }

    const updatedBookedSeats = [...currentBookedSeats, ...sanitizedSelectedSeats].sort((first, second) => first - second);
    const updatedTicketsLeft = Math.max(totalSeats - updatedBookedSeats.length, 0);

    transaction.update(showRef, {
      ticketsLeft: updatedTicketsLeft,
      bookedSeats: updatedBookedSeats,
    });
    transaction.set(paymentRef, {
      eventId,
      eventTitle: eventTitle || currentData.title || '',
      selectedSeats: sanitizedSelectedSeats,
      seatCount,
      email,
      amount,
      ticketCode,
      qrData,
      status: 'paid',
      createdAt: serverTimestamp(),
    });

    return { updatedTicketsLeft };
  });

  return {
    paymentId: paymentRef.id,
    ticketCode,
    qrData,
    ticketsLeft: result.updatedTicketsLeft,
  };
};

export const getMyPaidTickets = async () => {
  const userEmail = auth.currentUser?.email;

  if (!userEmail) {
    return [];
  }

  const paymentsRef = collection(db, 'payments');
  const paymentsQuery = query(paymentsRef, where('email', '==', userEmail));
  const snapshot = await getDocs(paymentsQuery);

  return snapshot.docs
    .map((paymentDoc) => ({ id: paymentDoc.id, ...paymentDoc.data() }))
    .filter((ticket) => ticket.status === 'paid')
    .sort((first, second) => {
      const firstMs = first.createdAt?.toDate ? first.createdAt.toDate().getTime() : 0;
      const secondMs = second.createdAt?.toDate ? second.createdAt.toDate().getTime() : 0;
      return secondMs - firstMs;
    });
};
