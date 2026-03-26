// Run with: node fix-download-btn.js
// From: C:\Users\alast\Downloads\agf-companion

const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, 'app', 'page.js');
let code = fs.readFileSync(pagePath, 'utf8');

// Check if download already exists
if (code.includes('Download PDF')) {
  console.log('· Download button already exists');
  process.exit(0);
}

// Check if downloadAsPDF function exists
if (!code.includes('downloadAsPDF')) {
  console.log('✗ downloadAsPDF function not found — run add-pdf-download.js first');
  process.exit(1);
}

// Find "Back to Chat" button in NotesView and add download before it
// Search for the pattern flexibly
const backToChatIdx = code.indexOf('← Back to Chat');
if (backToChatIdx === -1) {
  console.log('✗ Could not find "← Back to Chat" button');
  process.exit(1);
}

// Find the <button that contains this text — go backwards to find the opening <button
let btnStart = code.lastIndexOf('<button', backToChatIdx);
if (btnStart === -1) {
  console.log('✗ Could not find button start');
  process.exit(1);
}

// Insert download button just before the Back to Chat button
const downloadBtn = `<button onClick={() => downloadAsPDF(data.title, buildNotesHTML(data, subject))} style={{ padding: "8px 18px", borderRadius: 6, fontSize: 12, fontWeight: 600, border: \`1px solid \${C.border}\`, background: "transparent", color: C.textMuted, cursor: "pointer" }}>
          ↓ Download PDF
        </button>
        `;

code = code.slice(0, btnStart) + downloadBtn + code.slice(btnStart);
console.log('✓ Download PDF button added to Notes View header');

fs.writeFileSync(pagePath, code);
console.log('\n✅ Done! Hard refresh and test.');
