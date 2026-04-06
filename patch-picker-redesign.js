const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, 'app', 'page.js');
let src = fs.readFileSync(FILE, 'utf8');
const original = src;
let count = 0;

function patch(label, marker, replacement) {
  if (src.includes(marker)) {
    src = src.replace(marker, replacement);
    console.log("  OK: " + label);
    count++;
  } else {
    console.log("  FAIL: " + label);
  }
}

console.log('\nExam Picker Redesign\n');

// 1. Replace CATALOG
const catStart = src.indexOf('const CATALOG = [');
const catEndMarker = '];\r\n\r\n/* \u2550\u2550\u2550';
const catEnd = src.indexOf(catEndMarker, catStart);
if (catStart !== -1 && catEnd !== -1) {
  const newCat = `const CATALOG = [
  {
    id: "chemistry", name: "Chemistry", icon: "\u2697", colour: "#4d9460",
    subtitle: "Structure, bonding, organic, energetics, redox, groups",
    systems: [
      { system: "International A-Level", boards: [
        { board: "Pearson Edexcel IAL", expanded: true, papers: [
          { unitKey: "chem1", name: "Unit 1 (WCH11)", subtitle: "Structure, Bonding & Intro to Organic" },
          { unitKey: "chem2", name: "Unit 2 (WCH12)", subtitle: "Energetics, Group Chemistry & Organic" },
          { unitKey: "chem1", name: "Unit 3 (WCH13)", subtitle: "Practical Skills" },
          { unitKey: "chem2", name: "Unit 4 (WCH14)", subtitle: "Rates, Equilibria & Further Organic" },
          { unitKey: "chem2", name: "Unit 5 (WCH15)", subtitle: "Transition Metals & Organic Nitrogen" },
          { unitKey: "chem2", name: "Unit 6 (WCH16)", subtitle: "Practical Skills II" },
        ]},
        { board: "OxfordAQA", unitKey: "chem1" },
        { board: "Cambridge International", unitKey: "chem1" },
      ]},
      { system: "UK A-Level", boards: [
        { board: "Pearson Edexcel", unitKey: "chem1" },
        { board: "AQA", unitKey: "chem1" },
        { board: "OCR", unitKey: "chem1" },
        { board: "WJEC / Eduqas", unitKey: "chem1" },
        { board: "CCEA", unitKey: "chem1" },
      ]},
      { system: "GCSE / IGCSE", boards: [
        { board: "Foundation", unitKey: "chem1" },
        { board: "Higher", unitKey: "chem1" },
      ]},
      { system: "IB Diploma", boards: [
        { board: "Chemistry SL", unitKey: "chem1" },
        { board: "Chemistry HL", unitKey: "chem2" },
      ]},
      { system: "AP", boards: [
        { board: "AP Chemistry", unitKey: "chem2" },
      ]},
    ],
  },
  {
    id: "physics", name: "Physics", icon: "\u26A1", colour: "#5b7bbf",
    subtitle: "Mechanics, waves, electricity, fields, nuclear",
    systems: [
      { system: "International A-Level", boards: [
        { board: "Pearson Edexcel IAL", expanded: true, papers: [
          { unitKey: "phys1", name: "Unit 1 (WPH11)", subtitle: "Mechanics & Materials" },
          { unitKey: "phys2", name: "Unit 2 (WPH12)", subtitle: "Waves & Electricity" },
          { unitKey: "phys1", name: "Unit 3 (WPH13)", subtitle: "Practical Skills" },
          { unitKey: "phys2", name: "Unit 4 (WPH14)", subtitle: "Further Mechanics, Fields & Particles" },
          { unitKey: "phys2", name: "Unit 5 (WPH15)", subtitle: "Thermodynamics, Radiation, Oscillations" },
          { unitKey: "phys2", name: "Unit 6 (WPH16)", subtitle: "Practical Skills II" },
        ]},
        { board: "OxfordAQA", unitKey: "phys1" },
        { board: "Cambridge International", unitKey: "phys1" },
      ]},
      { system: "UK A-Level", boards: [
        { board: "Pearson Edexcel", unitKey: "phys1" },
        { board: "AQA", unitKey: "phys1" },
        { board: "OCR", unitKey: "phys1" },
        { board: "WJEC / Eduqas", unitKey: "phys1" },
        { board: "CCEA", unitKey: "phys1" },
      ]},
      { system: "GCSE / IGCSE", boards: [
        { board: "Foundation", unitKey: "phys1" },
        { board: "Higher", unitKey: "phys1" },
      ]},
      { system: "IB Diploma", boards: [
        { board: "Physics SL", unitKey: "phys1" },
        { board: "Physics HL", unitKey: "phys2" },
      ]},
      { system: "AP", boards: [
        { board: "AP Physics 1", unitKey: "phys1" },
        { board: "AP Physics 2", unitKey: "phys2" },
        { board: "AP Physics C: Mechanics", unitKey: "phys1" },
        { board: "AP Physics C: E&M", unitKey: "phys2" },
      ]},
    ],
  },
  {
    id: "maths", name: "Mathematics", icon: "\uD83D\uDCD0", colour: "#bf8f3d",
    subtitle: "Pure, applied, statistics, mechanics, calculus",
    systems: [
      { system: "International A-Level", boards: [
        { board: "Pearson Edexcel IAL", expanded: true, papers: [
          { unitKey: "maths", name: "Pure 1 (WMA11)", subtitle: "Algebra, coordinate geometry, calculus" },
          { unitKey: "maths", name: "Pure 2 (WMA12)", subtitle: "Trig, exponentials, sequences" },
          { unitKey: "maths", name: "Pure 3 (WMA13)", subtitle: "Further algebra, calculus, vectors" },
          { unitKey: "maths", name: "Pure 4 (WMA14)", subtitle: "Further calculus, differential equations" },
          { unitKey: "maths", name: "Statistics 1 (WST01)", subtitle: "Probability, distributions" },
          { unitKey: "maths", name: "Mechanics 1 (WME01)", subtitle: "Kinematics, forces, moments" },
        ]},
        { board: "OxfordAQA", unitKey: "maths" },
        { board: "Cambridge International", unitKey: "maths" },
      ]},
      { system: "UK A-Level", boards: [
        { board: "Pearson Edexcel", unitKey: "maths" },
        { board: "AQA", unitKey: "maths" },
        { board: "OCR", unitKey: "maths" },
        { board: "WJEC / Eduqas", unitKey: "maths" },
        { board: "CCEA", unitKey: "maths" },
      ]},
      { system: "GCSE / IGCSE", boards: [
        { board: "Foundation", unitKey: "maths" },
        { board: "Higher", unitKey: "maths" },
      ]},
      { system: "IB Diploma", boards: [
        { board: "Analysis & Approaches", unitKey: "maths" },
        { board: "Applications & Interpretation", unitKey: "maths" },
      ]},
      { system: "AP", boards: [
        { board: "AP Calculus AB", unitKey: "maths" },
        { board: "AP Calculus BC", unitKey: "maths" },
      ]},
    ],
  },
  { id: "sat", name: "SAT", icon: "\uD83D\uDCDD", colour: "#7b5bbf", subtitle: "Scholastic Assessment Test",
    systems: [{ system: "SAT Math", boards: [{ board: "College Board SAT", papers: [{ unitKey: "sat-math", name: "SAT Math", subtitle: "Problem Solving & Data Analysis" }]}]}] },
  { id: "act", name: "ACT", icon: "\u270F\uFE0F", colour: "#7b5bbf", subtitle: "American College Testing",
    systems: [{ system: "ACT Math", boards: [{ board: "ACT Math", papers: [{ unitKey: "sat-math", name: "ACT Math", subtitle: "Shares SAT Math content" }]}]}] },
  { id: "gmat", name: "GMAT", icon: "\uD83C\uDFAF", colour: "#7b5bbf", subtitle: "Graduate Management Admission Test", unitKey: "sat-math" },
  { id: "gre", name: "GRE", icon: "\uD83D\uDCCA", colour: "#7b5bbf", subtitle: "Graduate Record Examination", unitKey: "sat-math" },
  { id: "lnat", name: "LNAT", icon: "\u2696\uFE0F", colour: "#7b5bbf", subtitle: "Law National Aptitude Test", unitKey: "sat-math" },
  { id: "ucat", name: "UCAT", icon: "\uD83E\uDE7A", colour: "#7b5bbf", subtitle: "University Clinical Aptitude Test", unitKey: "sat-math" },
  { id: "ielts", name: "IELTS", icon: "\uD83C\uDF10", colour: "#3d8b7a", subtitle: "International English Language Testing System", unitKey: "sat-math" },
  { id: "toefl", name: "TOEFL", icon: "\uD83D\uDDE3\uFE0F", colour: "#3d8b7a", subtitle: "Test of English as a Foreign Language", unitKey: "sat-math" },
];`;
  src = src.substring(0, catStart) + newCat + src.substring(catEnd);
  console.log('  OK: Replace CATALOG (all boards live, no Coming Soon)');
  count++;
} else {
  console.log('  FAIL: CATALOG boundaries not found', catStart, catEnd);
}

