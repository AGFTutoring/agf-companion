// fix-board-override.js — Fix board context to properly override "Only answer WCH/WPH" constraints
// Run: node fix-board-override.js
// From: C:\Users\alast\Downloads\agf-companion

const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, 'app', 'page.js');
let src = fs.readFileSync(FILE, 'utf8');
const original = src;
let count = 0;

function patch(label, marker, replacement) {
  if (src.includes(marker)) {
    src = src.replace(marker, replacement);
    console.log("  OK: " + label);
    count++;
  } else {
    console.log("  FAIL: " + label);
  }
}

console.log('\nFix board context override\n');

// 1. Fix the currentUnit assembly to strip "Only answer W..." lines when board context is active
patch('Fix currentUnit assembly to strip unit-specific constraints',
  'const currentUnit=baseUnit&&boardOverride&&BOARD_CONTEXT[boardOverride]?{...baseUnit,name:BOARD_CONTEXT[boardOverride].name,code:BOARD_CONTEXT[boardOverride].code,system:BOARD_CONTEXT[boardOverride].prefix+"\\n\\n"+baseUnit.system}:baseUnit;',
  'const currentUnit=baseUnit&&boardOverride&&BOARD_CONTEXT[boardOverride]?{...baseUnit,name:BOARD_CONTEXT[boardOverride].name,code:BOARD_CONTEXT[boardOverride].code,system:BOARD_CONTEXT[boardOverride].prefix+"\\n\\n"+baseUnit.system.replace(/Only answer W[A-Z]+\\d+.*?\\./g,"").replace(/Use diagram tags[^.]*\\./g,"").replace(/Use \\[EQUATION[^.]*\\./g,"")}:baseUnit;'
);

// 2. Fix the duplicated "Only answer" lines (bonus cleanup)
patch('Dedupe chem2 trailing constraint',
  'Only answer WCH12 content. Use diagram tags where relevant.Only answer WCH12 content. Use diagram tags where relevant.Only answer WCH12 content. Use diagram tags where relevant.',
  'Only answer WCH12 content. Use diagram tags where relevant.');

patch('Dedupe phys1 trailing constraint',
  'Only answer WPH11 content. Use [EQUATION:...] tags for key formulae.Only answer WPH11 content. Use [EQUATION:...] tags for key formulae.Only answer WPH11 content. Use [EQUATION:...] tags for key formulae.',
  'Only answer WPH11 content. Use [EQUATION:...] tags for key formulae.');

patch('Dedupe phys2 trailing constraint',
  'Only answer WPH12 content. Use [EQUATION:...] tags for key formulae.Only answer WPH12 content. Use [EQUATION:...] tags for key formulae.Only answer WPH12 content. Use [EQUATION:...] tags for key formulae.',
  'Only answer WPH12 content. Use [EQUATION:...] tags for key formulae.');

if (src !== original) {
  fs.writeFileSync(FILE, src, 'utf8');
  console.log('\nDone: ' + count + ' patches applied.');
  console.log('\nnpm run dev');
  console.log('Test: AP Chemistry > ask "What is Ka?" > should explain Ka fully, no WCH12 references');
  console.log('Test: Edexcel IAL WCH12 > ask "What is Ka?" > should correctly say it\'s not in WCH12');
  console.log('git add .');
  console.log('git commit -m "Fix board context: strip unit constraints for non-IAL boards, dedupe trailing lines"');
  console.log('git push');
  console.log('del fix-board-override.js');
} else {
  console.log('\nNo changes made.');
}
