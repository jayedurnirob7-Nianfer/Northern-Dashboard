'use client';

import React, { useEffect, useState } from 'react';
import { Package, Search, Plus, FileDown, CheckSquare, Edit3, Truck, Trash2, Calculator, ListCollapse, X } from 'lucide-react';
import EditModal from './EditModal';
import BulkSummaryModal from './BulkSummaryModal';
import { generatePDF } from '@/lib/pdf';

export default function Dashboard() {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [showBulkSummary, setShowBulkSummary] = useState(false);

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    try {
      const res = await fetch('/api/shipments');
      const data = await res.json();
      if (Array.isArray(data)) {
        setShipments(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate Metrics
  const totalProfit = shipments.reduce((acc, s: any) => acc + (s.profit || 0), 0);
  const pendingCount = shipments.filter((s: any) => s.status !== 'Delivered').length;
  const deliveredCount = shipments.filter((s: any) => s.status === 'Delivered').length;

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredShipments.map((s: any) => s._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleBulkUpdateStatus = async (newStatus: string) => {
    if (selectedIds.length === 0) return;
    try {
      const res = await fetch('/api/shipments/bulk', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds, status: newStatus })
      });
      if (res.ok) {
        fetchShipments();
        setSelectedIds([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGeneratePDF = () => {
    const selectedData = shipments.filter((s: any) => selectedIds.includes(s._id));
    generatePDF(selectedData);
  };

  const handleNewShipment = () => {
    let nextShippingNo = 'NORS001';
    if (shipments.length > 0) {
      const norsNumbers = shipments
        .map((s: any) => s.shippingNumber)
        .filter((no: string) => no && no.startsWith('NORS'))
        .map((no: string) => parseInt(no.replace('NORS', ''), 10))
        .filter((no: number) => !isNaN(no));
      
      if (norsNumbers.length > 0) {
        const maxNo = Math.max(...norsNumbers);
        nextShippingNo = `NORS${String(maxNo + 1).padStart(3, '0')}`;
      }
    }
    setSelectedShipment({ shippingNumber: nextShippingNo });
  };

  const filteredShipments = shipments.filter((s: any) => statusFilter === 'All' || s.status === statusFilter);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'In China Warehouse': return 'bg-pink-500/20 text-pink-300 border border-pink-500/30';
      case 'In Shipment': return 'bg-red-500/20 text-red-400 border border-red-500/30';
      case 'In Bangladesh Warehouse': return 'bg-purple-500/20 text-purple-400 border border-purple-500/30';
      case 'Delivered': return 'bg-green-500/20 text-green-400 border border-green-500/30';
      case 'In Chittagong Port': return 'bg-blue-400/20 text-blue-300 border border-blue-400/30';
      default: return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
    }
  };

  const getMethodColor = (method: string) => {
    switch((method || '').toLowerCase().replace(/\s+/g, '')) {
      case 'air': return 'bg-blue-200 text-blue-800 border border-blue-300';
      case 'sea': return 'bg-blue-700 text-white border border-blue-600';
      case 'handcarry': return 'bg-[#404040] text-white border border-[#525252]';
      default: return 'bg-gray-800 text-gray-300 border border-gray-700';
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#09090b] text-gray-200 font-sans">
      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8">
        
        {/* Top Metrics */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-[#121217] border border-[#27272a] p-5 rounded-xl">
            <p className="text-gray-400 text-xs font-semibold mb-1">Total Shipments</p>
            <h2 className="text-2xl font-bold text-white">{shipments.length}</h2>
          </div>
          <div className="bg-[#121217] border border-[#27272a] p-5 rounded-xl">
            <p className="text-gray-400 text-xs font-semibold mb-1">Total Profit</p>
            <h2 className="text-2xl font-bold text-green-400">${totalProfit.toFixed(2)}</h2>
          </div>
          <div className="bg-[#121217] border border-[#27272a] p-5 rounded-xl">
            <p className="text-gray-400 text-xs font-semibold mb-1">Pending Delivery</p>
            <h2 className="text-2xl font-bold text-yellow-400">{pendingCount}</h2>
          </div>
          <div className="bg-[#121217] border border-[#27272a] p-5 rounded-xl">
            <p className="text-gray-400 text-xs font-semibold mb-1">Completed / Delivered</p>
            <h2 className="text-2xl font-bold text-blue-400">{deliveredCount}</h2>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-[#121217] border border-[#27272a] rounded-xl overflow-hidden flex flex-col h-[calc(100vh-200px)]">
        
        {/* Top Header & Filters */}
        <div className="p-6 border-b border-[#27272a] bg-[#121217] flex justify-between items-center gap-4 flex-wrap">
          <div className="flex items-center gap-4 flex-1 min-w-[200px]">
            <h1 className="text-xl font-bold text-white tracking-tight">Shipment Records</h1>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-2 sm:pb-0">
            {['All', 'In China Warehouse', 'In Shipment', 'In Chittagong Port', 'In Bangladesh Warehouse', 'Delivered'].map(status => (
              <button 
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${statusFilter === status ? 'bg-[#8b5cf6] text-white' : 'bg-[#18181f] text-gray-400 hover:text-white border border-[#27272a]'}`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-500" />
              <input type="text" placeholder="Search..." className="w-full bg-[#18181f] text-white pl-9 pr-4 py-2 rounded-lg border border-[#27272a] focus:outline-none focus:border-[#8b5cf6] text-sm" />
            </div>
            <button 
              onClick={handleNewShipment}
              className="bg-[#8b5cf6] hover:bg-[#a78bfa] text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors shadow-lg whitespace-nowrap"
            >
              <Plus className="w-4 h-4" /> New Shipment
            </button>
          </div>
        </div>

        {/* Bulk Action Bar (Always Visible) */}
        <div className={`border-b p-3 flex items-center gap-4 px-6 transition-all ${selectedIds.length > 0 ? 'bg-[#8b5cf6]/10 border-[#8b5cf6]/20' : 'bg-[#18181f] border-[#27272a]'}`}>
          <button 
            onClick={() => setSelectedIds([])}
            disabled={selectedIds.length === 0}
            className={`text-sm font-semibold flex items-center gap-2 transition-colors ${selectedIds.length > 0 ? 'text-[#a78bfa] hover:text-[#c4b5fd]' : 'text-gray-500 cursor-not-allowed'}`}
            title={selectedIds.length > 0 ? "Click to clear selection" : ""}
          >
            {selectedIds.length > 0 ? <X className="w-4 h-4" /> : <CheckSquare className="w-4 h-4" />} 
            {selectedIds.length} Selected
          </button>
          <div className="h-4 w-px bg-[#27272a]"></div>
          <div className="flex items-center gap-2">
            <select 
              onChange={(e) => handleBulkUpdateStatus(e.target.value)} 
              defaultValue="" 
              disabled={selectedIds.length === 0}
              className={`text-white p-1.5 rounded border text-xs font-medium ${selectedIds.length > 0 ? 'bg-[#18181f] border-[#3f3f46] cursor-pointer' : 'bg-[#121217] border-[#27272a] text-gray-500 cursor-not-allowed'}`}
            >
              <option value="" disabled>Change Status...</option>
              <option value="In China Warehouse">In China Warehouse</option>
              <option value="In Shipment">In Shipment</option>
              <option value="In Chittagong Port">In Chittagong Port</option>
              <option value="In Bangladesh Warehouse">In Bangladesh Warehouse</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
            <button 
              onClick={() => setShowBulkSummary(true)} 
              disabled={selectedIds.length === 0}
              className={`ml-auto border px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-2 transition-colors ${selectedIds.length > 0 ? 'bg-[#18181f] border-[#27272a] hover:bg-[#27272a] text-white' : 'bg-[#121217] border-[#27272a] text-gray-500 cursor-not-allowed'}`}
            >
              <ListCollapse className="w-3.5 h-3.5" /> Show Details
            </button>
            <button 
              onClick={handleGeneratePDF} 
              disabled={selectedIds.length === 0}
              className={`border px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-2 transition-colors ${selectedIds.length > 0 ? 'bg-[#18181f] border-[#27272a] hover:bg-[#27272a] text-white' : 'bg-[#121217] border-[#27272a] text-gray-500 cursor-not-allowed'}`}
            >
              <FileDown className="w-3.5 h-3.5" /> Generate PDF
            </button>
        </div>

        {/* Table Area */}
        <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-[#09090b] sticky top-0 uppercase tracking-wider text-[10px] z-10">
                <tr>
                  <th className="p-3 text-gray-400 font-semibold border-b border-[#27272a] whitespace-nowrap">
                    <input type="checkbox" onChange={handleSelectAll} checked={selectedIds.length === filteredShipments.length && filteredShipments.length > 0} className="rounded border-gray-600 bg-gray-700" />
                  </th>
                  <th className="p-3 text-gray-400 font-semibold border-b border-[#27272a] whitespace-nowrap">Shipping No</th>
                  <th className="p-3 text-gray-400 font-semibold border-b border-[#27272a] whitespace-nowrap">Tracking No</th>
                  <th className="p-3 text-gray-400 font-semibold border-b border-[#27272a] whitespace-nowrap">Shipping Mark</th>
                  <th className="p-3 text-gray-400 font-semibold border-b border-[#27272a] whitespace-nowrap">Date</th>
                  <th className="p-3 text-gray-400 font-semibold border-b border-[#27272a] whitespace-nowrap">Customer Name</th>
                  <th className="p-3 text-gray-400 font-semibold border-b border-[#27272a] whitespace-nowrap">Address</th>
                  <th className="p-3 text-gray-400 font-semibold border-b border-[#27272a] whitespace-nowrap">Mobile</th>
                  <th className="p-3 text-gray-400 font-semibold border-b border-[#27272a] whitespace-nowrap">Method</th>
                  <th className="p-3 text-gray-400 font-semibold border-b border-[#27272a] whitespace-nowrap">Product</th>
                  <th className="p-3 text-gray-400 font-semibold border-b border-[#27272a] whitespace-nowrap">Qty</th>
                  <th className="p-3 text-gray-400 font-semibold border-b border-[#27272a] whitespace-nowrap">Weight</th>
                  <th className="p-3 text-gray-400 font-semibold border-b border-[#27272a] whitespace-nowrap">Rate</th>
                  <th className="p-3 text-gray-400 font-semibold border-b border-[#27272a] whitespace-nowrap">Final Rate</th>
                  <th className="p-3 text-blue-400 font-bold border-b border-[#27272a] whitespace-nowrap">Unit Profit</th>
                  <th className="p-3 text-[#8b5cf6] font-bold border-b border-[#27272a] whitespace-nowrap">Status</th>
                  <th className="p-3 text-[#8b5cf6] font-bold border-b border-[#27272a] whitespace-nowrap">Del. Date</th>
                  <th className="p-3 text-gray-400 font-semibold border-b border-[#27272a] whitespace-nowrap">Client Bill</th>
                  <th className="p-3 text-gray-400 font-semibold border-b border-[#27272a] whitespace-nowrap">My Bill</th>
                  <th className="p-3 text-white font-bold border-b border-[#27272a] whitespace-nowrap text-right bg-black">Total Profit</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={20} className="p-8 text-center text-gray-500">Loading database...</td></tr>
                ) : filteredShipments.length === 0 ? (
                  <tr><td colSpan={20} className="p-8 text-center text-gray-500">No records found matching filters.</td></tr>
                ) : (
                  filteredShipments.map((s: any) => {
                    const isSelected = selectedIds.includes(s._id);
                    const isDelivered = s.status === 'Delivered';
                    let rowBg = isSelected ? 'bg-[#8b5cf6]/10' : (isDelivered ? 'bg-green-500/5' : '');
                    let hoverBg = isSelected ? 'hover:bg-[#8b5cf6]/20' : (isDelivered ? 'hover:bg-green-500/10' : 'hover:bg-[#1c1c21]');
                    
                    return (
                      <tr 
                        key={s._id} 
                        onClick={() => setSelectedShipment(s)} 
                        className={`border-b border-[#27272a] transition-colors cursor-pointer text-xs whitespace-nowrap ${rowBg} ${hoverBg}`}
                      >
                        <td className="p-3" onClick={(e) => e.stopPropagation()}>
                          <input type="checkbox" checked={isSelected} onChange={() => handleSelectRow(s._id)} className="rounded border-gray-600 bg-gray-700 cursor-pointer" />
                        </td>
                        <td className={`p-3 font-medium ${isDelivered ? 'text-green-200' : 'text-white'}`}>{s.shippingNumber}</td>
                      <td className="p-3 font-mono text-[#8b5cf6]">{s.trackingNumber || 'N/A'}</td>
                      <td className="p-3 text-gray-400">{s.shippingMark}</td>
                      <td className="p-3 text-gray-300">{s.date}</td>
                      <td className="p-3 text-white font-medium">{s.customerName}</td>
                      <td className="p-3 text-gray-400">{s.address}</td>
                      <td className="p-3 text-gray-300">{s.mobile}</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider ${getMethodColor(s.shippingMethod)}`}>
                          {s.shippingMethod || '-'}
                        </span>
                      </td>
                      <td className="p-3 text-gray-400 truncate max-w-[150px]">{s.productName}</td>
                      <td className="p-3 text-gray-400">{s.quantity}</td>
                      <td className="p-3 text-gray-300">{s.weight}</td>
                      <td className="p-3 text-gray-300">{s.rate}</td>
                      <td className="p-3 text-white font-semibold">{s.finalRate}</td>
                      <td className="p-3 text-blue-400 font-bold">{((parseFloat(s.finalRate) || 0) - (parseFloat(s.rate) || 0)).toFixed(2)}</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider ${getStatusColor(s.status)}`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="p-3 text-gray-300">{s.deliveryDate || '-'}</td>
                      <td className="p-3 text-gray-300">{s.clientBill}</td>
                      <td className="p-3 text-gray-300">{s.myBill}</td>
                      <td className="p-3 text-right font-bold text-black bg-[#6aa84f] border-l border-[#27272a]">${(s.totalProfit || s.profit || 0).toFixed(2)}</td>
                    </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* Modals */}
      {selectedShipment && (
        <EditModal 
          shipment={selectedShipment} 
          onClose={() => setSelectedShipment(null)} 
          onSave={() => {
            setSelectedShipment(null);
            fetchShipments();
          }} 
        />
      )}

      {showBulkSummary && (
        <BulkSummaryModal 
          shipments={shipments.filter((s: any) => selectedIds.includes(s._id))}
          onClose={() => setShowBulkSummary(false)}
        />
      )}
    </div>
  );
}
