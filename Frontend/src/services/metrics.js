import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

const DEFAULT_TICKET_ANALYTICS = [
  { name: 'General', tickets: 120, resolutionTime: 1.2 },
  { name: 'Premium', tickets: 80, resolutionTime: 1.4 },
  { name: 'Events', tickets: 65, resolutionTime: 1.1 },
  { name: 'Shows', tickets: 95, resolutionTime: 1.6 },
];

const DEFAULT_PROFIT_ANALYTICS = [
  { name: 'General', earnings: 8400, cost: 2100, profit: 6300 },
  { name: 'Premium', earnings: 12000, cost: 3500, profit: 8500 },
  { name: 'Events', earnings: 7000, cost: 1800, profit: 5200 },
  { name: 'Shows', earnings: 9800, cost: 2600, profit: 7200 },
];

const DEFAULT_EARNINGS_BREAKDOWN = {
  productSales: 18000,
  subscriptionFees: 14000,
  serviceCharges: 9000,
  miscellaneous: 4500,
};

const readCollection = async (collectionName) => {
  const snapshot = await getDocs(collection(db, collectionName));
  return snapshot.docs.map((docItem) => ({ id: docItem.id, ...docItem.data() }));
};

export const fetchTicketAnalytics = async () => {
  try {
    const data = await readCollection('tickets_analytics');
    return data.length ? data : DEFAULT_TICKET_ANALYTICS;
  } catch (error) {
    console.error('Error fetching ticket analytics from Firestore:', error);
    return DEFAULT_TICKET_ANALYTICS;
  }
};

export const fetchProfitAnalytics = async () => {
  try {
    const data = await readCollection('profit_analytics');
    const normalized = data.map((item) => ({
      ...item,
      earnings: item.earnings ?? item.earning ?? 0,
      cost: item.cost ?? 0,
      profit: item.profit ?? 0,
    }));
    return normalized.length ? normalized : DEFAULT_PROFIT_ANALYTICS;
  } catch (error) {
    console.error('Error fetching profit analytics from Firestore:', error);
    return DEFAULT_PROFIT_ANALYTICS;
  }
};

export const fetchEarningsBreakdown = async () => {
  try {
    const data = await readCollection('earnings_breakdown');
    return data[0] || DEFAULT_EARNINGS_BREAKDOWN;
  } catch (error) {
    console.error('Error fetching earnings breakdown from Firestore:', error);
    return DEFAULT_EARNINGS_BREAKDOWN;
  }
};
