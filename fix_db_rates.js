const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  
  // Find shipments where rate and finalRate are exactly the same and > 0
  const shipments = await db.collection('shipments').find({
    $expr: { $eq: ["$rate", "$finalRate"] },
    rate: { $gt: 0 }
  }).toArray();
  
  console.log(`Found ${shipments.length} shipments where rate == finalRate`);
  
  // We will set rate = 0, so that finalRate remains the client's rate
  const result = await db.collection('shipments').updateMany(
    { 
      $expr: { $eq: ["$rate", "$finalRate"] },
      rate: { $gt: 0 }
    },
    [{ $set: { rate: 0 } }]
  );
  
  console.log(`Updated ${result.modifiedCount} shipments.`);
  process.exit(0);
}

run().catch(console.error);
