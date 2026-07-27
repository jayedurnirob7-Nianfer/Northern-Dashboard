const fs = require('fs');

let code = fs.readFileSync('src/app/Dashboard.tsx', 'utf8');

const targetStr = `                    return (
                      <tr 
                        key={s._id} 
                        onClick={() => setSelectedShipment(s)} `;

const newStr = `                    const w = parseFloat(s.weight) || 0;
                    const r = parseFloat(s.rate) || 0;
                    const fr = parseFloat(s.finalRate) || 0;
                    
                    const clientBill = w * fr;
                    const myBill = w * r;
                    const totalProfit = clientBill - myBill;
                    const unitProfit = fr - r;

                    return (
                      <tr 
                        key={s._id} 
                        onClick={() => setSelectedShipment(s)} `;

code = code.replace(targetStr, newStr);

const targetStr2 = `                      <td className="p-3 text-blue-400 font-bold">{((parseFloat(s.finalRate) || 0) - (parseFloat(s.rate) || 0)).toFixed(2)}</td>`;
const newStr2 = `                      <td className="p-3 text-blue-400 font-bold">{unitProfit.toFixed(2)}</td>`;
code = code.replace(targetStr2, newStr2);

const targetStr3 = `                      <td className="p-3 text-gray-300">{s.clientBill}</td>
                      <td className="p-3 text-gray-300">{s.myBill}</td>
                      <td className="p-3 text-right font-bold text-black bg-[#6aa84f] border-l border-[#27272a]">\${(s.totalProfit || s.profit || 0).toFixed(2)}</td>`;
const newStr3 = `                      <td className="p-3 text-gray-300">{clientBill.toFixed(2)}</td>
                      <td className="p-3 text-gray-300">{myBill.toFixed(2)}</td>
                      <td className="p-3 text-right font-bold text-emerald-400 bg-emerald-500/10 border-l border-[#27272a]">\${totalProfit.toFixed(2)}</td>`;
code = code.replace(targetStr3, newStr3);

fs.writeFileSync('src/app/Dashboard.tsx', code);
console.log('Fixed dashboard calculations and colors');
