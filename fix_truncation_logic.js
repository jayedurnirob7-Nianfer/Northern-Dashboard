const fs = require('fs');

let code = fs.readFileSync('src/app/Dashboard.tsx', 'utf8');

// 1. Add double-click to restore width in ResizableHeader
const oldHeaderDiv = `<div 
        onMouseDown={startResizing}
        className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-[#8b5cf6] dark:hover:bg-[#8b5cf6] opacity-0 group-hover:opacity-100 z-10 transition-colors"
      />`;
const newHeaderDiv = `<div 
        onMouseDown={startResizing}
        onDoubleClick={() => setWidth(defaultWidth)}
        className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-[#8b5cf6] dark:hover:bg-[#8b5cf6] opacity-0 group-hover:opacity-100 z-10 transition-colors"
        title="Double click to restore default width"
      />`;
code = code.replace(oldHeaderDiv, newHeaderDiv);

// 2. Revert table to w-full min-w-max to enable aggressive truncation, and we'll add a dummy column
const oldTableClass = `<table className="w-max text-left border-collapse text-xs table-fixed">`;
const newTableClass = `<table className="w-full min-w-[2160px] text-left border-collapse text-xs table-fixed">`;
code = code.replace(oldTableClass, newTableClass);

// 3. Add dummy column header
const oldTheadRow = `<ResizableHeader defaultWidth={120}>Total Profit</ResizableHeader>
                </tr>
              </thead>`;
const newTheadRow = `<ResizableHeader defaultWidth={120}>Total Profit</ResizableHeader>
                  <th className="w-full"></th>
                </tr>
              </thead>`;
code = code.replace(oldTheadRow, newTheadRow);

// 4. Add dummy column cell to loading row
const oldLoading = `<tr><td colSpan={20} className="p-8 text-center text-gray-500">Loading database...</td></tr>`;
const newLoading = `<tr><td colSpan={21} className="p-8 text-center text-gray-500">Loading database...</td></tr>`;
code = code.replace(oldLoading, newLoading);

// 5. Add dummy column cell to empty filter row
const oldEmpty = `<tr><td colSpan={20} className="p-8 text-center text-gray-500">No records found matching filters.</td></tr>`;
const newEmpty = `<tr><td colSpan={21} className="p-8 text-center text-gray-500">No records found matching filters.</td></tr>`;
code = code.replace(oldEmpty, newEmpty);

// 6. Add dummy column cell to data row
const oldDataEnd = `<td className={\`p-3 truncate max-w-0 text-right font-bold border-l border-gray-200 dark:border-[#27272a] \${hasRate && totalProfit > 0 ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10' : 'text-gray-700 dark:text-gray-400 font-medium'}\`} title={hasRate ? \`$\${totalProfit.toFixed(2)}\` : ''}>{hasRate ? \`$\${totalProfit.toFixed(2)}\` : <span className="text-gray-400">-</span>}</td>
                      </tr>
                    );`;
const newDataEnd = `<td className={\`p-3 truncate max-w-0 text-right font-bold border-l border-gray-200 dark:border-[#27272a] \${hasRate && totalProfit > 0 ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10' : 'text-gray-700 dark:text-gray-400 font-medium'}\`} title={hasRate ? \`$\${totalProfit.toFixed(2)}\` : ''}>{hasRate ? \`$\${totalProfit.toFixed(2)}\` : <span className="text-gray-400">-</span>}</td>
                      <td></td>
                      </tr>
                    );`;
code = code.replace(oldDataEnd, newDataEnd);

fs.writeFileSync('src/app/Dashboard.tsx', code);
console.log('Fixed truncation constraint and added double click restore');
