// add-igcse-core-extended.js
// Adds a separate "IGCSE (Cambridge)" row (Core / Extended) alongside
// the existing "GCSE / IGCSE" (Foundation / Higher) row, for
// Chemistry, Physics, and Maths. Previously IGCSE students had no
// correct tier option at all — they were forced into Foundation/
// Higher, which isn't Cambridge IGCSE's terminology or tier structure.
//
// Adds 6 new BOARD_CONTEXT entries (igcse-{chem,phys,maths}-{core,extended})
// and 3 new catalog rows. Tier boundaries are based on the actual
// 2026-2028 Cambridge IGCSE syllabuses (0620 Chemistry, 0625 Physics,
// 0580 Maths) — paraphrased, not copied verbatim, to respect Cambridge's
// copyright and keep the prompts a reasonable length.
//
// Placeholder/prompts for these new boards will automatically pick up
// the generic-but-correct default from fix-board-placeholder.js /
// fix-board-prompts.js (run those first if you haven't already) —
// no extra curation needed for this patch to work correctly.
//
// Usage: place this file in your project root and run:
//   node add-igcse-core-extended.js

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app', 'page.js');
let content = fs.readFileSync(filePath, 'utf8');

function safeReplace(content, oldStr, newStr, label) {
  const occurrences = content.split(oldStr).length - 1;
  if (occurrences === 0) {
    throw new Error(`Could not find anchor for "${label}". No changes made for this section.`);
  }
  if (occurrences > 1) {
    throw new Error(`Found ${occurrences} matches for "${label}", expected exactly 1. Refusing to patch ambiguously.`);
  }
  return content.replace(oldStr, newStr);
}

