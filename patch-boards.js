/**
 * AGF Companion — Remove "Coming Soon" + Map boards to content
 * Routes all UK A-Level boards to the nearest Edexcel IAL unit
 * 
 * cd C:\Users\alast\Downloads\agf-companion
 * node patch-boards.js
 */

const fs = require('fs');
const path = require('path');

const PAGE_JS = path.join(__dirname, 'app', 'page.js');
let code = fs.readFileSync(PAGE_JS, 'utf8');
let steps = 0;

// ═══════════════════════════════════════════════════════════════
// CHEMISTRY — UK A-Level boards
// ═══════════════════════════════════════════════════════════════

// Edexcel UK — remove comingSoon, add unitKey mappings
const oldEdexcelUK = `{ board: "Pearson Edexcel", comingSoon: true, papers: [
          { name: "Paper 1", subtitle: "Core Inorganic & Physical" },`;
const newEdexcelUK = `{ board: "Pearson Edexcel", papers: [
          { name: "Paper 1", subtitle: "Core Inorganic & Physical", unitKey: "chem1" },`;

if (code.includes(oldEdexcelUK)) {
  code = code.replace(oldEdexcelUK, newEdexcelUK);
  steps++;
  console.log('✅ Chem: Edexcel UK Paper 1 → chem1');
}

// Find and update remaining Edexcel UK papers
const oldEdexP2 = '{ name: "Paper 2", subtitle: "Core Organic & Physical" },';
const oldEdexP3 = '{ name: "Paper 3", subtitle: "General & Practical" },';

// These appear in the UK A-Level section after Edexcel UK
// Need to be careful to only replace the chemistry ones
// We'll use indexOf to find them after the Edexcel UK marker
const edexUKIdx = code.indexOf('Pearson Edexcel", papers:');
if (edexUKIdx !== -1) {
  // Find Paper 2 and Paper 3 within the next 500 chars
  const searchBlock = code.substring(edexUKIdx, edexUKIdx + 500);
  
  if (searchBlock.includes(oldEdexP2)) {
    const p2Idx = code.indexOf(oldEdexP2, edexUKIdx);
    if (p2Idx !== -1 && p2Idx < edexUKIdx + 500) {
      code = code.substring(0, p2Idx) + 
        '{ name: "Paper 2", subtitle: "Core Organic & Physical", unitKey: "chem1" },' +
        code.substring(p2Idx + oldEdexP2.length);
      steps++;
      console.log('✅ Chem: Edexcel UK Paper 2 → chem1');
    }
  }
  
  const p3Search = '{ name: "Paper 3", subtitle: "General & Practical" }';
  const p3Idx = code.indexOf(p3Search, edexUKIdx);
  if (p3Idx !== -1 && p3Idx < edexUKIdx + 500) {
    code = code.substring(0, p3Idx) + 
      '{ name: "Paper 3", subtitle: "General & Practical", unitKey: "chem2" }' +
      code.substring(p3Idx + p3Search.length);
    steps++;
    console.log('✅ Chem: Edexcel UK Paper 3 → chem2');
  }
}

// AQA Chemistry — remove comingSoon, add unitKey mappings
const oldAQAChem = `{ board: "AQA", comingSoon: true, papers: [
          { name: "Paper 1", subtitle: "Inorganic & Physical" },`;
const newAQAChem = `{ board: "AQA", papers: [
          { name: "Paper 1", subtitle: "Inorganic & Physical", unitKey: "chem1" },`;

if (code.includes(oldAQAChem)) {
  code = code.replace(oldAQAChem, newAQAChem);
  steps++;
  console.log('✅ Chem: AQA Paper 1 → chem1');
}

