const fs = require('fs');

let html = fs.readFileSync('public/invoice/index.html', 'utf8');

// The replacement was already made, so we just need to replace `data.data.map` with `data.map` in the html.
html = html.replace(/rows = data\.data\.map\(function\(item\) \{/, 'rows = data.map(function(item) {');

fs.writeFileSync('public/invoice/index.html', html);
console.log('Successfully fixed index.html data mapping');
