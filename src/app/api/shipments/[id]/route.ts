import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Shipment from '@/models/Shipment';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const updatedShipment = await Shipment.findByIdAndUpdate(params.id, body, { new: true });
    
    if (!updatedShipment) {
      return NextResponse.json({ error: 'Shipment not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedShipment);
  } catch (error: any) {
    console.error('Failed to update shipment:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const deletedShipment = await Shipment.findByIdAndDelete(params.id);
    
    if (!deletedShipment) {
      return NextResponse.json({ error: 'Shipment not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to delete shipment:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
