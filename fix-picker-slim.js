/**
 * fix-picker-slim.js
 * Replaces picker with tile-focused design: logo + tiles, no marketing fluff
 * Run: node fix-picker-slim.js
 */
const fs = require("fs");
const path = require("path");
const FILE = path.join(__dirname, "app", "page.js");

let src = fs.readFileSync(FILE, "utf8");
console.log("Read page.js: " + src.length + " chars");

// Find the picker block
var startMatch = 'if(pickerStep==="subject")';
var startIdx = src.indexOf(startMatch);
if (startIdx === -1) {
  console.error("FATAL: Could not find pickerStep===subject");
  process.exit(1);
}

var endMatch = 'if(pickerStep==="exam"';
var endIdx = src.indexOf(endMatch, startIdx + 10);
if (endIdx === -1) {
  console.error("FATAL: Could not find pickerStep===exam");
  process.exit(1);
}

console.log("Found picker: chars " + startIdx + " to " + endIdx);

// Build new picker: logo at top, then straight to tiles
var NP = '';
NP += 'if(pickerStep==="subject"){';
NP += 'const coreSubjects=CATALOG.filter(s=>["chemistry","physics","maths"].includes(s.id));';
NP += 'const otherSubjects=CATALOG.filter(s=>!["chemistry","physics","maths"].includes(s.id));';
NP += 'const boardTags={chemistry:"Edexcel IAL \u00b7 AQA \u00b7 OCR \u00b7 Cambridge \u00b7 IB \u00b7 AP",physics:"Edexcel IAL \u00b7 AQA \u00b7 OCR \u00b7 Cambridge \u00b7 IB \u00b7 AP",maths:"Edexcel IAL \u00b7 AQA \u00b7 OCR \u00b7 IB \u00b7 AP \u00b7 SAT \u00b7 GMAT"};';

NP += 'return(<div style={{width:"100%",minHeight:"100vh",display:"flex",flexDirection:"column",background:C.bg,fontFamily:"\'Outfit\',sans-serif",color:C.text}}>';

// NAV BAR with logo
NP += '<nav style={{padding:"18px 32px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${C.border}`,maxWidth:1200,margin:"0 auto",width:"100%"}}>';
NP += '<div style={{display:"flex",alignItems:"center",gap:12}}>';
NP += '<svg width="22" height="26" viewBox="0 0 22 26">{[0.5,0.85,1,0.65].map((f,i)=>(<rect key={i} x={i*5.8} y={26-26*f} width={3.2} height={26*f} rx={0.8} fill={C.green}/>))}</svg>';
NP += '<div><div style={{fontFamily:"\'DM Serif Display\',serif",fontSize:18,fontWeight:400,letterSpacing:"-0.02em",lineHeight:1}}>AGF</div>';
NP += '<div style={{fontSize:8.5,fontWeight:500,letterSpacing:"0.15em",textTransform:"uppercase",color:C.textMuted,marginTop:1}}>TUTORING</div></div>';
NP += '</div>';
NP += '<a href="https://agftutoring.co.uk" target="_blank" rel="noopener" style={{fontSize:12,color:C.textDim,textDecoration:"none"}}>agftutoring.co.uk</a>';
NP += '</nav>';

// CENTERED CONTENT AREA
NP += '<div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"32px 32px 40px",maxWidth:960,margin:"0 auto",width:"100%"}}>';

// Small label + tagline
NP += '<div style={{textAlign:"center",marginBottom:36}}>';
NP += '<div style={{fontSize:11,fontWeight:500,letterSpacing:"0.12em",textTransform:"uppercase",color:C.green,marginBottom:10}}>Study Companion</div>';
NP += '<div style={{fontFamily:"\'DM Serif Display\',serif",fontSize:"clamp(24px, 3.5vw, 36px)",fontWeight:400,lineHeight:1.2,letterSpacing:"-0.02em",color:C.text}}>Choose your subject</div>';
NP += '</div>';

