const fs = require('fs');

let code = fs.readFileSync('src/app/Dashboard.tsx', 'utf8');

const regexClientBill = /<td className="p-3 text-gray-700 dark:text-gray-300">\{s.clientBill\}<\/td>/;
code = code.replace(regexClientBill, '<td className="p-3 text-gray-700 dark:text-gray-300">{clientBill.toFixed(2)}</td>');

const regexMyBill = /<td className="p-3 text-gray-700 dark:text-gray-300">\{s.myBill\}<\/td>/;
code = code.replace(regexMyBill, '<td className="p-3 text-gray-700 dark:text-gray-300">{myBill.toFixed(2)}</td>');

const regexTotalProfit = /<td className="p-3 text-right font-bold text-black bg-\[#6aa84f\] border-l border-gray-200 dark:border-\[#27272a\]">\$\{\(s.totalProfit \|\| s.profit \|\| 0\)\.toFixed\(2\)\}<\/td>/;
code = code.replace(regexTotalProfit, '<td className="p-3 text-right font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-l border-gray-200 dark:border-[#27272a]">${totalProfit.toFixed(2)}</td>');

fs.writeFileSync('src/app/Dashboard.tsx', code);
console.log('Fixed variables part 2');
