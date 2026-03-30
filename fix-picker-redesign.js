/**
 * fix-picker-redesign.js
 * Replaces the subject picker with editorial design matching agftutoring.co.uk
 * Run: node fix-picker-redesign.js
 */
const fs = require("fs");
const path = require("path");
const FILE = path.join(__dirname, "app", "page.js");

let src = fs.readFileSync(FILE, "utf8");
console.log("Read page.js: " + src.length + " chars");

// The picker is: if(pickerStep==="subject"){...return(<div...>...</div>);}
// Find it
var startMatch = 'if(pickerStep==="subject")';
var startIdx = src.indexOf(startMatch);
if (startIdx === -1) {
  startMatch = "if(pickerStep===\"subject\")";
  startIdx = src.indexOf(startMatch);
}
if (startIdx === -1) {
  startMatch = 'if (pickerStep === "subject")';
  startIdx = src.indexOf(startMatch);
}
if (startIdx === -1) {
  console.error("FATAL: Could not find pickerStep===subject. Aborting.");
  process.exit(1);
}
console.log("Found picker start at char " + startIdx);

// Now find the end. The picker block ends with a closing that leads into:
// if(pickerStep==="exam"
var endMatch = 'if(pickerStep==="exam"';
var endIdx = src.indexOf(endMatch, startIdx + 10);
if (endIdx === -1) {
  endMatch = 'if (pickerStep === "exam"';
  endIdx = src.indexOf(endMatch, startIdx + 10);
}
if (endIdx === -1) {
  console.error("FATAL: Could not find pickerStep===exam. Aborting.");
  process.exit(1);
}
console.log("Found exam section at char " + endIdx);

// Walk backward from endIdx to skip whitespace/newlines
var blockEnd = endIdx;
while (blockEnd > 0 && (src[blockEnd-1] === " " || src[blockEnd-1] === "\n" || src[blockEnd-1] === "\r")) blockEnd--;
// We need to be after the closing of the subject block
// The subject block ends with } right before the exam if
// Make sure blockEnd is right after the }
// Actually let's just replace from startIdx to endIdx (exclusive)
// and re-add proper spacing

console.log("Replacing chars " + startIdx + " to " + endIdx);
console.log("Old picker: " + (endIdx - startIdx) + " chars");

// Build the new picker
// Note: CATALOG is an array, not object. We use .filter() directly.
// The click handler is: setSelectedCatalog(s);setPickerStep("exam");

var NP = '';
NP += 'if(pickerStep==="subject"){';
NP += 'const coreSubjects=CATALOG.filter(s=>["chemistry","physics","maths"].includes(s.id));';
NP += 'const otherSubjects=CATALOG.filter(s=>!["chemistry","physics","maths"].includes(s.id));';
NP += 'const boardTags={chemistry:"Edexcel IAL \\u00b7 AQA \\u00b7 OCR \\u00b7 Cambridge \\u00b7 IB \\u00b7 AP",physics:"Edexcel IAL \\u00b7 AQA \\u00b7 OCR \\u00b7 Cambridge \\u00b7 IB \\u00b7 AP",maths:"Edexcel IAL \\u00b7 AQA \\u00b7 OCR \\u00b7 IB \\u00b7 AP \\u00b7 SAT \\u00b7 GMAT"};';
NP += 'const unis=["Oxford","Cambridge","Harvard","MIT","Stanford","Princeton","Yale","Columbia","Cornell","Caltech","Imperial College","LSE","UCL","King\\u2019s College London","Brown","Dartmouth","Rice","UC Berkeley","UCLA","UPenn","Wharton","McGill","Toronto","Edinburgh","St Andrews","Warwick","Bristol","Durham","Manchester","Glasgow","Exeter","Bath","London Business School","INSEAD","HEC Paris","Bocconi","Erasmus","Delft","Copenhagen Business School","KU Leuven","UBC","Michigan","UNC Chapel Hill","Kellogg","Stanford GSB","Haas Berkeley"];';
NP += 'const tickerText=unis.join("  \\u00b7  ");';
NP += 'return(<div style={{width:"100%",minHeight:"100vh",background:C.bg,fontFamily:"\'Outfit\',sans-serif",color:C.text,overflowX:"hidden"}}>';

