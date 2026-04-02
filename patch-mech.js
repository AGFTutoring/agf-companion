/**
 * Fix mechanism diagram rule
 * cd C:\Users\alast\Downloads\agf-companion
 * node patch-mech.js
 */
const fs = require('fs');
const f = 'app/page.js';
let c = fs.readFileSync(f, 'utf8');
const old = 'When explaining ANY mechanism, ALWAYS include [MECHANISM:...] tag';
const nu = 'When the student asks about organic reaction mechanisms (e.g. free radical substitution, electrophilic addition), include the [MECHANISM:...] tag. Do NOT include mechanism diagrams when discussing energetics, redox, equilibria, groups, or other non-mechanism topics';
if (c.includes(old)) {
  c = c.replace(old, nu);
  fs.writeFileSync(f, c);
  console.log('Done: tightened mechanism rule');
} else {
  console.log('Text not found — may already be fixed');
}
