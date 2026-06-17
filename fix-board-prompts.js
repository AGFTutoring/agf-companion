// fix-board-prompts.js
// Fixes: the 4 "Try Asking" suggestion prompts shown under the welcome
// message still come from the base Edexcel IAL unit for any board NOT
// in STANDALONE_UI (e.g. GCSE Foundation showing "differentiate from
// first principles" and "integration" — neither is a Foundation topic).
//
// Same root cause as the placeholder fix: only STANDALONE_UI's 17 boards
// get curated prompts. This adds a sensible default (board-name-aware,
// not topic-specific, so it can never be syllabus-wrong) for every board,
// while leaving the 17 already-curated boards untouched (object spread
// order: STANDALONE_UI still wins where it exists).
//
// Requires fix-board-placeholder.js to have been run first.
//
// Usage: place this file in your project root and run:
//   node fix-board-prompts.js

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app', 'page.js');
let content = fs.readFileSync(filePath, 'utf8');

const oldStr = "placeholder:`Ask about ${BOARD_CONTEXT[boardOverride].name}...`,...(STANDALONE_UI[boardOverride]||{}),system:";

const newStr = "placeholder:`Ask about ${BOARD_CONTEXT[boardOverride].name}...`,prompts:[`Quiz me on a key ${BOARD_CONTEXT[boardOverride].name} topic`,`Explain a core ${BOARD_CONTEXT[boardOverride].name} concept`,`What's a common mistake to avoid in ${BOARD_CONTEXT[boardOverride].name}?`,`Give me a worked example for ${BOARD_CONTEXT[boardOverride].name}`],...(STANDALONE_UI[boardOverride]||{}),system:";

const occurrences = content.split(oldStr).length - 1;

if (occurrences === 0) {
  console.error('ERROR: Could not find the expected code (did fix-board-placeholder.js run successfully first?). No changes made.');
  process.exit(1);
}

if (occurrences > 1) {
  console.error(`ERROR: Found ${occurrences} matches, expected exactly 1. Refusing to patch ambiguously. No changes made.`);
  process.exit(1);
}

content = content.replace(oldStr, newStr);

fs.writeFileSync(filePath, content, 'utf8');

console.log('Patched successfully: every board overlay now gets generic but board-correct "Try Asking" prompts unless STANDALONE_UI already curates specific ones.');
console.log('Next steps: npm run dev, check GCSE Maths Foundation again — the 4 suggestions should now be generic-but-correct rather than calculus topics, then commit & push.');
