import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Shipment from '@/models/Shipment';

function parseCSV(csv: string) {
  const lines = csv.split('\n');
  const result = [];
  for (let i = 0; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const row = [];
    let cur = '';
    let inQuote = false;
    for (let j = 0; j < lines[i].length; j++) {
      const char = lines[i][j];
      if (char === '"' && lines[i][j + 1] === '"') {
        cur += '"'; j++;
      } else if (char === '"') {
        inQuote = !inQuote;
      } else if (char === ',' && !inQuote) {
        row.push(cur.trim());
        cur = '';
      } else {
        cur += char;
      }
    }
    row.push(cur.trim());
    result.push(row);
  }
  return result;
}

export async function POST(req: Request) {
  try {
    const { url, skipRows } = await req.json();
    if (!url) return NextResponse.json({ error: 'URL is required' }, { status: 400 });

    let exportUrl = url;
    if (url.includes('/edit')) {
      exportUrl = url.replace(/\/edit.*$/, '/export?format=csv&' + (url.split('?')[1] || ''));
    }

    const response = await fetch(exportUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.statusText}`);
    }
    const csvData = await response.text();
    const parsed = parseCSV(csvData);
    const dataRows = parsed.slice(skipRows || 0);
    
    await connectToDatabase();
    let importedCount = 0;
    
    for (const row of dataRows) {
      if (row.length < 5 || !row[0]) continue;
      
      const shipment = {
        shippingNumber: row[0] || '',
        trackingNumber: row[1] || '',
        shippingMark: row[2] || '',
        date: row[3] || '',
        customerName: row[4] || '',
        address: row[5] || '',
        mobile: row[6] || '',
        shippingMethod: row[7] || '',
        productName: row[8] || '',
        quantity: row[9] || '',
        weight: parseFloat(row[10]) || 0,
        rate: parseFloat(row[11]) || 0,
        finalRate: parseFloat(row[12]) || 0,
        profitPerKg: parseFloat(row[13]) || 0,
        clientBill: parseFloat(row[14]) || 0,
        myBill: parseFloat(row[15]) || 0,
        totalProfit: parseFloat(row[16]) || 0,
        status: row[17] || 'Pending',
        deliveryDate: row[18] || '',
      };
      
      await Shipment.create(shipment);
      importedCount++;
    }
    
    return NextResponse.json({ success: true, count: importedCount });
  } catch (error: any) {
    console.error('Import failed:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
