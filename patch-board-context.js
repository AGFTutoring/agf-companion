// patch-board-context.js — Add board-specific context layer
// Every board gets its own adapted prompt prefix, welcome msg, and display name
// Run: node patch-board-context.js
// From: C:\Users\alast\Downloads\agf-companion

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

console.log('\nBoard Context Layer\n');

// ═══════════════════════════════════════════════════
// 1. Add BOARD_CONTEXT object after UNITS closing
// ═══════════════════════════════════════════════════

// Find end of UNITS and sat-math entry
const satEnd = src.indexOf('},\n};\n', src.indexOf('"sat-math"'));
const unitsClose = src.indexOf('\n};\n', src.indexOf('"sat-math"'));
// Use a reliable marker: the line after UNITS closes
const markerAfterUnits = '};\n\n/* \u2550\u2550\u2550 SHAPE SVG';
const markerAfterUnits2 = '};\r\n\r\n/* \u2550\u2550\u2550 SHAPE SVG';

let unitsEndMarker = null;
if (src.includes(markerAfterUnits2)) unitsEndMarker = markerAfterUnits2;
else if (src.includes(markerAfterUnits)) unitsEndMarker = markerAfterUnits;

if (unitsEndMarker) {
  const boardContext = `};

/* Board context overlays — prepended to system prompts when student selects a non-IAL board */
const BOARD_CONTEXT = {
  /* ─── CHEMISTRY ─── */
  "aqa-chem": { name: "AQA Chemistry", code: "AQA", welcome: "I'm loaded with **AQA A-Level Chemistry** content.", prefix: "The student is studying AQA A-Level Chemistry. Use AQA terminology and mark scheme conventions. Do not reference Edexcel unit codes (WCH11 etc). Cover the full AQA spec: Physical, Inorganic, and Organic chemistry across Papers 1, 2, and 3." },
  "ocr-chem": { name: "OCR Chemistry", code: "OCR A", welcome: "I'm loaded with **OCR A Chemistry** content.", prefix: "The student is studying OCR A-Level Chemistry. Use OCR terminology. Do not reference Edexcel unit codes. OCR papers: Periodic Table/Energy (Paper 1), Synthesis/Analytical (Paper 2), Unified (Paper 3)." },
  "wjec-chem": { name: "WJEC Chemistry", code: "WJEC", welcome: "I'm loaded with **WJEC Chemistry** content.", prefix: "The student is studying WJEC/Eduqas A-Level Chemistry. Use WJEC terminology. Do not reference Edexcel unit codes." },
  "ccea-chem": { name: "CCEA Chemistry", code: "CCEA", welcome: "I'm loaded with **CCEA Chemistry** content.", prefix: "The student is studying CCEA A-Level Chemistry. Use CCEA terminology. Do not reference Edexcel unit codes." },
  "edexcel-uk-chem": { name: "Edexcel Chemistry", code: "Edexcel", welcome: "I'm loaded with **Edexcel A-Level Chemistry** content.", prefix: "The student is studying UK Pearson Edexcel A-Level Chemistry (not IAL). Use UK Edexcel terminology. Papers 1-3 format." },
  "oxfordaqa-chem": { name: "OxfordAQA Chemistry", code: "OxfordAQA", welcome: "I'm loaded with **OxfordAQA International Chemistry** content.", prefix: "The student is studying OxfordAQA International A-Level Chemistry. Use international terminology." },
  "cambridge-chem": { name: "Cambridge Chemistry", code: "CAIE", welcome: "I'm loaded with **Cambridge International Chemistry** content.", prefix: "The student is studying Cambridge International AS & A Level Chemistry (9701). Use Cambridge terminology. Papers 1-5 format." },
  "gcse-chem-f": { name: "GCSE Chemistry (Foundation)", code: "GCSE-F", welcome: "I'm loaded with **GCSE Chemistry Foundation** content.", prefix: "The student is studying GCSE Chemistry at Foundation tier. Keep content at Foundation level. Use simpler language. Do not reference A-Level unit codes." },
  "gcse-chem-h": { name: "GCSE Chemistry (Higher)", code: "GCSE-H", welcome: "I'm loaded with **GCSE Chemistry Higher** content.", prefix: "The student is studying GCSE Chemistry at Higher tier. Cover the full Higher tier spec. Do not reference A-Level unit codes." },
  "ib-chem-sl": { name: "IB Chemistry SL", code: "IB SL", welcome: "I'm loaded with **IB Chemistry SL** content.", prefix: "The student is studying IB Chemistry at Standard Level. Use IB terminology (topics, not units). Cover the IB syllabus: Structure and Reactivity. Reference IB data booklet values. Do not reference Edexcel unit codes." },
  "ib-chem-hl": { name: "IB Chemistry HL", code: "IB HL", welcome: "I'm loaded with **IB Chemistry HL** content.", prefix: "The student is studying IB Chemistry at Higher Level. Use IB terminology. Cover all HL additional topics. Reference IB data booklet. Do not reference Edexcel unit codes." },
  "ap-chem": { name: "AP Chemistry", code: "AP", welcome: "I'm loaded with **AP Chemistry** content.\\n\\nThis covers all 9 College Board units from atomic structure to applications of thermodynamics.", prefix: "The student is studying AP Chemistry (College Board). Use AP terminology and unit numbering (Units 1-9). Cover: atomic structure, molecular bonding, intermolecular forces, chemical reactions, kinetics, thermodynamics, equilibrium, acids/bases, electrochemistry. Reference OpenStax Chemistry 2e. Do not reference Edexcel/UK unit codes." },

  /* ─── PHYSICS ─── */
  "aqa-phys": { name: "AQA Physics", code: "AQA", welcome: "I'm loaded with **AQA A-Level Physics** content.", prefix: "The student is studying AQA A-Level Physics. Use AQA terminology. Do not reference Edexcel unit codes (WPH11 etc)." },
  "ocr-phys": { name: "OCR Physics", code: "OCR A", welcome: "I'm loaded with **OCR A Physics** content.", prefix: "The student is studying OCR A-Level Physics. Use OCR terminology. Do not reference Edexcel unit codes." },
  "wjec-phys": { name: "WJEC Physics", code: "WJEC", welcome: "I'm loaded with **WJEC Physics** content.", prefix: "The student is studying WJEC/Eduqas A-Level Physics. Use WJEC terminology. Do not reference Edexcel unit codes." },
  "ccea-phys": { name: "CCEA Physics", code: "CCEA", welcome: "I'm loaded with **CCEA Physics** content.", prefix: "The student is studying CCEA A-Level Physics. Use CCEA terminology. Do not reference Edexcel unit codes." },
  "edexcel-uk-phys": { name: "Edexcel Physics", code: "Edexcel", welcome: "I'm loaded with **Edexcel A-Level Physics** content.", prefix: "The student is studying UK Pearson Edexcel A-Level Physics (not IAL). Use UK Edexcel format." },
  "oxfordaqa-phys": { name: "OxfordAQA Physics", code: "OxfordAQA", welcome: "I'm loaded with **OxfordAQA International Physics** content.", prefix: "The student is studying OxfordAQA International A-Level Physics." },
  "cambridge-phys": { name: "Cambridge Physics", code: "CAIE", welcome: "I'm loaded with **Cambridge International Physics** content.", prefix: "The student is studying Cambridge International AS & A Level Physics (9702). Use Cambridge terminology." },
  "gcse-phys-f": { name: "GCSE Physics (Foundation)", code: "GCSE-F", welcome: "I'm loaded with **GCSE Physics Foundation** content.", prefix: "The student is studying GCSE Physics at Foundation tier. Keep content at Foundation level. Do not reference A-Level unit codes." },
  "gcse-phys-h": { name: "GCSE Physics (Higher)", code: "GCSE-H", welcome: "I'm loaded with **GCSE Physics Higher** content.", prefix: "The student is studying GCSE Physics at Higher tier. Cover full Higher spec. Do not reference A-Level unit codes." },
  "ib-phys-sl": { name: "IB Physics SL", code: "IB SL", welcome: "I'm loaded with **IB Physics SL** content.", prefix: "The student is studying IB Physics at Standard Level. Use IB terminology and topics. Reference IB data booklet. Do not reference Edexcel unit codes." },
  "ib-phys-hl": { name: "IB Physics HL", code: "IB HL", welcome: "I'm loaded with **IB Physics HL** content.", prefix: "The student is studying IB Physics at Higher Level. Use IB terminology. Cover all HL additional topics. Do not reference Edexcel unit codes." },
  "ap-phys1": { name: "AP Physics 1", code: "AP 1", welcome: "I'm loaded with **AP Physics 1** content.\\n\\nAlgebra-based mechanics, waves, and circuits.", prefix: "The student is studying AP Physics 1 (College Board). Algebra-based. Cover: kinematics, dynamics, circular motion, energy, momentum, simple harmonic motion, torque, electric charge/force, DC circuits, mechanical waves/sound. Reference OpenStax University Physics Vol 1. Do not reference Edexcel unit codes." },
  "ap-phys2": { name: "AP Physics 2", code: "AP 2", welcome: "I'm loaded with **AP Physics 2** content.\\n\\nAlgebra-based thermodynamics, optics, and modern physics.", prefix: "The student is studying AP Physics 2 (College Board). Algebra-based. Cover: thermodynamics, fluids, electrostatics, electric circuits, magnetism, optics, modern physics. Reference OpenStax University Physics Vols 2-3. Do not reference Edexcel unit codes." },
  "ap-physc-mech": { name: "AP Physics C: Mechanics", code: "AP C:M", welcome: "I'm loaded with **AP Physics C: Mechanics** content.\\n\\nCalculus-based mechanics.", prefix: "The student is studying AP Physics C: Mechanics (College Board). Calculus-based. Cover: kinematics, Newton's laws, work/energy/power, systems of particles, rotation, oscillations, gravitation. Use calculus freely. Reference OpenStax University Physics Vol 1. Do not reference Edexcel unit codes." },
  "ap-physc-em": { name: "AP Physics C: E&M", code: "AP C:EM", welcome: "I'm loaded with **AP Physics C: Electricity & Magnetism** content.\\n\\nCalculus-based E&M.", prefix: "The student is studying AP Physics C: Electricity and Magnetism (College Board). Calculus-based. Cover: electrostatics, conductors/capacitors/dielectrics, electric circuits, magnetic fields, electromagnetism. Use calculus freely. Reference OpenStax University Physics Vols 2-3. Do not reference Edexcel unit codes." },

  /* ─── MATHS ─── */
  "aqa-maths": { name: "AQA Mathematics", code: "AQA", welcome: "I'm loaded with **AQA A-Level Maths** content.", prefix: "The student is studying AQA A-Level Mathematics. Use AQA terminology. Papers: Pure 1, Pure 2, Applied (Statistics & Mechanics). Do not reference Edexcel unit codes (WMA11 etc)." },
  "ocr-maths": { name: "OCR Mathematics", code: "OCR", welcome: "I'm loaded with **OCR A Mathematics** content.", prefix: "The student is studying OCR A-Level Mathematics. Use OCR terminology. Papers: Pure, Pure & Mechanics, Pure & Statistics. Do not reference Edexcel unit codes." },
  "wjec-maths": { name: "WJEC Mathematics", code: "WJEC", welcome: "I'm loaded with **WJEC Mathematics** content.", prefix: "The student is studying WJEC/Eduqas A-Level Mathematics. Use WJEC terminology. Do not reference Edexcel unit codes." },
  "ccea-maths": { name: "CCEA Mathematics", code: "CCEA", welcome: "I'm loaded with **CCEA Mathematics** content.", prefix: "The student is studying CCEA A-Level Mathematics. Use CCEA terminology. Do not reference Edexcel unit codes." },
  "edexcel-uk-maths": { name: "Edexcel Mathematics", code: "Edexcel", welcome: "I'm loaded with **Edexcel A-Level Maths** content.", prefix: "The student is studying UK Pearson Edexcel A-Level Mathematics (not IAL). Papers: Pure 1, Pure 2, Applied." },
  "oxfordaqa-maths": { name: "OxfordAQA Mathematics", code: "OxfordAQA", welcome: "I'm loaded with **OxfordAQA International Maths** content.", prefix: "The student is studying OxfordAQA International A-Level Mathematics." },
  "cambridge-maths": { name: "Cambridge Mathematics", code: "CAIE", welcome: "I'm loaded with **Cambridge International Maths** content.", prefix: "The student is studying Cambridge International AS & A Level Mathematics (9709). Use Cambridge terminology." },
  "gcse-maths-f": { name: "GCSE Maths (Foundation)", code: "GCSE-F", welcome: "I'm loaded with **GCSE Maths Foundation** content.", prefix: "The student is studying GCSE Mathematics at Foundation tier. Keep to Foundation content only. Use simpler explanations. Do not reference A-Level content or unit codes." },
  "gcse-maths-h": { name: "GCSE Maths (Higher)", code: "GCSE-H", welcome: "I'm loaded with **GCSE Maths Higher** content.", prefix: "The student is studying GCSE Mathematics at Higher tier. Cover the full Higher spec. Do not reference A-Level unit codes." },
  "ib-maths-aa": { name: "IB Maths AA", code: "IB AA", welcome: "I'm loaded with **IB Analysis & Approaches** content.\\n\\nCovers SL and HL topics.", prefix: "The student is studying IB Mathematics: Analysis and Approaches. Use IB terminology and topic numbering. Cover: algebra, functions, trig, calculus, probability/statistics. Reference IB formula booklet. Do not reference Edexcel unit codes." },
  "ib-maths-ai": { name: "IB Maths AI", code: "IB AI", welcome: "I'm loaded with **IB Applications & Interpretation** content.", prefix: "The student is studying IB Mathematics: Applications and Interpretation. Focus on modelling, statistics, and real-world applications. Use IB terminology. Do not reference Edexcel unit codes." },
  "ap-calc-ab": { name: "AP Calculus AB", code: "AP AB", welcome: "I'm loaded with **AP Calculus AB** content.\\n\\nCovers all 8 College Board units from limits to applications of integration.", prefix: "The student is studying AP Calculus AB (College Board). Cover Units 1-8: limits, differentiation (definition, rules, composite/implicit/inverse), applications of differentiation (related rates, optimization, L'Hopital), integration (Riemann sums, FTC, techniques), applications of integration (area, volume, accumulation), differential equations (slope fields, separation of variables). Reference OpenStax Calculus Vol 1. Do not reference Edexcel/UK unit codes." },
  "ap-calc-bc": { name: "AP Calculus BC", code: "AP BC", welcome: "I'm loaded with **AP Calculus BC** content.\\n\\nCovers all 10 College Board units including series and parametric.", prefix: "The student is studying AP Calculus BC (College Board). Cover all AB content plus: parametric/polar/vector functions, advanced integration (by parts, partial fractions, improper integrals), infinite sequences and series (convergence tests, Taylor/Maclaurin, power series). Reference OpenStax Calculus Vols 1-2. Do not reference Edexcel/UK unit codes." },

  /* ─── ADMISSIONS ─── */
  "gmat": { name: "GMAT Mathematics", code: "GMAT", welcome: "I'm loaded with **GMAT Quantitative** content.\\n\\nCovers problem solving and data sufficiency.", prefix: "The student is preparing for the GMAT (Graduate Management Admission Test). Focus on quantitative reasoning, data sufficiency questions, and integrated reasoning. Use GMAT-specific strategies and terminology." },
  "gre": { name: "GRE Mathematics", code: "GRE", welcome: "I'm loaded with **GRE Quantitative** content.", prefix: "The student is preparing for the GRE (Graduate Record Examination). Focus on quantitative reasoning and comparison questions. Use GRE-specific strategies." },
  "lnat": { name: "LNAT Preparation", code: "LNAT", welcome: "I'm loaded with **LNAT** preparation content.\\n\\nCovers multiple choice reasoning and essay skills.", prefix: "The student is preparing for the LNAT (Law National Aptitude Test). Focus on verbal reasoning, comprehension of argumentative passages, and essay writing skills. This is a law aptitude test, not a knowledge test." },
  "ucat": { name: "UCAT Preparation", code: "UCAT", welcome: "I'm loaded with **UCAT** preparation content.\\n\\nCovers all 5 subtests.", prefix: "The student is preparing for the UCAT (University Clinical Aptitude Test). Cover: Verbal Reasoning, Decision Making, Quantitative Reasoning, Abstract Reasoning, and Situational Judgement. Focus on time management and pattern recognition strategies." },
  "ielts": { name: "IELTS Preparation", code: "IELTS", welcome: "I'm loaded with **IELTS** preparation content.\\n\\nCovers all 4 skills.", prefix: "The student is preparing for IELTS (International English Language Testing System). Cover: Listening, Reading, Writing (Task 1 and Task 2), and Speaking. Provide band score criteria and strategies for each section. Use British English." },
  "toefl": { name: "TOEFL Preparation", code: "TOEFL", welcome: "I'm loaded with **TOEFL iBT** preparation content.", prefix: "The student is preparing for TOEFL iBT (Test of English as a Foreign Language). Cover: Reading, Listening, Speaking, and Writing sections. Use American English conventions." },
};

`;

  src = src.replace(unitsEndMarker, boardContext + '/* \u2550\u2550\u2550 SHAPE SVG');
  console.log('  OK: Add BOARD_CONTEXT object (~45 board contexts)');
  count++;
} else {
  console.log('  FAIL: Could not find UNITS end marker');
  console.log('  Looking for: }; then SHAPE SVG');
}

