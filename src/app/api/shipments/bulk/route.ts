import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Shipment from '@/models/Shipment';

export async function PUT(req: Request) {
  try {
    const { ids, status } = await req.json();
    if (!ids || !Array.isArray(ids) || !status) {
      return NextResponse.json({ error: 'ids array and status are required' }, { status: 400 });
    }

    await connectToDatabase();
    
    const result = await Shipment.updateMany(
      { _id: { $in: ids } },
      { $set: { status } }
    );
    
    return NextResponse.json({ success: true, count: result.modifiedCount });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
