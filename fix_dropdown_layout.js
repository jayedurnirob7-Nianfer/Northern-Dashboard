const fs = require('fs');

let code = fs.readFileSync('src/app/Dashboard.tsx', 'utf8');

// 1. Fix checkbox td width
const oldCheckboxTd = `<td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <input type="checkbox" checked={isSelected} onChange={() => handleSelectRow(s._id)} className="rounded border-gray-600 bg-gray-700 cursor-pointer" />
                        </td>`;
const newCheckboxTd = `<td className="p-3 text-center w-12 min-w-[48px] max-w-[48px]" onClick={(e) => e.stopPropagation()}>
                          <input type="checkbox" checked={isSelected} onChange={() => handleSelectRow(s._id)} className="rounded border-gray-600 bg-gray-700 cursor-pointer" />
                        </td>`;
code = code.replace(oldCheckboxTd, newCheckboxTd);

// 2. Fix Method Select Dropdown
const oldMethodTd = `<td className="p-3" onClick={(e) => e.stopPropagation()}>
                        <select 
                          value={s.shippingMethod || ''} 
                          onChange={(e) => handleInlineUpdate(s._id, 'shippingMethod', e.target.value)}
                          className={\`px-2 py-1 pr-6 rounded-full text-[10px] font-bold tracking-wider cursor-pointer border-0 outline-none hover:ring-2 hover:ring-[#8b5cf6]/50 transition-all \${s.shippingMethod ? getMethodColor(s.shippingMethod) : 'bg-gray-100 text-gray-500 dark:bg-gray-800'}\`}
                        >`;

const newMethodTd = `<td className="p-3 truncate max-w-0" onClick={(e) => e.stopPropagation()}>
                        <select 
                          value={s.shippingMethod || ''} 
                          onChange={(e) => handleInlineUpdate(s._id, 'shippingMethod', e.target.value)}
                          className={\`px-2 py-1 pr-6 w-full max-w-full text-ellipsis overflow-hidden rounded-full text-[10px] font-bold tracking-wider cursor-pointer border-0 outline-none hover:ring-2 hover:ring-[#8b5cf6]/50 transition-all \${s.shippingMethod ? getMethodColor(s.shippingMethod) : 'bg-gray-100 text-gray-500 dark:bg-gray-800'}\`}
                        >`;
code = code.replace(oldMethodTd, newMethodTd);

// 3. Fix Status Select Dropdown
const oldStatusTd = `<td className="p-3" onClick={(e) => e.stopPropagation()}>
                        <select 
                          value={s.status} 
                          onChange={(e) => handleInlineUpdate(s._id, 'status', e.target.value)}
                          className={\`px-2 py-1 pr-6 rounded-full text-[10px] font-bold tracking-wider cursor-pointer border-0 outline-none hover:ring-2 hover:ring-[#8b5cf6]/50 transition-all \${getStatusColor(s.status)}\`}
                        >`;

const newStatusTd = `<td className="p-3 truncate max-w-0" onClick={(e) => e.stopPropagation()}>
                        <select 
                          value={s.status} 
                          onChange={(e) => handleInlineUpdate(s._id, 'status', e.target.value)}
                          className={\`px-2 py-1 pr-6 w-full max-w-full text-ellipsis overflow-hidden rounded-full text-[10px] font-bold tracking-wider cursor-pointer border-0 outline-none hover:ring-2 hover:ring-[#8b5cf6]/50 transition-all \${getStatusColor(s.status)}\`}
                        >`;
code = code.replace(oldStatusTd, newStatusTd);

// 4. Ensure Table minimum width to prevent completely crushed columns
const oldTableClass = `<table className="w-full text-left border-collapse text-xs table-fixed">`;
const newTableClass = `<table className="w-full min-w-[2160px] text-left border-collapse text-xs table-fixed">`;
code = code.replace(oldTableClass, newTableClass);

fs.writeFileSync('src/app/Dashboard.tsx', code);
console.log('Fixed dropdowns and layout constraints');
