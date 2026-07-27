const fs = require('fs');

let code = fs.readFileSync('src/app/Dashboard.tsx', 'utf8');

// Fix duplicates
code = code.replace(/import InvoiceModal from '\.\/InvoiceModal';\r?\nimport InvoiceModal from '\.\/InvoiceModal';/g, "import InvoiceModal from './InvoiceModal';");
code = code.replace(/const \[showInvoiceModal, setShowInvoiceModal\] = useState\(false\);\r?\n\s+const \[showInvoiceModal, setShowInvoiceModal\] = useState\(false\);/g, "const [showInvoiceModal, setShowInvoiceModal] = useState(false);");
code = code.replace(/<InvoiceModal isOpen=\{showInvoiceModal\} onClose=\{.*\} shipment=\{selectedShipment\} \/>\r?\n\s+<InvoiceModal isOpen=\{showInvoiceModal\} onClose=\{.*\} shipment=\{selectedShipment\} \/>/g, "<InvoiceModal isOpen={showInvoiceModal} onClose={() => setShowInvoiceModal(false)} shipment={selectedShipment} />");

// Fix layout: "the shiipping no is not idealy positioned."
// Add spacing to the shipping number header and cell
code = code.replace(/<th className="p-3 text-left/g, '<th className="p-3 pl-6 text-left');
code = code.replace(/<td className=\{`p-3 font-medium/g, '<td className={`p-3 pl-6 font-medium');

// Add text-center to checkbox header if it is not there
code = code.replace(/<th className="p-3 w-10">/g, '<th className="p-3 w-10 text-center">');
code = code.replace(/<td className="p-3" onClick=\{\(e\) => e.stopPropagation\(\)\}>/g, '<td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>');


fs.writeFileSync('src/app/Dashboard.tsx', code);
console.log('Fixed syntax and padding');
