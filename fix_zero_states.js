const fs = require('fs');

let code = fs.readFileSync('src/app/Dashboard.tsx', 'utf8');

// Fix Method
const methodRegex = /<td className="p-3">\s*<span className=\{\`px-2\.5 py-1 rounded-full text-\[10px\] font-bold tracking-wider \$\{getMethodColor\(s\.shippingMethod\)\}\`\}>\s*\{s\.shippingMethod \|\| '-'\}\s*<\/span>\s*<\/td>/;
const newMethod = `<td className="p-3">
                        {s.shippingMethod ? (
                          <span className={\`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider \${getMethodColor(s.shippingMethod)}\`}>
                            {s.shippingMethod}
                          </span>
                        ) : (
                          <span className="text-gray-500 dark:text-gray-600">-</span>
                        )}
                      </td>`;
code = code.replace(methodRegex, newMethod);

// Fix Unit Profit
const unitProfitRegex = /<td className="p-3 text-blue-400 font-bold">\{\(\(parseFloat\(s\.finalRate\) \|\| 0\) - \(parseFloat\(s\.rate\) \|\| 0\)\)\.toFixed\(2\)\}<\/td>/;
const newUnitProfit = `<td className={\`p-3 font-bold \${unitProfit > 0 ? 'text-blue-500 dark:text-blue-400' : 'text-gray-400 dark:text-gray-600 font-medium'}\`}>{unitProfit.toFixed(2)}</td>`;
code = code.replace(unitProfitRegex, newUnitProfit);

// Fix Del. Date
const delDateRegex = /<td className="p-3 text-gray-700 dark:text-gray-300">\{s\.deliveryDate \|\| '-'\}<\/td>/;
const newDelDate = `<td className="p-3 text-gray-700 dark:text-gray-300">{s.deliveryDate || <span className="text-gray-400 dark:text-gray-600">-</span>}</td>`;
code = code.replace(delDateRegex, newDelDate);

// Fix Total Profit
const totalProfitRegex = /<td className="p-3 text-right font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500\/10 border-l border-gray-200 dark:border-\[#27272a\]">\$\{totalProfit\.toFixed\(2\)\}<\/td>/;
const newTotalProfit = `<td className={\`p-3 text-right font-bold border-l border-gray-200 dark:border-[#27272a] \${totalProfit > 0 ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10' : 'text-gray-400 dark:text-gray-600 font-medium'}\`}>\${totalProfit.toFixed(2)}</td>`;
code = code.replace(totalProfitRegex, newTotalProfit);


fs.writeFileSync('src/app/Dashboard.tsx', code);
console.log('Fixed zero states');
