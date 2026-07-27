const fs = require('fs');

let code = fs.readFileSync('src/app/Dashboard.tsx', 'utf8');

// Replacements to support light/dark mode
const replacements = [
  { target: /bg-\[#0f0f13\]/g, newStr: 'bg-slate-50 dark:bg-[#0f0f13]' },
  { target: /bg-\[#18181f\]/g, newStr: 'bg-white dark:bg-[#18181f]' },
  { target: /bg-\[#121217\]/g, newStr: 'bg-slate-100 dark:bg-[#121217]' },
  { target: /border-\[#27272a\]/g, newStr: 'border-gray-200 dark:border-[#27272a]' },
  { target: /border-\[#3f3f46\]/g, newStr: 'border-gray-300 dark:border-[#3f3f46]' },
  { target: /text-gray-400/g, newStr: 'text-gray-600 dark:text-gray-400' },
  { target: /text-gray-300/g, newStr: 'text-gray-700 dark:text-gray-300' },
  { target: /text-gray-500/g, newStr: 'text-gray-500 dark:text-gray-500' },
  { target: /bg-\[#1c1c21\]/g, newStr: 'bg-gray-100 dark:bg-[#1c1c21]' },
  { target: /hover:bg-\[#1c1c21\]/g, newStr: 'hover:bg-gray-50 dark:hover:bg-[#1c1c21]' },
  { target: /hover:bg-\[#27272a\]/g, newStr: 'hover:bg-gray-100 dark:hover:bg-[#27272a]' },
  { target: /bg-gray-800/g, newStr: 'bg-gray-200 dark:bg-gray-800' },
  { target: /text-gray-300 border border-gray-700/g, newStr: 'text-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-700' },
];

// Special care for text-white outside of buttons/badges where it shouldn't be dark text
code = code.replace(/text-white/g, 'text-gray-900 dark:text-white');
// Fix text-white in buttons and badges where it should remain white
code = code.replace(/text-gray-900 dark:text-white flex items-center/g, 'text-white flex items-center');
code = code.replace(/text-gray-900 dark:text-white px-4/g, 'text-white px-4');
code = code.replace(/bg-gradient-to-r(.*?)(text-gray-900 dark:text-white)/g, 'bg-gradient-to-r$1text-white');
code = code.replace(/bg-\[#8b5cf6\] (.*?) text-gray-900 dark:text-white/g, 'bg-[#8b5cf6] $1 text-white');
code = code.replace(/bg-\[#8b5cf6\] text-gray-900 dark:text-white/g, 'bg-[#8b5cf6] text-white');

replacements.forEach(({ target, newStr }) => {
  code = code.replace(target, newStr);
});

// Fix hardcoded table header text color
code = code.replace(/text-gray-500 dark:text-gray-500/g, 'text-gray-500');

fs.writeFileSync('src/app/Dashboard.tsx', code);
console.log('Fixed Dashboard.tsx dark mode');
