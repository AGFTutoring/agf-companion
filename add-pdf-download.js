// Run with: node add-pdf-download.js
// From: C:\Users\alast\Downloads\agf-companion

const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, 'app', 'page.js');
let code = fs.readFileSync(pagePath, 'utf8');

// ═══ 1. ADD printNotes FUNCTION ═══
// Insert before the NotesView component

const printNotesFn = `
/* ═══ PDF DOWNLOAD HELPER ═══ */
function downloadAsPDF(title, contentHtml) {
  const win = window.open('', '_blank');
  if (!win) { alert('Please allow popups to download PDF'); return; }
  win.document.write(\`<!DOCTYPE html>
<html><head>
<title>\${title} — AGF Tutoring</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Outfit', sans-serif; color: #1a1a1a; padding: 40px 50px; max-width: 800px; margin: 0 auto; line-height: 1.6; }
  .pdf-header { text-align: center; margin-bottom: 32px; padding-bottom: 20px; border-bottom: 2px solid #4d9460; }
  .pdf-logo { font-family: 'DM Serif Display', serif; font-size: 22px; color: #1a1a1a; }
  .pdf-logo span { color: #4d9460; }
  .pdf-subtitle { font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 0.15em; margin-top: 4px; }
  .pdf-title { font-family: 'DM Serif Display', serif; font-size: 26px; margin-top: 16px; }
  .pdf-desc { font-size: 13px; color: #666; margin-top: 6px; }
  
  .section { margin-top: 28px; }
  .section-num { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #4d9460; opacity: 0.6; }
  .section-title { font-family: 'DM Serif Display', serif; font-size: 18px; margin-top: 2px; margin-bottom: 12px; }
  
  .def-item { border-left: 3px solid #4d9460; padding-left: 14px; margin-bottom: 12px; }
  .def-term { font-weight: 600; font-size: 13px; margin-bottom: 2px; }
  .def-text { font-size: 12px; color: #555; }
  
  .eq-table { width: 100%; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; margin: 8px 0; border-collapse: collapse; }
  .eq-row { display: flex; align-items: center; padding: 10px 16px; border-bottom: 1px solid #eee; }
  .eq-row:last-child { border-bottom: none; }
  .eq-label { flex: 1; font-size: 12px; color: #666; }
  .eq-formula { font-family: 'JetBrains Mono', monospace; font-size: 14px; color: #4d9460; font-weight: 500; }
  .eq-units { font-size: 10px; color: #999; margin-left: 10px; }
  
  .content-para { font-size: 13px; color: #333; line-height: 1.8; margin-bottom: 10px; }
  .bullet { display: flex; gap: 8px; align-items: flex-start; margin-bottom: 4px; padding-left: 4px; }
  .bullet-dot { color: #4d9460; font-size: 8px; margin-top: 5px; flex-shrink: 0; }
  .bullet-text { font-size: 12px; color: #444; line-height: 1.6; }
  
  .data-table { width: 100%; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; border-collapse: collapse; margin: 8px 0; font-size: 12px; }
  .data-table th { background: #f5f5f5; padding: 8px 12px; text-align: left; font-weight: 600; font-size: 11px; text-transform: uppercase; letter-spacing: 0.04em; border-bottom: 1px solid #ddd; }
  .data-table td { padding: 8px 12px; border-bottom: 1px solid #eee; color: #444; }
  .data-table tr:nth-child(even) { background: #fafafa; }
  
  .tip-box { margin: 16px 0; padding: 12px 16px; border-radius: 8px; border: 1px solid rgba(77,148,96,0.2); background: rgba(77,148,96,0.04); display: flex; gap: 10px; }
  .tip-label { font-size: 10px; font-weight: 600; color: #4d9460; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 3px; }
  .tip-text { font-size: 12px; color: #444; line-height: 1.6; }
  
  .warn-box { margin: 16px 0; padding: 12px 16px; border-radius: 8px; border: 1px solid rgba(212,162,76,0.2); background: rgba(212,162,76,0.04); display: flex; gap: 10px; }
  .warn-label { font-size: 10px; font-weight: 600; color: #b8860b; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 3px; }
  
  .example-box { margin: 16px 0; padding: 14px 18px; border-radius: 8px; border: 1px solid #ddd; background: #fafafa; }
  .example-label { font-size: 10px; font-weight: 600; color: #4d9460; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px; }
  .example-q { font-size: 13px; font-weight: 500; margin-bottom: 10px; }
  .example-sol { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #333; line-height: 1.8; white-space: pre-wrap; background: #f0f0f0; padding: 10px 14px; border-radius: 6px; }
  
  .pdf-footer { text-align: center; margin-top: 40px; padding-top: 16px; border-top: 1px solid #ddd; font-size: 10px; color: #999; }
  
  .score-big { font-family: 'JetBrains Mono', monospace; font-size: 48px; font-weight: 700; color: #4d9460; text-align: center; }
  .score-detail { text-align: center; font-size: 14px; color: #666; margin-top: 4px; }
  .score-bar { height: 8px; background: #eee; border-radius: 4px; margin: 16px 0; overflow: hidden; }
  .score-fill { height: 100%; border-radius: 4px; }
  .weak-box { padding: 12px 16px; border-radius: 8px; border: 1px solid rgba(224,96,96,0.2); background: rgba(224,96,96,0.04); margin: 16px 0; }
  .weak-label { font-size: 11px; font-weight: 600; color: #c0392b; margin-bottom: 4px; }
  .weak-text { font-size: 12px; color: #444; }
  .q-review { padding: 12px 16px; border-radius: 8px; border: 1px solid #ddd; margin: 8px 0; }
  .q-header { display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 12px; font-weight: 600; }
  .q-text { font-size: 12px; color: #444; }
  .q-answer { font-size: 11px; color: #888; margin-top: 4px; }
  .correct { color: #4d9460; }
  .incorrect { color: #c0392b; }
  
  @media print {
    body { padding: 20px 30px; }
    .no-print { display: none !important; }
  }
</style>
</head><body>
\${contentHtml}
<div class="no-print" style="text-align:center;margin-top:24px;">
  <button onclick="window.print()" style="padding:10px 28px;font-size:14px;font-weight:600;background:#4d9460;color:white;border:none;border-radius:6px;cursor:pointer;font-family:'Outfit',sans-serif;">
    Save as PDF
  </button>
  <p style="font-size:11px;color:#999;margin-top:8px;">In the print dialog, select "Save as PDF" as the destination</p>
</div>
</body></html>\`);
  win.document.close();
}

function buildNotesHTML(data, subject) {
  let html = \`<div class="pdf-header">
    <div class="pdf-logo">AGF <span>tutoring</span></div>
    <div class="pdf-subtitle">\${subject?.code || ''} · Revision Notes</div>
    <div class="pdf-title">\${data.title}</div>
    \${data.subtitle ? '<div class="pdf-desc">' + data.subtitle + '</div>' : ''}
  </div>\`;

  data.sections.forEach((s, idx) => {
    if (s.type === 'definitions') {
      html += \`<div class="section">
        <span class="section-num">\${String(idx+1).padStart(2,'0')}</span>
        <div class="section-title">\${s.title}</div>
        \${(s.items||[]).map(item => \`<div class="def-item"><div class="def-term">\${item.term}</div><div class="def-text">\${item.definition}</div></div>\`).join('')}
      </div>\`;
    } else if (s.type === 'equations') {
      html += \`<div class="section">
        <span class="section-num">\${String(idx+1).padStart(2,'0')}</span>
        <div class="section-title">\${s.title}</div>
        <div class="eq-table">
          \${(s.items||[]).map(item => \`<div class="eq-row"><span class="eq-label">\${item.label}</span><span class="eq-formula">\${item.equation}</span>\${item.units ? '<span class="eq-units">'+item.units+'</span>' : ''}</div>\`).join('')}
        </div>
      </div>\`;
    } else if (s.type === 'content') {
      html += \`<div class="section">
        <span class="section-num">\${String(idx+1).padStart(2,'0')}</span>
        <div class="section-title">\${s.title}</div>
        \${(s.paragraphs||[]).map(p => '<div class="content-para">'+p+'</div>').join('')}
        \${(s.bullets||[]).map(b => '<div class="bullet"><span class="bullet-dot">●</span><span class="bullet-text">'+b+'</span></div>').join('')}
      </div>\`;
    } else if (s.type === 'table') {
      html += \`<div class="section">
        \${s.title ? '<span class="section-num">'+String(idx+1).padStart(2,'0')+'</span><div class="section-title">'+s.title+'</div>' : ''}
        <table class="data-table">
          <thead><tr>\${(s.headers||[]).map(h => '<th>'+h+'</th>').join('')}</tr></thead>
          <tbody>\${(s.rows||[]).map(row => '<tr>'+row.map(cell => '<td>'+cell+'</td>').join('')+'</tr>').join('')}</tbody>
        </table>
      </div>\`;
    } else if (s.type === 'tip') {
      html += \`<div class="tip-box"><span style="font-size:16px">💡</span><div><div class="tip-label">Exam Tip</div><div class="tip-text">\${s.text}</div></div></div>\`;
    } else if (s.type === 'warning') {
      html += \`<div class="warn-box"><span style="font-size:16px">⚠️</span><div><div class="warn-label">Watch Out</div><div class="tip-text">\${s.text}</div></div></div>\`;
    } else if (s.type === 'worked_example') {
      html += \`<div class="example-box"><div class="example-label">⭐ Worked Example</div>
        \${s.question ? '<div class="example-q">'+s.question+'</div>' : ''}
        \${s.solution ? '<div class="example-sol">'+s.solution+'</div>' : ''}
      </div>\`;
    }
  });

  html += '<div class="pdf-footer">Powered by AGF Tutoring · Grounded in curated notes · agftutoring.co.uk</div>';
  return html;
}

function buildQuizHTML(score, maxScore, pct, grade, weakTopics, history, subject) {
  let html = \`<div class="pdf-header">
    <div class="pdf-logo">AGF <span>tutoring</span></div>
    <div class="pdf-subtitle">\${subject?.code || ''} · Quiz Results</div>
    <div class="pdf-title">\${subject?.name || ''} — Quiz Complete</div>
  </div>
  <div class="score-big">\${score}/\${maxScore}</div>
  <div class="score-detail">\${pct}% — Grade \${grade}</div>
  <div class="score-bar"><div class="score-fill" style="width:\${pct}%;background:\${pct >= 70 ? '#4d9460' : pct >= 50 ? '#d4a24c' : '#e06060'}"></div></div>\`;

  if (weakTopics.length > 0) {
    html += \`<div class="weak-box"><div class="weak-label">Topics to revise:</div><div class="weak-text">\${weakTopics.join(', ')}</div></div>\`;
  }

  html += '<div class="section"><div class="section-title">Question Review</div>';
  history.forEach((h, i) => {
    html += \`<div class="q-review">
      <div class="q-header"><span>Q\${i+1}</span><span class="\${h.correct ? 'correct' : 'incorrect'}">\${h.correct ? '✓ Correct' : '✗ Wrong (was ' + h.correctLabel + ')'}</span></div>
      <div class="q-text">\${h.q}</div>
      <div class="q-answer">Your answer: \${h.answer}</div>
    </div>\`;
  });
  html += '</div>';
  html += '<div class="pdf-footer">Powered by AGF Tutoring · Grounded in curated notes · agftutoring.co.uk</div>';
  return html;
}

`;

