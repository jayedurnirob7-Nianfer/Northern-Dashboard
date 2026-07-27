const fs = require('fs');

let html = fs.readFileSync('public/invoice/index.html', 'utf8');

const targetStr = `var savedUrl = lsGet(LS.URL) || DEFAULT_SHEET_URL;
            if (savedUrl) {
              var suEl = g("sheet-url");
              if (suEl) suEl.value = savedUrl;
              var sbEl = g("saved-badge");
              if (sbEl) sbEl.classList.add("show");
              setStatus("y", "Auto-loading...");
              loadSheetSilent(savedUrl);
            }`;

const newStr = `
            // Replaced auto-load logic to always load from API
            loadSheet();
`;

html = html.replace(targetStr, newStr);

fs.writeFileSync('public/invoice/index.html', html);
console.log('Fixed boot logic to use loadSheet');
