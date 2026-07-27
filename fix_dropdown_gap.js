const fs = require('fs');

let code = fs.readFileSync('src/app/Dashboard.tsx', 'utf8');

// Inject the helper functions
const injectHelpers = `
const getMethodWidth = (method: string) => {
  if (method === 'Handcarry') return 'w-[95px]';
  return 'w-[55px]';
}

const getStatusWidth = (status: string) => {
  if (status === 'In Bangladesh Warehouse') return 'w-[165px]';
  if (status === 'In China Warehouse' || status === 'In Chittagong Port') return 'w-[135px]';
  if (status === 'In Shipment') return 'w-[95px]';
  if (status === 'Delivered') return 'w-[80px]';
  return 'w-[100px]';
}

export default function Dashboard() {`;
code = code.replace('export default function Dashboard() {', injectHelpers);

// Update Method select
const oldMethodClass = `className={\`px-2 py-1 pr-6 max-w-full text-ellipsis overflow-hidden rounded-full text-[10px] font-bold tracking-wider cursor-pointer border-0 outline-none hover:ring-2 hover:ring-[#8b5cf6]/50 transition-all \${s.shippingMethod ? getMethodColor(s.shippingMethod) : 'bg-gray-100 text-gray-500 dark:bg-gray-800'}\`}`;
const newMethodClass = `className={\`px-2 py-1 pr-6 \${getMethodWidth(s.shippingMethod || '')} max-w-full text-ellipsis overflow-hidden rounded-full text-[10px] font-bold tracking-wider cursor-pointer border-0 outline-none hover:ring-2 hover:ring-[#8b5cf6]/50 transition-all \${s.shippingMethod ? getMethodColor(s.shippingMethod) : 'bg-gray-100 text-gray-500 dark:bg-gray-800'}\`}`;
code = code.replace(oldMethodClass, newMethodClass);

// Update Status select
const oldStatusClass = `className={\`px-2 py-1 pr-6 max-w-full text-ellipsis overflow-hidden rounded-full text-[10px] font-bold tracking-wider cursor-pointer border-0 outline-none hover:ring-2 hover:ring-[#8b5cf6]/50 transition-all \${getStatusColor(s.status)}\`}`;
const newStatusClass = `className={\`px-2 py-1 pr-6 \${getStatusWidth(s.status || '')} max-w-full text-ellipsis overflow-hidden rounded-full text-[10px] font-bold tracking-wider cursor-pointer border-0 outline-none hover:ring-2 hover:ring-[#8b5cf6]/50 transition-all \${getStatusColor(s.status)}\`}`;
code = code.replace(oldStatusClass, newStatusClass);

fs.writeFileSync('src/app/Dashboard.tsx', code);
console.log('Fixed dropdown exact widths');
