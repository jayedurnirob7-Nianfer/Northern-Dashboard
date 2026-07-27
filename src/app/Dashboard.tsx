'use client';

import React, { useEffect, useState } from 'react';
import { Package, Search, Plus, FileDown, CheckSquare, Edit3, Truck, Trash2, Calculator, ListCollapse, X , DownloadCloud} from 'lucide-react';
import EditModal from './EditModal';
import BulkSummaryModal from './BulkSummaryModal';
import InvoiceModal from './InvoiceModal';
import { generatePDF } from '@/lib/pdf';


const ResizableHeader = ({ children, minWidth = 50, defaultWidth = 100 }: any) => {
  const [width, setWidth] = React.useState(defaultWidth);
  const startResizing = React.useCallback((mouseDownEvent: React.MouseEvent) => {
    mouseDownEvent.preventDefault();
    const startX = mouseDownEvent.clientX;
    const startWidth = width;
    
    const onMouseMove = (mouseMoveEvent: MouseEvent) => {
      const newWidth = Math.max(minWidth, startWidth + mouseMoveEvent.clientX - startX);
      setWidth(newWidth);
    };
    
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [width, minWidth]);

  return (
    <th className="p-0 border-b border-gray-200 dark:border-[#27272a] relative select-none group" style={{ width, minWidth: width, maxWidth: width }}>
      <div className="p-3 text-gray-700 dark:text-gray-400 font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
        {children}
      </div>
      <div 
        onMouseDown={startResizing}
        onDoubleClick={() => setWidth(defaultWidth)}
        className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-[#8b5cf6] dark:hover:bg-[#8b5cf6] opacity-0 group-hover:opacity-100 z-10 transition-colors"
        title="Double click to restore default width"
      />
    </th>
  );
};


const getMethodWidth = (method: string) => {
  if (method === 'Handcarry') return 'w-[120px]';
  return 'w-[85px]';
}

const getStatusWidth = (status: string) => {
  if (status === 'In Bangladesh Warehouse') return 'w-[200px]';
  if (status === 'In China Warehouse' || status === 'In Chittagong Port') return 'w-[170px]';
  if (status === 'In Shipment') return 'w-[130px]';
  if (status === 'Delivered') return 'w-[115px]';
  return 'w-[135px]';
}

export default function Dashboard() {

  const [shipments, setShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedShipment, setSelectedShipment] = useState<any | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [showBulkSummary, setShowBulkSummary] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

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

  
  const handleImport = async () => {
    setIsImporting(true);
    try {
      const res = await fetch('/api/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          url: 'https://docs.google.com/spreadsheets/d/1aT-DXdBmjYu5LqWohDCVB6BRdOTNXwgbLZ-3Jm7CrT0/edit?gid=0#gid=0',
          skipRows: 1
        })
      });
      const data = await res.json();
      if (res.ok) {
        alert('Successfully synced ' + data.count + ' records from sheet!');
        fetchShipments();
      } else {
        alert('Failed to sync: ' + data.error);
      }
    } catch (error) {
      console.error(error);
      alert('Error syncing data');
    } finally {
      setIsImporting(false);
    }
  };

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

  const handleInlineUpdate = async (id: string, field: string, value: string) => {
    try {
      setShipments(prev => prev.map(s => s._id === id ? { ...s, [field]: value } : s));
      const res = await fetch(`/api/shipments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value })
      });
      if (!res.ok) fetchShipments();
    } catch (err) {
      console.error(err);
      fetchShipments();
    }
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

  const filteredShipments = shipments.filter((s: any) => statusFilter === 'All' || s.status === statusFilter).sort((a: any, b: any) => {
    // Pure descending sort by NORS number, regardless of status.
    const aNum = parseInt((a.shippingNumber || '').replace(/\D/g, ''), 10) || 0;
    const bNum = parseInt((b.shippingNumber || '').replace(/\D/g, ''), 10) || 0;
    return bNum - aNum;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'In China Warehouse': return 'bg-pink-100 dark:bg-pink-500/20 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-500/30';
      case 'In Shipment': return 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/30';
      case 'In Bangladesh Warehouse': return 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-500/30';
      case 'Delivered': return 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30';
      case 'In Chittagong Port': return 'bg-blue-100 dark:bg-blue-400/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-400/30';
      default: return 'bg-gray-500/20 text-gray-700 dark:text-gray-400 border border-gray-500/30';
    }
  };

  const getMethodColor = (method: string) => {
    switch((method || '').toLowerCase().replace(/\s+/g, '')) {
      case 'air': return 'bg-blue-200 text-blue-800 border border-blue-300';
      case 'sea': return 'bg-blue-700 text-gray-900 dark:text-white border border-blue-600';
      case 'handcarry': return 'bg-gray-200 dark:bg-[#404040] text-gray-900 dark:text-white border border-gray-300 dark:border-[#525252]';
      default: return 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700';
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-[#09090b] text-gray-900 dark:text-gray-200 font-sans">
      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8">
        
        {/* Top Metrics */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-100 dark:bg-[#121217] border border-gray-200 dark:border-[#27272a] p-5 rounded-xl">
            <p className="text-gray-700 dark:text-gray-400 text-xs font-semibold mb-1">Total Shipments</p>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{shipments.length}</h2>
          </div>
          
          <div className="bg-slate-100 dark:bg-[#121217] border border-gray-200 dark:border-[#27272a] p-5 rounded-xl">
            <p className="text-gray-700 dark:text-gray-400 text-xs font-semibold mb-1">Pending Delivery</p>
            <h2 className="text-2xl font-bold text-amber-500 dark:text-yellow-400">{pendingCount}</h2>
          </div>
          <div className="bg-slate-100 dark:bg-[#121217] border border-gray-200 dark:border-[#27272a] p-5 rounded-xl">
            <p className="text-gray-700 dark:text-gray-400 text-xs font-semibold mb-1">Completed / Delivered</p>
            <h2 className="text-2xl font-bold text-blue-400">{deliveredCount}</h2>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-slate-100 dark:bg-[#121217] border border-gray-200 dark:border-[#27272a] rounded-xl overflow-hidden flex flex-col h-[calc(100vh-200px)]">
        
        {/* Top Header & Filters */}
        <div className="p-6 border-b border-gray-200 dark:border-[#27272a] bg-slate-100 dark:bg-[#121217] flex justify-between items-center gap-4 flex-wrap">
          <div className="flex items-center gap-4 flex-1 min-w-[200px]">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Shipment Records</h1>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-2 sm:pb-0">
            {['All', 'In China Warehouse', 'In Shipment', 'In Chittagong Port', 'In Bangladesh Warehouse', 'Delivered'].map(status => (
              <button 
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${statusFilter === status ? 'bg-[#8b5cf6] text-gray-900 dark:text-white' : 'bg-white dark:bg-[#18181f] text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:text-white border border-gray-200 dark:border-[#27272a]'}`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-500" />
              <input type="text" placeholder="Search..." className="w-full bg-white dark:bg-[#18181f] text-gray-900 dark:text-white pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-[#27272a] focus:outline-none focus:border-[#8b5cf6] text-sm" />
            </div>
            <button 
              onClick={handleImport}
              disabled={isImporting}
              className="bg-gray-100 hover:bg-gray-200 dark:bg-[#27272a] dark:hover:bg-[#3f3f46] text-gray-900 dark:text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors shadow-sm whitespace-nowrap border border-gray-200 dark:border-[#3f3f46]"
            >
              {isImporting ? <span className="animate-spin">⏳</span> : <DownloadCloud className="w-4 h-4" />}
              {isImporting ? 'Syncing...' : 'Sync Sheet'}
            </button>
            <button 
              onClick={handleNewShipment}
              className="bg-[#8b5cf6] hover:bg-[#a78bfa] text-gray-900 dark:text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors shadow-lg whitespace-nowrap"
            >
              <Plus className="w-4 h-4" /> New Shipment
            </button>
          </div>
        </div>

        {/* Bulk Action Bar (Always Visible) */}
        <div className={`border-b p-3 flex items-center gap-4 px-6 transition-all ${selectedIds.length > 0 ? 'bg-[#8b5cf6]/10 border-[#8b5cf6]/20' : 'bg-white dark:bg-[#18181f] border-gray-200 dark:border-[#27272a]'}`}>
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
              className={`text-gray-900 dark:text-white p-1.5 rounded border text-xs font-medium ${selectedIds.length > 0 ? 'bg-white dark:bg-[#18181f] border-gray-300 dark:border-[#3f3f46] cursor-pointer' : 'bg-slate-100 dark:bg-[#121217] border-gray-200 dark:border-[#27272a] text-gray-500 cursor-not-allowed'}`}
            >
              <option value="" disabled>Change Status...</option>
              <option value="In China Warehouse">In China Warehouse</option>
              <option value="In Shipment">In Shipment</option>
              <option value="In Chittagong Port">In Chittagong Port</option>
              <option value="In Bangladesh Warehouse">In Bangladesh Warehouse</option>
              <option value="Delivered">Delivered</option>
            </select>

            <button 
              onClick={() => setShowBulkSummary(true)}
              disabled={selectedIds.length === 0}
              className={`p-1.5 rounded border text-xs font-medium flex items-center gap-1 transition-colors ${selectedIds.length > 0 ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20 hover:bg-blue-100 dark:hover:bg-blue-500/20 cursor-pointer' : 'bg-slate-100 dark:bg-[#121217] text-gray-400 border-gray-200 dark:border-[#27272a] cursor-not-allowed'}`}
            >
              <Calculator className="w-3.5 h-3.5" /> Summary
            </button>
            <button 
              onClick={() => setShowInvoiceModal(true)} 
              disabled={selectedIds.length === 0}
              className={`px-6 py-2.5 rounded-lg text-sm font-black tracking-wide flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95 ${selectedIds.length > 0 ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-xl shadow-emerald-500/30 border-none animate-pulse hover:animate-none' : 'bg-slate-100 dark:bg-[#121217] border border-gray-200 dark:border-[#27272a] text-gray-500 cursor-not-allowed shadow-none transform-none'}`}
            >
              <FileDown className="w-5 h-5" /> GENERATE INVOICE
            </button>
          </div>
        </div>

        {/* Table Area */}
        <div className="flex-1 overflow-auto">
            <table className="w-max text-left border-collapse text-xs table-fixed">
              <thead className="bg-white dark:bg-[#09090b] sticky top-0 uppercase tracking-wider text-[10px] z-10">
                <tr>
                  <th className="p-3 w-12 min-w-[48px] max-w-[48px] text-center text-gray-700 dark:text-gray-400 font-semibold border-b border-gray-200 dark:border-[#27272a] whitespace-nowrap">
                    <input type="checkbox" onChange={handleSelectAll} checked={selectedIds.length === filteredShipments.length && filteredShipments.length > 0} className="rounded border-gray-600 bg-gray-700" />
                  </th>
                  <ResizableHeader defaultWidth={120}>Shipping No</ResizableHeader>
                  <ResizableHeader defaultWidth={120}>Tracking No</ResizableHeader>
                  <ResizableHeader defaultWidth={120}>Shipping Mark</ResizableHeader>
                  <ResizableHeader defaultWidth={120}>Date</ResizableHeader>
                  <ResizableHeader defaultWidth={120}>Customer Name</ResizableHeader>
                  <ResizableHeader defaultWidth={120}>Address</ResizableHeader>
                  <ResizableHeader defaultWidth={120}>Mobile</ResizableHeader>
                  <ResizableHeader defaultWidth={120}>Method</ResizableHeader>
                  <ResizableHeader defaultWidth={120}>Product</ResizableHeader>
                  <ResizableHeader defaultWidth={120}>Qty</ResizableHeader>
                  <ResizableHeader defaultWidth={120}>Weight</ResizableHeader>
                  <ResizableHeader defaultWidth={120}>Rate</ResizableHeader>
                  <ResizableHeader defaultWidth={120}>Final Rate</ResizableHeader>
                  <ResizableHeader defaultWidth={120}>Unit Profit</ResizableHeader>
                  <ResizableHeader defaultWidth={120}>Status</ResizableHeader>
                  <ResizableHeader defaultWidth={120}>Del. Date</ResizableHeader>
                  <ResizableHeader defaultWidth={120}>Client Bill</ResizableHeader>
                  <ResizableHeader defaultWidth={120}>My Bill</ResizableHeader>
                  <ResizableHeader defaultWidth={120}>Total Profit</ResizableHeader>
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
                    let rowBg = isSelected ? 'bg-[#8b5cf6]/10' : (isDelivered ? 'bg-emerald-50 dark:bg-emerald-500/10' : '');
                    let hoverBg = isSelected ? 'hover:bg-[#8b5cf6]/20' : (isDelivered ? 'hover:bg-emerald-100 dark:hover:bg-emerald-500/20' : 'hover:bg-gray-50 dark:hover:bg-[#1c1c21]');
                    
                    const w = parseFloat(s.weight) || 0;
                    const r = parseFloat(s.rate) || 0;
                    const fr = parseFloat(s.finalRate) || 0;
                    const hasRate = r > 0; // rate=0 means not set yet
                    
                    const clientBill = (s.clientBill != null && s.clientBill !== 0) ? parseFloat(s.clientBill) : (w * fr);
                    const myBill = hasRate ? ((s.myBill != null && s.myBill !== 0) ? parseFloat(s.myBill) : (w * r)) : 0;
                    const totalProfit = hasRate ? ((s.totalProfit != null && s.totalProfit !== 0) ? parseFloat(s.totalProfit) : (clientBill - myBill)) : 0;
                    const unitProfit = hasRate ? ((s.profitPerKg != null && s.profitPerKg !== 0) ? parseFloat(s.profitPerKg) : (fr - r)) : 0;

                    return (
                      <tr 
                        key={s._id} 
                        onClick={() => setSelectedShipment(s)} 
                        className={`border-b border-gray-200 dark:border-[#27272a] transition-colors cursor-pointer text-xs whitespace-nowrap ${rowBg} ${hoverBg}`}
                      >
                        <td className="p-3 text-center w-12 min-w-[48px] max-w-[48px]" onClick={(e) => e.stopPropagation()}>
                          <input type="checkbox" checked={isSelected} onChange={() => handleSelectRow(s._id)} className="rounded border-gray-600 bg-gray-700 cursor-pointer" />
                        </td>
                        <td className={`p-3 max-w-0 pl-6 font-medium ${isDelivered ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-900 dark:text-white'}`}><div className="w-full overflow-hidden text-ellipsis whitespace-nowrap">{s.shippingNumber}</div></td>
                        <td className="p-3 max-w-0 font-mono text-[#8b5cf6]"><div className="w-full overflow-hidden text-ellipsis whitespace-nowrap">{s.trackingNumber || 'N/A'}</div></td>
                        <td className="p-3 max-w-0 text-gray-700 dark:text-gray-400"><div className="w-full overflow-hidden text-ellipsis whitespace-nowrap">{s.shippingMark}</div></td>
                        <td className="p-3 max-w-0 text-gray-700 dark:text-gray-300"><div className="w-full overflow-hidden text-ellipsis whitespace-nowrap">{s.date}</div></td>
                        <td className="p-3 max-w-0 text-gray-900 dark:text-white font-medium"><div className="w-full overflow-hidden text-ellipsis whitespace-nowrap">{s.customerName}</div></td>
                        <td className="p-3 max-w-0 text-gray-700 dark:text-gray-400"><div className="w-full overflow-hidden text-ellipsis whitespace-nowrap">{s.address}</div></td>
                        <td className="p-3 max-w-0 text-gray-700 dark:text-gray-300"><div className="w-full overflow-hidden text-ellipsis whitespace-nowrap">{s.mobile}</div></td>
                        <td className="p-3 max-w-0" onClick={(e) => e.stopPropagation()}>
                          <select 
                            value={s.shippingMethod || ''} 
                            onChange={(e) => handleInlineUpdate(s._id, 'shippingMethod', e.target.value)}
                            className={`px-2 py-1 pr-6 ${getMethodWidth(s.shippingMethod || '')} max-w-full text-ellipsis overflow-hidden rounded-full text-[10px] font-bold tracking-wider cursor-pointer border-0 outline-none hover:ring-2 hover:ring-[#8b5cf6]/50 transition-all ${s.shippingMethod ? getMethodColor(s.shippingMethod) : 'bg-gray-100 text-gray-500 dark:bg-gray-800'}`}
                          >
                            <option value="" disabled>-</option>
                            <option value="Sea" className="bg-white dark:bg-[#18181f] text-gray-900 dark:text-white font-medium">Sea</option>
                            <option value="Air" className="bg-white dark:bg-[#18181f] text-gray-900 dark:text-white font-medium">Air</option>
                            <option value="Handcarry" className="bg-white dark:bg-[#18181f] text-gray-900 dark:text-white font-medium">Handcarry</option>
                          </select>
                        </td>
                        <td className="p-3 max-w-0 text-gray-700 dark:text-gray-400"><div className="w-full overflow-hidden text-ellipsis whitespace-nowrap">{s.productName}</div></td>
                        <td className="p-3 max-w-0 text-gray-700 dark:text-gray-400"><div className="w-full overflow-hidden text-ellipsis whitespace-nowrap">{s.quantity}</div></td>
                        <td className="p-3 max-w-0 text-gray-700 dark:text-gray-300"><div className="w-full overflow-hidden text-ellipsis whitespace-nowrap">{s.weight}</div></td>
                        <td className="p-3 max-w-0 text-gray-700 dark:text-gray-300"><div className="w-full overflow-hidden text-ellipsis whitespace-nowrap">{hasRate ? r : <span className="text-gray-400">-</span>}</div></td>
                        <td className="p-3 max-w-0 text-gray-900 dark:text-white font-semibold"><div className="w-full overflow-hidden text-ellipsis whitespace-nowrap">{s.finalRate}</div></td>
                        <td className="p-3 max-w-0 text-blue-400 font-bold"><div className="w-full overflow-hidden text-ellipsis whitespace-nowrap">{hasRate ? unitProfit.toFixed(2) : <span className="text-gray-400">-</span>}</div></td>
                        <td className="p-3 max-w-0" onClick={(e) => e.stopPropagation()}>
                          <select 
                            value={s.status} 
                            onChange={(e) => handleInlineUpdate(s._id, 'status', e.target.value)}
                            className={`px-2 py-1 pr-6 ${getStatusWidth(s.status || '')} max-w-full text-ellipsis overflow-hidden rounded-full text-[10px] font-bold tracking-wider cursor-pointer border-0 outline-none hover:ring-2 hover:ring-[#8b5cf6]/50 transition-all ${getStatusColor(s.status)}`}
                          >
                            <option value="In China Warehouse" className="bg-white dark:bg-[#18181f] text-gray-900 dark:text-white font-medium">In China Warehouse</option>
                            <option value="In Shipment" className="bg-white dark:bg-[#18181f] text-gray-900 dark:text-white font-medium">In Shipment</option>
                            <option value="In Chittagong Port" className="bg-white dark:bg-[#18181f] text-gray-900 dark:text-white font-medium">In Chittagong Port</option>
                            <option value="In Bangladesh Warehouse" className="bg-white dark:bg-[#18181f] text-gray-900 dark:text-white font-medium">In Bangladesh Warehouse</option>
                            <option value="Delivered" className="bg-white dark:bg-[#18181f] text-gray-900 dark:text-white font-medium">Delivered</option>
                          </select>
                        </td>
                        <td className="p-3 max-w-0 text-gray-700 dark:text-gray-300"><div className="w-full overflow-hidden text-ellipsis whitespace-nowrap">{s.deliveryDate || <span className="text-gray-400">-</span>}</div></td>
                        <td className="p-3 max-w-0 text-gray-700 dark:text-gray-300"><div className="w-full overflow-hidden text-ellipsis whitespace-nowrap">{clientBill.toFixed(2)}</div></td>
                        <td className="p-3 max-w-0 text-gray-700 dark:text-gray-300"><div className="w-full overflow-hidden text-ellipsis whitespace-nowrap">{hasRate ? myBill.toFixed(2) : <span className="text-gray-400">-</span>}</div></td>
                        <td className={`p-3 max-w-0 text-right font-bold border-l border-gray-200 dark:border-[#27272a] ${hasRate && totalProfit > 0 ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10' : 'text-gray-700 dark:text-gray-400 font-medium'}`} title={hasRate ? `$${totalProfit.toFixed(2)}` : ''}><div className="w-full overflow-hidden text-ellipsis whitespace-nowrap">{hasRate ? `$${totalProfit.toFixed(2)}` : <span className="text-gray-400">-</span>}</div></td>
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

      {showInvoiceModal && (
        <InvoiceModal 
          ids={selectedIds}
          onClose={() => setShowInvoiceModal(false)}
        />
      )}
    </div>
  );
}
