/**
 * AGF Companion — IUPAC Naming + Overload Fix (v4)
 * 
 * cd C:\Users\alast\Downloads\agf-companion
 * node patch-all.js
 */

const fs = require('fs');
const path = require('path');

const PAGE_JS = path.join(__dirname, 'app', 'page.js');
let code = fs.readFileSync(PAGE_JS, 'utf8');
let steps = 0;

// ═══════════════════════════════════════════════════════════════
// STEP 1: FIND AND REPLACE ORGANIC SECTION
// ═══════════════════════════════════════════════════════════════

// Strategy: find the START marker and END marker, replace everything between
const START = 'TOPIC 4 — ORGANIC & ALKANES';
const END = 'Tests: Br₂ water decolourises, KMnO₄ decolourises';

const startIdx = code.indexOf(START);
const endIdx = code.indexOf(END);

if (startIdx === -1) {
  console.error('❌ Cannot find "' + START + '" in page.js');
  process.exit(1);
}
if (endIdx === -1) {
  console.error('❌ Cannot find "' + END + '" in page.js');
  process.exit(1);
}
if (endIdx < startIdx) {
  console.error('❌ END marker found before START marker — unexpected file structure');
  process.exit(1);
}

// Grab the full old section including both markers
const oldSection = code.substring(startIdx, endIdx + END.length);

// Detect whether newlines are stored as literal \n or actual newline
const usesEscaped = oldSection.includes('\\n');
const NL = usesEscaped ? '\\n' : '\n';

console.log('   Detected newline format: ' + (usesEscaped ? 'escaped \\n (template literal)' : 'actual newlines'));

const newSection = [
  'TOPIC 4 — ORGANIC CHEMISTRY & ALKANES',
  '',
  'IUPAC NAMING — CRITICAL RULES (follow EXACTLY):',
  'Step 1: Find the LONGEST continuous carbon chain — this is the parent name.',
  '  1C=meth, 2C=eth, 3C=prop, 4C=but, 5C=pent, 6C=hex, 7C=hept, 8C=oct, 9C=non, 10C=dec',
  '  IMPORTANT: The longest chain may NOT be drawn horizontally — it can bend or turn!',
  'Step 2: Number from the end giving LOWEST locants to substituents/functional groups.',
  'Step 3: Name branches: CH₃=methyl, C₂H₅=ethyl, C₃H₇=propyl.',
  'Step 4: Use di-, tri-, tetra- for multiple identical substituents.',
  'Step 5: List substituents ALPHABETICALLY (ignore di-/tri- for alphabetical order).',
  'Step 6: Commas between numbers, hyphens between numbers and letters.',
  '',
  'WORKED NAMING EXAMPLES:',
  '• CH₃CH₂CH₂CH₃ = butane (4C chain, no branches)',
  '• CH₃CH(CH₃)CH₂CH₃ = 2-methylbutane (longest chain 4C, CH₃ at C2)',
  '• CH₃C(CH₃)₂CH₃ = 2,2-dimethylpropane (longest chain 3C, two CH₃ at C2)',
  '• CH₃CH₂CH(CH₃)CH(CH₃)CH₂CH₃ = 3,4-dimethylhexane (6C chain)',
  '• CH₃CH(CH₃)CH(C₂H₅)CH₃: longest chain is 5C through the ethyl group → 2,3-dimethylpentane NOT 2-methyl-3-ethylbutane',
  '',
  'COMMON NAMING MISTAKES TO AVOID:',
  '1. NOT finding the longest chain — it can bend/turn in the structure',
  '2. Numbering from the wrong end — always give lowest locants',
  '3. Using ethyl when the longest chain runs through that group',
  '',
  'TYPES OF FORMULA:',
  '• Molecular: just atoms e.g. C₄H₁₀',
  '• Structural: shows groupings e.g. CH₃CH(CH₃)₂',
  '• Displayed: shows ALL bonds explicitly',
  '• Skeletal: zig-zag, each vertex/end = carbon, H on C not shown',
  'Always state which type of formula you are showing.',
  '',
  'STRUCTURAL ISOMERISM:',
  'Types: chain, position, functional group isomerism',
  '• C₄H₁₀: 2 isomers (butane, 2-methylpropane)',
  '• C₅H₁₂: 3 isomers (pentane, 2-methylbutane, 2,2-dimethylpropane)',
  '',
  'ALKANES — PROPERTIES:',
  'General formula CₙH₂ₙ₊₂, saturated, tetrahedral 109.5° at each C',
  'bp↑chain length (stronger London forces), bp↓branching (less surface contact)',
  'Non-polar → only London dispersion forces',
  '',
  'FREE RADICAL SUBSTITUTION (FRS):',
  'Conditions: UV light + halogen (Cl₂ or Br₂)',
  'Initiation: Cl₂ → 2Cl• (homolytic fission)',
  'Propagation: Cl• + CH₄ → CH₃• + HCl, then CH₃• + Cl₂ → CH₃Cl + Cl•',
  'Termination: two radicals combine e.g. CH₃• + CH₃• → C₂H₆',
  'Limitation: mixture of products (CH₂Cl₂, CHCl₃, CCl₄)',
  '',
  'Combustion: complete(CO₂+H₂O), incomplete(CO/C). Cracking: heat/catalyst',
  '',
  'TOPIC 5 — ALKENES',
  'General formula CₙH₂ₙ, unsaturated (contains C=C)',
  'C=C = one σ bond + one π bond. Restricted rotation → E/Z isomerism',
  '',
  'NAMING ALKENES:',
  'Same IUPAC rules, suffix -ene. Number to give C=C the lowest locant.',
  '• CH₂=CHCH₂CH₃ = but-1-ene',
  '• CH₃CH=CHCH₃ = but-2-ene',
  '• CH₂=CHCH₂CH(CH₃)CH₃ = 4-methylpent-1-ene',
  '• CH₃CH=C(CH₃)CH₃ = 2-methylbut-2-ene',
  '',
  'E/Z ISOMERISM:',
  'Requires: restricted rotation (C=C) AND two different groups on EACH C of C=C',
  'Z = higher priority groups SAME side, E = OPPOSITE sides',
  'Priority: higher atomic number = higher priority (CIP rules)',
  '',
  'REACTIONS — Electrophilic Addition:',
  '1. + HBr → bromoalkane (Markovnikov applies)',
  '2. + Br₂ → dibromoalkane (TEST: decolourises bromine water)',
  '3. + steam + H₃PO₄ → alcohol',
  '4. + H₂ + Ni → alkane',
  'Also: KMnO₄ decolourises (test for unsaturation)',
  '',
  "MARKOVNIKOV'S RULE:",
  "H adds to C with MORE H's → more stable carbocation (3°>2°>1°)",
  'Example: propene + HBr → 2-bromopropane (major)',
  '',
  'Tests: Br₂ water decolourises, KMnO₄ decolourises',
].join(NL);

