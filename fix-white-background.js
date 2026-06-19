// fix-white-background.js
// body had no background-color set at all, so the browser's default white
// was showing through below the app's dark content whenever it didn't
// perfectly fill the viewport height. Sets body to the same charcoal
// (#1a1a1a) used throughout the rest of the app, plus min-height:100vh so
// it always covers the full viewport even on short conversations.
//
// Usage: place this file in your project root and run:
//   node fix-white-background.js

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app', 'layout.js');
let raw = fs.readFileSync(filePath, 'utf8');
const usesCRLF = raw.includes('\r\n');
let content = usesCRLF ? raw.replace(/\r\n/g, '\n') : raw;

const oldStr = "<body style={{ margin: 0, padding: 0 }}>";
const newStr = "<body style={{ margin: 0, padding: 0, backgroundColor: \"#1a1a1a\", minHeight: \"100vh\" }}>";

const occurrences = content.split(oldStr).length - 1;
if (occurrences === 0) {
  console.error('ERROR: anchor not found. File may have changed. No changes made.');
  process.exit(1);
}
if (occurrences > 1) {
  console.error(`ERROR: found ${occurrences} matches, expected 1. Refusing to patch ambiguously.`);
  process.exit(1);
}

content = content.replace(oldStr, () => newStr);
const output = usesCRLF ? content.replace(/\n/g, '\r\n') : content;
fs.writeFileSync(filePath, output, 'utf8');

console.log('Patched successfully: body background set to #1a1a1a.');
console.log('Next steps: npm run dev, scroll a short conversation to the bottom and confirm no white shows below the dark content, then commit & push.');