// ═══════════════════════════════════════════════════
// 2. Add boardOverride state and modify selectUnit
// ═══════════════════════════════════════════════════

// Add state for board override
patch('Add boardOverride state',
  'const[pickerStep,setPickerStep]=useState("subject");',
  'const[pickerStep,setPickerStep]=useState("subject");\n  const[boardOverride,setBoardOverride]=useState(null);'
);

// Modify selectUnit to accept optional boardId
patch('Modify selectUnit for board context',
  'const selectUnit=(unitKey)=>{setActiveUnit(unitKey);setPickerStep(null);setMsgs([{role:"assistant",content:UNITS[unitKey].welcome}]);setErr(null);setInput("");setMode("ask");resetQuiz();setNotesContent(null);setNotesLoading(false);setShowPicker(false);};',
  'const selectUnit=(unitKey,boardId)=>{setActiveUnit(unitKey);setBoardOverride(boardId||null);setPickerStep(null);const bc=boardId&&BOARD_CONTEXT[boardId];const welcomeBase=UNITS[unitKey].welcome;const welcomeMsg=bc?welcomeBase.replace(/\\*\\*.*?\\*\\*/, "**"+bc.name+"**").replace(/\\(W[A-Z]+\\d+\\).*?\\./,"."): welcomeBase;setMsgs([{role:"assistant",content:bc?`Hello! I\'m your **AGF Study Companion**, powered by Alastair\'s diagnostic teaching method.\\n\\n${bc.welcome}\\n\\n\\u2022 **Ask me anything** about the syllabus\\n\\u2022 Say **"quiz me"** for practice questions\\n\\nWhat shall we work on?`:welcomeMsg}]);setErr(null);setInput("");setMode("ask");resetQuiz();setNotesContent(null);setNotesLoading(false);setShowPicker(false);};'
);

