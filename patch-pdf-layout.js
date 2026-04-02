/**
 * Overhaul PDF notes layout — full page width, bigger fonts, AGF branding
 * cd C:\Users\alast\Downloads\agf-companion
 * node patch-pdf-layout.js
 */
const fs = require('fs');
const f = 'app/page.js';
let c = fs.readFileSync(f, 'utf8');

// Find the entire downloadChatNotes function
const fnStart = 'const downloadChatNotes=(content,topic)=>{';
const fnStartIdx = c.indexOf(fnStart);

if (fnStartIdx === -1) {
  console.log('ERROR: could not find downloadChatNotes');
  process.exit(1);
}

// Find the end of the function — look for the closing };
// The function ends with "};}" or just "};" before the next const/function
let depth = 0;
let fnEndIdx = -1;
for (let i = fnStartIdx + fnStart.length; i < c.length; i++) {
  if (c[i] === '{') depth++;
  if (c[i] === '}') {
    if (depth === 0) {
      fnEndIdx = i + 2; // include the };
      break;
    }
    depth--;
  }
}

if (fnEndIdx === -1) {
  console.log('ERROR: could not find end of downloadChatNotes');
  process.exit(1);
}

const oldFn = c.substring(fnStartIdx, fnEndIdx);
console.log('Found downloadChatNotes: ' + oldFn.length + ' chars');

