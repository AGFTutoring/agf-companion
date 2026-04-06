// fix-board-focus.js — Replace stripped constraints with board-appropriate focus instruction
// Run: node fix-board-focus.js
// From: C:\Users\alast\Downloads\agf-companion

const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, 'app', 'page.js');
let src = fs.readFileSync(FILE, 'utf8');
const original = src;

console.log('\nFix board focus constraint\n');

const oldLine = 'const currentUnit=baseUnit&&boardOverride&&BOARD_CONTEXT[boardOverride]?{...baseUnit,name:BOARD_CONTEXT[boardOverride].name,code:BOARD_CONTEXT[boardOverride].code,system:BOARD_CONTEXT[boardOverride].prefix+"\\n\\n"+baseUnit.system.replace(/Only answer W[A-Z]+\\d+.*?\\./g,"").replace(/Use diagram tags[^.]*\\./g,"").replace(/Use \\[EQUATION[^.]*\\./g,"")}:baseUnit;';

const newLine = 'const currentUnit=baseUnit&&boardOverride&&BOARD_CONTEXT[boardOverride]?{...baseUnit,name:BOARD_CONTEXT[boardOverride].name,code:BOARD_CONTEXT[boardOverride].code,system:BOARD_CONTEXT[boardOverride].prefix+"\\n\\n"+baseUnit.system.replace(/Only answer W[A-Z]+\\d+[^.]*\\.[^`]*/g,"")+"\\n\\nOnly answer "+BOARD_CONTEXT[boardOverride].name+" content. Stay focused on the student\\u2019s question. Use [EQUATION:...] tags for key formulae. Show all working step by step."}:baseUnit;';

if (src.includes(oldLine)) {
  src = src.replace(oldLine, newLine);
  fs.writeFileSync(FILE, src, 'utf8');
  console.log('  OK: Fixed — board context now replaces constraint with focused instruction');
  console.log('\nnpm run dev');
  console.log('Test: AP Chemistry > "What is Ka?" > should explain Ka concisely, no electrophilic addition');
  console.log('git add .');
  console.log('git commit -m "Fix board context: replace constraint with board-focused instruction"');
  console.log('git push');
  console.log('del fix-board-focus.js');
} else {
  console.log('  FAIL: Could not find assembly line');
}
