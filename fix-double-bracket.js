// fix-double-bracket.js — Fix ];]; syntax error
// Run: node fix-double-bracket.js

const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, 'app', 'page.js');
let src = fs.readFileSync(FILE, 'utf8');

if (src.includes('];];')) {
  src = src.replace('];];', '];');
  fs.writeFileSync(FILE, src, 'utf8');
  console.log('OK: Fixed ];]; -> ];');
} else {
  console.log('Not found — already fixed or different issue.');
}
