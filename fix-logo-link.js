/**
 * fix-logo-link.js
 * Wraps the nav logo in a link to agftutoring.co.uk
 * Run: node fix-logo-link.js
 */
const fs = require("fs");
const path = require("path");
const FILE = path.join(__dirname, "app", "page.js");

let src = fs.readFileSync(FILE, "utf8");
console.log("Read page.js: " + src.length + " chars");

// Find the logo div that needs wrapping
var target = '<div style={{display:"flex",alignItems:"center",gap:12}}><svg width="22" height="26"';
var idx = src.indexOf(target);

if (idx === -1) {
  console.error("FATAL: Could not find logo div");
  process.exit(1);
}

// Replace the opening <div with an <a> link
var oldOpen = '<div style={{display:"flex",alignItems:"center",gap:12}}>';
var newOpen = '<a href="https://agftutoring.co.uk" target="_blank" rel="noopener" style={{display:"flex",alignItems:"center",gap:12,textDecoration:"none",color:C.text}}>';

// Find the closing </div> for this logo block - it's after TUTORING</div></div>
// The structure is: <div gap:12><svg.../><div><div>AGF</div><div>TUTORING</div></div></div>
// We need to find the correct closing </div>
var searchFrom = idx;
var closingTarget = 'TUTORING</div></div></div>';
var closingIdx = src.indexOf(closingTarget, searchFrom);

if (closingIdx === -1) {
  console.error("FATAL: Could not find logo closing divs");
  process.exit(1);
}

// The last </div> in that sequence is the one we want to change to </a>
// Replace: TUTORING</div></div></div> with TUTORING</div></div></a>
var oldClosing = 'TUTORING</div></div></div>';
var newClosing = 'TUTORING</div></div></a>';

// Do both replacements (only first occurrence)
src = src.substring(0, idx) + newOpen + src.substring(idx + oldOpen.length);

// Re-find closing after the replacement (offsets shifted)
var closingIdx2 = src.indexOf(oldClosing, idx);
if (closingIdx2 !== -1) {
  src = src.substring(0, closingIdx2) + newClosing + src.substring(closingIdx2 + oldClosing.length);
  console.log("Wrapped logo in link");
} else {
  console.log("WARNING: Could not find closing to replace");
}

fs.writeFileSync(FILE, src, "utf8");
console.log("SUCCESS! Logo now links to agftutoring.co.uk");
console.log("Next: npm run dev, then git add/commit/push");
