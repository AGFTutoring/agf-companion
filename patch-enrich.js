/**
 * AGF Companion — LibreTexts Deep Enrichment for WCH11 Topics 4 & 5
 * Replaces the earlier naming enrichment with much deeper content
 * sourced from LibreTexts (CC BY-NC-SA 4.0)
 *
 * cd C:\Users\alast\Downloads\agf-companion
 * node patch-enrich.js
 */

const fs = require('fs');
const path = require('path');

const PAGE_JS = path.join(__dirname, 'app', 'page.js');
let code = fs.readFileSync(PAGE_JS, 'utf8');

// Find the organic section using the same indexOf approach that worked before
const START = 'TOPIC 4';
const END = 'Tests: Br₂ water decolourises, KMnO₄ decolourises';

// We need to find the FIRST occurrence of "TOPIC 4" that's in the chem1 system prompt
// (not "TOPIC 4 — WAVES" which is in the physics prompt)
// The chem1 one contains "ORGANIC" nearby
let searchFrom = 0;
let startIdx = -1;
while (true) {
  const idx = code.indexOf(START, searchFrom);
  if (idx === -1) break;
  // Check the next 50 chars to see if this is the organic one
  const context = code.substring(idx, idx + 60);
  if (context.includes('ORGANIC') || context.includes('Organic') || context.includes('ALKANES')) {
    startIdx = idx;
    break;
  }
  searchFrom = idx + 10;
}

if (startIdx === -1) {
  console.error('❌ Cannot find TOPIC 4 — ORGANIC in page.js');
  process.exit(1);
}

const endIdx = code.indexOf(END, startIdx);
if (endIdx === -1) {
  console.error('❌ Cannot find end marker: "' + END + '"');
  process.exit(1);
}

const oldSection = code.substring(startIdx, endIdx + END.length);
const usesEscaped = oldSection.includes('\\n');
const NL = usesEscaped ? '\\n' : '\n';

console.log('   Found organic section at position ' + startIdx + ' (' + oldSection.length + ' chars)');
console.log('   Newline format: ' + (usesEscaped ? 'escaped' : 'raw'));

