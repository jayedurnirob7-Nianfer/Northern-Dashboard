const fs = require('fs');

let html = fs.readFileSync('public/invoice/index.html', 'utf8');

// 1. Remove the Sheet URL input box entirely and change Load Sheet to Load Data
html = html.replace(/<div class="dr">\s*<input\s*type="text"\s*id="sheet-url"[\s\S]*?<\/div>/g, '');
html = html.replace(/<button class="btn-gold" id="btn-load">Load Sheet<\/button>/g, '<button class="btn-gold" id="btn-load">Load Data</button>');

// 2. Replace loadSheet function
const newLoadSheet = `
        async function loadSheet() {
          var btn = document.getElementById("btn-load");
          if (btn) {
            btn.disabled = true;
            btn.textContent = "Loading...";
          }
          setProgress(10);
          setStatus("y", "Connecting...");
          try {
            setProgress(30);
            setStatus("y", "Fetching data...");
            var r = await fetch('/api/shipments');
            var data = await r.json();
            
            setProgress(90);
            
            // Map MongoDB fields to the format the invoice generator expects
            rows = data.data.map(function(item) {
              return {
                "Name": item.customerName || "",
                "Address": item.address || "",
                "Mobile": item.mobile || "",
                "Shipping Mark": item.shippingMark || "",
                "Shipping Number": item.shippingNumber || "",
                "Tracking Number": item.trackingNumber || "",
                "Product Name": item.productName || "",
                "Quantity": item.quantity || "",
                "Weight": item.weight || 0,
                "Rate": item.rate || 0,
                "Total": item.clientBill || 0,
                "Date": item.date || "",
                "Status": item.status || "Pending"
              };
            });
            
            // Setting up colMap to be explicit, as detectColMap relies on hdrs
            colMap = {
              "Name": "Name",
              "Address": "Address",
              "Mobile": "Mobile",
              "Date": "Date",
              "Weight": "Weight",
              "Rate": "Rate",
              "Total": "Total",
              "Tracking": "Tracking Number",
              "Shipping": "Shipping Number",
              "Mark": "Shipping Mark",
              "Product": "Product Name",
              "Quantity": "Quantity"
            };
            
            renderTable();
            setProgress(100);
            setStatus("g", "Connected - " + rows.length + " rows");
            
            var lbl = document.getElementById("row-count-lbl");
            if(lbl) lbl.textContent = rows.length + " rows loaded";
            
            var badge = document.getElementById("saved-badge");
            if(badge) badge.classList.add("show");
            
            toast("Loaded " + rows.length + " rows");
          } catch (e) {
            console.error("loadSheet error:", e);
            setStatus("r", "Error");
            setProgress(0);
            toast("Failed: " + e.message, 8000);
          } finally {
            if (btn) {
              btn.disabled = false;
              btn.textContent = "Load Data";
            }
          }
        }
`;

html = html.replace(/\/\* -- LOAD SHEET -- \*\/[\s\S]*?async function loadSheetSilent\(raw\) \{/g, '/* -- LOAD SHEET -- */\n' + newLoadSheet + '\n        async function loadSheetSilent(raw) {');

// 3. Optional: we can also remove the "Auto-load on startup" call since we just fetch directly
html = html.replace(/var savedUrl = lsGet\(LS\.URL\);[\s\S]*?loadSheetSilent\(savedUrl\);[\s\S]*?\}/g, 'loadSheet(); }');

fs.writeFileSync('public/invoice/index.html', html);
console.log('Successfully patched index.html');
