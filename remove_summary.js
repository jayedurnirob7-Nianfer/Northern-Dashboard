const fs = require('fs');

let code = fs.readFileSync('src/app/Dashboard.tsx', 'utf8');

const regex = /<div className="bg-slate-100 dark:bg-\[#121217\] border border-gray-200 dark:border-\[#27272a\] p-5 rounded-xl">\s*<p className="text-gray-600 dark:text-gray-400 text-xs font-semibold mb-1">Total Profit<\/p>\s*<h2 className="text-2xl font-bold text-green-400">\$\{totalProfit\.toFixed\(2\)\}<\/h2>\s*<\/div>/;

code = code.replace(regex, '');

fs.writeFileSync('src/app/Dashboard.tsx', code);
console.log('Removed Total Profit summary card');
