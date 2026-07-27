const fs = require('fs');

let code = fs.readFileSync('src/app/EditModal.tsx', 'utf8');

// Use less strict regex to remove readOnly and change classes
code = code.replace(/<input type="number" step="0\.01" name="clientBill" value=\{formData\.clientBill \|\| 0\} readOnly className=".*?" \/>/g, 
  '<input type="number" step="0.01" name="clientBill" value={formData.clientBill ?? 0} onChange={handleChange} className="w-full bg-white dark:bg-[#18181f] text-gray-900 dark:text-white p-2 rounded border border-gray-200 dark:border-[#3f3f46] text-sm" />');

code = code.replace(/<input type="number" step="0\.01" name="myBill" value=\{formData\.myBill \|\| 0\} readOnly className=".*?" \/>/g,
  '<input type="number" step="0.01" name="myBill" value={formData.myBill ?? 0} onChange={handleChange} className="w-full bg-white dark:bg-[#18181f] text-gray-900 dark:text-white p-2 rounded border border-gray-200 dark:border-[#3f3f46] text-sm" />');

code = code.replace(/<input type="number" step="0\.01" name="totalProfit" value=\{formData\.totalProfit \|\| 0\} readOnly className=".*?" \/>/g,
  '<input type="number" step="0.01" name="totalProfit" value={formData.totalProfit ?? 0} onChange={handleChange} className="w-full bg-white dark:bg-[#18181f] text-gray-900 dark:text-white p-2 rounded border border-gray-200 dark:border-[#3f3f46] text-sm" />');

fs.writeFileSync('src/app/EditModal.tsx', code);
console.log('Fixed EditModal inputs');
