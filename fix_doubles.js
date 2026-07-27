const fs = require('fs');
const path = require('path');

const files = [
  'src/app/Dashboard.tsx',
  'src/app/EditModal.tsx',
  'src/app/BulkSummaryModal.tsx',
  'src/app/InvoiceModal.tsx'
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  
  let code = fs.readFileSync(file, 'utf8');

  // Fix the double dark:bg- variants I introduced
  code = code.replace(/dark:bg-white dark:bg-\[/g, 'dark:bg-[');
  code = code.replace(/dark:bg-gray-100 dark:bg-\[/g, 'dark:bg-[');
  code = code.replace(/dark:bg-gray-50 dark:bg-\[/g, 'dark:bg-[');
  code = code.replace(/dark:bg-gray-200 dark:bg-\[/g, 'dark:bg-[');
  code = code.replace(/dark:text-gray-900 dark:text-white/g, 'dark:text-white');
  code = code.replace(/dark:text-gray-900 dark:text-gray-200/g, 'dark:text-gray-200');
  code = code.replace(/dark:border-gray-200 dark:border-\[/g, 'dark:border-[');
  code = code.replace(/dark:border-gray-300 dark:border-\[/g, 'dark:border-[');

  fs.writeFileSync(file, code);
  console.log('Cleaned up double dark prefixes in ' + file);
});
