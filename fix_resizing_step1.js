const fs = require('fs');

let code = fs.readFileSync('src/app/Dashboard.tsx', 'utf8');

// 1. Revert Table to w-max
code = code.replace(
  '<table className="w-full min-w-[2160px] text-left border-collapse text-xs table-fixed">',
  '<table className="w-max text-left border-collapse text-xs table-fixed">'
);

// 2. Remove Dummy Header
code = code.replace(
  '<ResizableHeader defaultWidth={120}>Total Profit</ResizableHeader>\n                  <th className="w-full"></th>',
  '<ResizableHeader defaultWidth={120}>Total Profit</ResizableHeader>'
);
code = code.replace(
  '<ResizableHeader defaultWidth={120}>Total Profit</ResizableHeader>\r\n                  <th className="w-full"></th>',
  '<ResizableHeader defaultWidth={120}>Total Profit</ResizableHeader>'
);

// 3. Revert colSpans
code = code.replace(/colSpan=\{21\}/g, 'colSpan={20}');

// 4. Remove Dummy Row cell
code = code.replace(
  /<span className="text-gray-400">-<\/span>\}<\/td>\s*<td><\/td>/g,
  '<span className="text-gray-400">-</span>}</td>'
);
code = code.replace(
  /\}<\/td>\s*<td><\/td>/g,
  '}</td>'
);


fs.writeFileSync('src/app/Dashboard.tsx', code);
console.log('Fixed Google Sheets style right-to-left resizing architecture (Step 1)');
