/**
 * Nuclear: strip "on this" via string replace + style PDF button
 * cd C:\Users\alast\Downloads\agf-companion
 * node patch-nuclear.js
 */
const fs = require('fs');
const f = 'app/page.js';
let c = fs.readFileSync(f, 'utf8');
let steps = 0;

// FIX 1: Replace the complex regex approach with simple string operations
const oldClean = "const cleanContent = (actionLine ? m.content.replace(actionLine[0], '') : m.content).replace(/\\n*on this\\s*$/gm,'').replace(/^on this\\s*$/gm,'').replace(/on this\\s*$/,'').replace(/\\non this\\n/g,'\\n').trimEnd();";

if (c.includes(oldClean)) {
  // Simple approach: strip the action line, then strip any line that is just "on this"
  const newClean = "const cleanContent = (actionLine ? m.content.replace(actionLine[0], '') : m.content).split('\\n').filter(line=>line.trim()!=='on this').join('\\n').trimEnd();";
  c = c.replace(oldClean, newClean);
  steps++;
  console.log('Done: nuclear on this fix (filter lines)');
} else {
  console.log('Could not find cleanContent - checking...');
  const idx = c.indexOf('cleanContent');
  if (idx !== -1) console.log('Found at ' + idx + ': ' + c.substring(idx, idx + 250));
}

// FIX 2: Make PDF download button more prominent
const oldPdfBtn = "Download as PDF";
if (c.includes(oldPdfBtn)) {
  c = c.replace(oldPdfBtn, "Save as PDF");
  steps++;
  console.log('Done: renamed to Save as PDF');
}

// Also style the button more prominently
const oldPdfStyle = 'padding:"6px 14px",borderRadius:20,border:"1px solid "+C.border,background:"transparent"';
if (c.includes(oldPdfStyle)) {
  c = c.replace(oldPdfStyle, 'padding:"8px 18px",borderRadius:8,border:"1px solid "+C.greenBorder,background:C.greenDim');
  steps++;
  console.log('Done: styled PDF button more prominently');
}

fs.writeFileSync(f, c);
console.log('\\n' + steps + ' fixes applied');
console.log('git add . && git commit -m "Fix on this + style PDF button" && git push');
