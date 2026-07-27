const fs = require('fs');

const filesToClean = [
  'src/app/Dashboard.tsx',
  'src/app/BulkSummaryModal.tsx',
  'src/app/EditModal.tsx',
];

filesToClean.forEach(f => {
  let code = fs.readFileSync(f, 'utf8');

  // Fix multiple bg-white dark overrides
  code = code.replace(/bg-white dark:bg-white dark:bg-\[#18181f\]/g, 'bg-white dark:bg-[#18181f]');
  code = code.replace(/bg-gray-200 dark:bg-gray-200 dark:bg-gray-800/g, 'bg-gray-200 dark:bg-gray-800');
  
  // Fix multiple text overrides
  code = code.replace(/text-gray-700 dark:text-gray-800 dark:text-gray-700 dark:text-gray-300/g, 'text-gray-700 dark:text-gray-300');
  code = code.replace(/dark:text-gray-800 dark:text-gray-700/g, 'dark:text-gray-700');
  code = code.replace(/dark:text-amber-500 dark:text-yellow-400/g, 'dark:text-yellow-400');
  code = code.replace(/dark:text-gray-700 dark:text-gray-300/g, 'dark:text-gray-300');
  code = code.replace(/text-gray-700 dark:text-gray-700 dark:text-gray-300/g, 'text-gray-700 dark:text-gray-300');
  code = code.replace(/dark:text-gray-400 dark:text-gray-600/g, 'dark:text-gray-400');
  code = code.replace(/hover:bg-gray-50 dark:hover:bg-gray-100 dark:bg-\[#1c1c21\]/g, 'hover:bg-gray-50 dark:hover:bg-[#1c1c21]');

  fs.writeFileSync(f, code);
  console.log(`Cleaned ${f}`);
});
