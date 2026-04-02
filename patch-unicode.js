/**
 * AGF Companion — Fix Unicode escapes in shape SVG labels
 * Replaces literal \u2014 (em dash) and \u00B0 (degree) with actual characters
 * 
 * cd C:\Users\alast\Downloads\agf-companion
 * node patch-unicode.js
 */

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, 'app', 'page.js');
let code = fs.readFileSync(FILE, 'utf8');

const before = code;

// Replace all literal \u2014 with actual em dash
code = code.split('\\u2014').join('\u2014');

// Replace all literal \u00B0 with actual degree symbol
code = code.split('\\u00B0').join('\u00B0');

const changes = (before.match(/\\u2014/g) || []).length + (before.match(/\\u00B0/g) || []).length;

fs.writeFileSync(FILE, code, 'utf8');
console.log(`Done: replaced ${changes} Unicode escape sequences with actual characters`);
console.log('git add .');
console.log('git commit -m "Fix Unicode escapes in shape labels"');
console.log('git push');
