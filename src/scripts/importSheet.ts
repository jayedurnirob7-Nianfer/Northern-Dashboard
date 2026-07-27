import mongoose from 'mongoose';
import Papa from 'papaparse';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Define a simple schema that matches your MongoDB model
const ShipmentSchema = new mongoose.Schema({
  shippingNumber: { type: String, default: '' },
  trackingNumber: { type: String, default: '' },
  shippingMark: { type: String, default: '' },
  date: { type: String, default: '' },
  customerName: { type: String, default: '' },
  address: { type: String, default: '' },
  mobile: { type: String, default: '' },
  shippingMethod: { type: String, default: '' },
  productName: { type: String, default: '' },
  quantity: { type: String, default: '' },
  weight: { type: Number, default: 0 },
  rate: { type: Number, default: 0 },
  finalRate: { type: Number, default: 0 },
  profitPerKg: { type: Number, default: 0 },
  clientBill: { type: Number, default: 0 },
  myBill: { type: Number, default: 0 },
  totalProfit: { type: Number, default: 0 },
  status: { type: String, default: 'Pending' },
  deliveryDate: { type: String, default: '' },
}, { timestamps: true });

const Shipment = mongoose.models.Shipment || mongoose.model('Shipment', ShipmentSchema);

async function importData() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('No MONGODB_URI found in .env.local');
    process.exit(1);
  }

  console.log('Connecting to MongoDB...');
  await mongoose.connect(uri);
  console.log('Connected!');

  const sheetUrl = 'https://docs.google.com/spreadsheets/d/1p-IhjC2K1YZwdwimDcKFprKvN9i7KYDxuU6uX92-ynU/export?format=csv&gid=0';
  console.log('Fetching Google Sheet data...');
  
  const response = await fetch(sheetUrl);
  const csvText = await response.text();

  console.log('Parsing CSV...');
  const result = Papa.parse(csvText, {
    skipEmptyLines: true,
  });

  const rows = result.data as string[][];
  // Remove header
  const dataRows = rows.slice(1);

  console.log(`Found ${dataRows.length} rows. Clearing old shipments and inserting new ones...`);
  
  // Optional: clear existing records to avoid duplicates if re-running
  await Shipment.deleteMany({});

  const shipments = dataRows.map((row) => {
    const rate = Number(row[11]) || 0;
    const clientBill = Number(row[12]) || 0;
    
    return {
      shippingNumber: row[0]?.trim() || '',
      trackingNumber: row[1]?.trim() || '',
      shippingMark: row[2]?.trim() || '',
      date: row[3]?.trim() || '',
      customerName: row[4]?.trim() || '',
      address: row[5]?.trim() || '',
      mobile: row[6]?.trim() || '',
      productName: row[7]?.trim() || '',
      quantity: row[8]?.trim() || '',
      weight: Number(row[10]) || 0,
      rate: rate,
      finalRate: rate, // Default finalRate to rate
      profitPerKg: 0,
      clientBill: clientBill,
      myBill: 0,
      totalProfit: 0,
      status: row[13]?.trim() || 'Pending',
    };
  }).filter(s => s.shippingNumber || s.customerName || s.productName);

  await Shipment.insertMany(shipments);
  console.log(`Successfully imported ${shipments.length} shipments into MongoDB!`);
  
  process.exit(0);
}

importData().catch(console.error);