// ═══════════════════════════════════════════════════
// 3. Override currentUnit to include board prefix in system prompt
// ═══════════════════════════════════════════════════

patch('Add currentUnit with board context',
  'const currentUnit=activeUnit?UNITS[activeUnit]:null;',
  'const baseUnit=activeUnit?UNITS[activeUnit]:null;\n  const currentUnit=baseUnit&&boardOverride&&BOARD_CONTEXT[boardOverride]?{...baseUnit,name:BOARD_CONTEXT[boardOverride].name,code:BOARD_CONTEXT[boardOverride].code,system:BOARD_CONTEXT[boardOverride].prefix+"\\n\\n"+baseUnit.system}:baseUnit;'
);

// ═══════════════════════════════════════════════════
// 4. Update CATALOG to pass boardId for non-IAL boards
// ═══════════════════════════════════════════════════

// Chemistry boards
patch('Chem: OxfordAQA boardId', '{ board: "OxfordAQA", unitKey: "chem1" },\n        { board: "Cambridge International", unitKey: "chem1" },\n      ]},\n      { system: "UK A-Level", boards: [\n        { board: "Pearson Edexcel", unitKey: "chem1" },\n        { board: "AQA", unitKey: "chem1" },\n        { board: "OCR", unitKey: "chem1" },\n        { board: "WJEC / Eduqas", unitKey: "chem1" },\n        { board: "CCEA", unitKey: "chem1" },',
  '{ board: "OxfordAQA", unitKey: "chem1", boardId: "oxfordaqa-chem" },\n        { board: "Cambridge International", unitKey: "chem1", boardId: "cambridge-chem" },\n      ]},\n      { system: "UK A-Level", boards: [\n        { board: "Pearson Edexcel", unitKey: "chem1", boardId: "edexcel-uk-chem" },\n        { board: "AQA", unitKey: "chem1", boardId: "aqa-chem" },\n        { board: "OCR", unitKey: "chem1", boardId: "ocr-chem" },\n        { board: "WJEC / Eduqas", unitKey: "chem1", boardId: "wjec-chem" },\n        { board: "CCEA", unitKey: "chem1", boardId: "ccea-chem" },');

