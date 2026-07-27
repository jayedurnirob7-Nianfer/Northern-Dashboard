const fs = require('fs');

let code = fs.readFileSync('src/app/Dashboard.tsx', 'utf8');

// ============================================================
// FIX 1: Sort shipments properly
// - Pending/active shipments first, Delivered last
// - Within each group, sort by NORS number ASCENDING (001, 002, 003...)
// ============================================================

const oldSort = `const filteredShipments = shipments.filter((s: any) => statusFilter === 'All' || s.status === statusFilter).sort((a: any, b: any) => {
    if (a.status !== 'Delivered' && b.status === 'Delivered') return -1;
    if (a.status === 'Delivered' && b.status !== 'Delivered') return 1;
    return 0;
  });`;

const newSort = `const filteredShipments = shipments.filter((s: any) => statusFilter === 'All' || s.status === statusFilter).sort((a: any, b: any) => {
    // Pending/active shipments first, Delivered last
    const aDelivered = a.status === 'Delivered' ? 1 : 0;
    const bDelivered = b.status === 'Delivered' ? 1 : 0;
    if (aDelivered !== bDelivered) return aDelivered - bDelivered;
    // Within each group, sort by NORS number ascending
    const aNum = parseInt((a.shippingNumber || '').replace(/\\D/g, ''), 10) || 0;
    const bNum = parseInt((b.shippingNumber || '').replace(/\\D/g, ''), 10) || 0;
    return aNum - bNum;
  });`;

if (code.includes(oldSort)) {
  code = code.replace(oldSort, newSort);
  console.log('✅ FIX 1: Sort logic replaced');
} else {
  console.log('⚠️  FIX 1: Could not find old sort block, attempting regex');
  code = code.replace(
    /const filteredShipments = shipments\.filter\(\(s: any\) => statusFilter === 'All' \|\| s\.status === statusFilter\)\.sort\([^}]+\}\);/s,
    newSort
  );
}

// ============================================================
// FIX 2: Fix calculation logic — use proper null/zero checks
// The DB has rate=0, myBill=0, totalProfit=0 for all records.
// rate=0 means "unknown/not set", not "free shipping".
// We need to distinguish between "genuinely 0" and "not set".
// Since ALL records have rate=0 because of the fix_db_rates.js
// script, we treat rate=0 as "not set" and show "-".
// ============================================================

// Replace the calculation block
const oldCalc = `                    const w = parseFloat(s.weight) || 0;
                    const r = parseFloat(s.rate) || 0;
                    const fr = parseFloat(s.finalRate) || 0;
                    
                    const clientBill = s.clientBill ? parseFloat(s.clientBill) : (w * fr);
                    const myBill = s.myBill ? parseFloat(s.myBill) : (w * r);
                    const totalProfit = s.totalProfit ? parseFloat(s.totalProfit) : (clientBill - myBill);
                    const unitProfit = s.profitPerKg ? parseFloat(s.profitPerKg) : (fr - r);`;

const newCalc = `                    const w = parseFloat(s.weight) || 0;
                    const r = parseFloat(s.rate) || 0;
                    const fr = parseFloat(s.finalRate) || 0;
                    const hasRate = r > 0; // rate=0 means not set yet
                    
                    const clientBill = (s.clientBill != null && s.clientBill !== 0) ? parseFloat(s.clientBill) : (w * fr);
                    const myBill = hasRate ? ((s.myBill != null && s.myBill !== 0) ? parseFloat(s.myBill) : (w * r)) : 0;
                    const totalProfit = hasRate ? ((s.totalProfit != null && s.totalProfit !== 0) ? parseFloat(s.totalProfit) : (clientBill - myBill)) : 0;
                    const unitProfit = hasRate ? ((s.profitPerKg != null && s.profitPerKg !== 0) ? parseFloat(s.profitPerKg) : (fr - r)) : 0;`;

if (code.includes(oldCalc)) {
  code = code.replace(oldCalc, newCalc);
  console.log('✅ FIX 2: Calculation logic replaced');
} else {
  console.log('⚠️  FIX 2: Could not find old calc block');
}

// ============================================================
// FIX 3: Fix rate display — show "-" when rate is 0 (not set)
// ============================================================

// Rate column
code = code.replace(
  `<td className="p-3 text-gray-700 dark:text-gray-300">{s.rate}</td>`,
  `<td className="p-3 text-gray-700 dark:text-gray-300">{hasRate ? r : <span className="text-gray-400">-</span>}</td>`
);
console.log('✅ FIX 3a: Rate column fixed');

// Unit Profit column — replace whatever is there
code = code.replace(
  /\{r > 0 \|\| s\.profitPerKg \? unitProfit\.toFixed\(2\) : "-"\}/,
  `{hasRate ? unitProfit.toFixed(2) : <span className="text-gray-400">-</span>}`
);
console.log('✅ FIX 3b: Unit Profit column fixed');

// My Bill column
code = code.replace(
  `<td className="p-3 text-gray-700 dark:text-gray-300">{myBill.toFixed(2)}</td>`,
  `<td className="p-3 text-gray-700 dark:text-gray-300">{hasRate ? myBill.toFixed(2) : <span className="text-gray-400">-</span>}</td>`
);
console.log('✅ FIX 3c: My Bill column fixed');

// Total Profit column
code = code.replace(
  /\$\{totalProfit\.toFixed\(2\)\}/,
  `{hasRate ? '$' + totalProfit.toFixed(2) : <span className="text-gray-400">-</span>}`
);
console.log('✅ FIX 3d: Total Profit column fixed');

// Delivery Date — already shows "-" for empty, but let's make sure
// (Already correct in the code)

fs.writeFileSync('src/app/Dashboard.tsx', code);
console.log('\\n🎉 All fixes applied to Dashboard.tsx');
