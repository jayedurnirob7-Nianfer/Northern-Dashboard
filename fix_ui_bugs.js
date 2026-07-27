const fs = require('fs');

let code = fs.readFileSync('src/app/Dashboard.tsx', 'utf8');

// Fix dark mode double prefixes
code = code.replace(/dark:bg-slate-100 dark:bg-\[#121217\]/g, 'dark:bg-[#121217]');
code = code.replace(/dark:text-gray-700 dark:text-gray-400/g, 'dark:text-gray-400');
code = code.replace(/dark:bg-gray-100 dark:bg-\[#121217\]/g, 'dark:bg-[#121217]'); // just in case

// Fix sorting: put Delivered at the bottom, Pending at the top. 
// Right now it's: const sortedShipments = ... (Wait, there's no sortedShipments variable, we map over filteredShipments)
// Let's replace the fetchShipments sort, or replace filteredShipments mapping.
// Let's modify the filtering logic to also sort.
const targetSort = `    const filtered = shipments.filter((s: any) => {
      if (statusFilter !== 'All' && s.status !== statusFilter) return false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
          s.shippingNumber?.toLowerCase().includes(term) ||
          s.trackingNumber?.toLowerCase().includes(term) ||
          s.customerName?.toLowerCase().includes(term)
        );
      }
      return true;
    });`;

const newSort = `    const filtered = shipments.filter((s: any) => {
      if (statusFilter !== 'All' && s.status !== statusFilter) return false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
          s.shippingNumber?.toLowerCase().includes(term) ||
          s.trackingNumber?.toLowerCase().includes(term) ||
          s.customerName?.toLowerCase().includes(term)
        );
      }
      return true;
    }).sort((a: any, b: any) => {
      // Pending first, Delivered last
      if (a.status !== 'Delivered' && b.status === 'Delivered') return -1;
      if (a.status === 'Delivered' && b.status !== 'Delivered') return 1;
      return 0;
    });`;

code = code.replace(targetSort, newSort);

fs.writeFileSync('src/app/Dashboard.tsx', code);
console.log('Fixed dark mode and sorting in Dashboard.tsx');