// NAV BAR
NP += '<nav style={{padding:"18px 32px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${C.border}`,maxWidth:1200,margin:"0 auto"}}>';
NP += '<div style={{display:"flex",alignItems:"center",gap:12}}>';
NP += '<svg width="22" height="26" viewBox="0 0 22 26">{[0.5,0.85,1,0.65].map((f,i)=>(<rect key={i} x={i*5.8} y={26-26*f} width={3.2} height={26*f} rx={0.8} fill={C.green}/>))}</svg>';
NP += '<div><div style={{fontFamily:"\'DM Serif Display\',serif",fontSize:18,fontWeight:400,letterSpacing:"-0.02em",lineHeight:1}}>AGF</div>';
NP += '<div style={{fontSize:8.5,fontWeight:500,letterSpacing:"0.15em",textTransform:"uppercase",color:C.textMuted,marginTop:1}}>TUTORING</div></div>';
NP += '</div>';
NP += '<a href="https://agftutoring.co.uk" target="_blank" rel="noopener" style={{fontSize:12,color:C.textDim,textDecoration:"none"}}>agftutoring.co.uk</a>';
NP += '</nav>';

// HERO
NP += '<section style={{maxWidth:800,margin:"0 auto",padding:"72px 32px 0",textAlign:"center"}}>';
NP += '<div style={{fontSize:11,fontWeight:500,letterSpacing:"0.12em",textTransform:"uppercase",color:C.green,marginBottom:24}}>Study Companion</div>';
NP += '<h1 style={{fontFamily:"\'DM Serif Display\',serif",fontSize:"clamp(32px, 5vw, 52px)",fontWeight:400,lineHeight:1.15,letterSpacing:"-0.02em",color:C.text,marginBottom:20}}>Sixty thousand hours<br/>of tutoring, <em style={{color:C.green,fontStyle:"italic"}}>distilled.</em></h1>';
NP += '<p style={{fontSize:15,fontWeight:300,lineHeight:1.7,color:C.textMuted,maxWidth:520,margin:"0 auto 36px"}}>An AI study companion built on three decades of diagnostic teaching \\u2014 giving every student access to the expertise behind some of the world\\u2019s strongest academic outcomes.</p>';

// Stats
NP += '<div style={{display:"flex",justifyContent:"center",gap:40,marginBottom:32}}>';
NP += '{[{n:"60k+",l:"hours taught"},{n:"30",l:"years\\u2019 experience"},{n:"100+",l:"university placements"}].map((s,i)=>(';
NP += '<div key={i} style={{textAlign:"center"}}>';
NP += '<div style={{fontFamily:"\'DM Serif Display\',serif",fontSize:28,color:C.green,letterSpacing:"-0.02em",lineHeight:1}}>{s.n}</div>';
NP += '<div style={{fontSize:11,color:C.textDim,textTransform:"uppercase",letterSpacing:"0.08em",marginTop:6,fontWeight:400}}>{s.l}</div>';
NP += '</div>))}</div>';

// Quote
NP += '<div style={{borderLeft:`2px solid ${C.greenBorder}`,paddingLeft:20,maxWidth:520,margin:"0 auto 16px",textAlign:"left"}}>';
NP += '<div style={{fontFamily:"\'DM Serif Display\',serif",fontSize:15,fontStyle:"italic",color:C.textMuted,lineHeight:1.6}}>The real task of teaching is not to add more information \\u2014 it is to remove confusion.</div>';
NP += '<div style={{fontSize:11,color:C.textDim,marginTop:8}}>Alastair Fisher \\u00b7 AGF Tutoring</div>';
NP += '</div></section>';

// UNIVERSITY TICKER
NP += '<div style={{overflow:"hidden",padding:"24px 0 40px",position:"relative"}}>';
NP += '<div style={{position:"absolute",left:0,top:0,bottom:0,width:80,background:`linear-gradient(to right, ${C.bg}, transparent)`,zIndex:2}}/>';
NP += '<div style={{position:"absolute",right:0,top:0,bottom:0,width:80,background:`linear-gradient(to left, ${C.bg}, transparent)`,zIndex:2}}/>';
NP += '<div style={{display:"flex",animation:"ticker 60s linear infinite",whiteSpace:"nowrap"}}>';
NP += '<div style={{fontFamily:"\'DM Serif Display\',serif",fontSize:13,color:C.green,opacity:0.35,paddingRight:40}}>{tickerText}  \\u00b7  {tickerText}</div>';
NP += '</div></div>';

// CHOOSE SUBJECT DIVIDER
NP += '<div style={{maxWidth:900,margin:"0 auto",padding:"0 32px"}}>';
NP += '<div style={{display:"flex",alignItems:"center",gap:20,marginBottom:48}}>';
NP += '<div style={{flex:1,height:1,background:C.border}}/>';
NP += '<span style={{fontSize:11,fontWeight:500,letterSpacing:"0.12em",textTransform:"uppercase",color:C.textDim}}>Choose your subject</span>';
NP += '<div style={{flex:1,height:1,background:C.border}}/>';
NP += '</div></div>';

