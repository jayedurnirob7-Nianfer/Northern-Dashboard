import mongoose, { Schema, Document } from 'mongoose';

export interface IShipment extends Document {
  shippingNumber: string;
  trackingNumber: string;
  shippingMark: string;
  date: string;
  customerName: string;
  address: string;
  mobile: string;
  shippingMethod: string;
  productName: string;
  quantity: string;
  weight: number;
  rate: number;
  finalRate: number;
  profitPerKg: number;
  clientBill: number;
  myBill: number;
  totalProfit: number;
  status: string;
  deliveryDate?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ShipmentSchema: Schema = new Schema(
  {
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
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Shipment || mongoose.model<IShipment>('Shipment', ShipmentSchema);
