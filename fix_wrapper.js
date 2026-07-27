const fs = require('fs');

let html = fs.readFileSync('public/invoice/index.html', 'utf8');

// Change .layout to #app in the embed logic
html = html.replace("const mainApp = document.querySelector('.layout');", "const mainApp = document.getElementById('app');");

fs.writeFileSync('public/invoice/index.html', html);
console.log('Fixed wrapper class for embed mode');
