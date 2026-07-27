const fs = require('fs');

let html = fs.readFileSync('public/invoice/index.html', 'utf8');

// We need to inject the URL params filtering into the loadSheet function.
// Let's replace the line:
// var data = await r.json();
// with a new chunk of code that filters data if `ids` is present in the query string.

const replaceTarget = "var data = await r.json();";
const newCode = `var data = await r.json();
            
            // Check if we need to filter by specific IDs from the URL
            const urlParams = new URLSearchParams(window.location.search);
            const idsParam = urlParams.get('ids');
            if (idsParam) {
              const selectedIds = idsParam.split(',');
              data = data.filter(item => selectedIds.includes(item._id));
            }
`;

html = html.replace(replaceTarget, newCode);

fs.writeFileSync('public/invoice/index.html', html);
console.log('Successfully patched index.html to support URL filtering');
