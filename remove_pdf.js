const fs = require('fs');

let code = fs.readFileSync('src/app/Dashboard.tsx', 'utf8');

const regex = /const handleGeneratePDF = \(\) => \{[\s\S]*?\};\n\n/;
code = code.replace(regex, '');

const importRegex = /import \{ generatePDF \} from '@\/lib\/pdf';\n/;
code = code.replace(importRegex, '');

fs.writeFileSync('src/app/Dashboard.tsx', code);
console.log('Removed handleGeneratePDF');
