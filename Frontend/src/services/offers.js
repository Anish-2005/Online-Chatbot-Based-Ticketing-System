import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { auth, db } from './firebase';

const OFFERS_COLLECTION = 'special_offers';

export const fetchSpecialOffers = async () => {
  const offersRef = collection(db, OFFERS_COLLECTION);
  const offersQuery = query(offersRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(offersQuery);
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
};

export const createSpecialOffer = async ({ title, description, validUntil, discountLabel }) => {
  const payload = {
    title,
    description,
    validUntil,
    discountLabel,
    isActive: true,
    createdBy: auth.currentUser?.email || null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const ref = await addDoc(collection(db, OFFERS_COLLECTION), payload);
  return { id: ref.id, ...payload };
};

export const updateSpecialOfferStatus = async (offerId, isActive) => {
  await updateDoc(doc(db, OFFERS_COLLECTION, offerId), {
    isActive,
    updatedAt: serverTimestamp(),
  });
};