// CORE SUBJECTS - 3 column
NP += '<div style={{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:20,width:"100%",marginBottom:40}}>';
NP += '{coreSubjects.map(s=>(<button key={s.id} onClick={()=>{setSelectedCatalog(s);setPickerStep("exam");}}';
NP += ' style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:12,padding:"28px 24px",cursor:"pointer",transition:"all 0.25s ease",textAlign:"left",position:"relative",overflow:"hidden"}}';
NP += ' onMouseEnter={e=>{e.currentTarget.style.borderColor=s.colour;e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.querySelector("[data-accent]").style.opacity="1";}}';
NP += ' onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.transform="none";e.currentTarget.querySelector("[data-accent]").style.opacity="0.4";}}>'; 
NP += '<div data-accent="1" style={{position:"absolute",top:0,left:0,right:0,height:3,background:s.colour,opacity:0.4,transition:"opacity 0.25s"}}/>';
NP += '<div style={{fontFamily:"\'DM Serif Display\',serif",fontSize:22,fontWeight:400,letterSpacing:"-0.02em",marginBottom:10,marginTop:8,color:C.text}}>{s.name}</div>';
NP += '<div style={{fontSize:13,color:C.textMuted,lineHeight:1.6,fontWeight:300,marginBottom:16}}>{s.subtitle}</div>';
NP += '<div style={{fontSize:10.5,color:C.textDim,letterSpacing:"0.04em",lineHeight:1.5}}>{boardTags[s.id]}</div>';
NP += '</button>))}</div>';

// ADMISSIONS DIVIDER
NP += '<div style={{display:"flex",alignItems:"center",gap:20,marginBottom:24,width:"100%"}}>';
NP += '<div style={{flex:1,height:1,background:C.border}}/>';
NP += '<span style={{fontSize:10,fontWeight:500,letterSpacing:"0.12em",textTransform:"uppercase",color:C.textDim}}>Admissions & Language</span>';
NP += '<div style={{flex:1,height:1,background:C.border}}/>';
NP += '</div>';

// ADMISSIONS TILES - 4 column compact
NP += '<div style={{display:"grid",gridTemplateColumns:"repeat(4, 1fr)",gap:12,width:"100%"}}>';
NP += '{otherSubjects.map(s=>(<button key={s.id} onClick={()=>{setSelectedCatalog(s);setPickerStep("exam");}}';
NP += ' style={{background:s.systems?C.bgCard:"transparent",border:`1px solid ${C.border}`,borderRadius:8,padding:"14px 16px",cursor:s.systems?"pointer":"default",transition:"all 0.2s",opacity:s.systems?1:0.5,textAlign:"left"}}';
NP += ' onMouseEnter={e=>{if(s.systems)e.currentTarget.style.borderColor=C.green;}}';
NP += ' onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;}}>';
NP += '<div style={{fontFamily:"\'DM Serif Display\',serif",fontSize:15,fontWeight:400,marginBottom:3,color:C.text}}>{s.name}</div>';
NP += '<div style={{fontSize:10,fontWeight:500,letterSpacing:"0.06em",color:s.systems?C.green:C.textDim}}>{s.systems?"Available":"Coming soon"}</div>';
NP += '</button>))}</div>';

// Close centered content area
NP += '</div>';

// FOOTER
NP += '<footer style={{borderTop:`1px solid ${C.border}`,padding:"20px 32px",display:"flex",justifyContent:"space-between",alignItems:"center",maxWidth:1200,margin:"0 auto",width:"100%"}}>';
NP += '<div style={{display:"flex",alignItems:"center",gap:10}}>';
NP += '<svg width="14" height="16" viewBox="0 0 22 26">{[0.5,0.85,1,0.65].map((f,i)=>(<rect key={i} x={i*5.8} y={26-26*f} width={3.2} height={26*f} rx={0.8} fill={C.green}/>))}</svg>';
NP += '<span style={{fontSize:10,color:C.textDim}}>Powered by AGF Tutoring \u00b7 Grounded in curated notes</span>';
NP += '</div>';
NP += '<a href="https://agftutoring.co.uk" target="_blank" rel="noopener" style={{fontSize:10,color:C.textDim,textDecoration:"none"}}>agftutoring.co.uk</a>';
NP += '</footer>';

NP += '<style>{CSS}</style>';
NP += '</div>);}\n  ';

// Apply
var newSrc = src.substring(0, startIdx) + NP + src.substring(endIdx);

fs.writeFileSync(FILE, newSrc, "utf8");
console.log("");
console.log("SUCCESS! Wrote " + newSrc.length + " chars");
console.log("Old: " + (endIdx - startIdx) + " chars | New: " + NP.length + " chars");
console.log("");
console.log("Next: npm run dev (check localhost), then:");
console.log("  git add .");
console.log("  git commit -m \"Slim picker - tile focused\"");
console.log("  git push");
