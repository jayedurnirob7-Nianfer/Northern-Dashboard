// =================================================================
// MASTER DATABASE SYNC SCRIPT
// Wipes the DB and re-imports all rows from the Google Sheet CSV.
// This is the definitive, correct import.
// =================================================================

require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

const CSV_DATA = `Shipping Number,Tracking Number,Shipping Mark,Date,Customer Name,Address,Mobile,Shipping Method,Product Name,Quantity,Weight,Rate,Final Rate,Profit,Client Bill,My Bill,Total Profit,Status,Delivery Date
NORS010,LDS25104,RAJ,22 August 2025,Rubel,,,Sea,Printer,2,573,155,220,65,126060,88815,37245,Delivered,27 September 2025
NORS011,LDS25119,RAJ,22 August 2025,Rubel,,,Sea,UV Printer,1,130,155,310,155,40300,20150,20150,Delivered,27 September 2025
NORS012,"LDS25113-14(2)",RAJ,11 September 2025,Rubel,,,Sea,Printer,5,1549,210,235,25,364015,325290,38725,Delivered,31 October 2025
NORS013,LDS25119,RAJ,25 September 2025,Hossen,Purana Paltan,2589632145,Sea,Printer,7,734,210,235,25,172490,154140,18350,Delivered,6 November 2025
NORS014,LDS25132,RAJ,30 September 2025,Rubel,,,Sea,Printer,5,1486,210,235,25,349210,312060,37150,Delivered,12 December 2025
NORS015,LDS25156,RAJ,11 December 2025,Rubel,"Satarkul, Badda",1548325481,Sea,Printer,5,1429,220,235,15,335815,314380,21435,Delivered,26 January 2026
NORS016,LDS25156,RAJ,12 December 2025,Rubel,,,Sea,Toner,1,154,360,390,30,60060,55440,4620,Delivered,26 January 2026
NORS017,LDS25158,RAJ,16 December 2025,Rubel,,,Sea,Forklift,1,143,190,220,30,31460,27170,4290,Delivered,26 January 2026
NORS018,LDS2607,RAJ,24 December 2025,Rubel,,,Sea,Printer,5,1450,220,235,15,340750,319000,21750,Delivered,10 March 2026
NORS019,LDS3426,RAJ,20 March 2026,Rubel,Paltan,0171228334,Sea,MIX,7,249,140,190,50,47310,34860,12450,Delivered,7 May 2026
NORS020,LDS3426,RAJ,27 March 2026,Rubel,Paltan,0171228334,Sea,Printer,7,1337,220,235,15,314195,294140,20055,Delivered,7 May 2026
NORS021,,RAJ,27 March 2026,Rubel,Paltan,0171228334,Sea,Film Cutting Machine,2,85,140,190,50,16150,11900,4250,Delivered,7 May 2026
NORS022,Tanner/Jayedur/Mahmudul,Tanner/Jayedur/Mahmudul,7 May 2026,Mahmudul,,,Air,"Toy, Brushes, Gloves",3,12,750,800,50,9600,9000,600,Delivered,25 May 2026
NORS023,LDS2669,RAJ,3 June 2026,Rubel,Purana Paltan,0171228334,Sea,binding machine,1,93,150,235,85,21855,13950,7905,Delivered,20 July 2026
NORS024,LDS2669,RAJ,3 June 2026,Rubel,Purana Paltan,0171228334,Sea,duplex printer,1,215,220,235,15,50525,47300,3225,Delivered,20 July 2026
NORS025,LDS2669,RAJ,3 June 2026,Rubel,Purana Paltan,0171228334,Sea,ink cartridge,2,20,230,280,50,5600,4600,1000,Delivered,20 July 2026
NORS026,LDS2669,RAJ,3 June 2026,Rubel,Purana Paltan,0171228334,Sea,Improved machine,1,65,220,235,15,15275,14300,975,Delivered,20 July 2026
NORS027,LDS2669,RAJ,3 June 2026,Rubel,Purana Paltan,0171228334,Sea,Printer,10,1696,220,235,15,398560,373120,25440,Delivered,20 July 2026
NORS028,LDS2669,RAJ,3 June 2026,Rubel,Purana Paltan,0171228334,Sea,printer toner,6,153,230,390,160,59670,35190,24480,Delivered,20 July 2026
NORS029,LDS2669,RAJ,3 June 2026,Rubel,Purana Paltan,0171228334,Sea,printer parts,2,50,320,390,70,19500,16000,3500,Delivered,20 July 2026
NORS030,LDS2673,RAJ,4 June 2026,Rubel,Purana Paltan,0171228334,Sea,Refurbished high-speed printers,5,993,220,235,15,233355,218460,14895,Delivered,21 July 2026
NORS031,LDS2673,RAJ,4 June 2026,Rubel,Purana Paltan,0171228334,Sea,Used ink/used printing paper,1,167,375,400,25,66800,62625,4175,Delivered,21 July 2026
NORS032,,,22 June 2026,Rubel,,,Sea,Printer,5,724,220,235,15,170140,159280,10860,Delivered,27 July 2026
NORS033,,,22 June 2026,Rubel,,,Sea,Thin film,13,147,220,360,140,52920,32340,20580,Delivered,27 July 2026
NORS034,,,22 June 2026,Rubel,,,Sea,ink,10,118,360,400,40,47200,42480,4720,Delivered,27 July 2026
NORS035,,,9 July 2026,Rubel,,,Sea,Heat transfer printer,5,191,220,235,15,44885,42020,2865,In Shipment,
NORS036,,,9 July 2026,Rubel,,,Sea,DTF Oven,5,61,220,235,15,14335,13420,915,In Shipment,
NORS037,,,9 July 2026,Rubel,,,Sea,Die Cutting Mechine,5,213,220,235,15,50055,46860,3195,In Shipment,
NORS038,,,19 July 2026,Rubel,,,Sea,Printer,5,1456,220,235,15,342160,320320,21840,In China Warehouse,
NORS039,,,19 July 2026,Rubel,,,Sea,printer parts,1,120,320,390,70,46800,38400,8400,In China Warehouse,`;