// AQA Paper 2 and Paper 3
const aqaIdx = code.indexOf('"AQA", papers:');
if (aqaIdx !== -1) {
  const aqaBlock = code.substring(aqaIdx, aqaIdx + 500);
  
  const oldAqaP2 = '{ name: "Paper 2", subtitle: "Organic & Physical" },';
  if (aqaBlock.includes(oldAqaP2)) {
    const p2i = code.indexOf(oldAqaP2, aqaIdx);
    if (p2i !== -1 && p2i < aqaIdx + 500) {
      code = code.substring(0, p2i) +
        '{ name: "Paper 2", subtitle: "Organic & Physical", unitKey: "chem1" },' +
        code.substring(p2i + oldAqaP2.length);
      steps++;
      console.log('✅ Chem: AQA Paper 2 → chem1');
    }
  }
  
  const oldAqaP3 = '{ name: "Paper 3", subtitle: "Unified Chemistry" }';
  const p3i = code.indexOf(oldAqaP3, aqaIdx);
  if (p3i !== -1 && p3i < aqaIdx + 500) {
    code = code.substring(0, p3i) +
      '{ name: "Paper 3", subtitle: "Unified Chemistry", unitKey: "chem2" }' +
      code.substring(p3i + oldAqaP3.length);
    steps++;
    console.log('✅ Chem: AQA Paper 3 → chem2');
  }
}

// OCR, WJEC, CCEA — remove comingSoon, route to chem1
const simpleBoards = [
  { old: '{ board: "OCR", comingSoon: true }', new: '{ board: "OCR", papers: [{ name: "Paper 1", subtitle: "Periodic Table & Energy", unitKey: "chem1" }, { name: "Paper 2", subtitle: "Synthesis & Analytical", unitKey: "chem1" }, { name: "Paper 3", subtitle: "Unified Chemistry", unitKey: "chem2" }] }', label: 'Chem: OCR' },
  { old: '{ board: "WJEC / Eduqas", comingSoon: true }', new: '{ board: "WJEC / Eduqas", papers: [{ name: "Paper 1", subtitle: "Core Chemistry", unitKey: "chem1" }, { name: "Paper 2", subtitle: "Applied Chemistry", unitKey: "chem2" }] }', label: 'Chem: WJEC' },
  { old: '{ board: "CCEA", comingSoon: true }', new: '{ board: "CCEA", papers: [{ name: "Paper 1", subtitle: "AS Chemistry", unitKey: "chem1" }, { name: "Paper 2", subtitle: "A2 Chemistry", unitKey: "chem2" }] }', label: 'Chem: CCEA' },
];

// These appear multiple times (chem, phys, maths) so we need to be careful
// Replace only the first occurrence for chemistry (before physics section)
const physStartIdx = code.indexOf('"physics"');

for (const sb of simpleBoards) {
  const idx = code.indexOf(sb.old);
  if (idx !== -1 && idx < physStartIdx) {
    code = code.substring(0, idx) + sb.new + code.substring(idx + sb.old.length);
    steps++;
    console.log('✅ ' + sb.label + ' → papers with unitKey');
  }
}

// OxfordAQA and Cambridge International for chemistry
const oldOxAQAChem = '{ board: "OxfordAQA", comingSoon: true }';
const oldCambChem = '{ board: "Cambridge International", comingSoon: true }';

// Find these in the chemistry IAL section (before physics)
const oxIdx = code.indexOf(oldOxAQAChem);
if (oxIdx !== -1 && oxIdx < physStartIdx) {
  code = code.substring(0, oxIdx) + 
    '{ board: "OxfordAQA", papers: [{ name: "Unit 1", subtitle: "Physical & Inorganic", unitKey: "chem1" }, { name: "Unit 2", subtitle: "Organic & Physical", unitKey: "chem2" }] }' +
    code.substring(oxIdx + oldOxAQAChem.length);
  steps++;
  console.log('✅ Chem: OxfordAQA → chem1/chem2');
}

const cambIdx = code.indexOf(oldCambChem);
if (cambIdx !== -1 && cambIdx < physStartIdx) {
  code = code.substring(0, cambIdx) +
    '{ board: "Cambridge International", papers: [{ name: "Paper 1", subtitle: "Multiple Choice", unitKey: "chem1" }, { name: "Paper 2", subtitle: "Structured Questions", unitKey: "chem1" }, { name: "Paper 4", subtitle: "A Level Structured Questions", unitKey: "chem2" }] }' +
    code.substring(cambIdx + oldCambChem.length);
  steps++;
  console.log('✅ Chem: Cambridge → chem1/chem2');
}

