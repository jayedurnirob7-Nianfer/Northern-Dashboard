const fs = require('fs');

let code = fs.readFileSync('src/app/Dashboard.tsx', 'utf8');

const brokenBlock = `                    const unitProfit = hasRate ? ((s.profitPerKg != null && s.profitPerKg !== 0) ? parseFloat(s.profitPerKg) : (fr - r)) : 0;

                      <td className="p-3 truncate text-gray-900 dark:text-white font-medium">{s.customerName}</td>`;

const fixedBlock = `                    const unitProfit = hasRate ? ((s.profitPerKg != null && s.profitPerKg !== 0) ? parseFloat(s.profitPerKg) : (fr - r)) : 0;

                    return (
                      <tr 
                        key={s._id} 
                        onClick={() => setSelectedShipment(s)} 
                        className={\`border-b border-gray-200 dark:border-[#27272a] transition-colors cursor-pointer text-xs whitespace-nowrap \${rowBg} \${hoverBg}\`}
                      >
                        <td className="p-3 truncate text-center w-12 min-w-[48px] max-w-[48px]" onClick={(e) => e.stopPropagation()}>
                          <input type="checkbox" checked={isSelected} onChange={() => handleSelectRow(s._id)} className="rounded border-gray-600 bg-gray-700 cursor-pointer" />
                        </td>
                        <td className={\`p-3 truncate pl-6 font-medium \${isDelivered ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-900 dark:text-white'}\`}>{s.shippingNumber}</td>
                      <td className="p-3 truncate font-mono text-[#8b5cf6]">{s.trackingNumber || 'N/A'}</td>
                      <td className="p-3 truncate text-gray-700 dark:text-gray-400">{s.shippingMark}</td>
                      <td className="p-3 truncate text-gray-700 dark:text-gray-300">{s.date}</td>
                      <td className="p-3 truncate text-gray-900 dark:text-white font-medium">{s.customerName}</td>`;

code = code.replace(brokenBlock, fixedBlock);

fs.writeFileSync('src/app/Dashboard.tsx', code);
console.log('Restored broken JSX block');
