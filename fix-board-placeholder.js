// fix-board-placeholder.js
// Fixes: chat input placeholder (and "Try Asking" prompts where curated)
// showing the wrong exam system for any board overlay NOT already in
// STANDALONE_UI (e.g. GCSE, IB, AQA, OCR, WJEC, CCEA, Edexcel UK,
// OxfordAQA, Cambridge International, AP Physics 1/2, standalone SAT/ACT Math).
//
// Root cause: currentUnit only overrides placeholder/prompts via
// ...(STANDALONE_UI[boardOverride]||{}) — a 17-board allowlist — so the
// other 33 boards silently keep the base Edexcel IAL unit's placeholder.
//
// Fix: inject a sensible default placeholder (built from the board's own
// name) for EVERY board overlay, before the STANDALONE_UI spread, so the
// 17 already-curated boards still win (object spread order), and the other
// 33 get a correct placeholder instead of the wrong one.
//
// Usage: place this file in your project root (same folder as app/) and run:
//   node fix-board-placeholder.js

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app', 'page.js');
let content = fs.readFileSync(filePath, 'utf8');

const oldStr = 'const currentUnit=baseUnit&&boardOverride&&BOARD_CONTEXT[boardOverride]?{...baseUnit,name:BOARD_CONTEXT[boardOverride].name,code:BOARD_CONTEXT[boardOverride].code,...(STANDALONE_UI[boardOverride]||{}),system:';

const newStr = 'const currentUnit=baseUnit&&boardOverride&&BOARD_CONTEXT[boardOverride]?{...baseUnit,name:BOARD_CONTEXT[boardOverride].name,code:BOARD_CONTEXT[boardOverride].code,placeholder:`Ask about ${BOARD_CONTEXT[boardOverride].name}...`,...(STANDALONE_UI[boardOverride]||{}),system:';

const occurrences = content.split(oldStr).length - 1;

if (occurrences === 0) {
  console.error('ERROR: Could not find the expected currentUnit code. The file may have changed since this patch was written. No changes made.');
  process.exit(1);
}

if (occurrences > 1) {
  console.error(`ERROR: Found ${occurrences} matches, expected exactly 1. Refusing to patch ambiguously. No changes made.`);
  process.exit(1);
}

content = content.replace(oldStr, newStr);

fs.writeFileSync(filePath, content, 'utf8');

console.log('Patched successfully: every board overlay now gets a correct default placeholder ("Ask about <Board Name>...") unless STANDALONE_UI already curates one.');
console.log('Next steps: npm run dev, click through a few non-IAL boards (e.g. GCSE Maths Higher, AQA Chemistry, IB Physics SL) and confirm the input placeholder now matches the selected board, then commit & push.');