// ═══════════════════════════════════════════════════════════════
// CHEMISTRY — IAL Units 3-6 (practical + A2)
// Remove comingSoon, route practical to chem1, A2 to chem2
// ═══════════════════════════════════════════════════════════════

const ialPracticals = [
  { old: '{ unitKey: null, name: "Unit 3 (WCH13)", subtitle: "Practical Skills", comingSoon: true }', new: '{ unitKey: "chem1", name: "Unit 3 (WCH13)", subtitle: "Practical Skills" }' },
  { old: '{ unitKey: null, name: "Unit 4 (WCH14)", subtitle: "Rates, Equilibria & Further Organic", comingSoon: true }', new: '{ unitKey: "chem2", name: "Unit 4 (WCH14)", subtitle: "Rates, Equilibria & Further Organic" }' },
  { old: '{ unitKey: null, name: "Unit 5 (WCH15)", subtitle: "Transition Metals & Organic Nitrogen", comingSoon: true }', new: '{ unitKey: "chem2", name: "Unit 5 (WCH15)", subtitle: "Transition Metals & Organic Nitrogen" }' },
  { old: '{ unitKey: null, name: "Unit 6 (WCH16)", subtitle: "Practical Skills II", comingSoon: true }', new: '{ unitKey: "chem2", name: "Unit 6 (WCH16)", subtitle: "Practical Skills II" }' },
];

for (const p of ialPracticals) {
  if (code.includes(p.old)) {
    code = code.replace(p.old, p.new);
    steps++;
    console.log('✅ Chem IAL: ' + p.new.match(/name: "([^"]+)"/)[1] + ' → live');
  }
}

// ═══════════════════════════════════════════════════════════════
// PHYSICS — same pattern
// ═══════════════════════════════════════════════════════════════

const physPracticals = [
  { old: '{ unitKey: null, name: "Unit 3 (WPH13)", subtitle: "Practical Skills", comingSoon: true }', new: '{ unitKey: "phys1", name: "Unit 3 (WPH13)", subtitle: "Practical Skills" }' },
  { old: '{ unitKey: null, name: "Unit 4 (WPH14)", subtitle: "Further Mechanics, Fields & Particles", comingSoon: true }', new: '{ unitKey: "phys2", name: "Unit 4 (WPH14)", subtitle: "Further Mechanics, Fields & Particles" }' },
  { old: '{ unitKey: null, name: "Unit 5 (WPH15)", subtitle: "Thermodynamics, Radiation, Oscillations", comingSoon: true }', new: '{ unitKey: "phys2", name: "Unit 5 (WPH15)", subtitle: "Thermodynamics, Radiation, Oscillations" }' },
  { old: '{ unitKey: null, name: "Unit 6 (WPH16)", subtitle: "Practical Skills II", comingSoon: true }', new: '{ unitKey: "phys2", name: "Unit 6 (WPH16)", subtitle: "Practical Skills II" }' },
];

for (const p of physPracticals) {
  if (code.includes(p.old)) {
    code = code.replace(p.old, p.new);
    steps++;
    console.log('✅ Phys IAL: ' + p.new.match(/name: "([^"]+)"/)[1] + ' → live');
  }
}

// Physics UK boards + international
const mathsStartIdx = code.indexOf('"maths"');

const physBoards = [
  '{ board: "OxfordAQA", comingSoon: true }',
  '{ board: "Cambridge International", comingSoon: true }',
  '{ board: "Pearson Edexcel", comingSoon: true }',
  '{ board: "AQA", comingSoon: true }',
  '{ board: "OCR", comingSoon: true }',
  '{ board: "WJEC / Eduqas", comingSoon: true }',
  '{ board: "CCEA", comingSoon: true }',
];

