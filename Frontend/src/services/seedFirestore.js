import { collection, addDoc, setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from './firebase';

/**
 * Seed Firestore collections with demo analytics and earnings data
 * Run this once after creating Firestore database to populate dashboards
 * Usage: Call seedFirestore() from browser console or integrate into setup flow
 */

export const seedFirestore = async () => {
  try {
    if (!auth.currentUser) {
      throw new Error('No authenticated user. Please log in first.');
    }

    console.log('Starting Firestore seed...');

    // 1. Seed shows collection with sample data
    const showsCollection = collection(db, 'shows');
    const sampleShows = [
      {
        title: 'Egyptian Heritage Exhibit',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: '10:00 AM',
        location: 'Main Hall A',
        price: 25,
        price_int: 2500,
        image: 'https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=400',
        ticketsLeft: 150,
        description: 'Explore ancient Egyptian artifacts and history',
        createdAt: serverTimestamp(),
      },
      {
        title: 'Ancient Rome: Power & Legacy',
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: '2:00 PM',
        location: 'Gallery Wing B',
        price: 30,
        price_int: 3000,
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
        ticketsLeft: 120,
        description: 'Journey through the Roman Empire',
        createdAt: serverTimestamp(),
      },
      {
        title: 'Medieval Knights Exhibition',
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: '11:00 AM',
        location: 'Central Exhibition',
        price: 28,
        price_int: 2800,
        image: 'https://images.unsplash.com/photo-1553989332-1ba519f8af75?w=400',
        ticketsLeft: 180,
        description: 'Experience the age of knights and castles',
        createdAt: serverTimestamp(),
      },
      {
        title: 'Renaissance Art & Culture',
        date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: '3:00 PM',
        location: 'East Wing',
        price: 35,
        price_int: 3500,
        image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
        ticketsLeft: 100,
        description: 'Discover masterpieces from the Renaissance period',
        createdAt: serverTimestamp(),
      },
    ];

    let showsSeeded = 0;
    for (const show of sampleShows) {
      await addDoc(showsCollection, show);
      showsSeeded++;
      console.log(`✓ Show seeded: ${show.title}`);
    }

    // 2. Seed tickets_analytics collection
    const ticketsAnalyticsCollection = collection(db, 'tickets_analytics');
    const ticketAnalytics = [
      { name: 'General', tickets: 120, resolutionTime: 1.2, createdAt: serverTimestamp() },
      { name: 'Premium', tickets: 80, resolutionTime: 1.4, createdAt: serverTimestamp() },
      { name: 'Events', tickets: 65, resolutionTime: 1.1, createdAt: serverTimestamp() },
      { name: 'Shows', tickets: 95, resolutionTime: 1.6, createdAt: serverTimestamp() },
    ];

    for (const analytics of ticketAnalytics) {
      await addDoc(ticketsAnalyticsCollection, analytics);
    }
    console.log(`✓ ${ticketAnalytics.length} ticket analytics documents seeded`);

    // 3. Seed profit_analytics collection
    const profitAnalyticsCollection = collection(db, 'profit_analytics');
    const profitAnalytics = [
      { name: 'General', earnings: 8400, cost: 2100, profit: 6300, createdAt: serverTimestamp() },
      { name: 'Premium', earnings: 12000, cost: 3500, profit: 8500, createdAt: serverTimestamp() },
      { name: 'Events', earnings: 7000, cost: 1800, profit: 5200, createdAt: serverTimestamp() },
      { name: 'Shows', earnings: 9800, cost: 2600, profit: 7200, createdAt: serverTimestamp() },
    ];

    for (const analytics of profitAnalytics) {
      await addDoc(profitAnalyticsCollection, analytics);
    }
    console.log(`✓ ${profitAnalytics.length} profit analytics documents seeded`);

    // 4. Seed earnings_breakdown collection (single document with all categories)
    const earningsBreakdownCollection = collection(db, 'earnings_breakdown');
    const earningsBreakdown = {
      productSales: 18000,
      subscriptionFees: 14000,
      serviceCharges: 9000,
      miscellaneous: 4500,
      totalEarnings: 45500,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await addDoc(earningsBreakdownCollection, earningsBreakdown);
    console.log('✓ Earnings breakdown document seeded');

    console.log('✅ Firestore seed completed successfully!');
    console.log(`\nSeeded Summary:`);
    console.log(`- Shows: ${showsSeeded}`);
    console.log(`- Ticket Analytics: ${ticketAnalytics.length}`);
    console.log(`- Profit Analytics: ${profitAnalytics.length}`);
    console.log(`- Earnings Breakdown: 1`);

    return {
      success: true,
      showsSeeded,
      ticketAnalyticsSeeded: ticketAnalytics.length,
      profitAnalyticsSeeded: profitAnalytics.length,
      earningsBreakdownSeeded: 1,
    };
  } catch (error) {
    console.error('❌ Error seeding Firestore:', error);
    throw error;
  }
};

/**
 * Optional utility to delete all seeded data (use with caution!)
 * Uncomment and use only if you need to clean slate
 */
export const clearFirestoreCollections = async () => {
  try {
    const collections = ['shows', 'tickets_analytics', 'profit_analytics', 'earnings_breakdown', 'payments'];
    
    for (const collectionName of collections) {
      const collectionRef = collection(db, collectionName);
      const snapshot = await getDocs(collectionRef);
      for (const docItem of snapshot.docs) {
        await deleteDoc(doc(db, collectionName, docItem.id));
      }
      console.log(`✓ Cleared ${collectionName}`);
    }
    
    console.log('✅ All collections cleared');
  } catch (error) {
    console.error('❌ Error clearing collections:', error);
    throw error;
  }
};