if (!code.includes('downloadAsPDF')) {
  const marker = '/* ═══ NOTES VIEW COMPONENT ═══ */';
  const idx = code.indexOf(marker);
  if (idx !== -1) {
    code = code.slice(0, idx) + printNotesFn + '\n' + code.slice(idx);
    console.log('✓ PDF download functions added');
  } else {
    console.log('✗ Could not find NotesView marker');
  }
} else {
  console.log('· PDF functions already exist');
}

// ═══ 2. ADD DOWNLOAD BUTTON TO NOTES VIEW HEADER ═══
const notesBackBtn = `<button onClick={onClose} style={{ padding: "8px 18px", borderRadius: 6, fontSize: 12, fontWeight: 600, border: \`1px solid \${C.green}\`, background: C.greenDim, color: C.green, cursor: "pointer" }}>
          ← Back to Chat
        </button>`;

const notesBackBtnWithDownload = `<button onClick={() => downloadAsPDF(data.title, buildNotesHTML(data, subject))} style={{ padding: "8px 18px", borderRadius: 6, fontSize: 12, fontWeight: 600, border: \`1px solid \${C.border}\`, background: "transparent", color: C.textMuted, cursor: "pointer" }}>
          ↓ Download PDF
        </button>
        <button onClick={onClose} style={{ padding: "8px 18px", borderRadius: 6, fontSize: 12, fontWeight: 600, border: \`1px solid \${C.green}\`, background: C.greenDim, color: C.green, cursor: "pointer" }}>
          ← Back to Chat
        </button>`;

