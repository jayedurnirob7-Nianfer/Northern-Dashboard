const fs = require('fs');
const code = fs.readFileSync('public/invoice/index.html', 'utf8');
console.log('Contains embed check:', code.includes("urlParams.get('embed')"));
console.log('Contains sheet-url input:', code.includes('id="sheet-url"'));
console.log('Contains btn-load:', code.includes('id="btn-load"'));