// CORE SUBJECTS
NP += '<div style={{maxWidth:900,margin:"0 auto",padding:"0 32px",display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:20,marginBottom:56}}>';
NP += '{coreSubjects.map(s=>(<button key={s.id} onClick={()=>{setSelectedCatalog(s);setPickerStep("exam");}}';
NP += ' style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:12,padding:"28px 24px",cursor:"pointer",transition:"all 0.25s ease",textAlign:"left",position:"relative",overflow:"hidden"}}';
NP += ' onMouseEnter={e=>{e.currentTarget.style.borderColor=s.colour;e.currentTarget.style.transform="translateY(-3px)";}}';
NP += ' onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.transform="none";}}>'; 
NP += '<div style={{position:"absolute",top:0,left:0,right:0,height:3,background:s.colour,opacity:0.4,transition:"opacity 0.25s"}}/>';
NP += '<div style={{fontFamily:"\'DM Serif Display\',serif",fontSize:22,fontWeight:400,letterSpacing:"-0.02em",marginBottom:10,marginTop:8,color:C.text}}>{s.name}</div>';
NP += '<div style={{fontSize:13,color:C.textMuted,lineHeight:1.6,fontWeight:300,marginBottom:16}}>{s.subtitle}</div>';
NP += '<div style={{fontSize:10.5,color:C.textDim,letterSpacing:"0.04em",lineHeight:1.5}}>{boardTags[s.id]}</div>';
NP += '</button>))}</div>';

// ADMISSIONS DIVIDER
NP += '<div style={{maxWidth:900,margin:"0 auto",padding:"0 32px"}}>';
NP += '<div style={{display:"flex",alignItems:"center",gap:20,marginBottom:28}}>';
NP += '<div style={{flex:1,height:1,background:C.border}}/>';
NP += '<span style={{fontSize:10,fontWeight:500,letterSpacing:"0.12em",textTransform:"uppercase",color:C.textDim}}>Admissions & Language</span>';
NP += '<div style={{flex:1,height:1,background:C.border}}/>';
NP += '</div></div>';

// ADMISSIONS TILES
NP += '<div style={{maxWidth:900,margin:"0 auto",padding:"0 32px",display:"grid",gridTemplateColumns:"repeat(4, 1fr)",gap:12,marginBottom:60}}>';
NP += '{otherSubjects.map(s=>(<button key={s.id} onClick={()=>{setSelectedCatalog(s);setPickerStep("exam");}}';
NP += ' style={{background:s.systems?C.bgCard:"transparent",border:`1px solid ${C.border}`,borderRadius:8,padding:"14px 16px",cursor:s.systems?"pointer":"default",transition:"all 0.2s",opacity:s.systems?1:0.5,textAlign:"left"}}';
NP += ' onMouseEnter={e=>{if(s.systems)e.currentTarget.style.borderColor=C.green;}}';
NP += ' onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;}}>';
NP += '<div style={{fontFamily:"\'DM Serif Display\',serif",fontSize:15,fontWeight:400,marginBottom:3,color:C.text}}>{s.name}</div>';
NP += '<div style={{fontSize:10,fontWeight:500,letterSpacing:"0.06em",color:s.systems?C.green:C.textDim}}>{s.systems?"Available":"Coming soon"}</div>';
NP += '</button>))}</div>';

// FOOTER
NP += '<footer style={{borderTop:`1px solid ${C.border}`,padding:"24px 32px",maxWidth:900,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center"}}>';
NP += '<div style={{display:"flex",alignItems:"center",gap:10}}>';
NP += '<svg width="16" height="18" viewBox="0 0 22 26">{[0.5,0.85,1,0.65].map((f,i)=>(<rect key={i} x={i*5.8} y={26-26*f} width={3.2} height={26*f} rx={0.8} fill={C.green}/>))}</svg>';
NP += '<span style={{fontSize:11,color:C.textDim}}>Powered by AGF Tutoring \\u00b7 Grounded in curated notes</span>';
NP += '</div>';
NP += '<a href="https://agftutoring.co.uk" target="_blank" rel="noopener" style={{fontSize:11,color:C.textDim,textDecoration:"none"}}>agftutoring.co.uk</a>';
NP += '</footer>';

// STYLE
NP += '<style>{CSS+`@keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>';

NP += '</div>);}\n  ';

// Apply
var newSrc = src.substring(0, startIdx) + NP + src.substring(endIdx);

fs.writeFileSync(FILE, newSrc, "utf8");
console.log("");
console.log("SUCCESS! Wrote " + newSrc.length + " chars");
console.log("Old: " + (endIdx - startIdx) + " chars removed");
console.log("New: " + NP.length + " chars inserted");
console.log("");
console.log("Next: npm run dev, then git add/commit/push");
