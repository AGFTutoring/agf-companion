/**
 * Fix alphabetical ordering emphasis + ORGANIC tag usage
 * cd C:\Users\alast\Downloads\agf-companion
 * node patch-alpha.js
 */
const fs = require('fs');
const f = 'app/page.js';
let c = fs.readFileSync(f, 'utf8');
let steps = 0;

// FIX 1: Add CRITICAL alphabetical ordering reminder to the self-check
const oldSelfCheck = 'Never give a name without checking both directions.';
if (c.includes(oldSelfCheck)) {
  c = c.replace(oldSelfCheck, 
    'Never give a name without checking both directions.\\n' +
    'FINAL NAME ASSEMBLY: substituents MUST appear in ALPHABETICAL order. ' +
    'bromo before chloro, chloro before fluoro, ethyl before methyl. ' +
    'Example: 2-chloro-1-fluorohex-3-ene (chloro before fluoro). ' +
    'NEVER write 1-fluoro-2-chloro — that violates alphabetical order.');
  steps++;
  console.log('Done: added alphabetical ordering emphasis');
}

// FIX 2: Fix the worked example to emphasize alphabetical final name
const oldWorked = 'Correct: 2-chloro-1-fluorohex-3-ene';
if (c.includes(oldWorked)) {
  c = c.replace(oldWorked, 
    'Correct: 2-chloro-1-fluorohex-3-ene (chloro before fluoro ALPHABETICALLY in the name)');
  steps++;
  console.log('Done: emphasized alphabetical order in worked example');
}

// FIX 3: Strengthen ORGANIC instruction — find it by unique substring
const orgSearch = 'ORGANIC:...] tag';
const orgIdx = c.indexOf(orgSearch);
if (orgIdx !== -1) {
  // Find the full rule line containing this
  const lineStart = c.lastIndexOf('- When', orgIdx);
  const lineEnd = c.indexOf('\\n', orgIdx + 10);
  if (lineStart !== -1 && lineEnd !== -1) {
    const oldLine = c.substring(lineStart, lineEnd);
    const newLine = '- When discussing IUPAC naming, ALWAYS use [ORGANIC:...] tag to show the numbered carbon chain. This is MANDATORY for naming questions. Format:\\n[ORGANIC:     Cl\\\\n     |\\\\nCH3-CH2-CH=CH-CH-CH2F\\\\n 6    5    4   3   2   1]';
    c = c.substring(0, lineStart) + newLine + c.substring(lineEnd);
    steps++;
    console.log('Done: strengthened ORGANIC tag instruction');
  }
}

fs.writeFileSync(f, c);
console.log('\\n' + steps + ' fixes applied');
console.log('git add . && git commit -m "Fix alphabetical ordering + ORGANIC" && git push');
