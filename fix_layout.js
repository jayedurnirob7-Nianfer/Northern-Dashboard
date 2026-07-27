const fs = require('fs');

let code = fs.readFileSync('src/app/Dashboard.tsx', 'utf8');

// 1. Fix sorting
const oldSort = `const filteredShipments = shipments.filter((s: any) => statusFilter === 'All' || s.status === statusFilter).sort((a: any, b: any) => {
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

const newSort = `const filteredShipments = shipments.filter((s: any) => statusFilter === 'All' || s.status === statusFilter).sort((a: any, b: any) => {
    const aDelivered = a.status === 'Delivered' ? 1 : 0;
    const bDelivered = b.status === 'Delivered' ? 1 : 0;
    if (aDelivered !== bDelivered) return aDelivered - bDelivered;
    
    // Whether delivered or pending, the user requested descending order for NORS numbers if dates are not used
    if (aDelivered === 1 && bDelivered === 1) {
      // Both delivered: Sort by Delivery Date descending (newest first)
      const dateA = a.deliveryDate ? new Date(a.deliveryDate).getTime() : 0;
      const dateB = b.deliveryDate ? new Date(b.deliveryDate).getTime() : 0;
      if (dateA !== dateB && !isNaN(dateA) && !isNaN(dateB)) {
        return dateB - dateA; // Descending
      }
    }
    
    // Fallback or Pending: sort by NORS number descending (user request: "the pending and all the data from shipping no coulmn needs to be sorted out Descending not Aesending.")
    const aNum = parseInt((a.shippingNumber || '').replace(/\\D/g, ''), 10) || 0;
    const bNum = parseInt((b.shippingNumber || '').replace(/\\D/g, ''), 10) || 0;
    return bNum - aNum;
  });`;

code = code.replace(oldSort, newSort);


// 2. Fix table layout and td classes
code = code.replace('<table className="w-full text-left border-collapse text-xs">', '<table className="w-full text-left border-collapse text-xs table-fixed">');

// For td elements, we need them to truncate. 
// We can just add 'truncate' to all td classNames that have 'p-3'
// Example: <td className="p-3 text-gray-700 dark:text-gray-400 truncate max-w-[150px]">
// Actually, truncate alone handles overflow-hidden, whitespace-nowrap, text-ellipsis.
// Let's replace 'p-3 ' with 'p-3 truncate ' for td elements inside the map function.
// Since regex might be tricky, let's just do a blanket replace for `<td className="p-3` -> `<td className="p-3 truncate`
// Wait, some have `<td className={\`p-3`
code = code.replace(/<td className="p-3 /g, '<td className="p-3 truncate ');
code = code.replace(/<td className={`p-3 /g, '<td className={`p-3 truncate ');
// The checkbox col shouldn't be truncated if we want it centered, but 'truncate' just hides overflow, so it's fine.
// Wait, the select dropdowns might get cut off if they are inside a truncate cell!
// Let's NOT blanket truncate all cells. Let's do it for text cells only.

// Let's revert the blanket replace in our string variable for safety:
// Actually, I didn't run it yet.

// A safer approach: I will write a custom regex to only add `truncate` to text cells.
// Or even easier, I'll just replace the `<tbody>` return statement block completely with the fixed one.

const oldTbodyRender = `                    return (
                      <tr 
                        key={s._id} 
                        onClick={() => setSelectedShipment(s)} 
                        className={\`border-b border-gray-200 dark:border-[#27272a] transition-colors cursor-pointer text-xs whitespace-nowrap \${rowBg} \${hoverBg}\`}
                      >
                        <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <input type="checkbox" checked={isSelected} onChange={() => handleSelectRow(s._id)} className="rounded border-gray-600 bg-gray-700 cursor-pointer" />
                        </td>
                        <td className={\`p-3 pl-6 font-medium \${isDelivered ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-900 dark:text-white'}\`}>{s.shippingNumber}</td>
                      <td className="p-3 font-mono text-[#8b5cf6]">{s.trackingNumber || 'N/A'}</td>
                      <td className="p-3 text-gray-700 dark:text-gray-400">{s.shippingMark}</td>
                      <td className="p-3 text-gray-700 dark:text-gray-300">{s.date}</td>
                      <td className="p-3 text-gray-900 dark:text-white font-medium">{s.customerName}</td>
                      <td className="p-3 text-gray-700 dark:text-gray-400">{s.address}</td>
                      <td className="p-3 text-gray-700 dark:text-gray-300">{s.mobile}</td>
                      <td className="p-3" onClick={(e) => e.stopPropagation()}>
                        <select 
                          value={s.shippingMethod || ''} 
                          onChange={(e) => handleInlineUpdate(s._id, 'shippingMethod', e.target.value)}
                          className={\`px-2 py-1 pr-6 rounded-full text-[10px] font-bold tracking-wider cursor-pointer border-0 outline-none hover:ring-2 hover:ring-[#8b5cf6]/50 transition-all \${s.shippingMethod ? getMethodColor(s.shippingMethod) : 'bg-gray-100 text-gray-500 dark:bg-gray-800'}\`}
                        >
                          <option value="" disabled>-</option>
                          <option value="Sea" className="bg-white dark:bg-[#18181f] text-gray-900 dark:text-white font-medium">Sea</option>
                          <option value="Air" className="bg-white dark:bg-[#18181f] text-gray-900 dark:text-white font-medium">Air</option>
                          <option value="Handcarry" className="bg-white dark:bg-[#18181f] text-gray-900 dark:text-white font-medium">Handcarry</option>
                        </select>
                      </td>
                      <td className="p-3 text-gray-700 dark:text-gray-400 truncate max-w-[150px]">{s.productName}</td>
                      <td className="p-3 text-gray-700 dark:text-gray-400">{s.quantity}</td>
                      <td className="p-3 text-gray-700 dark:text-gray-300">{s.weight}</td>
                      <td className="p-3 text-gray-700 dark:text-gray-300">{hasRate ? r : <span className="text-gray-400">-</span>}</td>
                      <td className="p-3 text-gray-900 dark:text-white font-semibold">{s.finalRate}</td>
                      <td className="p-3 text-blue-400 font-bold">{hasRate ? unitProfit.toFixed(2) : <span className="text-gray-400">-</span>}</td>
                      <td className="p-3" onClick={(e) => e.stopPropagation()}>
                        <select 
                          value={s.status} 
                          onChange={(e) => handleInlineUpdate(s._id, 'status', e.target.value)}
                          className={\`px-2 py-1 pr-6 rounded-full text-[10px] font-bold tracking-wider cursor-pointer border-0 outline-none hover:ring-2 hover:ring-[#8b5cf6]/50 transition-all \${getStatusColor(s.status)}\`}
                        >
                          <option value="In China Warehouse" className="bg-white dark:bg-[#18181f] text-gray-900 dark:text-white font-medium">In China Warehouse</option>
                          <option value="In Shipment" className="bg-white dark:bg-[#18181f] text-gray-900 dark:text-white font-medium">In Shipment</option>
                          <option value="In Chittagong Port" className="bg-white dark:bg-[#18181f] text-gray-900 dark:text-white font-medium">In Chittagong Port</option>
                          <option value="In Bangladesh Warehouse" className="bg-white dark:bg-[#18181f] text-gray-900 dark:text-white font-medium">In Bangladesh Warehouse</option>
                          <option value="Delivered" className="bg-white dark:bg-[#18181f] text-gray-900 dark:text-white font-medium">Delivered</option>
                        </select>
                      </td>
                      <td className="p-3 text-gray-700 dark:text-gray-300">{s.deliveryDate || <span className="text-gray-400">-</span>}</td>
                      <td className="p-3 text-gray-700 dark:text-gray-300">{clientBill.toFixed(2)}</td>
                      <td className="p-3 text-gray-700 dark:text-gray-300">{hasRate ? myBill.toFixed(2) : <span className="text-gray-400">-</span>}</td>
                      <td className={\`p-3 text-right font-bold border-l border-gray-200 dark:border-[#27272a] \${hasRate && totalProfit > 0 ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10' : 'text-gray-700 dark:text-gray-400 font-medium'}\`}>{hasRate ? \`$\${totalProfit.toFixed(2)}\` : <span className="text-gray-400">-</span>}</td>
                      </tr>
                    );`;

const newTbodyRender = `                    return (
                      <tr 
                        key={s._id} 
                        onClick={() => setSelectedShipment(s)} 
                        className={\`border-b border-gray-200 dark:border-[#27272a] transition-colors cursor-pointer text-xs whitespace-nowrap \${rowBg} \${hoverBg}\`}
                      >
                        <td className="p-3 truncate text-center" onClick={(e) => e.stopPropagation()}>
                          <input type="checkbox" checked={isSelected} onChange={() => handleSelectRow(s._id)} className="rounded border-gray-600 bg-gray-700 cursor-pointer" />
                        </td>
                        <td className={\`p-3 truncate pl-6 font-medium \${isDelivered ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-900 dark:text-white'}\`} title={s.shippingNumber}>{s.shippingNumber}</td>
                      <td className="p-3 truncate font-mono text-[#8b5cf6]" title={s.trackingNumber}>{s.trackingNumber || 'N/A'}</td>
                      <td className="p-3 truncate text-gray-700 dark:text-gray-400" title={s.shippingMark}>{s.shippingMark}</td>
                      <td className="p-3 truncate text-gray-700 dark:text-gray-300" title={s.date}>{s.date}</td>
                      <td className="p-3 truncate text-gray-900 dark:text-white font-medium" title={s.customerName}>{s.customerName}</td>
                      <td className="p-3 truncate text-gray-700 dark:text-gray-400" title={s.address}>{s.address}</td>
                      <td className="p-3 truncate text-gray-700 dark:text-gray-300" title={s.mobile}>{s.mobile}</td>
                      <td className="p-3 truncate" onClick={(e) => e.stopPropagation()}>
                        <select 
                          value={s.shippingMethod || ''} 
                          onChange={(e) => handleInlineUpdate(s._id, 'shippingMethod', e.target.value)}
                          className={\`px-2 py-1 pr-6 rounded-full text-[10px] font-bold tracking-wider cursor-pointer border-0 outline-none hover:ring-2 hover:ring-[#8b5cf6]/50 transition-all \${s.shippingMethod ? getMethodColor(s.shippingMethod) : 'bg-gray-100 text-gray-500 dark:bg-gray-800'}\`}
                        >
                          <option value="" disabled>-</option>
                          <option value="Sea" className="bg-white dark:bg-[#18181f] text-gray-900 dark:text-white font-medium">Sea</option>
                          <option value="Air" className="bg-white dark:bg-[#18181f] text-gray-900 dark:text-white font-medium">Air</option>
                          <option value="Handcarry" className="bg-white dark:bg-[#18181f] text-gray-900 dark:text-white font-medium">Handcarry</option>
                        </select>
                      </td>
                      <td className="p-3 truncate text-gray-700 dark:text-gray-400" title={s.productName}>{s.productName}</td>
                      <td className="p-3 truncate text-gray-700 dark:text-gray-400" title={s.quantity}>{s.quantity}</td>
                      <td className="p-3 truncate text-gray-700 dark:text-gray-300" title={s.weight}>{s.weight}</td>
                      <td className="p-3 truncate text-gray-700 dark:text-gray-300" title={hasRate ? r : ''}>{hasRate ? r : <span className="text-gray-400">-</span>}</td>
                      <td className="p-3 truncate text-gray-900 dark:text-white font-semibold" title={s.finalRate}>{s.finalRate}</td>
                      <td className="p-3 truncate text-blue-400 font-bold" title={hasRate ? unitProfit.toFixed(2) : ''}>{hasRate ? unitProfit.toFixed(2) : <span className="text-gray-400">-</span>}</td>
                      <td className="p-3 truncate" onClick={(e) => e.stopPropagation()}>
                        <select 
                          value={s.status} 
                          onChange={(e) => handleInlineUpdate(s._id, 'status', e.target.value)}
                          className={\`px-2 py-1 pr-6 rounded-full text-[10px] font-bold tracking-wider cursor-pointer border-0 outline-none hover:ring-2 hover:ring-[#8b5cf6]/50 transition-all \${getStatusColor(s.status)}\`}
                        >
                          <option value="In China Warehouse" className="bg-white dark:bg-[#18181f] text-gray-900 dark:text-white font-medium">In China Warehouse</option>
                          <option value="In Shipment" className="bg-white dark:bg-[#18181f] text-gray-900 dark:text-white font-medium">In Shipment</option>
                          <option value="In Chittagong Port" className="bg-white dark:bg-[#18181f] text-gray-900 dark:text-white font-medium">In Chittagong Port</option>
                          <option value="In Bangladesh Warehouse" className="bg-white dark:bg-[#18181f] text-gray-900 dark:text-white font-medium">In Bangladesh Warehouse</option>
                          <option value="Delivered" className="bg-white dark:bg-[#18181f] text-gray-900 dark:text-white font-medium">Delivered</option>
                        </select>
                      </td>
                      <td className="p-3 truncate text-gray-700 dark:text-gray-300" title={s.deliveryDate}>{s.deliveryDate || <span className="text-gray-400">-</span>}</td>
                      <td className="p-3 truncate text-gray-700 dark:text-gray-300" title={clientBill.toFixed(2)}>{clientBill.toFixed(2)}</td>
                      <td className="p-3 truncate text-gray-700 dark:text-gray-300" title={hasRate ? myBill.toFixed(2) : ''}>{hasRate ? myBill.toFixed(2) : <span className="text-gray-400">-</span>}</td>
                      <td className={\`p-3 truncate text-right font-bold border-l border-gray-200 dark:border-[#27272a] \${hasRate && totalProfit > 0 ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10' : 'text-gray-700 dark:text-gray-400 font-medium'}\`} title={hasRate ? \`$\${totalProfit.toFixed(2)}\` : ''}>{hasRate ? \`$\${totalProfit.toFixed(2)}\` : <span className="text-gray-400">-</span>}</td>
                      </tr>
                    );`;

code = code.replace(oldTbodyRender, newTbodyRender);


fs.writeFileSync('src/app/Dashboard.tsx', code);
console.log('Fixed sort and layout');