// Replace physics boards (between physStartIdx and mathsStartIdx)
for (const pb of physBoards) {
  const idx = code.indexOf(pb, physStartIdx);
  if (idx !== -1 && idx < mathsStartIdx) {
    const boardName = pb.match(/board: "([^"]+)"/)[1];
    const replacement = `{ board: "${boardName}", papers: [{ name: "Paper 1", subtitle: "Core Physics", unitKey: "phys1" }, { name: "Paper 2", subtitle: "Further Physics", unitKey: "phys2" }] }`;
    code = code.substring(0, idx) + replacement + code.substring(idx + pb.length);
    steps++;
    console.log('✅ Phys: ' + boardName + ' → phys1/phys2');
  }
}

// ═══════════════════════════════════════════════════════════════
// MATHS — IAL units + UK boards
// ═══════════════════════════════════════════════════════════════

const mathsPracticals = [
  { old: '{ unitKey: null, name: "Pure 2 (WMA12)", subtitle: "Trig, exponentials, sequences", comingSoon: true }', new: '{ unitKey: "maths", name: "Pure 2 (WMA12)", subtitle: "Trig, exponentials, sequences" }' },
  { old: '{ unitKey: null, name: "Pure 3 (WMA13)", subtitle: "Further algebra, calculus, vectors", comingSoon: true }', new: '{ unitKey: "maths", name: "Pure 3 (WMA13)", subtitle: "Further algebra, calculus, vectors" }' },
  { old: '{ unitKey: null, name: "Pure 4 (WMA14)", subtitle: "Further calculus, differential equations", comingSoon: true }', new: '{ unitKey: "maths", name: "Pure 4 (WMA14)", subtitle: "Further calculus, differential equations" }' },
  { old: '{ unitKey: null, name: "Statistics 1 (WST01)", subtitle: "Probability, distributions", comingSoon: true }', new: '{ unitKey: "maths", name: "Statistics 1 (WST01)", subtitle: "Probability, distributions" }' },
  { old: '{ unitKey: null, name: "Mechanics 1 (WME01)", subtitle: "Kinematics, forces, moments", comingSoon: true }', new: '{ unitKey: "maths", name: "Mechanics 1 (WME01)", subtitle: "Kinematics, forces, moments" }' },
];

for (const p of mathsPracticals) {
  if (code.includes(p.old)) {
    code = code.replace(p.old, p.new);
    steps++;
    console.log('✅ Maths IAL: ' + p.new.match(/name: "([^"]+)"/)[1] + ' → live');
  }
}

// Maths UK boards + international (after mathsStartIdx)
const admissionsIdx = code.indexOf('"gmat"') || code.length;

const mathsBoards = [
  '{ board: "OxfordAQA", comingSoon: true }',
  '{ board: "Cambridge International", comingSoon: true }',
  '{ board: "Pearson Edexcel", comingSoon: true }',
  '{ board: "AQA", comingSoon: true }',
  '{ board: "OCR", comingSoon: true }',
  '{ board: "WJEC / Eduqas", comingSoon: true }',
  '{ board: "CCEA", comingSoon: true }',
];

for (const mb of mathsBoards) {
  const idx = code.indexOf(mb, mathsStartIdx);
  if (idx !== -1 && idx < admissionsIdx) {
    const boardName = mb.match(/board: "([^"]+)"/)[1];
    const replacement = `{ board: "${boardName}", papers: [{ name: "Paper 1", subtitle: "Pure Mathematics", unitKey: "maths" }, { name: "Paper 2", subtitle: "Applied Mathematics", unitKey: "maths" }] }`;
    code = code.substring(0, idx) + replacement + code.substring(idx + mb.length);
    steps++;
    console.log('✅ Maths: ' + boardName + ' → maths');
  }
}

// ═══════════════════════════════════════════════════════════════
// WRITE
// ═══════════════════════════════════════════════════════════════

fs.writeFileSync(PAGE_JS, code, 'utf8');

// Count remaining comingSoon
const remaining = (code.match(/comingSoon: true/g) || []).length;

console.log('\n✅ ' + steps + ' board mappings applied');
console.log('   ' + remaining + ' "Coming Soon" items remaining (IB, AP, GCSE, admissions, language)');
console.log('\n   npm run dev → test');
console.log('   git add . && git commit -m "Remove Coming Soon, map all UK boards to content" && git push');
