import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Shipment from '@/models/Shipment';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Fetch all records, sorted by newest first
    const shipments = await Shipment.find({}).sort({ createdAt: -1 });
    
    // Define the exact headers matching the Google Sheet
    const headers = [
      "Shipping Number", "Tracking Number", "Shipping Mark", "Date", "Customer Name", 
      "Address", "Mobile",
      "Shipping Method", "Product Name", "Quantity", "Weight", "Rate", "Final Rate", 
      "Profit", "Client Bill", "My Bill", "Total Profit", "Status", "Delivery Date"
    ];
    
    // Map data to CSV rows
    const rows = shipments.map(s => [
      s.shippingNumber || '',
      s.trackingNumber || '',
      s.shippingMark || '',
      s.date || '',
      s.customerName || '',
      s.address || '',
      s.mobile || '',
      s.shippingMethod || '',
      s.productName || '',
      s.quantity || '',
      s.weight || 0,
      s.rate || 0,
      s.finalRate || 0,
      s.profitPerKg || 0,
      s.clientBill || 0,
      s.myBill || 0,
      s.totalProfit || 0,
      s.status || 'Pending',
      s.deliveryDate || ''
    ]);
    
    // Escape quotes and commas for safe CSV formatting
    const escapeCSV = (field: any) => {
      const str = String(field);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };
    
    const csvContent = [
      headers.map(escapeCSV).join(','),
      ...rows.map(row => row.map(escapeCSV).join(','))
    ].join('\n');
    
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="shipments_backup_${new Date().toISOString().split('T')[0]}.csv"`
      }
    });
  } catch (error: any) {
    console.error('Export failed:', error);
    return NextResponse.json({ error: 'Failed to generate backup' }, { status: 500 });
  }
}
