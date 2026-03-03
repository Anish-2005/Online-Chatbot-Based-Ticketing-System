import { addDoc, collection, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

const SHOWS_COLLECTION = 'shows';

export const fetchShows = async () => {
  const snapshot = await getDocs(collection(db, SHOWS_COLLECTION));

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const createShow = async (payload) => {
  const showPayload = {
    ...payload,
    ticketsLeft: Number(payload.ticketsLeft),
    price_int: Number(payload.price_int),
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, SHOWS_COLLECTION), showPayload);

  return {
    id: docRef.id,
    ...showPayload,
  };
};
