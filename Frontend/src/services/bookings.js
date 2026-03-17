import {
  collection,
  doc,
  getDoc,
  getDocs,
  runTransaction,
  serverTimestamp,
  query,
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

export const processChatbotBooking = async ({
  eventTitle,
  seatCount,
  email,
}) => {
  // 1. Find the show by title
  const showsRef = collection(db, 'shows');
  const q = query(showsRef, where('title', '==', eventTitle));
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) {
    throw new Error(`Show "${eventTitle}" not found`);
  }
  
  const showDoc = snapshot.docs[0];
  const showData = showDoc.data();
  const showId = showDoc.id;

  // 2. Pick next available seats
  const currentBookedSeats = Array.isArray(showData.bookedSeats) ? showData.bookedSeats : [];
  const bookedSet = new Set(currentBookedSeats.map(Number));
  const configuredSeatsRaw = showData.available_seats ?? showData.totalSeats ?? 100;
  const totalSeats = Number(configuredSeatsRaw);
  
  const selectedSeats = [];
  for (let i = 1; i <= totalSeats && selectedSeats.length < seatCount; i++) {
    if (!bookedSet.has(i)) {
      selectedSeats.push(i);
    }
  }

  if (selectedSeats.length < seatCount) {
    throw new Error('Not enough seats available');
  }

  // 3. Process using existing logic
  return await processShowPayment({
    eventId: showId,
    selectedSeats,
    seatCount,
    email,
    amount: (showData.price_int || 200) * seatCount,
    eventTitle: showData.title,
  });
};





export const getMyPaidTickets = async () => {
  const userEmail = auth.currentUser?.email;

  if (!userEmail) {
    return [];
  }

  try {
    const q = query(
      collection(db, 'payments'),
      where('email', '==', userEmail),
      where('status', '==', 'paid')
    );
    const snapshot = await getDocs(q);
    const tickets = snapshot.docs.map(doc => {
      const data = doc.data();
      let createdAt = null;
      if (data.createdAt && data.createdAt.toDate) {
        createdAt = data.createdAt.toDate().getTime();
      } else if (typeof data.createdAt === 'number') {
        createdAt = data.createdAt;
      }
      return { id: doc.id, ...data, createdAt };
    });

    return tickets.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  } catch (error) {
    console.error("User Tickets Error:", error);
    throw new Error("Failed to load your tickets.");
  }
};
