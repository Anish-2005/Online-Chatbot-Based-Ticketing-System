import { addDoc, collection, getDocs, serverTimestamp } from 'firebase/firestore';
import { db, auth } from './firebase';

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
    adminId: auth.currentUser?.uid || null,
    adminEmail: auth.currentUser?.email || null,
    createdAt: serverTimestamp(),
  };

  let docRef;
  try {
    docRef = await addDoc(collection(db, SHOWS_COLLECTION), showPayload);
  } catch (error) {
    if (error?.code === 'permission-denied') {
      throw new Error('Missing or insufficient permissions. Publish updated Firestore rules, then try Add Show again.');
    }
    throw error;
  }

  return {
    id: docRef.id,
    ...showPayload,
  };
};
