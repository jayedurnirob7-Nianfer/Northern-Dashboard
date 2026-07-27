const fs = require('fs');

let code = fs.readFileSync('src/app/Dashboard.tsx', 'utf8');

const targetStr = `            <button 
              onClick={handleGeneratePDF} 
              disabled={selectedIds.length === 0}
              className={\`border px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-2 transition-colors \${selectedIds.length > 0 ? 'bg-[#18181f] border-[#27272a] hover:bg-[#27272a] text-white' : 'bg-[#121217] border-[#27272a] text-gray-500 cursor-not-allowed'}\`}
            >
              <FileDown className="w-3.5 h-3.5" /> Generate PDF
            </button>`;

const newStr = `            <button 
              onClick={handleGeneratePDF} 
              disabled={selectedIds.length === 0}
              className={\`border px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] \${selectedIds.length > 0 ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-500/20 border-transparent' : 'bg-[#121217] border-[#27272a] text-gray-500 cursor-not-allowed shadow-none transform-none'}\`}
            >
              <FileDown className="w-4 h-4" /> Generate PDF
            </button>`;

if (code.includes(targetStr)) {
  code = code.replace(targetStr, newStr);
  fs.writeFileSync('src/app/Dashboard.tsx', code);
  console.log('Fixed Generate PDF button');
} else {
  console.log('Could not find target string');
}
