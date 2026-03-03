import {
  collection,
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

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

  const result = await runTransaction(db, async (transaction) => {
    const showSnapshot = await transaction.get(showRef);

    if (!showSnapshot.exists()) {
      throw new Error('Show not found');
    }

    const currentData = showSnapshot.data();
    const currentTicketsLeft = Number(currentData.ticketsLeft || 0);

    if (currentTicketsLeft < seatCount) {
      throw new Error('Not enough tickets left');
    }

    const updatedTicketsLeft = currentTicketsLeft - seatCount;

    transaction.update(showRef, { ticketsLeft: updatedTicketsLeft });
    transaction.set(paymentRef, {
      eventId,
      eventTitle: eventTitle || currentData.title || '',
      selectedSeats,
      seatCount,
      email,
      amount,
      status: 'paid',
      createdAt: serverTimestamp(),
    });

    return { updatedTicketsLeft };
  });

  return {
    paymentId: paymentRef.id,
    ticketsLeft: result.updatedTicketsLeft,
  };
};
