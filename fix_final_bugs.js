const fs = require('fs');
let code = fs.readFileSync('src/app/Dashboard.tsx', 'utf8');

// Fix bg-white missing dark mode
code = code.replace(
  '<div className="bg-white rounded-xl shadow-sm border border-gray-100 dark:border-[#27272a] overflow-hidden flex flex-col min-h-[600px]">',
  '<div className="bg-white dark:bg-[#121217] rounded-xl shadow-sm border border-gray-100 dark:border-[#27272a] overflow-hidden flex flex-col min-h-[600px]">'
);

// Fix the sorting logic
const targetSort = `const filteredShipments = shipments.filter((s: any) => statusFilter === 'All' || s.status === statusFilter);`;
const newSort = `const filteredShipments = shipments.filter((s: any) => statusFilter === 'All' || s.status === statusFilter).sort((a: any, b: any) => {
    if (a.status !== 'Delivered' && b.status === 'Delivered') return -1;
    if (a.status === 'Delivered' && b.status !== 'Delivered') return 1;
    return 0;
  });`;

code = code.replace(targetSort, newSort);

fs.writeFileSync('src/app/Dashboard.tsx', code);
console.log('Fixed final bugs');
