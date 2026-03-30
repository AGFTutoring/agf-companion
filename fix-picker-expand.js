/**
 * fix-picker-expand.js
 * Expands tiles to use full screen, enhances aesthetics
 * Run: node fix-picker-expand.js
 */
const fs = require("fs");
const path = require("path");
const FILE = path.join(__dirname, "app", "page.js");

let src = fs.readFileSync(FILE, "utf8");
console.log("Read page.js: " + src.length + " chars");

var startIdx = src.indexOf('if(pickerStep==="subject")');
if (startIdx === -1) { console.error("FATAL: no pickerStep"); process.exit(1); }

var endIdx = src.indexOf('if(pickerStep==="exam"', startIdx + 10);
if (endIdx === -1) { console.error("FATAL: no exam section"); process.exit(1); }

console.log("Replacing chars " + startIdx + " to " + endIdx);

var NP = '';
NP += 'if(pickerStep==="subject"){';
NP += 'const coreSubjects=CATALOG.filter(s=>["chemistry","physics","maths"].includes(s.id));';
NP += 'const otherSubjects=CATALOG.filter(s=>!["chemistry","physics","maths"].includes(s.id));';
NP += 'const boardTags={chemistry:"Edexcel IAL \u00b7 AQA \u00b7 OCR \u00b7 Cambridge \u00b7 IB \u00b7 AP",physics:"Edexcel IAL \u00b7 AQA \u00b7 OCR \u00b7 Cambridge \u00b7 IB \u00b7 AP",maths:"Edexcel IAL \u00b7 AQA \u00b7 OCR \u00b7 IB \u00b7 AP \u00b7 SAT \u00b7 GMAT"};';
NP += 'const coreIcons={chemistry:"\u2697",physics:"\u26A1",maths:"\uD83D\uDCD0"};';

NP += 'return(<div style={{width:"100%",minHeight:"100vh",display:"flex",flexDirection:"column",background:C.bg,fontFamily:"\'Outfit\',sans-serif",color:C.text}}>';

// NAV
NP += '<nav style={{padding:"16px 40px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${C.border}`}}>';
NP += '<div style={{display:"flex",alignItems:"center",gap:12}}>';
NP += '<svg width="22" height="26" viewBox="0 0 22 26">{[0.5,0.85,1,0.65].map((f,i)=>(<rect key={i} x={i*5.8} y={26-26*f} width={3.2} height={26*f} rx={0.8} fill={C.green}/>))}</svg>';
NP += '<div><div style={{fontFamily:"\'DM Serif Display\',serif",fontSize:18,fontWeight:400,letterSpacing:"-0.02em",lineHeight:1}}>AGF</div>';
NP += '<div style={{fontSize:8.5,fontWeight:500,letterSpacing:"0.15em",textTransform:"uppercase",color:C.textMuted,marginTop:1}}>TUTORING</div></div>';
NP += '</div>';
NP += '<a href="https://agftutoring.co.uk" target="_blank" rel="noopener" style={{fontSize:12,color:C.textDim,textDecoration:"none"}}>agftutoring.co.uk</a>';
NP += '</nav>';

// MAIN CONTENT - vertically centred
NP += '<div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px 40px 32px"}}>';

// Label
NP += '<div style={{textAlign:"center",marginBottom:40}}>';
NP += '<div style={{fontSize:11,fontWeight:500,letterSpacing:"0.14em",textTransform:"uppercase",color:C.green,marginBottom:12}}>Study Companion</div>';
NP += '<div style={{fontFamily:"\'DM Serif Display\',serif",fontSize:"clamp(26px, 3.5vw, 38px)",fontWeight:400,lineHeight:1.2,letterSpacing:"-0.02em",color:C.text}}>Choose your subject</div>';
NP += '</div>';

