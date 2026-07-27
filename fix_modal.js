const fs = require('fs');

let code = fs.readFileSync('src/app/Dashboard.tsx', 'utf8');

// 1. Import
code = code.replace(
  "import BulkSummaryModal from './BulkSummaryModal';",
  "import BulkSummaryModal from './BulkSummaryModal';\nimport InvoiceModal from './InvoiceModal';"
);

// 2. State
code = code.replace(
  "const [showBulkSummary, setShowBulkSummary] = useState(false);",
  "const [showBulkSummary, setShowBulkSummary] = useState(false);\n  const [showInvoiceModal, setShowInvoiceModal] = useState(false);"
);

// 3. Button
const btnRegex = /<button\s*onClick=\{handleGeneratePDF\}[\s\S]*?<\/button>/;
const newBtn = `<button 
              onClick={() => setShowInvoiceModal(true)} 
              disabled={selectedIds.length === 0}
              className={\`border px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] \${selectedIds.length > 0 ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-500/20 border-transparent' : 'bg-slate-100 dark:bg-[#121217] border-gray-200 dark:border-[#27272a] text-gray-500 cursor-not-allowed shadow-none transform-none'}\`}
            >
              <FileDown className="w-4 h-4" /> Generate PDF
            </button>`;
code = code.replace(btnRegex, newBtn);

// 4. Modal component
const endRegex = /\{showBulkSummary && \([\s\S]*?<\/div>\s*\)\;\s*\}/;
const newEnd = `{showBulkSummary && (
        <BulkSummaryModal 
          shipments={shipments.filter((s: any) => selectedIds.includes(s._id))}
          onClose={() => setShowBulkSummary(false)}
        />
      )}

      {showInvoiceModal && (
        <InvoiceModal 
          ids={selectedIds}
          onClose={() => setShowInvoiceModal(false)}
        />
      )}
    </div>
  );
}`;
code = code.replace(endRegex, newEnd);

fs.writeFileSync('src/app/Dashboard.tsx', code);
console.log('Restored InvoiceModal to Dashboard.tsx');
