const fs = require('fs');

let code = fs.readFileSync('src/app/Dashboard.tsx', 'utf8');

const oldHelpers = `const getMethodWidth = (method: string) => {
  if (method === 'Handcarry') return 'w-[95px]';
  return 'w-[55px]';
}

const getStatusWidth = (status: string) => {
  if (status === 'In Bangladesh Warehouse') return 'w-[165px]';
  if (status === 'In China Warehouse' || status === 'In Chittagong Port') return 'w-[135px]';
  if (status === 'In Shipment') return 'w-[95px]';
  if (status === 'Delivered') return 'w-[80px]';
  return 'w-[100px]';
}`;

const newHelpers = `const getMethodWidth = (method: string) => {
  if (method === 'Handcarry') return 'w-[110px]';
  return 'w-[75px]';
}

const getStatusWidth = (status: string) => {
  if (status === 'In Bangladesh Warehouse') return 'w-[175px]';
  if (status === 'In China Warehouse' || status === 'In Chittagong Port') return 'w-[145px]';
  if (status === 'In Shipment') return 'w-[110px]';
  if (status === 'Delivered') return 'w-[95px]';
  return 'w-[120px]';
}`;

code = code.replace(oldHelpers, newHelpers);

fs.writeFileSync('src/app/Dashboard.tsx', code);
console.log('Fixed dropdown widths');