// CORE SUBJECTS - larger cards, full width
NP += '<div style={{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:24,width:"100%",maxWidth:1080,marginBottom:48}}>';
NP += '{coreSubjects.map(s=>(<button key={s.id} onClick={()=>{setSelectedCatalog(s);setPickerStep("exam");}}';
NP += ' style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:14,padding:"36px 30px 30px",cursor:"pointer",transition:"all 0.3s ease",textAlign:"left",position:"relative",overflow:"hidden"}}';
NP += ' onMouseEnter={e=>{e.currentTarget.style.borderColor=s.colour;e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 12px 32px rgba(0,0,0,0.4)";e.currentTarget.querySelector("[data-accent]").style.opacity="1";}}';
NP += ' onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";e.currentTarget.querySelector("[data-accent]").style.opacity="0.5";}}>'; 
NP += '<div data-accent="1" style={{position:"absolute",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg, ${s.colour}, transparent)`,opacity:0.5,transition:"opacity 0.3s"}}/>';
NP += '<div style={{fontSize:36,marginBottom:12}}>{coreIcons[s.id]}</div>';
NP += '<div style={{fontFamily:"\'DM Serif Display\',serif",fontSize:24,fontWeight:400,letterSpacing:"-0.02em",marginBottom:12,color:C.text}}>{s.name}</div>';
NP += '<div style={{fontSize:14,color:C.textMuted,lineHeight:1.7,fontWeight:300,marginBottom:20}}>{s.subtitle}</div>';
NP += '<div style={{fontSize:11,color:C.textDim,letterSpacing:"0.04em",lineHeight:1.6}}>{boardTags[s.id]}</div>';
NP += '</button>))}</div>';

// ADMISSIONS DIVIDER
NP += '<div style={{display:"flex",alignItems:"center",gap:20,marginBottom:28,width:"100%",maxWidth:1080}}>';
NP += '<div style={{flex:1,height:1,background:C.border}}/>';
NP += '<span style={{fontSize:10,fontWeight:500,letterSpacing:"0.12em",textTransform:"uppercase",color:C.textDim}}>Admissions & Language</span>';
NP += '<div style={{flex:1,height:1,background:C.border}}/>';
NP += '</div>';

// ADMISSIONS TILES - 4 column, slightly bigger
NP += '<div style={{display:"grid",gridTemplateColumns:"repeat(4, 1fr)",gap:14,width:"100%",maxWidth:1080}}>';
NP += '{otherSubjects.map(s=>(<button key={s.id} onClick={()=>{setSelectedCatalog(s);setPickerStep("exam");}}';
NP += ' style={{background:s.systems?C.bgCard:"transparent",border:`1px solid ${C.border}`,borderRadius:10,padding:"18px 20px",cursor:s.systems?"pointer":"default",transition:"all 0.25s",opacity:s.systems?1:0.45,textAlign:"left"}}';
NP += ' onMouseEnter={e=>{if(s.systems){e.currentTarget.style.borderColor=C.green;e.currentTarget.style.transform="translateY(-2px)";}}}';
NP += ' onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.transform="none";}}>';
NP += '<div style={{fontFamily:"\'DM Serif Display\',serif",fontSize:16,fontWeight:400,marginBottom:4,color:C.text}}>{s.name}</div>';
NP += '<div style={{fontSize:10.5,fontWeight:500,letterSpacing:"0.06em",color:s.systems?C.green:C.textDim}}>{s.systems?"Available":"Coming soon"}</div>';
NP += '</button>))}</div>';

// Close content
NP += '</div>';

// FOOTER
NP += '<footer style={{borderTop:`1px solid ${C.border}`,padding:"18px 40px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>';
NP += '<div style={{display:"flex",alignItems:"center",gap:10}}>';
NP += '<svg width="14" height="16" viewBox="0 0 22 26">{[0.5,0.85,1,0.65].map((f,i)=>(<rect key={i} x={i*5.8} y={26-26*f} width={3.2} height={26*f} rx={0.8} fill={C.green}/>))}</svg>';
NP += '<span style={{fontSize:10,color:C.textDim}}>Powered by AGF Tutoring \u00b7 Grounded in curated notes</span>';
NP += '</div>';
NP += '<a href="https://agftutoring.co.uk" target="_blank" rel="noopener" style={{fontSize:10,color:C.textDim,textDecoration:"none"}}>agftutoring.co.uk</a>';
NP += '</footer>';

NP += '<style>{CSS}</style>';
NP += '</div>);}\n  ';

var newSrc = src.substring(0, startIdx) + NP + src.substring(endIdx);
fs.writeFileSync(FILE, newSrc, "utf8");
console.log("\nSUCCESS! Wrote " + newSrc.length + " chars");
console.log("Next: npm run dev, check localhost, then git add/commit/push");