const edits = [

  // ---- BOARD_CONTEXT: Chemistry ----
  {
    label: 'BOARD_CONTEXT chemistry',
    old: '"gcse-chem-h": { name: "GCSE Chemistry (Higher)", code: "GCSE-H", welcome: "I\'m loaded with **GCSE Chemistry Higher** content.", prefix: "The student is studying GCSE Chemistry at Higher tier. Cover the full Higher tier spec. Do not reference A-Level unit codes." },',
    new: '"gcse-chem-h": { name: "GCSE Chemistry (Higher)", code: "GCSE-H", welcome: "I\'m loaded with **GCSE Chemistry Higher** content.", prefix: "The student is studying GCSE Chemistry at Higher tier. Cover the full Higher tier spec. Do not reference A-Level unit codes." },\n  "igcse-chem-core": { name: "IGCSE Chemistry (Core)", code: "IGCSE-C", welcome: "I\'m loaded with **IGCSE Chemistry (Core)** content.", prefix: "The student is studying Cambridge IGCSE Chemistry (0620) at Core tier (grade C ceiling). Cover ONLY Core-tier content. Do NOT teach Extended/Supplement-only material \u2014 this includes kinetic-theory explanations of state changes and heating/cooling curves, isotope relative-atomic-mass calculations, giant ionic/covalent/metallic structure explanations of properties, mole and concentration calculations beyond basic level, electrode half-equations, bond-energy enthalpy calculations, collision theory, Haber/Contact process equations and conditions reasoning, oxidation number, amphoteric oxides, transition metal variable ions, detailed metal extraction/electrolysis mechanisms, the greenhouse effect mechanism, structural isomerism, polymer repeat-unit deduction, and Rf calculations. If asked about these, explain they are Extended-tier and redirect to Core objectives unless the student says they are moving to Extended." },\n  "igcse-chem-extended": { name: "IGCSE Chemistry (Extended)", code: "IGCSE-E", welcome: "I\'m loaded with **IGCSE Chemistry (Extended)** content.", prefix: "The student is studying Cambridge IGCSE Chemistry (0620) at Extended tier (grades A*-C). Cover the full specification: all Core content plus Extended-only material \u2014 kinetic-theory explanations of state changes, isotope mass calculations, giant structure property explanations, full mole/concentration/titration calculations, electrode half-equations, bond-energy enthalpy calculations, collision theory, Haber/Contact process equations and the reasoning behind chosen conditions, oxidation number, amphoteric oxides, transition metal variable ions, full metal extraction/electrolysis mechanisms, the greenhouse effect, structural isomerism, polymer repeat-unit deduction (addition and condensation), and Rf calculations. Give full treatment expected at A*-C level." },'
  },

  // ---- BOARD_CONTEXT: Physics ----
  {
    label: 'BOARD_CONTEXT physics',
    old: '"gcse-phys-h": { name: "GCSE Physics (Higher)", code: "GCSE-H", welcome: "I\'m loaded with **GCSE Physics Higher** content.", prefix: "The student is studying GCSE Physics at Higher tier. Cover full Higher spec. Do not reference A-Level unit codes." },',
    new: '"gcse-phys-h": { name: "GCSE Physics (Higher)", code: "GCSE-H", welcome: "I\'m loaded with **GCSE Physics Higher** content.", prefix: "The student is studying GCSE Physics at Higher tier. Cover full Higher spec. Do not reference A-Level unit codes." },\n  "igcse-phys-core": { name: "IGCSE Physics (Core)", code: "IGCSE-C", welcome: "I\'m loaded with **IGCSE Physics (Core)** content.", prefix: "The student is studying Cambridge IGCSE Physics (0625) at Core tier (grade C ceiling). Cover ONLY Core-tier content. Do NOT teach Extended/Supplement-only material \u2014 this includes vector formalism and resultant-vector calculations, the acceleration equation and graph-gradient calculations, Hooke\'s law and circular motion, momentum/impulse equations, KE/GPE-change equations, specific heat capacity, particle-level thermal explanations, refractive index/critical angle, lens correction of sight defects, digital signal theory, Kirchhoff\'s laws and potential dividers, a.c. generators, nuclear fission/fusion equations, radioisotope half-life application reasoning, orbital mechanics, and stellar life cycle/cosmology. If asked about these, explain they are Extended-tier and redirect to Core objectives unless the student says they are moving to Extended." },\n  "igcse-phys-extended": { name: "IGCSE Physics (Extended)", code: "IGCSE-E", welcome: "I\'m loaded with **IGCSE Physics (Extended)** content.", prefix: "The student is studying Cambridge IGCSE Physics (0625) at Extended tier (grades A*-C). Cover the full specification: all Core content plus Extended-only material \u2014 vector formalism, acceleration calculations and graph analysis, Hooke\'s law and circular motion, momentum/impulse, KE/GPE/efficiency equations, specific heat capacity, particle-level thermal explanations, refraction/lenses, digital signalling, Kirchhoff\'s laws and potential dividers, a.c. generators, nuclear fission/fusion and decay equations, radioisotope applications, orbital mechanics, and stellar evolution/cosmology including redshift, Hubble\'s law and the age of the universe. Give full mathematical treatment expected at A*-C level." },'
  },

  // ---- BOARD_CONTEXT: Maths ----
  {
    label: 'BOARD_CONTEXT maths',
    old: '"gcse-maths-h": { name: "GCSE Maths (Higher)", code: "GCSE-H", welcome: "I\'m loaded with **GCSE Maths Higher** content.", prefix: "The student is studying GCSE Mathematics at Higher tier. Cover the full Higher spec. Do not reference A-Level unit codes." },',
    new: '"gcse-maths-h": { name: "GCSE Maths (Higher)", code: "GCSE-H", welcome: "I\'m loaded with **GCSE Maths Higher** content.", prefix: "The student is studying GCSE Mathematics at Higher tier. Cover the full Higher spec. Do not reference A-Level unit codes." },\n  "igcse-maths-core": { name: "IGCSE Maths (Core)", code: "IGCSE-C", welcome: "I\'m loaded with **IGCSE Maths (Core)** content.", prefix: "The student is studying Cambridge IGCSE Mathematics (0580) at Core tier (grade C ceiling). Cover ONLY Core-tier content. Do NOT teach Extended-only material \u2014 this includes exponential growth/decay, surds, algebraic fractions, direct/inverse proportion, differentiation, functions (composite/inverse), length and midpoint of a line segment, perpendicular lines, the extra circle theorems beyond the shared set, exact trig values and trig functions/graphs, the sine rule/cosine rule/triangle area formula, vectors, conditional probability, and cumulative frequency diagrams/histograms. Within shared topics like Equations, do not go beyond linear equations, simultaneous linear equations, and simple change-of-subject \u2014 no quadratics, no fractional equations with algebraic denominators. If asked about Extended-only material, explain it\'s Extended-tier and redirect to Core objectives unless the student says they are moving to Extended." },\n  "igcse-maths-extended": { name: "IGCSE Maths (Extended)", code: "IGCSE-E", welcome: "I\'m loaded with **IGCSE Maths (Extended)** content.", prefix: "The student is studying Cambridge IGCSE Mathematics (0580) at Extended tier (grades A*-C). Cover the full specification: all Core content plus Extended-only material \u2014 exponential growth/decay, surds, algebraic fractions, direct/inverse proportion, differentiation, functions, length/midpoint, perpendicular lines, additional circle theorems, exact trig values and trig functions, sine/cosine rules and triangle area, vectors, conditional probability, and cumulative frequency/histograms. Within shared topics, give full depth \u2014 e.g. for Equations, include fractional equations with algebraic denominators, simultaneous linear + non-linear systems, full quadratic solving (factorising, completing the square, the formula, surd-form answers), and harder change-of-subject problems. Give the harder problem types expected at A*-C level throughout, not just the Core baseline." },'
  },

  // ---- CATALOG: Chemistry ----
  {
    label: 'catalog chemistry',
    old: '{ system: "GCSE / IGCSE", boards: [\n        { board: "Foundation", unitKey: "chem1", boardId: "gcse-chem-f" },\n        { board: "Higher", unitKey: "chem1", boardId: "gcse-chem-h" },\n      ]},',
    new: '{ system: "GCSE / IGCSE", boards: [\n        { board: "Foundation", unitKey: "chem1", boardId: "gcse-chem-f" },\n        { board: "Higher", unitKey: "chem1", boardId: "gcse-chem-h" },\n      ]},\n      { system: "IGCSE (Cambridge)", boards: [\n        { board: "Core", unitKey: "chem1", boardId: "igcse-chem-core" },\n        { board: "Extended", unitKey: "chem1", boardId: "igcse-chem-extended" },\n      ]},'
  },

  // ---- CATALOG: Physics ----
  {
    label: 'catalog physics',
    old: '{ system: "GCSE / IGCSE", boards: [\n        { board: "Foundation", unitKey: "phys1", boardId: "gcse-phys-f" },\n        { board: "Higher", unitKey: "phys1", boardId: "gcse-phys-h" },\n      ]},',
    new: '{ system: "GCSE / IGCSE", boards: [\n        { board: "Foundation", unitKey: "phys1", boardId: "gcse-phys-f" },\n        { board: "Higher", unitKey: "phys1", boardId: "gcse-phys-h" },\n      ]},\n      { system: "IGCSE (Cambridge)", boards: [\n        { board: "Core", unitKey: "phys1", boardId: "igcse-phys-core" },\n        { board: "Extended", unitKey: "phys1", boardId: "igcse-phys-extended" },\n      ]},'
  },

  // ---- CATALOG: Maths ----
  {
    label: 'catalog maths',
    old: '{ system: "GCSE / IGCSE", boards: [\n        { board: "Foundation", unitKey: "maths", boardId: "gcse-maths-f" },\n        { board: "Higher", unitKey: "maths", boardId: "gcse-maths-h" },\n      ]},',
    new: '{ system: "GCSE / IGCSE", boards: [\n        { board: "Foundation", unitKey: "maths", boardId: "gcse-maths-f" },\n        { board: "Higher", unitKey: "maths", boardId: "gcse-maths-h" },\n      ]},\n      { system: "IGCSE (Cambridge)", boards: [\n        { board: "Core", unitKey: "maths", boardId: "igcse-maths-core" },\n        { board: "Extended", unitKey: "maths", boardId: "igcse-maths-extended" },\n      ]},'
  },
];

let appliedCount = 0;
const errors = [];

for (const edit of edits) {
  try {
    content = safeReplace(content, edit.old, edit.new, edit.label);
    appliedCount++;
    console.log(`OK: ${edit.label}`);
  } catch (err) {
    errors.push(`${edit.label}: ${err.message}`);
    console.error(`FAILED: ${edit.label} — ${err.message}`);
  }
}

if (errors.length > 0) {
  console.error(`\n${errors.length} of ${edits.length} edits failed. Writing file with only the ${appliedCount} successful edits applied — review carefully before committing, or restore from git and report back.`);
} else {
  console.log(`\nAll ${appliedCount} edits applied successfully.`);
}

fs.writeFileSync(filePath, content, 'utf8');

console.log('\nNext steps: npm run dev, check Chemistry/Physics/Maths pickers for a new "IGCSE (Cambridge)" row with Core/Extended buttons alongside the existing GCSE row, click into a couple and sanity-check the welcome message and placeholder, then commit & push.');
