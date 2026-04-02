/**
 * AGF Companion — Add bond angle notation to shape labels
 * Updates labels to match mark scheme format: Shape (X–Y–X angle)
 * 
 * cd C:\Users\alast\Downloads\agf-companion
 * node patch-labels.js
 */

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, 'app', 'page.js');
let code = fs.readFileSync(FILE, 'utf8');
let changes = 0;

const replacements = [
  ['{f} \u2014 Tetrahedral', '{f} \u2014 Tetrahedral (H\u2013C\u2013H {a||"109.5\u00B0"})'],
  ['{f} \u2014 Pyramidal', '{f} \u2014 Pyramidal (H\u2013N\u2013H {a||"107\u00B0"})'],
  ['{f} \u2014 Bent', '{f} \u2014 Bent (H\u2013O\u2013H {a||"104.5\u00B0"})'],
  ['{f} \u2014 Trigonal planar', '{f} \u2014 Trigonal planar (F\u2013B\u2013F {a||"120\u00B0"})'],
  ['{f} \u2014 Linear', '{f} \u2014 Linear (O\u2013C\u2013O {a||"180\u00B0"})'],
  ['{f} \u2014 Octahedral', '{f} \u2014 Octahedral (F\u2013S\u2013F {a||"90\u00B0"})'],
  ['{f} \u2014 Trigonal bipyramidal', '{f} \u2014 Trigonal bipyramidal ({a||"90\u00B0, 120\u00B0"})'],
  ['{f} \u2014 Square planar', '{f} \u2014 Square planar (F\u2013Xe\u2013F {a||"90\u00B0"})'],
];

for (const [old, rep] of replacements) {
  if (code.includes(old)) {
    code = code.replace(old, rep);
    changes++;
    console.log('Updated: ' + old.replace('{f} \u2014 ', ''));
  }
}

fs.writeFileSync(FILE, code, 'utf8');
console.log(`\nDone: ${changes} shape labels updated`);
