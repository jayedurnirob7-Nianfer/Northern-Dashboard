import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';
import { Lock, Unlock } from 'lucide-react';

export default function EditModal({ shipment, onClose, onSave }: { shipment: any, onClose: () => void, onSave: () => void }) {
  const [formData, setFormData] = useState(shipment || {});

  const isNew = shipment ? !shipment._id : false;
  const [isLocked, setIsLocked] = useState(!isNew && shipment?.status === 'Delivered');

  useEffect(() => {
    setFormData(shipment || {});
    setIsLocked(!isNew && shipment?.status === 'Delivered');
  }, [shipment, isNew]);

  if (!shipment) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const isNum = ['weight', 'rate', 'finalRate', 'profitPerKg', 'clientBill', 'myBill', 'totalProfit'].includes(name);
    
    setFormData((prev: any) => {
      const next = {
        ...prev,
        [name]: value
      };
      
      if (['weight', 'rate', 'finalRate'].includes(name)) {
        const w = parseFloat(next.weight) || 0;
        const r = parseFloat(next.rate) || 0;
        const fr = parseFloat(next.finalRate) || 0;
        
        next.clientBill = parseFloat((w * fr).toFixed(2));
        next.myBill = parseFloat((w * r).toFixed(2));
        next.totalProfit = parseFloat((next.clientBill - next.myBill).toFixed(2));
        next.profitPerKg = parseFloat((fr - r).toFixed(2));
      } else if (['clientBill', 'myBill'].includes(name)) {
        const cb = parseFloat(next.clientBill) || 0;
        const mb = parseFloat(next.myBill) || 0;
        next.totalProfit = parseFloat((cb - mb).toFixed(2));
      }
      
      return next;
    });
  };

  const handleDateChange = (name: string, date: Date | null) => {
    setFormData((prev: any) => ({
      ...prev,
      [name]: date ? format(date, 'dd-MMM-yyyy') : ''
    }));
  };

  const parseSafeDate = (dString: string) => {
    if (!dString) return null;
    const d = new Date(dString);
    return isNaN(d.getTime()) ? null : d;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = isNew ? '/api/shipments' : `/api/shipments/${shipment._id}`;
      const method = isNew ? 'POST' : 'PUT';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        onSave();
      } else {
        alert('Failed to save data');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving data');
    }
  };

  const handleDelete = async () => {
    const pwd = window.prompt("Enter password to delete this shipment:");
    if (pwd !== "admin123") {
      alert("Incorrect password!");
      return;
    }
    
    try {
      const res = await fetch(`/api/shipments/${shipment._id}`, { method: 'DELETE' });
      if (res.ok) {
        onSave();
      } else {
        alert("Failed to delete shipment");
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting shipment');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-gray-100 dark:bg-[#121217] border border-gray-200 dark:border-[#27272a] rounded-xl w-full max-w-4xl max-h-[90vh] overflow-auto flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 border-b border-gray-200 dark:border-[#27272a] flex justify-between items-center sticky top-0 bg-gray-100 dark:bg-[#121217] z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              {isNew ? 'Create New Shipment' : `Edit Shipment: ${formData.trackingNumber || formData.shippingNumber}`}
            </h2>
            {(!isNew && shipment.status === 'Delivered') && (
              <button 
                onClick={() => setIsLocked(!isLocked)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${isLocked ? 'bg-[#8b5cf6]/20 text-[#a78bfa] hover:bg-[#8b5cf6]/30' : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'}`}
              >
                {isLocked ? <><Lock size={14} /> Locked</> : <><Unlock size={14} /> Unlocked</>}
              </button>
            )}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 dark:text-white">&times; Close</button>
        </div>
        
        <form onSubmit={handleSubmit} className={`p-5 flex flex-col gap-6 ${isLocked ? 'opacity-70 pointer-events-none' : ''}`}>
          
          {/* General Information */}
          <div className="bg-white dark:bg-[#09090b] p-4 rounded-lg border border-gray-200 dark:border-[#27272a]">
            <h3 className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-3">General Information</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Shipping Number</label>
                <input type="text" name="shippingNumber" value={formData.shippingNumber || ''} onChange={handleChange} className="w-full bg-gray-50 dark:bg-[#18181f] text-gray-900 dark:text-white p-2 rounded border border-gray-300 dark:border-[#3f3f46] text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Tracking Number</label>
                <input type="text" name="trackingNumber" value={formData.trackingNumber || ''} onChange={handleChange} className="w-full bg-gray-50 dark:bg-[#18181f] text-gray-900 dark:text-white p-2 rounded border border-gray-300 dark:border-[#3f3f46] text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Shipping Mark</label>
                <input type="text" name="shippingMark" value={formData.shippingMark || ''} onChange={handleChange} className="w-full bg-gray-50 dark:bg-[#18181f] text-gray-900 dark:text-white p-2 rounded border border-gray-300 dark:border-[#3f3f46] text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Date</label>
                <DatePicker 
                  selected={parseSafeDate(formData.date)} 
                  onChange={(date: Date | null) => handleDateChange('date', date)} 
                  dateFormat="dd-MMM-yyyy"
                  placeholderText="Select Date"
                  className="w-full bg-gray-50 dark:bg-[#18181f] text-gray-900 dark:text-white p-2 rounded border border-gray-300 dark:border-[#3f3f46] text-sm cursor-pointer" 
                  wrapperClassName="w-full"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Customer Name</label>
                <input type="text" name="customerName" value={formData.customerName || ''} onChange={handleChange} className="w-full bg-gray-50 dark:bg-[#18181f] text-gray-900 dark:text-white p-2 rounded border border-gray-300 dark:border-[#3f3f46] text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Mobile</label>
                <input type="text" name="mobile" value={formData.mobile || ''} onChange={handleChange} className="w-full bg-gray-50 dark:bg-[#18181f] text-gray-900 dark:text-white p-2 rounded border border-gray-300 dark:border-[#3f3f46] text-sm" />
              </div>
              <div className="col-span-3">
                <label className="block text-xs text-gray-400 mb-1">Address</label>
                <input type="text" name="address" value={formData.address || ''} onChange={handleChange} className="w-full bg-gray-50 dark:bg-[#18181f] text-gray-900 dark:text-white p-2 rounded border border-gray-300 dark:border-[#3f3f46] text-sm" />
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="bg-white dark:bg-[#09090b] p-4 rounded-lg border border-gray-200 dark:border-[#27272a]">
            <h3 className="text-xs font-semibold text-orange-400 uppercase tracking-wider mb-3">Product Details</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-2">
                <label className="block text-xs text-gray-400 mb-1">Product Name</label>
                <input type="text" name="productName" value={formData.productName || ''} onChange={handleChange} className="w-full bg-gray-50 dark:bg-[#18181f] text-gray-900 dark:text-white p-2 rounded border border-gray-300 dark:border-[#3f3f46] text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Quantity</label>
                <input type="text" name="quantity" value={formData.quantity || ''} onChange={handleChange} className="w-full bg-gray-50 dark:bg-[#18181f] text-gray-900 dark:text-white p-2 rounded border border-gray-300 dark:border-[#3f3f46] text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Shipping Method</label>
                <select name="shippingMethod" value={formData.shippingMethod || 'Sea'} onChange={handleChange} className="w-full bg-gray-50 dark:bg-[#18181f] text-gray-900 dark:text-white p-2 rounded border border-gray-300 dark:border-[#3f3f46] text-sm">
                  <option value="Sea">SEA</option>
                  <option value="Air">Air</option>
                  <option value="Hand Carry">Hand Carry</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Weight</label>
                <input type="number" step="0.01" name="weight" value={formData.weight ?? ''} onChange={handleChange} className="w-full bg-gray-50 dark:bg-[#18181f] text-gray-900 dark:text-white p-2 rounded border border-gray-300 dark:border-[#3f3f46] text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Rate</label>
                <input type="number" step="0.01" name="rate" value={formData.rate ?? ''} onChange={handleChange} className="w-full bg-gray-50 dark:bg-[#18181f] text-gray-900 dark:text-white p-2 rounded border border-gray-300 dark:border-[#3f3f46] text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Final Rate</label>
                <input type="number" step="0.01" name="finalRate" value={formData.finalRate ?? ''} onChange={handleChange} className="w-full bg-gray-50 dark:bg-[#18181f] text-gray-900 dark:text-white p-2 rounded border border-gray-300 dark:border-[#3f3f46] text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              </div>
            </div>
          </div>

          {/* Financials & Status Section */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white dark:bg-[#09090b] p-4 rounded-lg border border-gray-200 dark:border-[#27272a]">
              <h3 className="text-xs font-semibold text-green-400 uppercase tracking-wider mb-3">Financials</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Client Bill ($)</label>
                  <input type="number" step="0.01" name="clientBill" value={formData.clientBill ?? 0} onChange={handleChange} className="w-full bg-white dark:bg-[#18181f] text-gray-900 dark:text-white p-2 rounded border border-gray-200 dark:border-[#3f3f46] text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">My Bill ($)</label>
                  <input type="number" step="0.01" name="myBill" value={formData.myBill ?? 0} onChange={handleChange} className="w-full bg-white dark:bg-[#18181f] text-gray-900 dark:text-white p-2 rounded border border-gray-200 dark:border-[#3f3f46] text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Total Profit ($)</label>
                  <input type="number" step="0.01" name="totalProfit" value={formData.totalProfit ?? 0} onChange={handleChange} className="w-full bg-white dark:bg-[#18181f] text-gray-900 dark:text-white p-2 rounded border border-gray-200 dark:border-[#3f3f46] text-sm" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#09090b] p-4 rounded-lg border border-gray-200 dark:border-[#27272a]">
              <h3 className="text-xs font-semibold text-[#8b5cf6] uppercase tracking-wider mb-3">Fulfillment Status</h3>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Status</label>
                  <select name="status" value={formData.status || 'In China Warehouse'} onChange={handleChange} className="w-full bg-gray-50 dark:bg-[#18181f] text-gray-900 dark:text-white p-2 rounded border border-gray-300 dark:border-[#3f3f46] text-sm">
                    <option value="In China Warehouse">In China Warehouse</option>
                    <option value="In Shipment">In Shipment</option>
                    <option value="In Chittagong Port">In Chittagong Port</option>
                    <option value="In Bangladesh Warehouse">In Bangladesh Warehouse</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Delivery Date</label>
                  <DatePicker 
                    selected={parseSafeDate(formData.deliveryDate)} 
                    onChange={(date: Date | null) => handleDateChange('deliveryDate', date)} 
                    dateFormat="dd-MMM-yyyy"
                    placeholderText="Select Date"
                    className="w-full bg-gray-50 dark:bg-[#18181f] text-gray-900 dark:text-white p-2 rounded border border-gray-300 dark:border-[#3f3f46] text-sm cursor-pointer" 
                    wrapperClassName="w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-[#27272a] mt-2">
            <div>
              {!isNew && (
                <button type="button" onClick={handleDelete} className="px-4 py-2 rounded-lg text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-colors">
                  Delete Shipment
                </button>
              )}
            </div>
            <div className="flex gap-3 pointer-events-auto">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-400 hover:text-gray-900 dark:text-white transition-colors">Cancel</button>
              <button type="submit" disabled={isLocked} className={`px-6 py-2 rounded-lg text-sm font-semibold transition-colors shadow-lg ${isLocked ? 'bg-[#27272a] text-gray-500 cursor-not-allowed' : 'bg-[#8b5cf6] hover:bg-[#a78bfa] text-gray-900 dark:text-white'}`}>
                {isNew ? 'Create Shipment' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
