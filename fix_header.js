const fs = require('fs');

let code = fs.readFileSync('src/app/Dashboard.tsx', 'utf8');

const startMarker = '{/* Top Header & Filters */}';
const endMarker = '{/* Table Area */}';

const startIndex = code.indexOf(startMarker);
const endIndex = code.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error('Could not find markers');
  process.exit(1);
}

const newHeader = "{/* Top Header & Filters */}\n" +
"        <div className=\"p-6 border-b border-gray-200 dark:border-[#27272a] bg-slate-100 dark:bg-[#121217] flex justify-between items-center gap-4 flex-wrap\">\n" +
"          <div className=\"flex items-center gap-4 flex-1 min-w-[200px]\">\n" +
"            <h1 className=\"text-xl font-bold text-gray-900 dark:text-white tracking-tight\">Shipment Records</h1>\n" +
"          </div>\n" +
"\n" +
"          <div className=\"flex items-center gap-3 overflow-x-auto pb-2 sm:pb-0\">\n" +
"            {['All', 'In China Warehouse', 'In Shipment', 'In Chittagong Port', 'In Bangladesh Warehouse', 'Delivered'].map(status => (\n" +
"              <button \n" +
"                key={status}\n" +
"                onClick={() => setStatusFilter(status)}\n" +
"                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${statusFilter === status ? 'bg-[#8b5cf6] text-gray-900 dark:text-white' : 'bg-white dark:bg-[#18181f] text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:text-white border border-gray-200 dark:border-[#27272a]'}`}\n" +
"              >\n" +
"                {status}\n" +
"              </button>\n" +
"            ))}\n" +
"          </div>\n" +
"\n" +
"          <div className=\"flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0\">\n" +
"            <div className=\"relative flex-1 sm:w-64\">\n" +
"              <Search className=\"w-4 h-4 absolute left-3 top-2.5 text-gray-500\" />\n" +
"              <input type=\"text\" placeholder=\"Search...\" className=\"w-full bg-white dark:bg-[#18181f] text-gray-900 dark:text-white pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-[#27272a] focus:outline-none focus:border-[#8b5cf6] text-sm\" />\n" +
"            </div>\n" +
"            <button \n" +
"              onClick={handleImport}\n" +
"              disabled={isImporting}\n" +
"              className=\"bg-gray-100 hover:bg-gray-200 dark:bg-[#27272a] dark:hover:bg-[#3f3f46] text-gray-900 dark:text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors shadow-sm whitespace-nowrap border border-gray-200 dark:border-[#3f3f46]\"\n" +
"            >\n" +
"              {isImporting ? <span className=\"animate-spin\">⏳</span> : <DownloadCloud className=\"w-4 h-4\" />}\n" +
"              {isImporting ? 'Syncing...' : 'Sync Sheet'}\n" +
"            </button>\n" +
"            <button \n" +
"              onClick={handleNewShipment}\n" +
"              className=\"bg-[#8b5cf6] hover:bg-[#a78bfa] text-gray-900 dark:text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors shadow-lg whitespace-nowrap\"\n" +
"            >\n" +
"              <Plus className=\"w-4 h-4\" /> New Shipment\n" +
"            </button>\n" +
"          </div>\n" +
"        </div>\n" +
"\n" +
"        {/* Bulk Action Bar (Always Visible) */}\n" +
"        <div className={`border-b p-3 flex items-center gap-4 px-6 transition-all ${selectedIds.length > 0 ? 'bg-[#8b5cf6]/10 border-[#8b5cf6]/20' : 'bg-white dark:bg-[#18181f] border-gray-200 dark:border-[#27272a]'}`}>\n" +
"          <button \n" +
"            onClick={() => setSelectedIds([])}\n" +
"            disabled={selectedIds.length === 0}\n" +
"            className={`text-sm font-semibold flex items-center gap-2 transition-colors ${selectedIds.length > 0 ? 'text-[#a78bfa] hover:text-[#c4b5fd]' : 'text-gray-500 cursor-not-allowed'}`}\n" +
"            title={selectedIds.length > 0 ? \"Click to clear selection\" : \"\"}\n" +
"          >\n" +
"            {selectedIds.length > 0 ? <X className=\"w-4 h-4\" /> : <CheckSquare className=\"w-4 h-4\" />} \n" +
"            {selectedIds.length} Selected\n" +
"          </button>\n" +
"          <div className=\"h-4 w-px bg-[#27272a]\"></div>\n" +
"          <div className=\"flex items-center gap-2\">\n" +
"            <select \n" +
"              onChange={(e) => handleBulkUpdateStatus(e.target.value)} \n" +
"              defaultValue=\"\" \n" +
"              disabled={selectedIds.length === 0}\n" +
"              className={`text-gray-900 dark:text-white p-1.5 rounded border text-xs font-medium ${selectedIds.length > 0 ? 'bg-white dark:bg-[#18181f] border-gray-300 dark:border-[#3f3f46] cursor-pointer' : 'bg-slate-100 dark:bg-[#121217] border-gray-200 dark:border-[#27272a] text-gray-500 cursor-not-allowed'}`}\n" +
"            >\n" +
"              <option value=\"\" disabled>Change Status...</option>\n" +
"              <option value=\"In China Warehouse\">In China Warehouse</option>\n" +
"              <option value=\"In Shipment\">In Shipment</option>\n" +
"              <option value=\"In Chittagong Port\">In Chittagong Port</option>\n" +
"              <option value=\"In Bangladesh Warehouse\">In Bangladesh Warehouse</option>\n" +
"              <option value=\"Delivered\">Delivered</option>\n" +
"            </select>\n" +
"            <button \n" +
"              onClick={handleBulkDelete}\n" +
"              disabled={selectedIds.length === 0}\n" +
"              className={`p-1.5 rounded border text-xs font-medium flex items-center gap-1 transition-colors ${selectedIds.length > 0 ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/20 cursor-pointer' : 'bg-slate-100 dark:bg-[#121217] text-gray-400 border-gray-200 dark:border-[#27272a] cursor-not-allowed'}`}\n" +
"            >\n" +
"              <Trash2 className=\"w-3.5 h-3.5\" /> Delete\n" +
"            </button>\n" +
"            <button \n" +
"              onClick={() => setShowBulkSummary(true)}\n" +
"              disabled={selectedIds.length === 0}\n" +
"              className={`p-1.5 rounded border text-xs font-medium flex items-center gap-1 transition-colors ${selectedIds.length > 0 ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20 hover:bg-blue-100 dark:hover:bg-blue-500/20 cursor-pointer' : 'bg-slate-100 dark:bg-[#121217] text-gray-400 border-gray-200 dark:border-[#27272a] cursor-not-allowed'}`}\n" +
"            >\n" +
"              <Calculator className=\"w-3.5 h-3.5\" /> Summary\n" +
"            </button>\n" +
"            <button \n" +
"              onClick={() => setShowInvoiceModal(true)}\n" +
"              disabled={selectedIds.length === 0}\n" +
"              className={`p-1.5 rounded border text-xs font-medium flex items-center gap-1 transition-colors ${selectedIds.length > 0 ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/20 hover:bg-green-100 dark:hover:bg-green-500/20 cursor-pointer' : 'bg-slate-100 dark:bg-[#121217] text-gray-400 border-gray-200 dark:border-[#27272a] cursor-not-allowed'}`}\n" +
"            >\n" +
"              <FileDown className=\"w-3.5 h-3.5\" /> Invoice\n" +
"            </button>\n" +
"          </div>\n" +
"        </div>\n\n        ";

code = code.substring(0, startIndex) + newHeader + code.substring(endIndex);

fs.writeFileSync('src/app/Dashboard.tsx', code);
console.log('Fixed header completely again');
