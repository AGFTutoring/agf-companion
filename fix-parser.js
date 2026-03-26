// Run with: node fix-parser.js
// From: C:\Users\alast\Downloads\agf-companion
// Requires: new-parser.txt in same directory

const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, 'app', 'page.js');
const parserPath = path.join(__dirname, 'new-parser.txt');

if (!fs.existsSync(parserPath)) {
  console.log('✗ new-parser.txt not found! Put it in the agf-companion folder.');
  process.exit(1);
}

let code = fs.readFileSync(pagePath, 'utf8');
const newParser = fs.readFileSync(parserPath, 'utf8');

// Find the old parser: starts with "function parseAndRender"
// and ends just before "/* ═══" (the MAIN COMPONENT section)
const startMarker = '/* ═══ PARSER ═══ */\n';
const endMarker = '\n/* ═══════════════════════════════════════════════════\n   MAIN COMPONENT';

const startIdx = code.indexOf(startMarker);
const endIdx = code.indexOf(endMarker);

if (startIdx === -1) {
  console.log('✗ Could not find parser start marker');
  process.exit(1);
}
if (endIdx === -1) {
  console.log('✗ Could not find main component marker');
  process.exit(1);
}

const before = code.slice(0, startIdx);
const after = code.slice(endIdx);

code = before + '/* ═══ PARSER ═══ */\n' + newParser + after;

fs.writeFileSync(pagePath, code);
console.log('✅ Parser upgraded!');
console.log('  - Section headers now have green left borders');
console.log('  - [EQUATION:...] tags render inside bullet points');
console.log('  - Inline equations work within text');
console.log('  - Better spacing and visual hierarchy');
console.log('\nDev server should auto-reload. Test at http://localhost:3000');
