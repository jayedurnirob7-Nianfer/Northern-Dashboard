const fs = require('fs');
const path = require('path');

const filesToFix = [
  'src/app/Dashboard.tsx',
  'src/app/EditModal.tsx',
  'src/app/BulkSummaryModal.tsx',
  'src/app/InvoiceModal.tsx'
];

filesToFix.forEach(file => {
  if (!fs.existsSync(file)) return;
  
  let code = fs.readFileSync(file, 'utf8');

  const replacements = [
    // Dashboard main wrapper
    { target: /bg-\[#09090b\] text-gray-200/g, newStr: 'bg-slate-50 dark:bg-[#09090b] text-gray-900 dark:text-gray-200' },
    
    // Backgrounds
    { target: /bg-\[#09090b\]/g, newStr: 'bg-white dark:bg-[#09090b]' },
    { target: /bg-\[#18181f\]\/50/g, newStr: 'bg-gray-100 dark:bg-[#18181f]/50' },
    { target: /bg-\[#18181f\]/g, newStr: 'bg-gray-50 dark:bg-[#18181f]' },
    { target: /bg-\[#121217\]/g, newStr: 'bg-gray-100 dark:bg-[#121217]' },
    { target: /bg-\[#404040\]/g, newStr: 'bg-gray-200 dark:bg-[#404040]' },
    
    // Text
    { target: /text-white/g, newStr: 'text-gray-900 dark:text-white' },
    // Fix over-replacements of text-white if they got replaced multiple times
    { target: /text-gray-900 dark:text-gray-900 dark:text-white/g, newStr: 'text-gray-900 dark:text-white' },

    // Borders
    { target: /border-\[#3f3f46\]/g, newStr: 'border-gray-300 dark:border-[#3f3f46]' },
    { target: /border-\[#27272a\]/g, newStr: 'border-gray-200 dark:border-[#27272a]' },
    { target: /border-\[#525252\]/g, newStr: 'border-gray-300 dark:border-[#525252]' },
  ];

  replacements.forEach(r => {
    code = code.replace(r.target, r.newStr);
  });
  
  // Cleanup any double prefixes that might have occurred
  code = code.replace(/bg-white dark:bg-white dark:bg-\[#09090b\]/g, 'bg-white dark:bg-[#09090b]');
  code = code.replace(/bg-slate-50 dark:bg-white dark:bg-\[#09090b\]/g, 'bg-slate-50 dark:bg-[#09090b]');
  code = code.replace(/bg-gray-50 dark:bg-gray-50 dark:bg-\[#18181f\]/g, 'bg-gray-50 dark:bg-[#18181f]');
  code = code.replace(/border-gray-200 dark:border-gray-200 dark:border-\[#27272a\]/g, 'border-gray-200 dark:border-[#27272a]');
  code = code.replace(/border-gray-300 dark:border-gray-300 dark:border-\[#3f3f46\]/g, 'border-gray-300 dark:border-[#3f3f46]');

  fs.writeFileSync(file, code);
  console.log('Fixed ' + file);
});
