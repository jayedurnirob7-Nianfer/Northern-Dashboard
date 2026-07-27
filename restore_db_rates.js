const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  
  // Find shipments where rate is 0
  const shipments = await db.collection('shipments').find({
    rate: 0
  }).toArray();
  
  console.log(`Found ${shipments.length} shipments where rate == 0`);
  
  // Restore rate to finalRate
  const result = await db.collection('shipments').updateMany(
    { rate: 0 },
    [{ $set: { rate: "$finalRate" } }]
  );
  
  console.log(`Updated ${result.modifiedCount} shipments.`);
  process.exit(0);
}

run().catch(console.error);
