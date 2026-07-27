const fs = require('fs');

let code = fs.readFileSync('src/app/Dashboard.tsx', 'utf8');

// Fix duplicate text colors
code = code.replace(/text-gray-900 dark:text-white font-bold border-b border-gray-200 dark:border-\[#27272a\] whitespace-nowrap text-right bg-emerald-50 dark:bg-\[#09090b\] text-emerald-700 dark:text-emerald-400/g, 'font-bold border-b border-gray-200 dark:border-[#27272a] whitespace-nowrap text-right bg-emerald-50 dark:bg-[#09090b] text-emerald-700 dark:text-emerald-400');

fs.writeFileSync('src/app/Dashboard.tsx', code);
console.log('Fixed duplicate text colors');
