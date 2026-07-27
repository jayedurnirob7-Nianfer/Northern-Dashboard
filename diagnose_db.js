// Deep diagnostic: query MongoDB and dump all fields for every shipment
require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function main() {
  const uri = process.env.MONGODB_URI;
  console.log('Connecting to:', uri ? uri.substring(0, 40) + '...' : 'NO URI FOUND');
  
  const client = new MongoClient(uri);
  await client.connect();
  
  const dbName = uri.split('/').pop().split('?')[0];
  const db = client.db(dbName);
  const col = db.collection('shipments');
  
  const docs = await col.find({}).toArray();
  console.log(`\nTotal documents: ${docs.length}\n`);
  
  // Check what fields each document actually has
  const allFields = new Set();
  docs.forEach(d => Object.keys(d).forEach(k => allFields.add(k)));
  console.log('ALL FIELDS across all docs:', [...allFields].sort().join(', '));
  console.log('');
  
  // Print a detailed table of key fields for each doc
  console.log('=== PER-DOCUMENT DATA CHECK ===');
  docs.forEach((d, i) => {
    console.log(`\n--- Doc ${i+1}: ${d.shippingNumber || 'NO_SHIPPING_NO'} ---`);
    console.log(`  _id:            ${d._id}`);
    console.log(`  shippingNumber:  ${JSON.stringify(d.shippingNumber)}`);
    console.log(`  shippingMethod:  ${JSON.stringify(d.shippingMethod)}`);
    console.log(`  rate:            ${JSON.stringify(d.rate)} (type: ${typeof d.rate})`);
    console.log(`  finalRate:       ${JSON.stringify(d.finalRate)} (type: ${typeof d.finalRate})`);
    console.log(`  profitPerKg:     ${JSON.stringify(d.profitPerKg)} (type: ${typeof d.profitPerKg})`);
    console.log(`  weight:          ${JSON.stringify(d.weight)} (type: ${typeof d.weight})`);
    console.log(`  clientBill:      ${JSON.stringify(d.clientBill)} (type: ${typeof d.clientBill})`);
    console.log(`  myBill:          ${JSON.stringify(d.myBill)} (type: ${typeof d.myBill})`);
    console.log(`  totalProfit:     ${JSON.stringify(d.totalProfit)} (type: ${typeof d.totalProfit})`);
    console.log(`  deliveryDate:    ${JSON.stringify(d.deliveryDate)}`);
    console.log(`  status:          ${JSON.stringify(d.status)}`);
    console.log(`  createdAt:       ${JSON.stringify(d.createdAt)}`);
  });
  
  await client.close();
}
main().catch(e => { console.error(e); process.exit(1); });