// 2. Replace exam picker rendering
const epStart = src.indexOf('if(pickerStep==="exam"&&selectedCatalog){');
// Find the "/* ─── QUIZ RESULTS" marker and go back to the newline before it
const qrMarker = '/* \u2500\u2500\u2500 QUIZ RESULTS';
const qrIdx = src.indexOf(qrMarker, epStart);
if (epStart !== -1 && qrIdx !== -1) {
  // Walk back to find start of line with QUIZ RESULTS
  let lineStart = qrIdx;
  while (lineStart > 0 && src[lineStart-1] !== '\n') lineStart--;
  
  const newEP = `if(pickerStep==="exam"&&selectedCatalog){const cat=selectedCatalog;if(cat.unitKey&&UNITS[cat.unitKey]){selectUnit(cat.unitKey);return null;}return(<div style={{width:"100%",minHeight:"100vh",display:"flex",flexDirection:"column",background:C.bg,fontFamily:"'Outfit',sans-serif",color:C.text}}><div style={{padding:"16px 20px",borderBottom:\`1px solid \${C.border}\`,display:"flex",alignItems:"center",gap:12}}><button onClick={()=>setPickerStep("subject")} style={{padding:"8px 16px",borderRadius:8,border:\`1px solid \${C.greenBorder}\`,background:C.greenDim,color:C.green,cursor:"pointer",fontSize:13,fontWeight:600,transition:"all 0.2s"}} onMouseEnter={e=>{e.currentTarget.style.background=C.green;e.currentTarget.style.color=C.bg;}} onMouseLeave={e=>{e.currentTarget.style.background=C.greenDim;e.currentTarget.style.color=C.green;}}>{"\\u2190 All Subjects"}</button><div style={{flex:1}}><div style={{fontFamily:"'DM Serif Display',serif",fontSize:20,letterSpacing:"-0.02em",display:"flex",alignItems:"center",gap:10}}><SubjectIcon id={cat.id} size={28} colour={cat.colour}/> {cat.name}</div><div style={{fontSize:12,color:C.textDim,marginTop:2}}>What are you studying?</div></div></div><div style={{flex:1,overflowY:"auto",padding:"24px 20px",maxWidth:680,margin:"0 auto",width:"100%"}}>{cat.systems?cat.systems.map((sys,si)=>(<div key={si} style={{marginBottom:24,...(si>0?{borderTop:\`1px solid \${C.border}\`,paddingTop:20}:{})}}><div style={{fontSize:11,fontWeight:600,color:C.green,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:10}}>{sys.system}</div>{sys.boards.map((board,bi)=>{if(board.expanded&&board.papers){return(<div key={bi} style={{marginBottom:12}}><div style={{fontSize:14,fontWeight:500,marginBottom:8,color:C.text}}>{board.board}</div><div style={{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:6}}>{board.papers.map((paper,pi)=>{const isAvail=paper.unitKey&&UNITS[paper.unitKey];return(<button key={pi} onClick={()=>isAvail&&selectUnit(paper.unitKey)} style={{padding:"10px 12px",borderRadius:8,textAlign:"left",background:C.bgCard,border:\`1px solid \${C.border}\`,cursor:isAvail?"pointer":"default",opacity:isAvail?1:0.5,transition:"all 0.2s"}} onMouseEnter={e=>{if(isAvail){e.currentTarget.style.borderColor=cat.colour;e.currentTarget.style.transform="translateY(-1px)";}}} onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.transform="none";}}><div style={{fontSize:12,fontWeight:500,color:isAvail?C.text:C.textDim}}>{paper.name}</div><div style={{fontSize:10,color:C.textDim,marginTop:2}}>{paper.subtitle}</div></button>);})}</div></div>);}return null;})}{(()=>{const pills=sys.boards.filter(b=>!b.expanded);if(!pills.length)return null;return(<div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:sys.boards.some(b=>b.expanded)?8:0}}>{pills.map((board,bi)=>{const uk=board.unitKey;const isAvail=uk&&UNITS[uk];return(<button key={bi} onClick={()=>isAvail&&selectUnit(uk)} style={{padding:"9px 16px",borderRadius:8,background:C.bgCard,border:\`1px solid \${C.border}\`,fontSize:13,cursor:isAvail?"pointer":"default",opacity:isAvail?1:0.5,color:isAvail?C.text:C.textDim,transition:"all 0.2s"}} onMouseEnter={e=>{if(isAvail){e.currentTarget.style.borderColor=cat.colour;e.currentTarget.style.transform="translateY(-1px)";}}} onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.transform="none";}}>{board.board}</button>);})}</div>);})()}</div>)):<div style={{textAlign:"center",padding:60}}><SubjectIcon id={cat.id} size={56} colour={cat.colour}/><div style={{fontSize:18,fontFamily:"'DM Serif Display',serif",marginTop:16,marginBottom:8}}>{cat.name}</div><div style={{fontSize:13,color:C.textMuted}}>{cat.subtitle}</div></div>}<div style={{marginTop:24,padding:"12px 16px",background:"rgba(77,148,96,0.04)",border:\`1px solid rgba(77,148,96,0.12)\`,borderRadius:8,fontSize:12,color:C.textDim,lineHeight:1.6}}>All boards share the same core content {"\\u2014"} the companion adapts terminology and exam technique to your board.</div></div><style>{CSS}</style></div>);}\r\n\r\n  `;

  src = src.substring(0, epStart) + newEP + src.substring(lineStart);
  console.log('  OK: Replace exam picker rendering (compact pills)');
  count++;
} else {
  console.log('  FAIL: exam picker boundaries not found', epStart, qrIdx);
}

