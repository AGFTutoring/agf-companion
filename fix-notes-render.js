// Run with: node fix-notes-render.js
// From: C:\Users\alast\Downloads\agf-companion

const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, 'app', 'page.js');
let code = fs.readFileSync(pagePath, 'utf8');

// Check if the rendering block already exists (the actual if(showNotes) check)
if (code.includes('if (showNotes)')) {
  console.log('· Notes View rendering already properly exists');
  process.exit(0);
}

// Add the rendering block before "if (!subject) {"
// We need to find the exact spot in the render function
const marker = '  /* ─── SUBJECT PICKER SCREEN ─── */\n  if (!subject) {';
let insertBefore = code.indexOf(marker);

// If that marker doesn't exist, try alternate
if (insertBefore === -1) {
  insertBefore = code.indexOf('if (!subject) {');
}

if (insertBefore === -1) {
  console.log('✗ Could not find insertion point');
  process.exit(1);
}

const renderBlock = `  /* ─── NOTES VIEW SCREEN ─── */
  if (showNotes) {
    if (notesLoading) {
      return (
        <div style={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: C.bg, fontFamily: "'Outfit',sans-serif", color: C.text }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
            {[0, 1, 2].map(d => <div key={d} style={{ width: 10, height: 10, borderRadius: "50%", background: C.green, opacity: 0.3, animation: \`p 1.2s ease-in-out \${d * 0.2}s infinite\` }} />)}
          </div>
          <div style={{ fontSize: 15, color: C.textMuted }}>Generating revision notes...</div>
          <div style={{ fontSize: 12, color: C.textDim, marginTop: 6 }}>This takes a few seconds</div>
          <style>{\`@keyframes p{0%,100%{opacity:.25;transform:scale(.85)}50%{opacity:.65;transform:scale(1.1)}}\`}</style>
        </div>
      );
    }
    if (notesData) {
      return (
        <>
          <NotesView data={notesData} subject={currentSubject} onClose={() => { setShowNotes(false); setNotesData(null); }} />
          <style>{\`
            @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
            @keyframes p{0%,100%{opacity:.25;transform:scale(.85)}50%{opacity:.65;transform:scale(1.1)}}
            ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.06);border-radius:3px}
            *{box-sizing:border-box}
          \`}</style>
        </>
      );
    }
  }

`;

code = code.slice(0, insertBefore) + renderBlock + code.slice(insertBefore);

fs.writeFileSync(pagePath, code);
console.log('✅ Notes View rendering block added!');
console.log('Hard refresh http://localhost:3000 (Ctrl+Shift+R), ask a question, click 📚');
