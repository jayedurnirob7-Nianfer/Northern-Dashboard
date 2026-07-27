const fs = require('fs');

let code = fs.readFileSync('src/app/Dashboard.tsx', 'utf8');

// 1. Revert Table to w-max
code = code.replace(
  '<table className="w-full min-w-[2160px] text-left border-collapse text-xs table-fixed">',
  '<table className="w-max text-left border-collapse text-xs table-fixed">'
);

// 2. Remove Dummy Header
code = code.replace(
  '<ResizableHeader defaultWidth={120}>Total Profit</ResizableHeader>\\n                  <th className="w-full"></th>',
  '<ResizableHeader defaultWidth={120}>Total Profit</ResizableHeader>'
);

// 3. Revert colSpans
code = code.replace(/colSpan=\\{21\\}/g, 'colSpan={20}');

// 4. Replace entire TR block with div-wrapped td contents
const oldTrRegex = /return \\(\\s*<tr[\\s\\S]*?<\\/tr>\\s*\\);/;
const newTr = \`return (
                      <tr 
                        key={s._id} 
                        onClick={() => setSelectedShipment(s)} 
                        className={\\\`border-b border-gray-200 dark:border-[#27272a] transition-colors cursor-pointer text-xs whitespace-nowrap \${rowBg} \${hoverBg}\\\`}
                      >
                        <td className="p-3 text-center w-12 min-w-[48px] max-w-[48px]" onClick={(e) => e.stopPropagation()}>
                          <input type="checkbox" checked={isSelected} onChange={() => handleSelectRow(s._id)} className="rounded border-gray-600 bg-gray-700 cursor-pointer" />
                        </td>
                        <td className={\\\`p-3 pl-6 font-medium \${isDelivered ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-900 dark:text-white'}\\\`}><div className="w-full overflow-hidden text-ellipsis whitespace-nowrap">{s.shippingNumber}</div></td>
                      <td className="p-3 font-mono text-[#8b5cf6]"><div className="w-full overflow-hidden text-ellipsis whitespace-nowrap">{s.trackingNumber || 'N/A'}</div></td>
                      <td className="p-3 text-gray-700 dark:text-gray-400"><div className="w-full overflow-hidden text-ellipsis whitespace-nowrap">{s.shippingMark}</div></td>
                      <td className="p-3 text-gray-700 dark:text-gray-300"><div className="w-full overflow-hidden text-ellipsis whitespace-nowrap">{s.date}</div></td>
                      <td className="p-3 text-gray-900 dark:text-white font-medium"><div className="w-full overflow-hidden text-ellipsis whitespace-nowrap">{s.customerName}</div></td>
                      <td className="p-3 text-gray-700 dark:text-gray-400"><div className="w-full overflow-hidden text-ellipsis whitespace-nowrap">{s.address}</div></td>
                      <td className="p-3 text-gray-700 dark:text-gray-300"><div className="w-full overflow-hidden text-ellipsis whitespace-nowrap">{s.mobile}</div></td>
                      <td className="p-3 max-w-0" onClick={(e) => e.stopPropagation()}>
                        <select 
                          value={s.shippingMethod || ''} 
                          onChange={(e) => handleInlineUpdate(s._id, 'shippingMethod', e.target.value)}
                          className={\\\`px-2 py-1 pr-6 \${getMethodWidth(s.shippingMethod || '')} max-w-full text-ellipsis overflow-hidden rounded-full text-[10px] font-bold tracking-wider cursor-pointer border-0 outline-none hover:ring-2 hover:ring-[#8b5cf6]/50 transition-all \${s.shippingMethod ? getMethodColor(s.shippingMethod) : 'bg-gray-100 text-gray-500 dark:bg-gray-800'}\\\`}
                        >
                          <option value="" disabled>-</option>
                          <option value="Sea" className="bg-white dark:bg-[#18181f] text-gray-900 dark:text-white font-medium">Sea</option>
                          <option value="Air" className="bg-white dark:bg-[#18181f] text-gray-900 dark:text-white font-medium">Air</option>
                          <option value="Handcarry" className="bg-white dark:bg-[#18181f] text-gray-900 dark:text-white font-medium">Handcarry</option>
                        </select>
                      </td>
                      <td className="p-3 text-gray-700 dark:text-gray-400"><div className="w-full overflow-hidden text-ellipsis whitespace-nowrap">{s.productName}</div></td>
                      <td className="p-3 text-gray-700 dark:text-gray-400"><div className="w-full overflow-hidden text-ellipsis whitespace-nowrap">{s.quantity}</div></td>
                      <td className="p-3 text-gray-700 dark:text-gray-300"><div className="w-full overflow-hidden text-ellipsis whitespace-nowrap">{s.weight}</div></td>
                      <td className="p-3 text-gray-700 dark:text-gray-300"><div className="w-full overflow-hidden text-ellipsis whitespace-nowrap">{hasRate ? r : <span className="text-gray-400">-</span>}</div></td>
                      <td className="p-3 text-gray-900 dark:text-white font-semibold"><div className="w-full overflow-hidden text-ellipsis whitespace-nowrap">{s.finalRate}</div></td>
                      <td className="p-3 text-blue-400 font-bold"><div className="w-full overflow-hidden text-ellipsis whitespace-nowrap">{hasRate ? unitProfit.toFixed(2) : <span className="text-gray-400">-</span>}</div></td>
                      <td className="p-3 max-w-0" onClick={(e) => e.stopPropagation()}>
                        <select 
                          value={s.status} 
                          onChange={(e) => handleInlineUpdate(s._id, 'status', e.target.value)}
                          className={\\\`px-2 py-1 pr-6 \${getStatusWidth(s.status || '')} max-w-full text-ellipsis overflow-hidden rounded-full text-[10px] font-bold tracking-wider cursor-pointer border-0 outline-none hover:ring-2 hover:ring-[#8b5cf6]/50 transition-all \${getStatusColor(s.status)}\\\`}
                        >
                          <option value="In China Warehouse" className="bg-white dark:bg-[#18181f] text-gray-900 dark:text-white font-medium">In China Warehouse</option>
                          <option value="In Shipment" className="bg-white dark:bg-[#18181f] text-gray-900 dark:text-white font-medium">In Shipment</option>
                          <option value="In Chittagong Port" className="bg-white dark:bg-[#18181f] text-gray-900 dark:text-white font-medium">In Chittagong Port</option>
                          <option value="In Bangladesh Warehouse" className="bg-white dark:bg-[#18181f] text-gray-900 dark:text-white font-medium">In Bangladesh Warehouse</option>
                          <option value="Delivered" className="bg-white dark:bg-[#18181f] text-gray-900 dark:text-white font-medium">Delivered</option>
                        </select>
                      </td>
                      <td className="p-3 text-gray-700 dark:text-gray-300"><div className="w-full overflow-hidden text-ellipsis whitespace-nowrap">{s.deliveryDate || <span className="text-gray-400">-</span>}</div></td>
                      <td className="p-3 text-gray-700 dark:text-gray-300"><div className="w-full overflow-hidden text-ellipsis whitespace-nowrap">{clientBill.toFixed(2)}</div></td>
                      <td className="p-3 text-gray-700 dark:text-gray-300"><div className="w-full overflow-hidden text-ellipsis whitespace-nowrap">{hasRate ? myBill.toFixed(2) : <span className="text-gray-400">-</span>}</div></td>
                      <td className={\\\`p-3 text-right font-bold border-l border-gray-200 dark:border-[#27272a] \${hasRate && totalProfit > 0 ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10' : 'text-gray-700 dark:text-gray-400 font-medium'}\\\`} title={hasRate ? \\\`$\${totalProfit.toFixed(2)}\\\` : ''}><div className="w-full overflow-hidden text-ellipsis whitespace-nowrap">{hasRate ? \\\`$\${totalProfit.toFixed(2)}\\\` : <span className="text-gray-400">-</span>}</div></td>
                      </tr>
                    );\`;

code = code.replace(oldTrRegex, newTr);
fs.writeFileSync('src/app/Dashboard.tsx', code);
console.log('Fixed Google Sheets style right-to-left resizing architecture');
