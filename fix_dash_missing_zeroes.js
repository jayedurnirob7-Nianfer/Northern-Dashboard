const fs = require('fs');
let code = fs.readFileSync('src/app/Dashboard.tsx', 'utf8');

// Replace the td values for rate, unitProfit, myBill, totalProfit
code = code.replace(
  /<td className="p-3 text-gray-700 dark:text-gray-300">\{s\.rate\}<\/td>/,
  '<td className="p-3 text-gray-700 dark:text-gray-300">{r > 0 ? r : "-"}</td>'
);

code = code.replace(
  /<td className="p-3 text-blue-400 font-bold">\{unitProfit\.toFixed\(2\)\}<\/td>/,
  '<td className="p-3 text-blue-400 font-bold">{r > 0 || s.profitPerKg ? unitProfit.toFixed(2) : "-"}</td>'
);

code = code.replace(
  /<td className="p-3 text-gray-700 dark:text-gray-300">\{myBill\.toFixed\(2\)\}<\/td>/,
  '<td className="p-3 text-gray-700 dark:text-gray-300">{r > 0 || s.myBill ? myBill.toFixed(2) : "-"}</td>'
);

code = code.replace(
  /\{`\$\{totalProfit\.toFixed\(2\)\}`\}/,
  '{r > 0 || s.totalProfit || s.myBill ? `$${totalProfit.toFixed(2)}` : "-"}'
);

fs.writeFileSync('src/app/Dashboard.tsx', code);
console.log('Fixed dash missing zeroes');
