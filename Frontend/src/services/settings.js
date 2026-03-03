import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from './firebase';

const SETTINGS_COLLECTION = 'app_settings';

export const DEFAULT_SETTINGS = [
  { id: 1, name: 'Notifications', enabled: true, key: 'notifications', type: 'boolean', description: 'Receive push notifications' },
  { id: 2, name: 'Email Alerts', enabled: true, key: 'emailAlerts', type: 'boolean', description: 'Get email updates' },
  { id: 3, name: 'Two-Factor Authentication', enabled: false, key: 'twoFactorAuth', type: 'boolean', description: 'Enhanced security' },
  { id: 4, name: 'Auto-Logout Timer', enabled: 15, key: 'autoLogoutMinutes', type: 'number', description: 'Session timeout (min)' },
  { id: 5, name: 'Language Preference', enabled: 'English', key: 'languagePreference', type: 'string', description: 'Interface language' },
];

const normalizeSettings = (storedValues = {}) => {
  return DEFAULT_SETTINGS.map((item) => ({
    ...item,
    enabled: storedValues[item.key] ?? item.enabled,
  }));
};

export const fetchRoleSettings = async (role = 'default') => {
  const docRef = doc(db, SETTINGS_COLLECTION, role);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    return normalizeSettings();
  }

  const stored = snapshot.data()?.values || {};
  return normalizeSettings(stored);
};

export const saveRoleSettings = async (role = 'default', settingsArray = []) => {
  const values = settingsArray.reduce((acc, item) => {
    acc[item.key] = item.enabled;
    return acc;
  }, {});

  await setDoc(doc(db, SETTINGS_COLLECTION, role), {
    values,
    updatedAt: serverTimestamp(),
  }, { merge: true });
};