const newFn = `const downloadChatNotes=(content,topic)=>{
    const clean=content
      .replace(/📖[^\\n]*Quiz me[^\\n]*/g,'')
      .split('\\n').filter(l=>l.trim()!=='on this').join('\\n')
      .trim();
    const html=clean
      .replace(/^### (.+)$/gm,'<h3>$1</h3>')
      .replace(/^## (.+)$/gm,'<h2>$1</h2>')
      .replace(/^# (.+)$/gm,'<h1>$1</h1>')
      .replace(/\\*\\*(.+?)\\*\\*/g,'<strong>$1</strong>')
      .replace(/\\*(.+?)\\*/g,'<em>$1</em>')
      .replace(/^● (.+)$/gm,'<li>$1</li>')
      .replace(/^• (.+)$/gm,'<li>$1</li>')
      .replace(/^- (.+)$/gm,'<li>$1</li>')
      .replace(/^(\\d+)\\. (.+)$/gm,'<li><strong>$1.</strong> $2</li>')
      .replace(/✅/g,'<span class="ok">✓</span>')
      .replace(/❌/g,'<span class="no">✗</span>')
      .replace(/✓/g,'<span class="ok">✓</span>')
      .replace(/✗/g,'<span class="no">✗</span>')
      .replace(/\\n/g,'<br>');
    const subj=currentUnit?.name||"Chemistry";
    const code=currentUnit?.code||"";
    const page=\`<!DOCTYPE html>
<html><head><meta charset="utf-8">
<title>\${topic||"Revision Notes"} — AGF Tutoring</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
@page{margin:1.5cm 2cm;size:A4}
*{box-sizing:border-box}
body{font-family:'Outfit',sans-serif;font-weight:400;color:#1a1a1a;line-height:1.8;margin:0;padding:0;font-size:15px;background:#fff}
.page{max-width:100%;padding:32px 40px}
.hdr{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:20px;margin-bottom:28px;border-bottom:3px solid #4d9460}
.hdr-left h1{font-family:'DM Serif Display',Georgia,serif;font-size:28px;font-weight:400;margin:0;color:#1a1a1a;line-height:1.2}
.hdr-left .sub{font-size:13px;color:#706b65;letter-spacing:.06em;text-transform:uppercase;margin-top:6px}
.hdr-right{text-align:right}
.hdr-right .brand{font-family:'DM Serif Display',Georgia,serif;font-size:18px;color:#4d9460;margin-bottom:2px}
.hdr-right .url{font-size:11px;color:#9a9690;letter-spacing:.04em}
.content{columns:2;column-gap:36px;column-rule:1px solid #e8e5de}
h1{font-family:'DM Serif Display',Georgia,serif;font-size:22px;font-weight:400;margin:28px 0 12px;color:#1a1a1a;break-after:avoid}
h2{font-family:'DM Serif Display',Georgia,serif;font-size:18px;font-weight:400;margin:24px 0 10px;padding-bottom:6px;border-bottom:1px solid #e0ddd6;color:#1a1a1a;break-after:avoid}
h3{font-size:15px;font-weight:600;margin:18px 0 8px;color:#4d9460;break-after:avoid}
strong{font-weight:600}
li{margin-bottom:6px;padding-left:4px;break-inside:avoid}
code{font-family:'JetBrains Mono',monospace;font-size:13px;background:#f5f3ee;padding:1px 5px;border-radius:3px}
.ok{color:#4d9460;font-weight:600}
.no{color:#e06060;font-weight:600}
.tip{background:#f0f8f2;border-left:3px solid #4d9460;padding:10px 14px;margin:12px 0;border-radius:0 6px 6px 0;font-size:14px;break-inside:avoid}
.warn{background:#fdf6ee;border-left:3px solid #d4a24c;padding:10px 14px;margin:12px 0;border-radius:0 6px 6px 0;font-size:14px;break-inside:avoid}
.ftr{margin-top:32px;padding-top:14px;border-top:2px solid #4d9460;display:flex;justify-content:space-between;align-items:center;font-size:11px;color:#9a9690}
.ftr .bars{display:flex;gap:2px;align-items:flex-end}
.ftr .bar{width:3px;background:#4d9460;border-radius:1px}
@media print{.np{display:none!important}.content{columns:2}}
@media screen{body{background:#f8f7f4}.page{max-width:900px;margin:0 auto;padding:40px 48px;background:#fff;min-height:100vh;box-shadow:0 0 40px rgba(0,0,0,0.08)}}
</style></head><body>
<div class="page">
<div class="hdr">
<div class="hdr-left">
<h1>\${topic||"Revision Notes"}</h1>
<div class="sub">\${subj} — \${code}</div>
</div>
<div class="hdr-right">
<div class="brand">AGF Tutoring</div>
<div class="url">agftutoring.co.uk</div>
</div>
</div>
<div class="content">\${html}</div>
<div class="ftr">
<div style="display:flex;align-items:center;gap:8px">
<div class="bars"><div class="bar" style="height:8px"></div><div class="bar" style="height:14px"></div><div class="bar" style="height:18px"></div><div class="bar" style="height:11px"></div></div>
<span>AGF Tutoring · Study Companion</span>
</div>
<span>Based on curated notes · agftutoring.co.uk</span>
</div>
</div>
<div class="np" style="text-align:center;padding:20px">
<button onclick="window.print()" style="padding:12px 32px;border-radius:8px;border:none;background:#4d9460;color:#fff;font-family:'Outfit',sans-serif;font-size:14px;font-weight:600;cursor:pointer;letter-spacing:.04em">Save as PDF (Ctrl+P)</button>
</div>
</body></html>\`;
    const w=window.open("","_blank");if(w){w.document.write(page);w.document.close();}
  };`;

c = c.substring(0, fnStartIdx) + newFn + c.substring(fnEndIdx);
fs.writeFileSync(f, c);

console.log('Done: overhauled PDF layout');
console.log('');
console.log('Changes:');
console.log('  - Full page width (no max-width constraint)');
console.log('  - Two-column layout for content');
console.log('  - Font size 15px (up from 13px)');
console.log('  - Proper AGF header with green bar logo');
console.log('  - Green accent headings, tip boxes');
console.log('  - Professional footer with AGF bars icon');
console.log('  - "on this" stripped in PDF too');
console.log('');
console.log('git add . && git commit -m "Overhaul PDF layout" && git push');
