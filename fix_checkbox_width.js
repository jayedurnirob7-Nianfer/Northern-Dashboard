const fs = require('fs');

let code = fs.readFileSync('src/app/Dashboard.tsx', 'utf8');

// 1. Fix the header checkbox column so it doesn't stretch
const oldThCheckbox = `<th className="p-3 text-gray-700 dark:text-gray-400 font-semibold border-b border-gray-200 dark:border-[#27272a] whitespace-nowrap">
                    <input type="checkbox" onChange={handleSelectAll}`;
const newThCheckbox = `<th className="p-3 w-12 min-w-[48px] max-w-[48px] text-center text-gray-700 dark:text-gray-400 font-semibold border-b border-gray-200 dark:border-[#27272a] whitespace-nowrap">
                    <input type="checkbox" onChange={handleSelectAll}`;
code = code.replace(oldThCheckbox, newThCheckbox);

// 2. Fix the row checkbox column so it doesn't stretch
const oldTdCheckbox = `<td className="p-3 truncate text-center" onClick={(e) => e.stopPropagation()}>
                          <input type="checkbox" checked={isSelected}`;
const newTdCheckbox = `<td className="p-3 truncate text-center w-12 min-w-[48px] max-w-[48px]" onClick={(e) => e.stopPropagation()}>
                          <input type="checkbox" checked={isSelected}`;
code = code.replace(oldTdCheckbox, newTdCheckbox);

fs.writeFileSync('src/app/Dashboard.tsx', code);
console.log('Fixed checkbox column stretching');
