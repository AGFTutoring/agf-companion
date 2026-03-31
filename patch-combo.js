/**
 * AGF Companion — Combined: New shapes + PDF download + fixes
 * 
 * cd C:\Users\alast\Downloads\agf-companion
 * node patch-combo.js
 */

const fs = require('fs');
const path = require('path');

const PAGE_JS = path.join(__dirname, 'app', 'page.js');
let code = fs.readFileSync(PAGE_JS, 'utf8');
let steps = 0;

// 1. ADD TRIGONAL BIPYRAMIDAL + SQUARE PLANAR SVG
const fallback = 'return <div style={{color:C.textMuted,fontSize:12,padding:8,background:C.bgLight,borderRadius:8,margin:"6px 0"}}>Shape: {shape} {f} {a}</div>;}';

if (code.includes(fallback)) {
  const tbp = `if(shape==="trigonal_bipyramidal")return wrap(<><circle cx="100" cy="90" r="14" fill={C.bgCard} {...S}/><text x="100" y="95" {...T}>P</text><line x1="100" y1="76" x2="100" y2="18" {...S}/><text x="100" y="12" {...L}>Cl</text><line x1="100" y1="104" x2="100" y2="165" {...S}/><text x="100" y="178" {...L}>Cl</text><line x1="86" y1="85" x2="28" y2="60" {...S}/><text x="16" y="58" {...L}>Cl</text><line x1="114" y1="85" x2="172" y2="60" {...S}/><text x="184" y="58" {...L}>Cl</text><line x1="114" y1="95" x2="172" y2="120" {...S}/><text x="184" y="124" {...L}>Cl</text><path d="M120,26 A30,30 0 0,1 138,52" fill="none" stroke={C.textDim} strokeWidth="1" strokeDasharray="3,2"/><text x="142" y="36" fill={C.textMuted} fontSize="8" fontFamily="'DM Sans',sans-serif">90°</text><path d="M48,68 A30,30 0 0,0 82,78" fill="none" stroke={C.textDim} strokeWidth="1" strokeDasharray="3,2"/><text x="52" y="82" fill={C.textMuted} fontSize="8" fontFamily="'DM Sans',sans-serif">120°</text><text x="100" y="194" {...Lb}>{f} — Trigonal bipyramidal</text></>,"0 0 200 200");`;
  const sp = `if(shape==="square_planar")return wrap(<><circle cx="100" cy="90" r="14" fill={C.bgCard} {...S}/><text x="100" y="95" {...T}>Xe</text><line x1="86" y1="78" x2="35" y2="35" {...S}/><text x="24" y="30" {...L}>F</text><line x1="114" y1="78" x2="165" y2="35" {...S}/><text x="176" y="30" {...L}>F</text><line x1="86" y1="102" x2="35" y2="145" {...S}/><text x="24" y="155" {...L}>F</text><line x1="114" y1="102" x2="165" y2="145" {...S}/><text x="176" y="155" {...L}>F</text><ellipse cx="100" cy="62" rx="7" ry="4" {...LP}/><ellipse cx="100" cy="57" rx="7" ry="4" {...LP}/><ellipse cx="100" cy="118" rx="7" ry="4" {...LP}/><ellipse cx="100" cy="123" rx="7" ry="4" {...LP}/><text x="100" y="52" fill={C.amber} fontSize="7" fontFamily="'DM Sans',sans-serif">LP</text><text x="100" y="137" fill={C.amber} fontSize="7" fontFamily="'DM Sans',sans-serif">LP</text><path d="M50,48 A30,30 0 0,0 78,74" fill="none" stroke={C.textDim} strokeWidth="1" strokeDasharray="3,2"/><text x="48" y="68" fill={C.textMuted} fontSize="8" fontFamily="'DM Sans',sans-serif">90°</text><text x="100" y="174" {...Lb}>{f} — Square planar</text></>,"0 0 200 180");`;
  code = code.replace(fallback, tbp + sp + fallback);
  steps++;
  console.log('✅ Step ' + steps + ': Added trigonal bipyramidal + square planar SVGs');
}

// 2. ADD SHAPES TO SYSTEM PROMPT
const oldTags = '[SHAPE:octahedral:SF₆:90°]';
if (code.includes(oldTags) && !code.includes('trigonal_bipyramidal:PCl')) {
  code = code.replace(oldTags, oldTags + '\\n[SHAPE:trigonal_bipyramidal:PCl₅:90°,120°]\\n[SHAPE:square_planar:XeF₄:90°]');
  steps++;
  console.log('✅ Step ' + steps + ': Added new shapes to system prompt');
}

// 3. FIX SHAPE RULE
const oldRule = 'When explaining ANY molecular shape, ALWAYS include the matching [SHAPE:...] tag';
const newRule = 'When the student ASKS about molecular shapes or VSEPR, include the matching [SHAPE:...] tag. Do NOT include shape diagrams when discussing naming, isomerism, mechanisms, or other non-shape topics';
if (code.includes(oldRule)) {
  code = code.replace(oldRule, newRule);
  steps++;
  console.log('✅ Step ' + steps + ': Tightened shape diagram rule');
}

