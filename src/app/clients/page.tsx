'use client';

import React, { useEffect, useState } from 'react';
import { Users, Search, ListCollapse, X } from 'lucide-react';

export default function ClientsPage() {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [selectedClient, setSelectedClient] = useState<string | null>(null);

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    try {
      const res = await fetch('/api/shipments');
      const data = await res.json();
      setShipments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Aggregate Clients
  const clientMap = new Map<string, {
    name: string;
    totalShipments: number;
    totalRevenue: number;
    totalProfit: number;
    shipments: any[];
  }>();

  shipments.forEach((s: any) => {
    const name = s.customerName || 'Unknown';
    if (!clientMap.has(name)) {
      clientMap.set(name, {
        name,
        totalShipments: 0,
        totalRevenue: 0,
        totalProfit: 0,
        shipments: []
      });
    }
    const client = clientMap.get(name)!;
    client.totalShipments += 1;
    client.totalRevenue += (parseFloat(s.clientBill) || 0);
    client.totalProfit += (parseFloat(s.totalProfit) || parseFloat(s.profit) || 0);
    client.shipments.push(s);
  });

  const allClients = Array.from(clientMap.values());
  const filteredClients = allClients.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // Calculate global metrics
  const totalClients = allClients.length;
  const totalGlobalRevenue = allClients.reduce((acc, c) => acc + c.totalRevenue, 0);
  const totalGlobalProfit = allClients.reduce((acc, c) => acc + c.totalProfit, 0);

  // Helper for the modal
  const selectedClientData = selectedClient ? clientMap.get(selectedClient) : null;

  return (
    <div className="flex flex-col h-full bg-[#09090b] text-gray-200 font-sans">
      <main className="flex-1 overflow-auto p-8">
        
        {/* Top Metrics */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-[#121217] border border-[#27272a] p-5 rounded-xl">
            <p className="text-gray-400 text-xs font-semibold mb-1">Total Unique Clients</p>
            <h2 className="text-2xl font-bold text-white">{totalClients}</h2>
          </div>
          <div className="bg-[#121217] border border-[#27272a] p-5 rounded-xl">
            <p className="text-gray-400 text-xs font-semibold mb-1">Total Lifetime Revenue</p>
            <h2 className="text-2xl font-bold text-green-400">${totalGlobalRevenue.toFixed(2)}</h2>
          </div>
          <div className="bg-[#121217] border border-[#27272a] p-5 rounded-xl">
            <p className="text-gray-400 text-xs font-semibold mb-1">Total Lifetime Profit</p>
            <h2 className="text-2xl font-bold text-blue-400">${totalGlobalProfit.toFixed(2)}</h2>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-[#121217] border border-[#27272a] rounded-xl overflow-hidden flex flex-col h-[calc(100vh-200px)]">
        
          <div className="p-6 border-b border-[#27272a] bg-[#121217] flex justify-between items-center gap-4 flex-wrap">
            <div className="flex items-center gap-4 flex-1 min-w-[200px]">
              <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <Users className="text-[#8b5cf6]" /> Client Database
              </h1>
            </div>
            
            <div className="flex items-center gap-4 flex-1 justify-end">
              <div className="relative w-full max-w-sm">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Search clients..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#18181f] text-white pl-9 pr-4 py-2 rounded-lg border border-[#27272a] focus:outline-none focus:border-[#8b5cf6] text-sm" 
                />
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-[#121217] z-10 shadow-sm">
                <tr>
                  <th className="p-4 text-gray-400 font-semibold border-b border-[#27272a] whitespace-nowrap">Client Name</th>
                  <th className="p-4 text-gray-400 font-semibold border-b border-[#27272a] whitespace-nowrap text-right">Total Shipments</th>
                  <th className="p-4 text-gray-400 font-semibold border-b border-[#27272a] whitespace-nowrap text-right">Lifetime Revenue</th>
                  <th className="p-4 text-gray-400 font-semibold border-b border-[#27272a] whitespace-nowrap text-right">Lifetime Profit</th>
                  <th className="p-4 text-gray-400 font-semibold border-b border-[#27272a] whitespace-nowrap text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="p-8 text-center text-gray-500">Loading clients...</td></tr>
                ) : filteredClients.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-gray-500">No clients found.</td></tr>
                ) : (
                  filteredClients.map((client) => (
                    <tr key={client.name} className="border-b border-[#27272a] hover:bg-[#1c1c21] transition-colors group">
                      <td className="p-4 text-white font-bold">{client.name}</td>
                      <td className="p-4 text-gray-300 font-medium text-right">{client.totalShipments}</td>
                      <td className="p-4 text-green-400 text-right">${client.totalRevenue.toFixed(2)}</td>
                      <td className="p-4 text-blue-400 font-semibold text-right">${client.totalProfit.toFixed(2)}</td>
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => setSelectedClient(client.name)}
                          className="bg-[#27272a] hover:bg-[#3f3f46] text-white px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-2 mx-auto transition-colors"
                        >
                          <ListCollapse className="w-3.5 h-3.5" /> View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Client Details Modal */}
      {selectedClientData && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setSelectedClient(null)}>
          <div className="bg-[#121217] border border-[#27272a] rounded-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>
            
            <div className="flex justify-between items-center p-6 border-b border-[#27272a] bg-[#18181f]">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Users className="text-[#8b5cf6]" /> {selectedClientData.name}'s Shipments
              </h2>
              <button onClick={() => setSelectedClient(null)} className="text-gray-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-6">
              <div className="bg-[#09090b] rounded-lg border border-[#27272a] overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#27272a] bg-[#18181f]">
                      <th className="p-3 text-xs font-semibold text-gray-400 uppercase">Shipment No</th>
                      <th className="p-3 text-xs font-semibold text-gray-400 uppercase">Date</th>
                      <th className="p-3 text-xs font-semibold text-gray-400 uppercase">Product</th>
                      <th className="p-3 text-xs font-semibold text-gray-400 uppercase text-right">Qty</th>
                      <th className="p-3 text-xs font-semibold text-gray-400 uppercase text-right">Weight (KG)</th>
                      <th className="p-3 text-xs font-semibold text-gray-400 uppercase text-right">Client Bill</th>
                      <th className="p-3 text-xs font-semibold text-gray-400 uppercase text-right">Profit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#27272a]">
                    {selectedClientData.shipments.map((s) => (
                      <tr key={s._id} className="hover:bg-[#18181f]/50 transition-colors">
                        <td className="p-3 text-sm text-gray-300 font-bold">{s.shippingNumber}</td>
                        <td className="p-3 text-sm text-gray-400 whitespace-nowrap">{s.date || '-'}</td>
                        <td className="p-3 text-sm text-gray-400">{s.productName || '-'}</td>
                        <td className="p-3 text-sm text-gray-400 text-right">{s.quantity || 0}</td>
                        <td className="p-3 text-sm text-gray-400 text-right">{s.weight || 0}</td>
                        <td className="p-3 text-sm text-green-400 text-right">${s.clientBill || 0}</td>
                        <td className="p-3 text-sm font-semibold text-black bg-[#6aa84f] text-right">${s.totalProfit || s.profit || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-[#8b5cf6]/10 border-t-2 border-[#8b5cf6]/30">
                    <tr>
                      <td className="p-4 text-sm font-bold text-[#a78bfa] uppercase" colSpan={3}>Aggregated Total</td>
                      <td className="p-4 text-sm font-bold text-white text-right">
                        {selectedClientData.shipments.reduce((acc, s) => acc + (parseFloat(s.quantity) || 0), 0)}
                      </td>
                      <td className="p-4 text-sm font-bold text-white text-right">
                        {selectedClientData.shipments.reduce((acc, s) => acc + (parseFloat(s.weight) || 0), 0).toFixed(2)} KG
                      </td>
                      <td className="p-4 text-sm font-bold text-green-400 text-right">
                        ${selectedClientData.totalRevenue.toFixed(2)}
                      </td>
                      <td className="p-4 text-sm font-bold text-black bg-[#6aa84f] text-right">
                        ${selectedClientData.totalProfit.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