if (!code.includes('Download PDF')) {
  code = code.replace(notesBackBtn, notesBackBtnWithDownload);
  console.log('✓ Download button added to Notes View');
} else {
  console.log('· Download button already exists');
}

// ═══ 3. ADD DOWNLOAD BUTTON TO QUIZ RESULTS ═══
// Find the quiz results "Back to Ask" and "New Quiz" buttons
const quizBtns = `<button onClick={backToAsk} style={{ padding: "8px 16px", borderRadius: 6, fontSize: 12, fontWeight: 500, border: \`1px solid \${C.border}\`, background: "transparent", color: C.textMuted, cursor: "pointer" }}>Back to Ask</button>
          <button onClick={startQuiz} style={{ padding: "8px 16px", borderRadius: 6, fontSize: 12, fontWeight: 500, border: \`1px solid \${C.gold}\`, background: C.goldDim, color: C.gold, cursor: "pointer" }}>New Quiz</button>`;

const quizBtnsWithDownload = `<button onClick={() => {
            const pctVal = quizMaxScore > 0 ? Math.round((quizScore / quizMaxScore) * 100) : 0;
            const gradeVal = pctVal >= 80 ? "A" : pctVal >= 70 ? "B" : pctVal >= 60 ? "C" : pctVal >= 50 ? "D" : "U";
            const weakTopicsVal = [...new Set(quizHistory.filter(h => h.correct !== true).map(h => h.topic).filter(Boolean))];
            downloadAsPDF(currentSubject.name + " Quiz Results", buildQuizHTML(quizScore, quizMaxScore, pctVal, gradeVal, weakTopicsVal, quizHistory, currentSubject));
          }} style={{ padding: "8px 16px", borderRadius: 6, fontSize: 12, fontWeight: 500, border: \`1px solid \${C.border}\`, background: "transparent", color: C.textMuted, cursor: "pointer" }}>↓ Download PDF</button>
          <button onClick={backToAsk} style={{ padding: "8px 16px", borderRadius: 6, fontSize: 12, fontWeight: 500, border: \`1px solid \${C.border}\`, background: "transparent", color: C.textMuted, cursor: "pointer" }}>Back to Ask</button>
          <button onClick={startQuiz} style={{ padding: "8px 16px", borderRadius: 6, fontSize: 12, fontWeight: 500, border: \`1px solid \${C.gold}\`, background: C.goldDim, color: C.gold, cursor: "pointer" }}>New Quiz</button>`;

if (code.includes(quizBtns)) {
  code = code.replace(quizBtns, quizBtnsWithDownload);
  console.log('✓ Download button added to Quiz Results');
} else {
  console.log('· Could not find quiz buttons (may need manual check)');
}

fs.writeFileSync(pagePath, code);
console.log('\n✅ PDF download added to Notes View and Quiz Results!');
console.log('Test:');
console.log('1. Generate notes → click "↓ Download PDF" in header');
console.log('2. Complete a quiz → click "↓ Download PDF" on results screen');
console.log('Both open a clean printable page — select "Save as PDF" in the print dialog');
