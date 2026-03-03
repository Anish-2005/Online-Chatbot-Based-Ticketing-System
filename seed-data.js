require('dotenv').config({ path: './Frontend/.env' });

const https = require('https');

// Firebase config from environment variables
const projectId = process.env.REACT_APP_FIREBASE_PROJECT_ID || 'chatticket';
const apiKey = process.env.REACT_APP_FIREBASE_API_KEY;

console.log('🔥 Firebase Cloud Firestore Seeder');
console.log(`📍 Project ID: ${projectId}\n`);

// Helper function to make HTTPS requests to Firestore REST API
function firestoreRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents${path}?key=${apiKey}`;
    
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(body ? JSON.parse(body) : null);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${body}`));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

// Helper to create Firestore document structure
function createDocPayload(docData) {
  const fields = {};
  
  Object.entries(docData).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      fields[key] = { nullValue: null };
    } else if (typeof value === 'boolean') {
      fields[key] = { booleanValue: value };
    } else if (typeof value === 'number') {
      if (Number.isInteger(value)) {
        fields[key] = { integerValue: value.toString() };
      } else {
        fields[key] = { doubleValue: value };
      }
    } else if (typeof value === 'string') {
      fields[key] = { stringValue: value };
    }
  });

  return { fields };
}

const seedShowsOnly = async () => {
  try {
    console.log('🎭 Starting Shows seeding (Priority)...\n');

    const sampleShows = [
      {
        title: 'Egyptian Heritage Exhibit',
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: '10:00 AM',
        location: 'Main Hall A',
        price: 25,
        price_int: 2500,
        image: 'https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=400',
        ticketsLeft: 150,
        description: 'Explore ancient Egyptian artifacts and history',
      },
      {
        title: 'Ancient Rome: Power & Legacy',
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: '2:00 PM',
        location: 'Gallery Wing B',
        price: 30,
        price_int: 3000,
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
        ticketsLeft: 120,
        description: 'Journey through the Roman Empire',
      },
      {
        title: 'Medieval Knights Exhibition',
        date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: '11:00 AM',
        location: 'Central Exhibition',
        price: 28,
        price_int: 2800,
        image: 'https://images.unsplash.com/photo-1553989332-1ba519f8af75?w=400',
        ticketsLeft: 180,
        description: 'Experience the age of knights and castles',
      },
      {
        title: 'Renaissance Art & Culture',
        date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: '3:00 PM',
        location: 'East Wing',
        price: 35,
        price_int: 3500,
        image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
        ticketsLeft: 100,
        description: 'Discover masterpieces from the Renaissance period',
      },
      {
        title: 'Asian Civilization Showcase',
        date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: '1:00 PM',
        location: 'West Wing',
        price: 32,
        price_int: 3200,
        image: 'https://images.unsplash.com/photo-1578926078328-123456789012?w=400',
        ticketsLeft: 200,
        description: 'Journey through ancient Asian cultures and traditions',
      },
      {
        title: 'Modern Art Revolution',
        date: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: '4:00 PM',
        location: 'Contemporary Wing',
        price: 40,
        price_int: 4000,
        image: 'https://images.unsplash.com/photo-1561214115-6d2f1b0609fa?w=400',
        ticketsLeft: 90,
        description: 'Explore contemporary and modern art installations',
      },
    ];

    console.log(`📊 Seeding ${sampleShows.length} shows...\n`);
    let showsSeeded = 0;

    for (const show of sampleShows) {
      const docPayload = createDocPayload(show);
      try {
        await firestoreRequest('POST', '/shows', docPayload);
        showsSeeded++;
        console.log(`  ✓ ${show.title} (${show.ticketsLeft} tickets, $${show.price})`);
      } catch (error) {
        console.error(`  ✗ Failed to seed ${show.title}:`, error.message);
      }
    }

    console.log(`\n✅ ${showsSeeded}/${sampleShows.length} shows seeded successfully!`);
    console.log('\n🚀 Carousel & BookShows page will now display real data!\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding shows:', error.message);
    process.exit(1);
  }
};

