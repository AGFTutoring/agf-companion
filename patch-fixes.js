/**
 * Fix "on this" stripping in displayed content + strengthen ORGANIC tag usage
 * cd C:\Users\alast\Downloads\agf-companion
 * node patch-fixes.js
 */
const fs = require('fs');
const f = 'app/page.js';
let c = fs.readFileSync(f, 'utf8');
let steps = 0;

// FIX 1: Strip "on this" from displayed content (not just PDF)
const old1 = "const cleanContent = actionLine ? m.content.replace(actionLine[0], '').trimEnd() : m.content;";
const new1 = "const cleanContent = (actionLine ? m.content.replace(actionLine[0], '') : m.content).replace(/\\n*on this\\s*$/gm,'').replace(/^on this\\s*$/gm,'').trimEnd();";

if (c.includes(old1)) {
  c = c.replace(old1, new1);
  steps++;
  console.log('Done: fixed "on this" stripping in displayed content');
} else {
  console.log('Could not find cleanContent line');
}

// FIX 2: Strengthen ORGANIC tag instruction in system prompt
// Make it clearer WHEN to use it
const oldOrganic = 'When showing structural formulae with carbon numbering for IUPAC naming, use [ORGANIC:...] tag. Show the chain with vertical bonds for substituents and carbon numbers below. Use \\\\n for line breaks inside the tag.';
const newOrganic = 'When discussing IUPAC naming, ALWAYS use [ORGANIC:...] to show the numbered carbon chain. Format example:\\n[ORGANIC:     Cl\\\\n     |\\\\nCH3-CH2-CH=CH-CH-CH2F\\\\n 6    5    4   3   2   1\\\\n\\\\nRight-to-left: Cl at C2, F at C1]\\nThis is MANDATORY for any naming question — students need to SEE the numbered structure.';

if (c.includes(oldOrganic)) {
  c = c.replace(oldOrganic, newOrganic);
  steps++;
  console.log('Done: strengthened ORGANIC tag instruction with example');
} else {
  console.log('Could not find ORGANIC instruction');
}

fs.writeFileSync(f, c);
console.log('\\n' + steps + ' fixes applied');
console.log('git add . && git commit -m "Fix on this + strengthen ORGANIC tag" && git push');