// Simple CSV parser that handles quoted fields with commas
function parseCSV(text) {
  const lines = text.split('\n').filter(l => l.trim());
  const headers = parseCSVLine(lines[0]);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const vals = parseCSVLine(lines[i]);
    if (!vals[0]) continue; // skip empty rows
    const row = {};
    headers.forEach((h, idx) => { row[h.trim()] = (vals[idx] || '').trim(); });
    rows.push(row);
  }
  return rows;
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

async function main() {
  const uri = process.env.MONGODB_URI;
  console.log('Connecting to MongoDB...');
  
  const client = new MongoClient(uri);
  await client.connect();
  
  const dbName = uri.split('/').pop().split('?')[0];
  const db = client.db(dbName);
  const col = db.collection('shipments');
  
  // Parse CSV
  const rows = parseCSV(CSV_DATA);
  console.log(`Parsed ${rows.length} rows from spreadsheet`);
  
  // Map spreadsheet columns to DB fields
  const documents = rows.map(row => {
    const weight = parseFloat(row['Weight']) || 0;
    const rate = parseFloat(row['Rate']) || 0;
    const finalRate = parseFloat(row['Final Rate']) || 0;
    const profitPerKg = parseFloat(row['Profit']) || 0;
    const clientBill = parseFloat(row['Client Bill']) || 0;
    const myBill = parseFloat(row['My Bill']) || 0;
    const totalProfit = parseFloat(row['Total Profit']) || 0;
    
    // Verify calculations match
    const calcClientBill = weight * finalRate;
    const calcMyBill = weight * rate;
    const calcProfit = finalRate - rate;
    const calcTotalProfit = clientBill - myBill;
    
    if (Math.abs(calcClientBill - clientBill) > 1) {
      console.warn(`  ⚠️  ${row['Shipping Number']}: clientBill mismatch: calc=${calcClientBill} vs sheet=${clientBill}`);
    }
    if (Math.abs(calcMyBill - myBill) > 1) {
      console.warn(`  ⚠️  ${row['Shipping Number']}: myBill mismatch: calc=${calcMyBill} vs sheet=${myBill}`);
    }
    
    return {
      shippingNumber: row['Shipping Number'] || '',
      trackingNumber: row['Tracking Number'] || '',
      shippingMark: row['Shipping Mark'] || '',
      date: row['Date'] || '',
      customerName: row['Customer Name'] || '',
      address: row['Address'] || '',
      mobile: row['Mobile'] || '',
      shippingMethod: row['Shipping Method'] || '',
      productName: row['Product Name'] || '',
      quantity: row['Quantity'] || '',
      weight: weight,
      rate: rate,
      finalRate: finalRate,
      profitPerKg: profitPerKg,
      clientBill: clientBill,
      myBill: myBill,
      totalProfit: totalProfit,
      status: row['Status'] || 'Pending',
      deliveryDate: row['Delivery Date'] || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });
  
  // Wipe existing data
  const deleteResult = await col.deleteMany({});
  console.log(`Deleted ${deleteResult.deletedCount} existing documents`);
  
  // Insert fresh data
  const insertResult = await col.insertMany(documents);
  console.log(`Inserted ${insertResult.insertedCount} documents`);
  
  // Verify
  const count = await col.countDocuments();
  console.log(`\n✅ Database now has ${count} documents`);
  
  // Print summary
  console.log('\n=== VERIFICATION ===');
  const docs = await col.find({}).sort({ shippingNumber: 1 }).toArray();
  docs.forEach(d => {
    console.log(`${d.shippingNumber} | ${d.shippingMethod.padEnd(4)} | W:${d.weight} | R:${d.rate} | FR:${d.finalRate} | UP:${d.profitPerKg} | CB:${d.clientBill} | MB:${d.myBill} | TP:${d.totalProfit} | ${d.status}`);
  });
  
  await client.close();
  console.log('\n🎉 Import complete!');
}

main().catch(e => { console.error(e); process.exit(1); });