patch('Chem: GCSE/IB/AP boardIds',
  '{ system: "GCSE / IGCSE", boards: [\n        { board: "Foundation", unitKey: "chem1" },\n        { board: "Higher", unitKey: "chem1" },\n      ]},\n      { system: "IB Diploma", boards: [\n        { board: "Chemistry SL", unitKey: "chem1" },\n        { board: "Chemistry HL", unitKey: "chem2" },\n      ]},\n      { system: "AP", boards: [\n        { board: "AP Chemistry", unitKey: "chem2" },\n      ]},',
  '{ system: "GCSE / IGCSE", boards: [\n        { board: "Foundation", unitKey: "chem1", boardId: "gcse-chem-f" },\n        { board: "Higher", unitKey: "chem1", boardId: "gcse-chem-h" },\n      ]},\n      { system: "IB Diploma", boards: [\n        { board: "Chemistry SL", unitKey: "chem1", boardId: "ib-chem-sl" },\n        { board: "Chemistry HL", unitKey: "chem2", boardId: "ib-chem-hl" },\n      ]},\n      { system: "AP", boards: [\n        { board: "AP Chemistry", unitKey: "chem2", boardId: "ap-chem" },\n      ]},');

// Physics boards
patch('Phys: OxfordAQA+ boardIds',
  '{ board: "OxfordAQA", unitKey: "phys1" },\n        { board: "Cambridge International", unitKey: "phys1" },\n      ]},\n      { system: "UK A-Level", boards: [\n        { board: "Pearson Edexcel", unitKey: "phys1" },\n        { board: "AQA", unitKey: "phys1" },\n        { board: "OCR", unitKey: "phys1" },\n        { board: "WJEC / Eduqas", unitKey: "phys1" },\n        { board: "CCEA", unitKey: "phys1" },',
  '{ board: "OxfordAQA", unitKey: "phys1", boardId: "oxfordaqa-phys" },\n        { board: "Cambridge International", unitKey: "phys1", boardId: "cambridge-phys" },\n      ]},\n      { system: "UK A-Level", boards: [\n        { board: "Pearson Edexcel", unitKey: "phys1", boardId: "edexcel-uk-phys" },\n        { board: "AQA", unitKey: "phys1", boardId: "aqa-phys" },\n        { board: "OCR", unitKey: "phys1", boardId: "ocr-phys" },\n        { board: "WJEC / Eduqas", unitKey: "phys1", boardId: "wjec-phys" },\n        { board: "CCEA", unitKey: "phys1", boardId: "ccea-phys" },');

