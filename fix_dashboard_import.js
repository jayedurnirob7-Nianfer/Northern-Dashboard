const fs = require('fs');
let code = fs.readFileSync('src/app/Dashboard.tsx', 'utf8');

const brokenPart = `          </div>
            className={\`text-sm font-semibold flex items-center gap-2 transition-colors \${selectedIds.length > 0 ? 'text-[#a78bfa] hover:text-[#c4b5fd]' : 'text-gray-500 cursor-not-allowed'}\`}
            title={selectedIds.length > 0 ? "Click to clear selection" : ""}
          >
            {selectedIds.length > 0 ? <X className="w-4 h-4" /> : <CheckSquare className="w-4 h-4" />} 
            {selectedIds.length} Selected
          </button>`;

const fixedPart = `          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-500" />
              <input type="text" placeholder="Search..." className="w-full bg-white dark:bg-[#18181f] text-gray-900 dark:text-white pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-[#27272a] focus:outline-none focus:border-[#8b5cf6] text-sm" />
            </div>
            <button 
              onClick={handleImport}
              disabled={isImporting}
              className="bg-gray-100 hover:bg-gray-200 dark:bg-[#27272a] dark:hover:bg-[#3f3f46] text-gray-900 dark:text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors shadow-sm whitespace-nowrap border border-gray-200 dark:border-[#3f3f46]"
            >
              {isImporting ? <span className="animate-spin">⏳</span> : <DownloadCloud className="w-4 h-4" />}
              {isImporting ? 'Syncing...' : 'Sync Sheet'}
            </button>
            <button 
              onClick={handleNewShipment}
              className="bg-[#8b5cf6] hover:bg-[#a78bfa] text-gray-900 dark:text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors shadow-lg whitespace-nowrap"
            >
              <Plus className="w-4 h-4" /> New Shipment
            </button>
          </div>
        </div>

        {/* Bulk Action Bar (Always Visible) */}
        <div className={\`border-b p-3 flex items-center gap-4 px-6 transition-all \${selectedIds.length > 0 ? 'bg-[#8b5cf6]/10 border-[#8b5cf6]/20' : 'bg-white dark:bg-[#18181f] border-gray-200 dark:border-[#27272a]'}\`}>
          <button 
            onClick={() => setSelectedIds([])}
            disabled={selectedIds.length === 0}
            className={\`text-sm font-semibold flex items-center gap-2 transition-colors \${selectedIds.length > 0 ? 'text-[#a78bfa] hover:text-[#c4b5fd]' : 'text-gray-500 cursor-not-allowed'}\`}
            title={selectedIds.length > 0 ? "Click to clear selection" : ""}
          >
            {selectedIds.length > 0 ? <X className="w-4 h-4" /> : <CheckSquare className="w-4 h-4" />} 
            {selectedIds.length} Selected
          </button>`;

code = code.replace(brokenPart, fixedPart);

const importRegex = /import \{([^}]+)\} from 'lucide-react';/;
const match = code.match(importRegex);
if (match && !match[1].includes('DownloadCloud')) {
  code = code.replace(importRegex, "import {" + match[1] + ", DownloadCloud} from 'lucide-react';");
}

const stateRegex = /const \[showInvoiceModal, setShowInvoiceModal\] = useState\(false\);/;
if (!code.includes('isImporting')) {
  code = code.replace(stateRegex, "const [showInvoiceModal, setShowInvoiceModal] = useState(false);\n  const [isImporting, setIsImporting] = useState(false);");
}

const funcRegex = /const handleSelectAll =/;
if (!code.includes('handleImport')) {
  const handleImportFunc = `
  const handleImport = async () => {
    setIsImporting(true);
    try {
      const res = await fetch('/api/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          url: 'https://docs.google.com/spreadsheets/d/1aT-DXdBmjYu5LqWohDCVB6BRdOTNXwgbLZ-3Jm7CrT0/edit?gid=0#gid=0',
          skipRows: 1
        })
      });
      const data = await res.json();
      if (res.ok) {
        alert('Successfully synced ' + data.count + ' records from sheet!');
        fetchShipments();
      } else {
        alert('Failed to sync: ' + data.error);
      }
    } catch (error) {
      console.error(error);
      alert('Error syncing data');
    } finally {
      setIsImporting(false);
    }
  };

  const handleSelectAll =`;
  code = code.replace(funcRegex, handleImportFunc);
}

fs.writeFileSync('src/app/Dashboard.tsx', code);
console.log('Fixed Dashboard.tsx');
