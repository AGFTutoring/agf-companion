// fix-retired-model.js
// URGENT: Anthropic retired claude-sonnet-4-20250514 on June 15, 2026.
// Every chat/quiz/notes request has been failing since then -- this is
// why you saw a raw error banner instead of a response. This updates
// the hardcoded model string in the API route to the current model.
//
// Usage: place this file in your project root and run:
//   node fix-retired-model.js

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app', 'api', 'chat', 'route.js');
let raw = fs.readFileSync(filePath, 'utf8');
const usesCRLF = raw.includes('\r\n');
let content = usesCRLF ? raw.replace(/\r\n/g, '\n') : raw;

const oldStr = 'model: "claude-sonnet-4-20250514",';
const newStr = 'model: "claude-sonnet-4-6",';

const occurrences = content.split(oldStr).length - 1;

if (occurrences === 0) {
  console.error('ERROR: Could not find the expected model string in app/api/chat/route.js. The file may have changed. No changes made.');
  process.exit(1);
}
if (occurrences > 1) {
  console.error(`ERROR: Found ${occurrences} matches, expected exactly 1. Refusing to patch ambiguously.`);
  process.exit(1);
}

content = content.replace(oldStr, newStr);

const output = usesCRLF ? content.replace(/\n/g, '\r\n') : content;
fs.writeFileSync(filePath, output, 'utf8');

console.log('Patched successfully: model updated from the retired claude-sonnet-4-20250514 to claude-sonnet-4-6.');
console.log('Next steps: npm run dev, ask any question in any subject, confirm you get an actual answer (not an error banner), then commit & push IMMEDIATELY -- this is live-breaking for every paying user until deployed.');
