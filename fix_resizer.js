const fs = require('fs');

let code = fs.readFileSync('src/app/Dashboard.tsx', 'utf8');

// 1. Add ResizableHeader component at the top
const resizableHeaderComponent = `import React, { useEffect, useState, useRef } from 'react';
import { Package, Search, Plus, FileDown, CheckSquare, Edit3, Truck, Trash2, Calculator, ListCollapse, X, DownloadCloud } from 'lucide-react';

const ResizableHeader = ({ children, minWidth = 50, defaultWidth = 100 }: any) => {
  const [width, setWidth] = useState(defaultWidth);
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
        className="absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-[#8b5cf6] dark:hover:bg-[#8b5cf6] opacity-0 group-hover:opacity-100 z-10 transition-colors"
      />
    </th>
  );
};
`;

code = code.replace("import React, { useEffect, useState } from 'react';\nimport { Package, Search, Plus, FileDown, CheckSquare, Edit3, Truck, Trash2, Calculator, ListCollapse, X , DownloadCloud} from 'lucide-react';", resizableHeaderComponent);


// 2. Fix sorting logic
const oldSort = `const filteredShipments = shipments.filter((s: any) => statusFilter === 'All' || s.status === statusFilter).sort((a: any, b: any) => {
    // Pending/active shipments first, Delivered last
    const aDelivered = a.status === 'Delivered' ? 1 : 0;
    const bDelivered = b.status === 'Delivered' ? 1 : 0;
    if (aDelivered !== bDelivered) return aDelivered - bDelivered;
    // Within each group, sort by NORS number ascending
    const aNum = parseInt((a.shippingNumber || '').replace(/\\D/g, ''), 10) || 0;
    const bNum = parseInt((b.shippingNumber || '').replace(/\\D/g, ''), 10) || 0;
    return aNum - bNum;
  });`;

const newSort = `const filteredShipments = shipments.filter((s: any) => statusFilter === 'All' || s.status === statusFilter).sort((a: any, b: any) => {
    const aDelivered = a.status === 'Delivered' ? 1 : 0;
    const bDelivered = b.status === 'Delivered' ? 1 : 0;
    if (aDelivered !== bDelivered) return aDelivered - bDelivered;
    
    if (aDelivered === 1 && bDelivered === 1) {
      // Both delivered: Sort by Delivery Date descending (newest first)
      const dateA = a.deliveryDate ? new Date(a.deliveryDate).getTime() : 0;
      const dateB = b.deliveryDate ? new Date(b.deliveryDate).getTime() : 0;
      if (dateA !== dateB && !isNaN(dateA) && !isNaN(dateB)) {
        return dateB - dateA; // Descending
      }
      // Fallback: NORS number descending
      const aNum = parseInt((a.shippingNumber || '').replace(/\\D/g, ''), 10) || 0;
      const bNum = parseInt((b.shippingNumber || '').replace(/\\D/g, ''), 10) || 0;
      return bNum - aNum;
    }
    
    // Pending: sort by NORS number ascending
    const aNum = parseInt((a.shippingNumber || '').replace(/\\D/g, ''), 10) || 0;
    const bNum = parseInt((b.shippingNumber || '').replace(/\\D/g, ''), 10) || 0;
    return aNum - bNum;
  });`;

code = code.replace(oldSort, newSort);


// 3. Replace all existing th with ResizableHeader
const thRegex = /<th className="([^"]*)">\s*<div style={{ resize: 'horizontal', overflow: 'hidden' }} className="[^"]*">\s*(.*?)\s*<\/div>\s*<\/th>/g;
code = code.replace(thRegex, (match, classes, innerHtml) => {
  return `<ResizableHeader defaultWidth={120}>${innerHtml}</ResizableHeader>`;
});

// There is one edge case: the checkbox column is not resizable and shouldn't be wrapped in ResizableHeader.
// It looks like:
// <th className="p-3 text-gray-700 dark:text-gray-400 font-semibold border-b border-gray-200 dark:border-[#27272a] whitespace-nowrap">
//    <input type="checkbox"... />
// </th>
// Let's make sure it's intact.
const cbRegex = /<th className="p-3[^>]*>\s*<input type="checkbox"[^>]*\/>\s*<\/th>/g;
// Actually, earlier I skipped the checkbox column when injecting the resize div, so it should just be a normal th.

// Let's run the regex replacement carefully.
fs.writeFileSync('src/app/Dashboard.tsx', code);
console.log('Script written');