// 4. ADD PDF DOWNLOAD FUNCTION
const pdfTarget = 'const downloadNotesPDF=()=>';
if (code.indexOf(pdfTarget) !== -1 && !code.includes('downloadChatNotes')) {
  const fn = `const downloadChatNotes=(content,topic)=>{const clean=content.replace(/📖[^\\n]*Quiz me[^\\n]*/g,'').replace(/\\non this\\s*$/,'').trim();const html=clean.replace(/^### (.+)$/gm,'<h3>$1</h3>').replace(/^## (.+)$/gm,'<h2>$1</h2>').replace(/^# (.+)$/gm,'<h1>$1</h1>').replace(/\\*\\*(.+?)\\*\\*/g,'<strong>$1</strong>').replace(/\\*(.+?)\\*/g,'<em>$1</em>').replace(/^● (.+)$/gm,'<li>$1</li>').replace(/^• (.+)$/gm,'<li>$1</li>').replace(/^- (.+)$/gm,'<li>$1</li>').replace(/^(\\d+)\\. (.+)$/gm,'<li><strong>$1.</strong> $2</li>').replace(/✅/g,'<span style="color:#4d9460">✓</span>').replace(/❌/g,'<span style="color:#e06060">✗</span>').replace(/\\n/g,'<br>');const page='<!DOCTYPE html><html><head><meta charset="utf-8"><title>'+(topic||"Notes")+' — AGF Tutoring</title><link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet"><style>@page{margin:2cm 2.5cm;size:A4}body{font-family:Outfit,sans-serif;color:#1a1a1a;line-height:1.8;max-width:680px;margin:0 auto;padding:40px 20px;font-size:13px}.hdr{border-bottom:2px solid #4d9460;padding-bottom:16px;margin-bottom:24px;display:flex;justify-content:space-between;align-items:flex-end}.hdr h1{font-family:DM Serif Display,serif;font-size:22px;font-weight:400;margin:0}.hdr .sub{font-size:11px;color:#706b65;letter-spacing:.08em;text-transform:uppercase}.hdr .brand{font-family:DM Serif Display,serif;font-size:14px;color:#4d9460}h1{font-family:DM Serif Display,serif;font-size:20px;margin:28px 0 12px}h2{font-family:DM Serif Display,serif;font-size:17px;margin:24px 0 10px;border-bottom:1px solid #e0ddd6;padding-bottom:4px}h3{font-size:14px;font-weight:600;margin:18px 0 6px;color:#4d9460}strong{font-weight:600}li{margin-bottom:4px}.ftr{margin-top:40px;padding-top:12px;border-top:1px solid #e0ddd6;font-size:10px;color:#9a9690;text-align:center}@media print{.np{display:none!important}}</style></head><body><div class="hdr"><div><h1>'+(topic||"Notes")+'</h1><div class="sub">'+(currentUnit?.name||"Chemistry")+' — '+(currentUnit?.code||"")+'</div></div><div class="brand">AGF Tutoring</div></div>'+html+'<div class="ftr">AGF Tutoring · Study Companion</div><div class="np" style="text-align:center;margin-top:20px"><button onclick="window.print()" style="padding:10px 28px;border-radius:6px;border:none;background:#4d9460;color:#fff;font-family:Outfit,sans-serif;font-size:13px;cursor:pointer">Save as PDF</button></div></body></html>';const w=window.open("","_blank");if(w){w.document.write(page);w.document.close();}};
  `;
  code = code.substring(0, code.indexOf(pdfTarget)) + fn + code.substring(code.indexOf(pdfTarget));
  steps++;
  console.log('✅ Step ' + steps + ': Added PDF download function');
}

// 5. ADD DOWNLOAD BUTTON AFTER ACTION BUTTONS
const actionEnd = `</div>
    )}
  </>;
})()}`;

if (code.includes(actionEnd) && !code.includes('Download as PDF')) {
  code = code.replace(actionEnd, `</div>
    )}
    {m.role==="assistant"&&m.content.length>800&&(m.content.includes("Revision Notes")||m.content.includes("Key Rules")||m.content.includes("Common Exam Mistakes")||m.content.includes("Worked Examples")||m.content.includes("Step-by-Step"))&&(
      <div style={{marginTop:8}}><button onClick={()=>{const t=m.content.match(/^#\\s*(.+)/m)?.[1]||m.content.match(/\\*\\*(.{10,60}?)\\*\\*/)?.[1]||"Revision Notes";downloadChatNotes(m.content,t);}} style={{padding:"6px 14px",borderRadius:20,border:"1px solid "+C.border,background:"transparent",color:C.textMuted,fontSize:11.5,fontWeight:500,cursor:"pointer",display:"flex",alignItems:"center",gap:6,transition:"all 0.2s"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=C.green;e.currentTarget.style.color=C.green;e.currentTarget.style.background=C.greenDim;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.textMuted;e.currentTarget.style.background="transparent";}}>⬇ Download as PDF</button></div>
    )}
  </>;
})()}`);
  steps++;
  console.log('✅ Step ' + steps + ': Added Download PDF button');
}

fs.writeFileSync(PAGE_JS, code, 'utf8');
console.log('\\n✅ ' + steps + ' patches applied!');
console.log('   npm run dev → test');
console.log('   git add . && git commit -m "New shapes + PDF download" && git push');