patch('Phys: GCSE/IB/AP boardIds',
  '{ system: "GCSE / IGCSE", boards: [\n        { board: "Foundation", unitKey: "phys1" },\n        { board: "Higher", unitKey: "phys1" },\n      ]},\n      { system: "IB Diploma", boards: [\n        { board: "Physics SL", unitKey: "phys1" },\n        { board: "Physics HL", unitKey: "phys2" },\n      ]},\n      { system: "AP", boards: [\n        { board: "AP Physics 1", unitKey: "phys1" },\n        { board: "AP Physics 2", unitKey: "phys2" },\n        { board: "AP Physics C: Mechanics", unitKey: "phys1" },\n        { board: "AP Physics C: E&M", unitKey: "phys2" },',
  '{ system: "GCSE / IGCSE", boards: [\n        { board: "Foundation", unitKey: "phys1", boardId: "gcse-phys-f" },\n        { board: "Higher", unitKey: "phys1", boardId: "gcse-phys-h" },\n      ]},\n      { system: "IB Diploma", boards: [\n        { board: "Physics SL", unitKey: "phys1", boardId: "ib-phys-sl" },\n        { board: "Physics HL", unitKey: "phys2", boardId: "ib-phys-hl" },\n      ]},\n      { system: "AP", boards: [\n        { board: "AP Physics 1", unitKey: "phys1", boardId: "ap-phys1" },\n        { board: "AP Physics 2", unitKey: "phys2", boardId: "ap-phys2" },\n        { board: "AP Physics C: Mechanics", unitKey: "phys1", boardId: "ap-physc-mech" },\n        { board: "AP Physics C: E&M", unitKey: "phys2", boardId: "ap-physc-em" },');

