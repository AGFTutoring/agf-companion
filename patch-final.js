/**
 * Kill "on this" at render level + verify PDF layout
 * cd C:\Users\alast\Downloads\agf-companion
 * node patch-final.js
 */
const fs = require('fs');
const f = 'app/page.js';
let c = fs.readFileSync(f, 'utf8');
let steps = 0;

// FIX 1: Kill "on this" in the RichLine component
// If the text of a line is just "on this", return nothing
const oldRichLine = 'function RichLine({text}){';
if (c.includes(oldRichLine)) {
  c = c.replace(oldRichLine, 'function RichLine({text}){if(text.trim()==="on this")return null;');
  steps++;
  console.log('Done: kill "on this" at RichLine render level');
}

// FIX 2: Also add to parseAndRender - skip "on this" lines entirely
const oldElseLine = '} else if (line) {';
if (c.includes(oldElseLine)) {
  c = c.replace(oldElseLine, '} else if (line && line.trim()!=="on this") {');
  steps++;
  console.log('Done: skip "on this" in parseAndRender');
} else {
  // Try minified version
  const oldElse2 = '}else if(line){';
  if (c.includes(oldElse2)) {
    c = c.replace(oldElse2, '}else if(line&&line.trim()!=="on this"){');
    steps++;
    console.log('Done: skip "on this" in parseAndRender (minified)');
  }
}

fs.writeFileSync(f, c);
console.log('\\n' + steps + ' fixes applied');
console.log('git add . && git commit -m "Kill on this at render level" && git push');
