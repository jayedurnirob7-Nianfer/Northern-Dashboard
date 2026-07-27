const fs = require('fs');
const files = [
  'src/app/BulkSummaryModal.tsx',
  'src/app/Dashboard.tsx',
  'src/app/EditModal.tsx',
  'src/app/InvoiceModal.tsx',
  'src/app/layout.tsx',
  'src/app/page.tsx'
];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  let lines = content.split('\n');
  lines.forEach((l, i) => {
    if (l.includes('bg-white') && !l.includes('dark:bg-') && !l.includes('bg-white/')) {
      console.log(`${f}:${i+1}: Missing dark bg -> ${l.trim()}`);
    }
    if (l.includes('bg-slate-50') && !l.includes('dark:bg-')) {
      console.log(`${f}:${i+1}: Missing dark bg -> ${l.trim()}`);
    }
    if (l.includes('text-gray-900') && !l.includes('dark:text-white') && !l.includes('dark:text-gray-')) {
      console.log(`${f}:${i+1}: Missing dark text -> ${l.trim()}`);
    }
    if (l.includes('text-gray-800') && !l.includes('dark:text-white') && !l.includes('dark:text-gray-')) {
      console.log(`${f}:${i+1}: Missing dark text -> ${l.trim()}`);
    }
    if (l.includes('border-gray-200') && !l.includes('dark:border-')) {
      console.log(`${f}:${i+1}: Missing dark border -> ${l.trim()}`);
    }
    if (l.includes('border-gray-100') && !l.includes('dark:border-')) {
      console.log(`${f}:${i+1}: Missing dark border -> ${l.trim()}`);
    }
    if (l.includes('bg-gray-50') && !l.includes('dark:bg-')) {
      console.log(`${f}:${i+1}: Missing dark bg -> ${l.trim()}`);
    }
  });
});