// Maths boards
patch('Maths: OxfordAQA+ boardIds',
  '{ board: "OxfordAQA", unitKey: "maths" },\n        { board: "Cambridge International", unitKey: "maths" },\n      ]},\n      { system: "UK A-Level", boards: [\n        { board: "Pearson Edexcel", unitKey: "maths" },\n        { board: "AQA", unitKey: "maths" },\n        { board: "OCR", unitKey: "maths" },\n        { board: "WJEC / Eduqas", unitKey: "maths" },\n        { board: "CCEA", unitKey: "maths" },',
  '{ board: "OxfordAQA", unitKey: "maths", boardId: "oxfordaqa-maths" },\n        { board: "Cambridge International", unitKey: "maths", boardId: "cambridge-maths" },\n      ]},\n      { system: "UK A-Level", boards: [\n        { board: "Pearson Edexcel", unitKey: "maths", boardId: "edexcel-uk-maths" },\n        { board: "AQA", unitKey: "maths", boardId: "aqa-maths" },\n        { board: "OCR", unitKey: "maths", boardId: "ocr-maths" },\n        { board: "WJEC / Eduqas", unitKey: "maths", boardId: "wjec-maths" },\n        { board: "CCEA", unitKey: "maths", boardId: "ccea-maths" },');

patch('Maths: GCSE/IB/AP boardIds',
  '{ system: "GCSE / IGCSE", boards: [\n        { board: "Foundation", unitKey: "maths" },\n        { board: "Higher", unitKey: "maths" },\n      ]},\n      { system: "IB Diploma", boards: [\n        { board: "Analysis & Approaches", unitKey: "maths" },\n        { board: "Applications & Interpretation", unitKey: "maths" },\n      ]},\n      { system: "AP", boards: [\n        { board: "AP Calculus AB", unitKey: "maths" },\n        { board: "AP Calculus BC", unitKey: "maths" },',
  '{ system: "GCSE / IGCSE", boards: [\n        { board: "Foundation", unitKey: "maths", boardId: "gcse-maths-f" },\n        { board: "Higher", unitKey: "maths", boardId: "gcse-maths-h" },\n      ]},\n      { system: "IB Diploma", boards: [\n        { board: "Analysis & Approaches", unitKey: "maths", boardId: "ib-maths-aa" },\n        { board: "Applications & Interpretation", unitKey: "maths", boardId: "ib-maths-ai" },\n      ]},\n      { system: "AP", boards: [\n        { board: "AP Calculus AB", unitKey: "maths", boardId: "ap-calc-ab" },\n        { board: "AP Calculus BC", unitKey: "maths", boardId: "ap-calc-bc" },');

