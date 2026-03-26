/**
 * fix-pdf-button.js
 * 
 * Makes the "Download PDF" button in the Notes View much more prominent.
 * 
 * What it does:
 *   1. Finds the Notes View section in page.js
 *   2. Adds a sticky bottom bar with a large green "Download PDF" CTA
 *   3. The bar uses a gradient fade so it doesn't block content abruptly
 * 
 * Usage:
 *   cd C:\Users\alast\Downloads\agf-companion
 *   node fix-pdf-button.js
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app', 'page.js');

if (!fs.existsSync(filePath)) {
  console.error('\u274C Cannot find app/page.js');
  console.error('   Run from: cd C:\\Users\\alast\\Downloads\\agf-companion');
  process.exit(1);
}

let content = fs.readFileSync(filePath, 'utf-8');

// ======================================================================
// Step 1: Find the Download PDF function name
// ======================================================================
const pdfFnMatch = content.match(/onClick=\{([A-Za-z_$][A-Za-z0-9_$]*)\}[^>]*>[^<]*Download PDF/);
if (!pdfFnMatch) {
  console.error('\u274C Could not find a "Download PDF" button in page.js');
  console.error('   Make sure the Notes View with PDF download exists first.');
  process.exit(1);
}
const pdfFn = pdfFnMatch[1];
console.log(`\u2705 Found PDF handler: ${pdfFn}`);

// ======================================================================
// Step 2: Find the header Download PDF button and shrink it
// ======================================================================
// Pattern: the button containing "Download PDF" text — replace with smaller version
const headerBtnRegex = new RegExp(
  // Match: <button onClick={pdfFn} style={{...}}>...Download PDF</button>
  '(<button\\s+onClick=\\{' + pdfFn + '\\}\\s+style=\\{\\{)([^}]+?)(\\}\\}[^>]*>)([^<]*Download PDF[^<]*)(</button>)',
  's'
);

const headerMatch = content.match(headerBtnRegex);
if (headerMatch) {
  const oldButton = headerMatch[0];
  const newButton = `<button onClick={${pdfFn}} style={{ padding: "6px 12px", borderRadius: 6, fontSize: 11, fontWeight: 500, border: \`1px solid \${C.border}\`, background: "transparent", color: C.textMuted, cursor: "pointer" }}>\u2193 PDF</button>`;
  content = content.replace(oldButton, newButton);
  console.log('\u2705 Shrunk header button to secondary "\u2193 PDF"');
} else {
  console.log('\u26A0\uFE0F  Could not match header button pattern \u2014 skipping header change');
}

// ======================================================================
// Step 3: Add sticky bottom bar with prominent Download CTA
// ======================================================================
// Strategy: Find the "Powered by AGF Tutoring" footer in the Notes View
// and insert the sticky bar right after it.
//
// If that fails, find the notes mode's <style> tag and insert before it.

const stickyBarCode = `
        {/* === STICKY DOWNLOAD BAR === */}
        <div style={{
          position: "sticky", bottom: 0, left: 0, right: 0,
          padding: "20px 20px 24px",
          background: \`linear-gradient(to top, \${C.bg} 70%, transparent)\`,
          display: "flex", justifyContent: "center", zIndex: 50,
        }}>
          <button onClick={${pdfFn}} style={{
            padding: "14px 36px", borderRadius: 10,
            background: C.green, border: "none",
            color: "#fff", fontSize: 15, fontWeight: 600,
            cursor: "pointer", transition: "all 0.2s",
            display: "flex", alignItems: "center", gap: 10,
            boxShadow: "0 4px 20px rgba(77,148,96,0.3)",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = C.greenLight; e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = C.green; e.currentTarget.style.transform = "none"; }}
          >
            <span style={{ fontSize: 18 }}>\u2193</span> Download revision notes PDF
          </button>
        </div>`;

// Try to find the notes section's "Powered by AGF" footer
const notesModeIdx = content.indexOf('mode === "notes"') !== -1
  ? content.indexOf('mode === "notes"')
  : content.indexOf("mode==='notes'") !== -1
    ? content.indexOf("mode==='notes'")
    : content.indexOf('Revision Notes');

if (notesModeIdx === -1) {
  console.error('\u274C Cannot find Notes mode section');
  process.exit(1);
}

// Find "Powered by AGF" that comes AFTER the notes section starts
let footerIdx = content.indexOf('Powered by AGF Tutoring', notesModeIdx);

// Also try variations
if (footerIdx === -1) footerIdx = content.indexOf('Powered by AGF', notesModeIdx);
if (footerIdx === -1) footerIdx = content.indexOf('Grounded in curated notes', notesModeIdx);

let inserted = false;

if (footerIdx !== -1) {
  // Find the closing </div> of the footer container
  let divCloseIdx = content.indexOf('</div>', footerIdx);
  if (divCloseIdx !== -1) {
    const insertPoint = divCloseIdx + '</div>'.length;
    content = content.slice(0, insertPoint) + stickyBarCode + content.slice(insertPoint);
    inserted = true;
    console.log('\u2705 Inserted sticky download bar after footer');
  }
}

if (!inserted) {
  // Fallback: find the <style> tag in the notes view and insert before it
  const styleIdx = content.indexOf('<style>', notesModeIdx);
  if (styleIdx !== -1) {
    content = content.slice(0, styleIdx) + stickyBarCode + '\n        ' + content.slice(styleIdx);
    inserted = true;
    console.log('\u2705 Inserted sticky download bar before style tag');
  }
}

if (!inserted) {
  console.error('\u274C Could not find a good insertion point for the sticky bar');
  console.error('   You may need to add it manually \u2014 see the code in this script.');
  process.exit(1);
}

// ======================================================================
// Step 4: Write the file
// ======================================================================
fs.writeFileSync(filePath, content, 'utf-8');

console.log('');
console.log('\u2705 Notes View Download PDF button updated!');
console.log('');
console.log('   Changes:');
console.log('   \u2022 Header button shrunk to secondary "\u2193 PDF" (subtle, not competing)');
console.log('   \u2022 Large green sticky bar at bottom: "Download revision notes PDF"');
console.log('   \u2022 Gradient fade background so it doesn\u2019t block content abruptly');
console.log('   \u2022 Hover lift + glow effect on the CTA button');
console.log('');
console.log('   Deploy:');
console.log('   git add .');
console.log('   git commit -m "Make Download PDF button more prominent in Notes View"');
console.log('   git push');