const seedFirestore = async () => {
  try {
    console.log('🚀 Starting Complete Firestore seed...\n');

    const sampleShows = [
      {
        title: 'Egyptian Heritage Exhibit',
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: '10:00 AM',
        location: 'Main Hall A',
        price: 25,
        price_int: 2500,
        image: 'https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=400',
        ticketsLeft: 150,
        description: 'Explore ancient Egyptian artifacts and history',
      },
      {
        title: 'Ancient Rome: Power & Legacy',
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: '2:00 PM',
        location: 'Gallery Wing B',
        price: 30,
        price_int: 3000,
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
        ticketsLeft: 120,
        description: 'Journey through the Roman Empire',
      },
      {
        title: 'Medieval Knights Exhibition',
        date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: '11:00 AM',
        location: 'Central Exhibition',
        price: 28,
        price_int: 2800,
        image: 'https://images.unsplash.com/photo-1553989332-1ba519f8af75?w=400',
        ticketsLeft: 180,
        description: 'Experience the age of knights and castles',
      },
      {
        title: 'Renaissance Art & Culture',
        date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: '3:00 PM',
        location: 'East Wing',
        price: 35,
        price_int: 3500,
        image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
        ticketsLeft: 100,
        description: 'Discover masterpieces from the Renaissance period',
      },
      {
        title: 'Asian Civilization Showcase',
        date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: '1:00 PM',
        location: 'West Wing',
        price: 32,
        price_int: 3200,
        image: 'https://images.unsplash.com/photo-1578926078328-123456789012?w=400',
        ticketsLeft: 200,
        description: 'Journey through ancient Asian cultures and traditions',
      },
      {
        title: 'Modern Art Revolution',
        date: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: '4:00 PM',
        location: 'Contemporary Wing',
        price: 40,
        price_int: 4000,
        image: 'https://images.unsplash.com/photo-1561214115-6d2f1b0609fa?w=400',
        ticketsLeft: 90,
        description: 'Explore contemporary and modern art installations',
      },
    ];

    console.log('📊 [1/5] Seeding Shows Collection...');
    let showsSeeded = 0;
    for (const show of sampleShows) {
      const docPayload = createDocPayload(show);
      try {
        await firestoreRequest('POST', '/shows', docPayload);
        showsSeeded++;
        console.log(`  ✓ ${show.title}`);
      } catch (error) {
        console.error(`  ✗ Failed to seed ${show.title}:`, error.message);
      }
    }

    // Seed ticket analytics
    console.log('\n📊 [2/5] Seeding Ticket Analytics...');
    const ticketAnalytics = [
      { name: 'General', tickets: 120, resolutionTime: 1.2 },
      { name: 'Premium', tickets: 80, resolutionTime: 1.4 },
      { name: 'Events', tickets: 65, resolutionTime: 1.1 },
      { name: 'Shows', tickets: 95, resolutionTime: 1.6 },
    ];

    for (const analytics of ticketAnalytics) {
      const docPayload = createDocPayload(analytics);
      try {
        await firestoreRequest('POST', '/tickets_analytics', docPayload);
      } catch (error) {
        console.error(`  ✗ Failed to seed analytics:`, error.message);
      }
    }
    console.log(`  ✓ ${ticketAnalytics.length} analytics entries seeded`);

    // Seed profit analytics
    console.log('\n💹 [3/5] Seeding Profit Analytics...');
    const profitAnalytics = [
      { name: 'General', earnings: 8400, cost: 2100, profit: 6300 },
      { name: 'Premium', earnings: 12000, cost: 3500, profit: 8500 },
      { name: 'Events', earnings: 7000, cost: 1800, profit: 5200 },
      { name: 'Shows', earnings: 9800, cost: 2600, profit: 7200 },
    ];

    for (const analytics of profitAnalytics) {
      const docPayload = createDocPayload(analytics);
      try {
        await firestoreRequest('POST', '/profit_analytics', docPayload);
      } catch (error) {
        console.error(`  ✗ Failed to seed profit analytics:`, error.message);
      }
    }
    console.log(`  ✓ ${profitAnalytics.length} analytics entries seeded`);

    // Seed earnings breakdown
    console.log('\n💰 [4/5] Seeding Earnings Breakdown...');
    const earningsBreakdown = {
      productSales: 18000,
      subscriptionFees: 14000,
      serviceCharges: 9000,
      miscellaneous: 4500,
      totalEarnings: 45500,
    };

    const docPayload = createDocPayload(earningsBreakdown);
    try {
      await firestoreRequest('POST', '/earnings_breakdown', docPayload);
      console.log('  ✓ Earnings breakdown document seeded');
    } catch (error) {
      console.error(`  ✗ Failed to seed earnings breakdown:`, error.message);
    }

    console.log('\n✅ [5/5] Firestore seed completed successfully!');
    console.log(`\n📈 Seeded Summary:`);
    console.log(`   🎭 Shows: ${showsSeeded}`);
    console.log(`   📊 Ticket Analytics: ${ticketAnalytics.length}`);
    console.log(`   💹 Profit Analytics: ${profitAnalytics.length}`);
    console.log(`   💰 Earnings Breakdown: 1`);
    console.log('\n🚀 Carousel & Admin Dashboards will now display real data!\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding Firestore:', error.message);
    process.exit(1);
  }
};

// Main execution
const command = process.argv[2] || 'shows';

if (command === 'shows') {
  console.log('🎯 Running: Seed Shows Only\n');
  seedShowsOnly();
} else if (command === 'complete') {
  console.log('🎯 Running: Complete Seed (Shows + Analytics + Earnings)\n');
  seedFirestore();
} else {
  console.log('\n❌ Unknown command. Use: "shows" or "complete"\n');
  process.exit(1);
}