// 3. Fix subject picker availability checks for unitKey-based subjects
patch('Fix availability check',
  'color:s.systems?C.green:C.textDim}}>{s.systems?"Available":"Coming soon"}',
  'color:(s.systems||s.unitKey)?C.green:C.textDim}}>{(s.systems||s.unitKey)?"Available":"Coming soon"}');

patch('Fix clickability',
  'background:s.systems?C.bgCard:"transparent"',
  'background:(s.systems||s.unitKey)?C.bgCard:"transparent"');

patch('Fix cursor/opacity',
  'cursor:s.systems?"pointer":"default",transition:"all 0.25s",opacity:s.systems?1:0.45',
  'cursor:(s.systems||s.unitKey)?"pointer":"default",transition:"all 0.25s",opacity:(s.systems||s.unitKey)?1:0.45');

patch('Fix hover guard',
  'if(s.systems){e.currentTarget.style.borderColor=C.green;e.currentTarget.style.transform="translateY(-2px)";}',
  'if(s.systems||s.unitKey){e.currentTarget.style.borderColor=C.green;e.currentTarget.style.transform="translateY(-2px)";}');

if (src !== original) {
  fs.writeFileSync(FILE, src, 'utf8');
  console.log('\nDone: ' + count + ' patches applied.');
  console.log('\nnpm run dev');
  console.log('git add .');
  console.log('git commit -m "Redesign exam picker: compact layout, all boards live, no Coming Soon"');
  console.log('git push');
  console.log('del patch-picker-redesign.js');
} else {
  console.log('\nNo changes made.');
}
