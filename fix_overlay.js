const fs = require('fs');

let code = fs.readFileSync('src/app/Dashboard.tsx', 'utf8');

// 1. Give the checkbox column a fixed width so it doesn't collapse or expand weirdly
const oldThCheckbox = `<th className="p-3 text-gray-700 dark:text-gray-400 font-semibold border-b border-gray-200 dark:border-[#27272a] whitespace-nowrap">
                    <input type="checkbox" onChange={handleSelectAll} checked={selectedIds.length === filteredShipments.length && filteredShipments.length > 0} className="rounded border-gray-600 bg-gray-700" />
                  </th>`;
const newThCheckbox = `<th className="p-3 w-12 min-w-[48px] max-w-[48px] text-center text-gray-700 dark:text-gray-400 font-semibold border-b border-gray-200 dark:border-[#27272a] whitespace-nowrap">
                    <input type="checkbox" onChange={handleSelectAll} checked={selectedIds.length === filteredShipments.length && filteredShipments.length > 0} className="rounded border-gray-600 bg-gray-700" />
                  </th>`;
code = code.replace(oldThCheckbox, newThCheckbox);

// 2. The checkbox td should not have truncate, it should just be centered. And add max-w-0 to all text tds to enforce truncation in table-fixed layout.
const oldTbodyRender = `                    return (
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
                      <td className="p-3 truncate text-gray-700 dark:text-gray-400 truncate max-w-[150px]" title={s.productName}>{s.productName}</td>
                      <td className="p-3 truncate text-gray-700 dark:text-gray-400" title={s.quantity}>{s.quantity}</td>
                      <td className="p-3 truncate text-gray-700 dark:text-gray-300" title={s.weight}>{s.weight}</td>
                      <td className="p-3 truncate text-gray-700 dark:text-gray-300" title={hasRate ? r : ''}>{hasRate ? r : <span className="text-gray-400">-</span>}</td>
                      <td className="p-3 truncate text-gray-900 dark:text-white font-semibold" title={s.finalRate}>{s.finalRate}</td>
                      <td className="p-3 truncate text-blue-400 font-bold" title={hasRate ? unitProfit.toFixed(2) : ''}>{hasRate ? unitProfit.toFixed(2) : <span className="text-gray-400">-</span>}</td>
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
                      <td className="p-3 truncate text-gray-700 dark:text-gray-300" title={s.deliveryDate}>{s.deliveryDate || <span className="text-gray-400">-</span>}</td>
                      <td className="p-3 truncate text-gray-700 dark:text-gray-300" title={clientBill.toFixed(2)}>{clientBill.toFixed(2)}</td>
                      <td className="p-3 truncate text-gray-700 dark:text-gray-300" title={hasRate ? myBill.toFixed(2) : ''}>{hasRate ? myBill.toFixed(2) : <span className="text-gray-400">-</span>}</td>
                      <td className={\`p-3 truncate text-right font-bold border-l border-gray-200 dark:border-[#27272a] \${hasRate && totalProfit > 0 ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10' : 'text-gray-700 dark:text-gray-400 font-medium'}\`} title={hasRate ? \`$\${totalProfit.toFixed(2)}\` : ''}>{hasRate ? \`$\${totalProfit.toFixed(2)}\` : <span className="text-gray-400">-</span>}</td>
                      </tr>
                    );`;

const newTbodyRender = `                    return (
                      <tr 
                        key={s._id} 
                        onClick={() => setSelectedShipment(s)} 
                        className={\`border-b border-gray-200 dark:border-[#27272a] transition-colors cursor-pointer text-xs whitespace-nowrap \${rowBg} \${hoverBg}\`}
                      >
                        <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <input type="checkbox" checked={isSelected} onChange={() => handleSelectRow(s._id)} className="rounded border-gray-600 bg-gray-700 cursor-pointer" />
                        </td>
                        <td className={\`p-3 truncate max-w-0 pl-6 font-medium \${isDelivered ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-900 dark:text-white'}\`} title={s.shippingNumber}>{s.shippingNumber}</td>
                      <td className="p-3 truncate max-w-0 font-mono text-[#8b5cf6]" title={s.trackingNumber}>{s.trackingNumber || 'N/A'}</td>
                      <td className="p-3 truncate max-w-0 text-gray-700 dark:text-gray-400" title={s.shippingMark}>{s.shippingMark}</td>
                      <td className="p-3 truncate max-w-0 text-gray-700 dark:text-gray-300" title={s.date}>{s.date}</td>
                      <td className="p-3 truncate max-w-0 text-gray-900 dark:text-white font-medium" title={s.customerName}>{s.customerName}</td>
                      <td className="p-3 truncate max-w-0 text-gray-700 dark:text-gray-400" title={s.address}>{s.address}</td>
                      <td className="p-3 truncate max-w-0 text-gray-700 dark:text-gray-300" title={s.mobile}>{s.mobile}</td>
                      <td className="p-3 truncate max-w-0" onClick={(e) => e.stopPropagation()}>
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
                      <td className="p-3 truncate max-w-0 text-gray-700 dark:text-gray-400" title={s.productName}>{s.productName}</td>
                      <td className="p-3 truncate max-w-0 text-gray-700 dark:text-gray-400" title={s.quantity}>{s.quantity}</td>
                      <td className="p-3 truncate max-w-0 text-gray-700 dark:text-gray-300" title={s.weight}>{s.weight}</td>
                      <td className="p-3 truncate max-w-0 text-gray-700 dark:text-gray-300" title={hasRate ? r : ''}>{hasRate ? r : <span className="text-gray-400">-</span>}</td>
                      <td className="p-3 truncate max-w-0 text-gray-900 dark:text-white font-semibold" title={s.finalRate}>{s.finalRate}</td>
                      <td className="p-3 truncate max-w-0 text-blue-400 font-bold" title={hasRate ? unitProfit.toFixed(2) : ''}>{hasRate ? unitProfit.toFixed(2) : <span className="text-gray-400">-</span>}</td>
                      <td className="p-3 truncate max-w-0" onClick={(e) => e.stopPropagation()}>
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
                      <td className="p-3 truncate max-w-0 text-gray-700 dark:text-gray-300" title={s.deliveryDate}>{s.deliveryDate || <span className="text-gray-400">-</span>}</td>
                      <td className="p-3 truncate max-w-0 text-gray-700 dark:text-gray-300" title={clientBill.toFixed(2)}>{clientBill.toFixed(2)}</td>
                      <td className="p-3 truncate max-w-0 text-gray-700 dark:text-gray-300" title={hasRate ? myBill.toFixed(2) : ''}>{hasRate ? myBill.toFixed(2) : <span className="text-gray-400">-</span>}</td>
                      <td className={\`p-3 truncate max-w-0 text-right font-bold border-l border-gray-200 dark:border-[#27272a] \${hasRate && totalProfit > 0 ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10' : 'text-gray-700 dark:text-gray-400 font-medium'}\`} title={hasRate ? \`$\${totalProfit.toFixed(2)}\` : ''}>{hasRate ? \`$\${totalProfit.toFixed(2)}\` : <span className="text-gray-400">-</span>}</td>
                      </tr>
                    );`;

code = code.replace(oldTbodyRender, newTbodyRender);

fs.writeFileSync('src/app/Dashboard.tsx', code);
console.log('Fixed overlay bug with max-w-0');
