const fs = require('fs');

let code = fs.readFileSync('src/app/Dashboard.tsx', 'utf8');

// 1. Add handleInlineUpdate function
const handleInlineUpdateFunc = "  const handleInlineUpdate = async (id: string, field: string, value: string) => {\n" +
"    try {\n" +
"      setShipments(prev => prev.map(s => s._id === id ? { ...s, [field]: value } : s));\n" +
"      const res = await fetch(`/api/shipments/${id}`, {\n" +
"        method: 'PUT',\n" +
"        headers: { 'Content-Type': 'application/json' },\n" +
"        body: JSON.stringify({ [field]: value })\n" +
"      });\n" +
"      if (!res.ok) fetchShipments();\n" +
"    } catch (err) {\n" +
"      console.error(err);\n" +
"      fetchShipments();\n" +
"    }\n" +
"  };\n\n" +
"  const handleBulkUpdateStatus =";

code = code.replace('  const handleBulkUpdateStatus =', handleInlineUpdateFunc);

// 2. Replace Method and Status spans with selects
const oldMethod = `<td className="p-3">
                        {s.shippingMethod ? (
                          <span className={\`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider \${getMethodColor(s.shippingMethod)}\`}>
                            {s.shippingMethod}
                          </span>
                        ) : (
                          <span className="text-gray-500 dark:text-gray-600">-</span>
                        )}
                      </td>`;

const newMethod = "<td className=\"p-3\" onClick={(e) => e.stopPropagation()}>\n" +
"                        <select \n" +
"                          value={s.shippingMethod || ''} \n" +
"                          onChange={(e) => handleInlineUpdate(s._id, 'shippingMethod', e.target.value)}\n" +
"                          className={`px-2 py-1 pr-6 rounded-full text-[10px] font-bold tracking-wider cursor-pointer border-0 outline-none hover:ring-2 hover:ring-[#8b5cf6]/50 transition-all ${s.shippingMethod ? getMethodColor(s.shippingMethod) : 'bg-gray-100 text-gray-500 dark:bg-gray-800'}`}\n" +
"                        >\n" +
"                          <option value=\"\" disabled>-</option>\n" +
"                          <option value=\"Sea\" className=\"bg-white dark:bg-[#18181f] text-gray-900 dark:text-white font-medium\">Sea</option>\n" +
"                          <option value=\"Air\" className=\"bg-white dark:bg-[#18181f] text-gray-900 dark:text-white font-medium\">Air</option>\n" +
"                          <option value=\"Handcarry\" className=\"bg-white dark:bg-[#18181f] text-gray-900 dark:text-white font-medium\">Handcarry</option>\n" +
"                        </select>\n" +
"                      </td>";

code = code.replace(oldMethod, newMethod);

const oldStatus = `<td className="p-3">
                        <span className={\`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider \${getStatusColor(s.status)}\`}>
                          {s.status}
                        </span>
                      </td>`;

const newStatus = "<td className=\"p-3\" onClick={(e) => e.stopPropagation()}>\n" +
"                        <select \n" +
"                          value={s.status} \n" +
"                          onChange={(e) => handleInlineUpdate(s._id, 'status', e.target.value)}\n" +
"                          className={`px-2 py-1 pr-6 rounded-full text-[10px] font-bold tracking-wider cursor-pointer border-0 outline-none hover:ring-2 hover:ring-[#8b5cf6]/50 transition-all ${getStatusColor(s.status)}`}\n" +
"                        >\n" +
"                          <option value=\"In China Warehouse\" className=\"bg-white dark:bg-[#18181f] text-gray-900 dark:text-white font-medium\">In China Warehouse</option>\n" +
"                          <option value=\"In Shipment\" className=\"bg-white dark:bg-[#18181f] text-gray-900 dark:text-white font-medium\">In Shipment</option>\n" +
"                          <option value=\"In Chittagong Port\" className=\"bg-white dark:bg-[#18181f] text-gray-900 dark:text-white font-medium\">In Chittagong Port</option>\n" +
"                          <option value=\"In Bangladesh Warehouse\" className=\"bg-white dark:bg-[#18181f] text-gray-900 dark:text-white font-medium\">In Bangladesh Warehouse</option>\n" +
"                          <option value=\"Delivered\" className=\"bg-white dark:bg-[#18181f] text-gray-900 dark:text-white font-medium\">Delivered</option>\n" +
"                        </select>\n" +
"                      </td>";

code = code.replace(oldStatus, newStatus);


// 3. Resizable Table Headers
const thRegex = /<th className="(.*?)">(.*?)<\/th>/g;
code = code.replace(thRegex, (match, classes, innerHtml) => {
  if (innerHtml.includes('input type="checkbox"')) {
    return match;
  }
  const thClasses = classes.replace('p-3', 'p-0').replace('whitespace-nowrap', '');
  return "<th className=\"" + thClasses + "\">\n" +
"                    <div style={{ resize: 'horizontal', overflow: 'hidden' }} className=\"p-3 whitespace-nowrap min-w-[max-content] w-auto inline-block\">\n" +
"                      " + innerHtml + "\n" +
"                    </div>\n" +
"                  </th>";
});


// 4. Emphasize Invoice Button
// The old invoice button actually has a few different shapes based on whether items are selected or not.
const oldPdfButtonRegex = /<button[^>]*onClick={\(\) => setShowInvoiceModal\(true\)}[^>]*>[\s\S]*?<\/button>/;
const newPdfButton = "<button \n" +
"              onClick={() => setShowInvoiceModal(true)} \n" +
"              disabled={selectedIds.length === 0}\n" +
"              className={`px-6 py-2.5 rounded-lg text-sm font-black tracking-wide flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95 ${selectedIds.length > 0 ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-xl shadow-emerald-500/30 border-none animate-pulse hover:animate-none' : 'bg-slate-100 dark:bg-[#121217] border border-gray-200 dark:border-[#27272a] text-gray-500 cursor-not-allowed shadow-none transform-none'}`}\n" +
"            >\n" +
"              <FileDown className=\"w-5 h-5\" /> GENERATE INVOICE\n" +
"            </button>";

code = code.replace(oldPdfButtonRegex, newPdfButton);

fs.writeFileSync('src/app/Dashboard.tsx', code);
console.log('Features updated');