// Admissions/language direct-link subjects
patch('GMAT boardId', '{ id: "gmat", name: "GMAT", icon: "\uD83C\uDFAF", colour: "#7b5bbf", subtitle: "Graduate Management Admission Test", unitKey: "sat-math" }',
  '{ id: "gmat", name: "GMAT", icon: "\uD83C\uDFAF", colour: "#7b5bbf", subtitle: "Graduate Management Admission Test", unitKey: "sat-math", boardId: "gmat" }');
patch('GRE boardId', '{ id: "gre", name: "GRE", icon: "\uD83D\uDCCA", colour: "#7b5bbf", subtitle: "Graduate Record Examination", unitKey: "sat-math" }',
  '{ id: "gre", name: "GRE", icon: "\uD83D\uDCCA", colour: "#7b5bbf", subtitle: "Graduate Record Examination", unitKey: "sat-math", boardId: "gre" }');
patch('LNAT boardId', '{ id: "lnat", name: "LNAT", icon: "\u2696\uFE0F", colour: "#7b5bbf", subtitle: "Law National Aptitude Test", unitKey: "sat-math" }',
  '{ id: "lnat", name: "LNAT", icon: "\u2696\uFE0F", colour: "#7b5bbf", subtitle: "Law National Aptitude Test", unitKey: "sat-math", boardId: "lnat" }');
