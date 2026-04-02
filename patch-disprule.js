/**
 * Add DISPLAYED tag rule to the Rules section
 * cd C:\Users\alast\Downloads\agf-companion
 * node patch-disprule.js
 */
const fs = require('fs');
const f = 'app/page.js';
let c = fs.readFileSync(f, 'utf8');

const oldRule = 'You can change the formula/angle in shape tags';
const newRule = 'You can change the formula/angle in shape tags\\n- When naming organic compounds or discussing IUPAC naming, you MUST include a [DISPLAYED:...] tag showing the numbered structure. Use the format [DISPLAYED:chainLength:doubleBondPos:substituents:direction:name]. For example, for 2-chloro-1-fluorohex-3-ene use [DISPLAYED:6:3:Cl@2,F@1:rtl:2-chloro-1-fluorohex-3-ene]. Always include this BEFORE your written explanation. chainLength=number of C in parent chain, doubleBondPos=C=C position or 0, substituents=comma-separated Group@CarbonNumber, direction=ltr or rtl';

if (c.includes(oldRule)) {
  c = c.replace(oldRule, newRule);
  fs.writeFileSync(f, c);
  console.log('Done: added DISPLAYED rule to Rules section');
} else {
  console.log('Could not find target rule');
}
