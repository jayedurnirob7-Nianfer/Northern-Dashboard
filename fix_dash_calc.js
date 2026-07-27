const fs = require('fs');

let code = fs.readFileSync('src/app/Dashboard.tsx', 'utf8');

const targetStr = `                    const clientBill = w * fr;
                    const myBill = w * r;
                    const totalProfit = clientBill - myBill;
                    const unitProfit = fr - r;`;

const newStr = `                    const clientBill = s.clientBill !== undefined && s.clientBill !== null && s.clientBill !== "" ? parseFloat(s.clientBill) : (w * fr);
                    const myBill = s.myBill !== undefined && s.myBill !== null && s.myBill !== "" ? parseFloat(s.myBill) : (w * r);
                    const totalProfit = s.totalProfit !== undefined && s.totalProfit !== null && s.totalProfit !== "" ? parseFloat(s.totalProfit) : (clientBill - myBill);
                    const unitProfit = s.profitPerKg !== undefined && s.profitPerKg !== null && s.profitPerKg !== "" ? parseFloat(s.profitPerKg) : (fr - r);`;

code = code.replace(targetStr, newStr);

fs.writeFileSync('src/app/Dashboard.tsx', code);
console.log('Fixed calculation logic in Dashboard.tsx to read from DB');
