import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Shipment from '@/models/Shipment';

export async function GET() {
  try {
    await connectToDatabase();
    // Sort by createdAt descending (newest first)
    const shipments = await Shipment.find({}).sort({ createdAt: -1 });
    return NextResponse.json(shipments);
  } catch (error: any) {
    console.error('Failed to fetch shipments:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const newShipment = await Shipment.create(body);
    return NextResponse.json(newShipment, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create shipment:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
