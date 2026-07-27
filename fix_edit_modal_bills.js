const fs = require('fs');

let code = fs.readFileSync('src/app/EditModal.tsx', 'utf8');

// 1. Update handleChange to support manual edits to bills
const targetHandleChange = `if (['weight', 'rate', 'finalRate'].includes(name)) {
        const w = parseFloat(next.weight) || 0;
        const r = parseFloat(next.rate) || 0;
        const fr = parseFloat(next.finalRate) || 0;
        
        next.clientBill = parseFloat((w * fr).toFixed(2));
        next.myBill = parseFloat((w * r).toFixed(2));
        next.totalProfit = parseFloat((next.clientBill - next.myBill).toFixed(2));
        next.profitPerKg = parseFloat((fr - r).toFixed(2));
      }`;

const newHandleChange = `if (['weight', 'rate', 'finalRate'].includes(name)) {
        const w = parseFloat(next.weight) || 0;
        const r = parseFloat(next.rate) || 0;
        const fr = parseFloat(next.finalRate) || 0;
        
        next.clientBill = parseFloat((w * fr).toFixed(2));
        next.myBill = parseFloat((w * r).toFixed(2));
        next.totalProfit = parseFloat((next.clientBill - next.myBill).toFixed(2));
        next.profitPerKg = parseFloat((fr - r).toFixed(2));
      } else if (['clientBill', 'myBill'].includes(name)) {
        const cb = parseFloat(next.clientBill) || 0;
        const mb = parseFloat(next.myBill) || 0;
        next.totalProfit = parseFloat((cb - mb).toFixed(2));
      }`;

code = code.replace(targetHandleChange, newHandleChange);

// 2. Remove readOnly from clientBill, myBill, totalProfit inputs
code = code.replace(/<input type="number" step="0.01" name="clientBill" value=\{formData\.clientBill \|\| 0\} readOnly className="w-full bg-gray-100 dark:bg-\[#18181f\]\/50 text-gray-500 p-2 rounded border border-\[#27272a\] text-sm cursor-not-allowed" \/>/g, 
  '<input type="number" step="0.01" name="clientBill" value={formData.clientBill ?? 0} onChange={handleChange} className="w-full bg-gray-50 dark:bg-[#18181f] text-gray-900 dark:text-white p-2 rounded border-gray-200 dark:border-[#3f3f46] border text-sm" />');

code = code.replace(/<input type="number" step="0.01" name="myBill" value=\{formData\.myBill \|\| 0\} readOnly className="w-full bg-gray-100 dark:bg-\[#18181f\]\/50 text-gray-500 p-2 rounded border border-\[#27272a\] text-sm cursor-not-allowed" \/>/g,
  '<input type="number" step="0.01" name="myBill" value={formData.myBill ?? 0} onChange={handleChange} className="w-full bg-gray-50 dark:bg-[#18181f] text-gray-900 dark:text-white p-2 rounded border-gray-200 dark:border-[#3f3f46] border text-sm" />');

code = code.replace(/<input type="number" step="0.01" name="totalProfit" value=\{formData\.totalProfit \|\| 0\} readOnly className="w-full bg-gray-100 dark:bg-\[#18181f\]\/50 text-gray-500 p-2 rounded border border-\[#27272a\] text-sm cursor-not-allowed" \/>/g,
  '<input type="number" step="0.01" name="totalProfit" value={formData.totalProfit ?? 0} onChange={handleChange} className="w-full bg-gray-50 dark:bg-[#18181f] text-gray-900 dark:text-white p-2 rounded border-gray-200 dark:border-[#3f3f46] border text-sm" />');

// 3. Fix the hardcoded dark colors I added inside those regexes in the previous step
// Wait, the previous regex was targeting the light mode fixed ones! Let's just do a clean replacement.
fs.writeFileSync('src/app/EditModal.tsx', code);
console.log('Fixed EditModal to allow manual bill entry');
