const fs = require('fs');

let code = fs.readFileSync('src/app/Dashboard.tsx', 'utf8');

// 1. Fix Method Select Dropdown - remove w-full so it doesn't stretch and create a gap
const oldMethodClass = `className={\`px-2 py-1 pr-6 w-full max-w-full text-ellipsis overflow-hidden rounded-full text-[10px] font-bold tracking-wider cursor-pointer border-0 outline-none hover:ring-2 hover:ring-[#8b5cf6]/50 transition-all \${s.shippingMethod ? getMethodColor(s.shippingMethod) : 'bg-gray-100 text-gray-500 dark:bg-gray-800'}\`}`;
const newMethodClass = `className={\`px-2 py-1 pr-6 max-w-full text-ellipsis overflow-hidden rounded-full text-[10px] font-bold tracking-wider cursor-pointer border-0 outline-none hover:ring-2 hover:ring-[#8b5cf6]/50 transition-all \${s.shippingMethod ? getMethodColor(s.shippingMethod) : 'bg-gray-100 text-gray-500 dark:bg-gray-800'}\`}`;
code = code.replace(oldMethodClass, newMethodClass);

// 2. Fix Status Select Dropdown - remove w-full
const oldStatusClass = `className={\`px-2 py-1 pr-6 w-full max-w-full text-ellipsis overflow-hidden rounded-full text-[10px] font-bold tracking-wider cursor-pointer border-0 outline-none hover:ring-2 hover:ring-[#8b5cf6]/50 transition-all \${getStatusColor(s.status)}\`}`;
const newStatusClass = `className={\`px-2 py-1 pr-6 max-w-full text-ellipsis overflow-hidden rounded-full text-[10px] font-bold tracking-wider cursor-pointer border-0 outline-none hover:ring-2 hover:ring-[#8b5cf6]/50 transition-all \${getStatusColor(s.status)}\`}`;
code = code.replace(oldStatusClass, newStatusClass);

// 3. Fix Table Resizing jumping - make table strictly w-max (content size) rather than w-full
const oldTableClass = `<table className="w-full min-w-[2160px] text-left border-collapse text-xs table-fixed">`;
const newTableClass = `<table className="w-max text-left border-collapse text-xs table-fixed">`;
code = code.replace(oldTableClass, newTableClass);

fs.writeFileSync('src/app/Dashboard.tsx', code);
console.log('Fixed dropdown width and table resizing mode');
