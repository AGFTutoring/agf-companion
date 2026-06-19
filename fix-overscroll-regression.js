// fix-overscroll-regression.js
// The previous fix (fix-white-background.js) added minHeight:'100vh' to
// body to stop white showing below short conversations. Side effect: if
// the chat auto-scrolls to the bottom of the page on load, it now scrolls
// to the bottom of an artificially-tall body instead of the bottom of the
// actual content, leaving a gap below the input bar (what you just saw).
//
// Fix: move the background colour to <html> instead, which paints the full
// viewport regardless of content height, and remove minHeight from body so
// it goes back to being exactly as tall as its actual content -- which
// should fix the auto-scroll overshoot.
//
// This assumes fix-white-background.js already ran on this file. If you
// see 'anchor not found' below, paste the current layout.js content back
// to me and I'll adjust.
//
// Usage: place this file in your project root and run:
//   node fix-overscroll-regression.js

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app', 'layout.js');
let raw = fs.readFileSync(filePath, 'utf8');
const usesCRLF = raw.includes('\r\n');
let content = usesCRLF ? raw.replace(/\r\n/g, '\n') : raw;

const edits = [
  { label: 'add background to html, remove minHeight from body', old: "<body style={{ margin: 0, padding: 0, backgroundColor: \"#1a1a1a\", minHeight: \"100vh\" }}>", new: "<body style={{ margin: 0, padding: 0, backgroundColor: \"#1a1a1a\" }}>" },
  { label: 'add background-color to html element', old: "<html lang=\"en\">", new: "<html lang=\"en\" style={{ backgroundColor: \"#1a1a1a\" }}>" },
];

let appliedCount = 0;
const errors = [];

for (const edit of edits) {
  const occurrences = content.split(edit.old).length - 1;
  if (occurrences === 0) {
    errors.push(edit.label);
    console.error(`FAILED: ${edit.label} \u2014 anchor not found. Either already patched, or fix-white-background.js wasn't run on this file yet.`);
    continue;
  }
  if (occurrences > 1) {
    errors.push(edit.label);
    console.error(`FAILED: ${edit.label} \u2014 found ${occurrences} matches, expected 1.`);
    continue;
  }
  content = content.replace(edit.old, () => edit.new);
  appliedCount++;
  console.log(`OK: ${edit.label}`);
}

if (errors.length > 0) {
  console.error(`\n${errors.length} edit(s) failed -- review before committing.`);
} else {
  console.log('\nAll edits applied successfully.');
}

const output = usesCRLF ? content.replace(/\n/g, '\r\n') : content;
fs.writeFileSync(filePath, output, 'utf8');
console.log('\nNext steps: npm run dev, check the white background is still gone AND the auto-scroll-overshoot/gap is gone too. Then commit & push (this will be the first time this background fix reaches production).');