// The enriched content — comprehensive, sourced from LibreTexts
const lines = [
'TOPIC 4 — ORGANIC CHEMISTRY & ALKANES',
'',
'=== IUPAC NOMENCLATURE — DETAILED RULES ===',
'The IUPAC system gives every unique compound its own exclusive name.',
'',
'STEP-BY-STEP METHOD:',
'1. FIND THE LONGEST CONTINUOUS CARBON CHAIN (parent chain)',
'   - This determines the parent name. The longest chain may NOT be drawn horizontally — trace all paths!',
'   - If two chains of equal length, choose the one with MORE substituents',
'   - Parent names: 1C=methane, 2C=ethane, 3C=propane, 4C=butane, 5C=pentane, 6C=hexane, 7C=heptane, 8C=octane, 9C=nonane, 10C=decane',
'2. IDENTIFY SUBSTITUENT GROUPS (branches)',
'   - Alkyl groups: remove -ane, add -yl. CH₃-=methyl, C₂H₅-=ethyl, C₃H₇-=propyl',
'   - Halogens: F=fluoro, Cl=chloro, Br=bromo, I=iodo',
'3. NUMBER THE PARENT CHAIN',
'   - Start from the end NEAREST a substituent',
'   - If equidistant, give LOWER number at first point of difference',
'4. ASSEMBLE THE NAME',
'   - Substituents in ALPHABETICAL order (ignore di-/tri-/tetra-)',
'   - Use di-, tri-, tetra- for multiple identical substituents',
'   - Commas between numbers (2,3-), hyphens between numbers and letters (2-methyl)',
'   - Write as ONE WORD',
'',
'VERIFICATION: Count total carbons. E.g. 3-ethyl-4-methylheptane = 7+2+1 = 10C.',
'',
'WORKED EXAMPLES WITH FULL REASONING:',
'• CH₃CH₂CH₂CH₂CH₃ → 5C chain, no branches → pentane',
'• CH₃CH(CH₃)CH₂CH₃ → 4C chain (butane), CH₃ at C2 → 2-methylbutane',
'• CH₃C(CH₃)₂CH₃ → 3C chain (propane), two CH₃ at C2 → 2,2-dimethylpropane. Check: 3+1+1=5C ✓',
'• CH₃CH₂CH(CH₃)CH(CH₃)CH₂CH₃ → 6C chain (hexane), CH₃ at C3 and C4 → 3,4-dimethylhexane. Check: 6+1+1=8C ✓',
'• COMMON MISTAKE: CH₃CH(CH₃)CH(C₂H₅)CH₃',
'  WRONG: 4C chain → "2-methyl-3-ethylbutane"',
'  CORRECT: longest chain is 5C through the ethyl group → pentane with CH₃ at C2 and C3 → 2,3-dimethylpentane. Check: 5+1+1=7C ✓',
'',
'C₅H₁₂ ISOMERS (3 exist): pentane, 2-methylbutane, 2,2-dimethylpropane',
'C₆H₁₄ ISOMERS (5 exist): hexane, 2-methylpentane, 3-methylpentane, 2,2-dimethylbutane, 2,3-dimethylbutane',
'',
'COMMON NAMING MISTAKES:',
'1. Not finding the longest chain (it can bend/turn)',
'2. Numbering from the wrong end',
'3. Using "ethyl" when the chain runs through it (should be part of parent)',
'4. Forgetting alphabetical order of substituents',
'',
'TYPES OF FORMULA (always state which type you are showing):',
'• Molecular: just atoms (C₄H₁₀)',
'• Structural: atom groupings (CH₃CH(CH₃)₂)',
'• Displayed: ALL bonds drawn explicitly',
'• Skeletal: zig-zag lines, each vertex/end = carbon, H on C not shown',
'',
'=== STRUCTURAL ISOMERISM ===',
'Same molecular formula, different structural arrangement (different connectivity).',
'Three types:',
'1. Chain isomerism: different carbon skeleton (butane vs 2-methylpropane)',
'2. Position isomerism: same skeleton, different position of functional group (but-1-ene vs but-2-ene)',
'3. Functional group isomerism: different functional group (ethanol vs methoxymethane, both C₂H₆O)',
'',
'=== ALKANE PROPERTIES ===',
'General formula CₙH₂ₙ₊₂, saturated (single bonds only), tetrahedral 109.5° at each C',
'Intermolecular forces: London dispersion forces ONLY (non-polar molecules)',
'• bp increases with chain length (more electrons → stronger London forces)',
'• bp decreases with branching (less surface contact → weaker London forces)',
'• All alkanes: insoluble in water, soluble in non-polar solvents, less dense than water',
'Homologous series: same general formula, same functional group, each member differs by CH₂',
'',
'=== FREE RADICAL SUBSTITUTION (FRS) — DETAILED ===',
'Conditions: UV light + halogen (Cl₂ or Br₂)',
'Overall: CH₄ + Cl₂ → CH₃Cl + HCl',
'',
'INITIATION (creating radicals):',
'Cl₂ → 2Cl• (homolytic fission — UV provides energy to break Cl-Cl bond)',
'Each Cl gets one electron. Fish-hook/half arrows show single electron movement.',
'',
'PROPAGATION (chain reaction, self-sustaining):',
'Step 1: Cl• + CH₄ → CH₃• + HCl (Cl• abstracts H from methane)',
'Step 2: CH₃• + Cl₂ → CH₃Cl + Cl• (methyl radical abstracts Cl from Cl₂)',
'The regenerated Cl• feeds back into Step 1 — the chain repeats hundreds of times.',
'',
'TERMINATION (radicals destroyed by combining):',
'Cl• + Cl• → Cl₂',
'CH₃• + Cl• → CH₃Cl',
'CH₃• + CH₃• → C₂H₆',
'C₂H₆ (ethane) as a product is KEY EVIDENCE for a radical mechanism — it cannot form by ionic pathways.',
'',
'LIMITATIONS:',
'• Further substitution: CH₃Cl → CH₂Cl₂ → CHCl₃ → CCl₄ → gives MIXTURE',
'• To maximise monosubstitution: use EXCESS alkane (high CH₄:Cl₂ ratio)',
'',
'Combustion: complete(CO₂+H₂O), incomplete(limited O₂ → CO or C soot)',
'Cracking: thermal (high T, no catalyst) or catalytic (zeolite, lower T) → shorter alkanes + alkenes',
'',
'TOPIC 5 — ALKENES',
'',
'=== NAMING ALKENES ===',
'General formula CₙH₂ₙ, unsaturated (contains C=C)',
'C=C = one σ bond (head-on overlap) + one π bond (sideways p-orbital overlap)',
'Restricted rotation around C=C due to π bond',
'',
'Rules (modifications from alkane naming):',
'1. Find longest chain CONTAINING BOTH carbons of C=C → parent chain',
'2. Change -ane to -ene',
'3. Number to give C=C the LOWEST locant',
'4. Position number before -ene: but-2-ene (not 2-butene)',
'',
'EXAMPLES:',
'• CH₂=CH₂ → ethene',
'• CH₃CH=CH₂ → propene',
'• CH₂=CHCH₂CH₃ → but-1-ene',
'• CH₃CH=CHCH₃ → but-2-ene',
'• CH₂=CHCH₂CH(CH₃)CH₃ → 4-methylpent-1-ene (5C, C=C at C1, CH₃ at C4)',
'• CH₃CH=C(CH₃)CH₃ → 2-methylbut-2-ene',
'',
'=== E/Z (GEOMETRIC) ISOMERISM ===',
'Type of stereoisomerism (same connectivity, different spatial arrangement).',
'',
'Requirements:',
'1. Restricted rotation (C=C double bond)',
'2. Each carbon of C=C must have TWO DIFFERENT groups',
'If either C has two identical groups → NO E/Z isomerism.',
'',
'CIP priority rules: higher atomic number = higher priority.',
'If directly attached atoms are same, move outward until difference found.',
'Z (zusammen=together): higher priority groups SAME side',
'E (entgegen=opposite): higher priority groups OPPOSITE sides',
'',
'Examples:',
'• but-2-ene: each C has H and CH₃ (different) → E/Z EXISTS',
'• but-1-ene: C1 has H and H (identical) → NO E/Z',
'• 2-methylbut-2-ene: C2 has CH₃ and CH₃ (identical) → NO E/Z',
'',
'=== ELECTROPHILIC ADDITION — DETAILED ===',
'C=C has HIGH ELECTRON DENSITY. π electrons are exposed above/below the plane → attract electrophiles.',
'An electrophile is an electron pair acceptor attracted to electron-rich regions.',
'',
'Mechanism (HBr + ethene):',
'Step 1: π electrons of C=C attack Hδ+ of H-Br → C-H bond forms, H-Br breaks heterolytically → carbocation + Br⁻',
'Step 2: Br⁻ (nucleophile) attacks carbocation → C-Br bond forms → product: bromoethane',
'',
"MARKOVNIKOV'S RULE (unsymmetrical alkenes):",
"H adds to C with MORE H's already. X adds to C with FEWER H's.",
'Why? Gives the MORE SUBSTITUTED (more stable) carbocation.',
'Carbocation stability: 3° > 2° > 1° > CH₃⁺ (alkyl groups stabilise by induction)',
'',
'Example: propene + HBr',
'C1 has 2H, C2 has 1H → H adds to C1 → 2° carbocation at C2 (stable)',
'Br⁻ attacks C2 → MAJOR product: 2-bromopropane (NOT 1-bromopropane)',
'',
'Other addition reactions:',
'1. + Br₂ → dibromoalkane (TEST: decolourises bromine water orange→colourless)',
'2. + H₂O (steam) + H₃PO₄ catalyst, 300°C → alcohol (industrial hydration)',
'3. + H₂ + Ni catalyst, 150°C → alkane (hydrogenation)',
'4. + conc. H₂SO₄ then water → alcohol (lab hydration)',
'',
'TESTS FOR UNSATURATION:',
'• Bromine water: orange→colourless = C=C present. Alkanes: no change.',
'• Acidified KMnO₄: purple→colourless = C=C present. Alkanes: no change.',
'',
'Tests: Br₂ water decolourises, KMnO₄ decolourises',
];

const newSection = lines.join(NL);

code = code.substring(0, startIdx) + newSection + code.substring(endIdx + END.length);
fs.writeFileSync(PAGE_JS, code, 'utf8');

console.log('✅ Deep enrichment applied! (' + lines.length + ' lines of content)');
console.log('   Old section: ' + oldSection.length + ' chars → New section: ' + newSection.length + ' chars');
console.log('\n📋 Next:');
console.log('   npm run dev → test');
console.log('   Ask: "Explain IUPAC naming step by step"');
console.log('   Ask: "Give me revision notes on free radical substitution"');
console.log('   git add . && git commit -m "Deep LibreTexts enrichment for organic chemistry" && git push');