code = code.substring(0, startIdx) + newSection + code.substring(endIdx + END.length);
steps++;
console.log('✅ Step ' + steps + ': Enriched organic chemistry with IUPAC naming rules');


// ═══════════════════════════════════════════════════════════════
// STEP 2: OVERLOAD RETRY
// ═══════════════════════════════════════════════════════════════

const catchStr = '}catch(e){setErr(e.message);}finally{setLoading(false);};},[currentUnit,quizHistory]);';

if (code.includes(catchStr)) {
  code = code.replace(
    catchStr,
    '}catch(e){' +
      'if(e.message&&(e.message.includes("overload")||e.message.includes("529")||e.message.includes("capacity"))){' +
        'setErr("API busy — retrying in 3s...");' +
        'await new Promise(r=>setTimeout(r,3000));' +
        'try{' +
          'const res2=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:[{role:"user",content:`Generate question ${questionNumber}/10. Respond with ONLY JSON.`}],system:QUIZ_GEN_SYSTEM(currentUnit.system),mode:"quiz"})});' +
          'const d2=await res2.json();' +
          'if(!d2.error){const t2=d2.content?.map(b=>b.type==="text"?b.text:"").filter(Boolean).join("\\n")||"";const p2=parseJSON(t2);if(p2&&p2.question&&p2.options&&p2.correctLabel){setQuizQ(p2);setErr(null);setLoading(false);return;}}' +
        '}catch(e2){}' +
      '}' +
      'setErr(e.message+" — Click Retry or start a New Quiz.");' +
    '}finally{setLoading(false);};},[currentUnit,quizHistory]);'
  );
  steps++;
  console.log('✅ Step ' + steps + ': Added overload retry to quiz');
} else {
  console.log('⏭️  Quiz error handler format not matched — skipping overload retry');
}


// ═══════════════════════════════════════════════════════════════
// WRITE
// ═══════════════════════════════════════════════════════════════

fs.writeFileSync(PAGE_JS, code, 'utf8');
console.log('\n✅ ' + steps + ' patch(es) applied!');
console.log('\n📋 Next:');
console.log('   npm run dev');
console.log('   Test: "Name CH₃CH(CH₃)CH₂CH₃" → should get 2-methylbutane');
console.log('   git add . && git commit -m "Enrich organic naming + overload retry" && git push');