patch('UCAT boardId', '{ id: "ucat", name: "UCAT", icon: "\uD83E\uDE7A", colour: "#7b5bbf", subtitle: "University Clinical Aptitude Test", unitKey: "sat-math" }',
  '{ id: "ucat", name: "UCAT", icon: "\uD83E\uDE7A", colour: "#7b5bbf", subtitle: "University Clinical Aptitude Test", unitKey: "sat-math", boardId: "ucat" }');
patch('IELTS boardId', '{ id: "ielts", name: "IELTS", icon: "\uD83C\uDF10", colour: "#3d8b7a", subtitle: "International English Language Testing System", unitKey: "sat-math" }',
  '{ id: "ielts", name: "IELTS", icon: "\uD83C\uDF10", colour: "#3d8b7a", subtitle: "International English Language Testing System", unitKey: "sat-math", boardId: "ielts" }');
patch('TOEFL boardId', '{ id: "toefl", name: "TOEFL", icon: "\uD83D\uDDE3\uFE0F", colour: "#3d8b7a", subtitle: "Test of English as a Foreign Language", unitKey: "sat-math" }',
  '{ id: "toefl", name: "TOEFL", icon: "\uD83D\uDDE3\uFE0F", colour: "#3d8b7a", subtitle: "Test of English as a Foreign Language", unitKey: "sat-math", boardId: "toefl" }');

// ═══════════════════════════════════════════════════
// 5. Update exam picker to pass boardId in selectUnit calls
// ═══════════════════════════════════════════════════

// For expanded boards (Edexcel IAL units) - no boardId needed, they use default
// For pill boards - pass boardId
patch('Pass boardId from pill buttons',
  'onClick={()=>isAvail&&selectUnit(uk)}',
  'onClick={()=>isAvail&&selectUnit(uk,board.boardId)}'
);

// For direct-link subjects (GMAT, GRE etc)
patch('Pass boardId from direct-link subjects',
  'if(cat.unitKey&&UNITS[cat.unitKey]){selectUnit(cat.unitKey);return null;}',
  'if(cat.unitKey&&UNITS[cat.unitKey]){selectUnit(cat.unitKey,cat.boardId);return null;}'
);

// For subject switcher dropdown
patch('Pass boardId from switcher dropdown',
  'onClick={e=>{e.stopPropagation();selectUnit(u.id);}}',
  'onClick={e=>{e.stopPropagation();selectUnit(u.id,null);}}'
);

// ═══════════════════════════════════════════════════
// WRITE
// ═══════════════════════════════════════════════════

if (src !== original) {
  fs.writeFileSync(FILE, src, 'utf8');
  console.log('\nDone: ' + count + ' patches applied.');
  console.log('\nnpm run dev');
  console.log('Test: AP Chemistry should now say "AP Chemistry" not "WCH12"');
  console.log('Test: AQA Physics should say "AQA Physics" not "WPH11"');
  console.log('Test: Edexcel IAL should still work normally');
  console.log('git add .');
  console.log('git commit -m "Add board context layer: every board gets adapted prompt, name, welcome"');
  console.log('git push');
  console.log('del patch-board-context.js');
} else {
  console.log('\nNo changes made.');
}
