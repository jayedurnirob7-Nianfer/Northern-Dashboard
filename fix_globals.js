const fs = require('fs');

let css = fs.readFileSync('src/app/globals.css', 'utf8');

// Add custom-variant
if (!css.includes('@custom-variant dark')) {
  css = css.replace('@import "tailwindcss";', '@import "tailwindcss";\n@custom-variant dark (&:where(.dark, .dark *));');
}

// Replace media query with .dark class
const mediaRegex = /@media\s*\(prefers-color-scheme:\s*dark\)\s*\{\s*:root\s*\{([^}]+)\}\s*\}/g;
css = css.replace(mediaRegex, '.dark {\n$1\n}');

fs.writeFileSync('src/app/globals.css', css);
console.log('Fixed globals.css for Tailwind v4 dark mode');
