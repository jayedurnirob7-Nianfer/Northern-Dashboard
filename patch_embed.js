const fs = require('fs');

let html = fs.readFileSync('public/invoice/index.html', 'utf8');

// Inside loadSheet:
const replaceTarget = 'toast("Loaded " + rows.length + " rows");';
const newCode = `toast("Loaded " + rows.length + " rows");
            
            if (urlParams.get('embed') === 'true') {
              // Hide main app container
              const mainApp = document.querySelector('.container');
              if(mainApp) mainApp.style.display = 'none';
              
              // Select all rows
              selRows = [...rows];
              
              // Generate the invoice immediately
              genInvoice();
            }`;

html = html.replace(replaceTarget, newCode);

fs.writeFileSync('public/invoice/index.html', html);
console.log('Successfully patched index.html for embed mode');
