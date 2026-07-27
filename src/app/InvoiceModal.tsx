import React from 'react';
import { X } from 'lucide-react';

interface InvoiceModalProps {
  ids: string[];
  onClose: () => void;
}

export default function InvoiceModal({ ids, onClose }: InvoiceModalProps) {
  if (!ids || ids.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-8">
      <div className="relative w-full h-full max-w-[1400px] max-h-[95vh] bg-[#1a0a00] rounded-xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header / Close button */}
        <div className="absolute top-2 right-2 z-10 flex gap-2">
          <button 
            onClick={onClose} 
            className="p-2 bg-gray-900/60 hover:bg-gray-800 text-white rounded-full transition-colors border border-gray-700/50"
            title="Close Invoice Generator"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* The isolated generic HTML embedded seamlessly */}
        <iframe 
          src={`/invoice/index.html?ids=${ids.join(',')}&embed=true&t=${Date.now()}`} 
          className="w-full h-full border-0 bg-transparent flex-1"
          title="Invoice Generator"
        />
      </div>
    </div>
  );
}
