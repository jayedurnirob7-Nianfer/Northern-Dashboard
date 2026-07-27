import React from 'react';
import { X, Calculator } from 'lucide-react';

export default function BulkSummaryModal({ shipments, onClose }: { shipments: any[], onClose: () => void }) {
  if (!shipments || shipments.length === 0) return null;

  const totalQty = shipments.reduce((acc, s) => acc + (parseFloat(s.qty) || 0), 0);
  const totalWeight = shipments.reduce((acc, s) => acc + (parseFloat(s.weight) || 0), 0);
  const totalClientBill = shipments.reduce((acc, s) => acc + (parseFloat(s.clientBill) || 0), 0);
  const totalMyBill = shipments.reduce((acc, s) => acc + (parseFloat(s.myBill) || 0), 0);
  const totalProfit = shipments.reduce((acc, s) => acc + (parseFloat(s.totalProfit) || parseFloat(s.profit) || 0), 0);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-gray-100 dark:bg-[#121217] border border-gray-200 dark:border-[#27272a] rounded-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-[#27272a] bg-gray-50 dark:bg-[#18181f]">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Calculator className="text-[#8b5cf6]" /> Selected Shipments Summary
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 dark:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="bg-white dark:bg-[#09090b] rounded-lg border border-gray-200 dark:border-[#27272a] overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-[#27272a] bg-gray-50 dark:bg-[#18181f]">
                  <th className="p-3 text-xs font-semibold text-gray-400 uppercase">Product</th>
                  <th className="p-3 text-xs font-semibold text-gray-400 uppercase text-right">Qty</th>
                  <th className="p-3 text-xs font-semibold text-gray-400 uppercase text-right">Weight (KG)</th>
                  <th className="p-3 text-xs font-semibold text-gray-400 uppercase text-right">Rate</th>
                  <th className="p-3 text-xs font-semibold text-gray-400 uppercase text-right">Final Rate</th>
                  <th className="p-3 text-xs font-semibold text-gray-400 uppercase text-right">Client Bill</th>
                  <th className="p-3 text-xs font-semibold text-gray-400 uppercase text-right">My Bill</th>
                  <th className="p-3 text-xs font-semibold text-gray-400 uppercase text-right">Profit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272a]">
                {shipments.map((s) => (
                  <tr key={s._id} className="hover:bg-gray-100 dark:bg-[#18181f]/50 transition-colors">
                    <td className="p-3 text-sm text-gray-300 font-medium">{s.productName || '-'}</td>
                    <td className="p-3 text-sm text-gray-400 text-right">{s.qty || 0}</td>
                    <td className="p-3 text-sm text-gray-400 text-right">{s.weight || 0}</td>
                    <td className="p-3 text-sm text-gray-400 text-right">${s.rate || 0}</td>
                    <td className="p-3 text-sm text-gray-400 text-right">${s.finalRate || 0}</td>
                    <td className="p-3 text-sm text-green-400 text-right">${s.clientBill || 0}</td>
                    <td className="p-3 text-sm text-red-400 text-right">${s.myBill || 0}</td>
                    <td className="p-3 text-sm font-semibold text-blue-400 text-right">${s.totalProfit || s.profit || 0}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-[#8b5cf6]/10 border-t-2 border-[#8b5cf6]/30">
                <tr>
                  <td className="p-4 text-sm font-bold text-[#a78bfa] uppercase">Combined Total</td>
                  <td className="p-4 text-sm font-bold text-gray-900 dark:text-white text-right">{totalQty}</td>
                  <td className="p-4 text-sm font-bold text-gray-900 dark:text-white text-right">{totalWeight.toFixed(2)} KG</td>
                  <td className="p-4 text-sm font-bold text-gray-500 text-right">-</td>
                  <td className="p-4 text-sm font-bold text-gray-500 text-right">-</td>
                  <td className="p-4 text-sm font-bold text-green-400 text-right">${totalClientBill.toFixed(2)}</td>
                  <td className="p-4 text-sm font-bold text-red-400 text-right">${totalMyBill.toFixed(2)}</td>
                  <td className="p-4 text-sm font-bold text-blue-400 text-right">${totalProfit.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
