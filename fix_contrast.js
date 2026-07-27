const fs = require('fs');
const path = require('path');

let code = fs.readFileSync('src/app/Dashboard.tsx', 'utf8');

const replacements = [
  // 1. Table header "Total Profit" bg-black -> adaptive
  { target: /text-right bg-black/g, newStr: 'text-right bg-emerald-50 dark:bg-[#09090b] text-emerald-700 dark:text-emerald-400' },
  
  // 2. ShippingNumber text-green-200 -> text-emerald-700 dark:text-emerald-400
  { target: /'text-green-200'/g, newStr: "'text-emerald-700 dark:text-emerald-400'" },

  // 3. rowBg for delivered -> bg-emerald-50 dark:bg-emerald-500/5
  { target: /'bg-green-500\/5'/g, newStr: "'bg-emerald-50 dark:bg-emerald-500/10'" },
  { target: /'hover:bg-green-500\/10'/g, newStr: "'hover:bg-emerald-100 dark:hover:bg-emerald-500/20'" },

  // 4. getStatusColor revamp
  { target: /case 'In China Warehouse': return 'bg-pink-500\/20 text-pink-300 border border-pink-500\/30';/g, newStr: "case 'In China Warehouse': return 'bg-pink-100 dark:bg-pink-500/20 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-500/30';" },
  { target: /case 'In Shipment': return 'bg-red-500\/20 text-red-400 border border-red-500\/30';/g, newStr: "case 'In Shipment': return 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/30';" },
  { target: /case 'In Bangladesh Warehouse': return 'bg-purple-500\/20 text-purple-400 border border-purple-500\/30';/g, newStr: "case 'In Bangladesh Warehouse': return 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-500/30';" },
  { target: /case 'Delivered': return 'bg-green-500\/20 text-green-400 border border-green-500\/30';/g, newStr: "case 'Delivered': return 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30';" },
  { target: /case 'In Chittagong Port': return 'bg-blue-400\/20 text-blue-300 border border-blue-400\/30';/g, newStr: "case 'In Chittagong Port': return 'bg-blue-100 dark:bg-blue-400/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-400/30';" },
  
  // 5. Enhance text contrasts slightly for light mode readability
  { target: /text-gray-600 dark:text-gray-400/g, newStr: 'text-gray-700 dark:text-gray-400' }, // Darker grey in light mode
  { target: /text-blue-500/g, newStr: 'text-blue-600' }, // Darker blue for light mode
  
  // 6. Summary cards text contrasts
  { target: /text-green-400/g, newStr: 'text-emerald-600 dark:text-emerald-400' },
  { target: /text-yellow-400/g, newStr: 'text-amber-500 dark:text-yellow-400' }
];

replacements.forEach(r => {
  code = code.replace(r.target, r.newStr);
});

fs.writeFileSync('src/app/Dashboard.tsx', code);
console.log('Fixed contrast issues');
