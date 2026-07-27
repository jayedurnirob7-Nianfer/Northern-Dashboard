const fs = require('fs');

let html = fs.readFileSync('public/invoice/index.html', 'utf8');

const targetStr = `if (urlParams.get('embed') === 'true') {
              // Hide main app container
              const mainApp = document.getElementById('app');
              if(mainApp) mainApp.style.display = 'none';
              
              // Select all rows
              selRows = [...rows];
              
              // Generate the invoice immediately
              genInvoice();
            }`;

const newStr = `if (urlParams.get('embed') === 'true') {
              // Hide main app container
              const mainApp = document.getElementById('app');
              if(mainApp) mainApp.style.display = 'none';
              
              // Select all rows
              selRows = [...rows];
              
              // Hide the inner close button since React has one
              const innerCloseBtn = document.querySelector('.btn-close');
              if(innerCloseBtn) innerCloseBtn.style.display = 'none';
              
              // Generate the invoice immediately
              genInvoice();
            }`;

html = html.replace(targetStr, newStr);

fs.writeFileSync('public/invoice/index.html', html);
console.log('Added close button hide logic');
