const fs = require('fs');

let code = fs.readFileSync('src/app/Dashboard.tsx', 'utf8');

const regex = /let hoverBg = .*?;\s*return \(/;

const newStr = `let hoverBg = isSelected ? 'hover:bg-[#8b5cf6]/20' : (isDelivered ? 'hover:bg-green-500/10' : 'hover:bg-gray-50 dark:hover:bg-[#1c1c21]');
                    
                    const w = parseFloat(s.weight) || 0;
                    const r = parseFloat(s.rate) || 0;
                    const fr = parseFloat(s.finalRate) || 0;
                    
                    const clientBill = w * fr;
                    const myBill = w * r;
                    const totalProfit = clientBill - myBill;
                    const unitProfit = fr - r;

                    return (`

code = code.replace(regex, newStr);

fs.writeFileSync('src/app/Dashboard.tsx', code);
console.log('Fixed unitProfit declaration');
