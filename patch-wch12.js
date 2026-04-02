/**
 * AGF Companion — Enrich WCH12 (Topics 6-10)
 * Replaces syllabus-level notes with detailed content
 * 
 * cd C:\Users\alast\Downloads\agf-companion
 * node patch-wch12.js
 */

const fs = require('fs');
const path = require('path');

const PAGE_JS = path.join(__dirname, 'app', 'page.js');
let code = fs.readFileSync(PAGE_JS, 'utf8');

// Find the chem2 system prompt — it starts after chem1's closing
// Look for "CHEMISTRY UNIT 2 NOTES (WCH12"
const START = 'TOPIC 6';
const END = 'Only answer WCH12 content';

// Find the WCH12 section specifically (not WPH12's Topic 6)
// WCH12's Topic 6 is about ENERGETICS, WPH12's is about ELECTRICITY
let searchFrom = 0;
let startIdx = -1;
while (true) {
  const idx = code.indexOf(START, searchFrom);
  if (idx === -1) break;
  const context = code.substring(idx, idx + 80);
  if (context.includes('ENERGETICS') || context.includes('Energetics')) {
    startIdx = idx;
    break;
  }
  searchFrom = idx + 10;
}

if (startIdx === -1) {
  console.error('Could not find TOPIC 6 — ENERGETICS in chem2 system prompt');
  process.exit(1);
}

const endIdx = code.indexOf(END, startIdx);
if (endIdx === -1) {
  console.error('Could not find "Only answer WCH12 content"');
  process.exit(1);
}

const oldSection = code.substring(startIdx, endIdx);
const usesEscaped = oldSection.includes('\\n');
const NL = usesEscaped ? '\\n' : '\n';

console.log('Found WCH12 section at position ' + startIdx + ' (' + oldSection.length + ' chars)');
console.log('Newline format: ' + (usesEscaped ? 'escaped' : 'raw'));

const lines = [
'TOPIC 6 — ENERGETICS (DETAILED)',
'Enthalpy (H): heat content at constant pressure. Delta H = enthalpy change (kJ mol-1).',
'Exothermic: Delta H < 0 (heat released, T rises). Examples: combustion, neutralisation.',
'Endothermic: Delta H > 0 (heat absorbed, T falls). Examples: thermal decomposition.',
'Standard conditions: 298 K, 100 kPa, 1 mol/dm3, standard states.',
'',
'TYPES OF ENTHALPY CHANGE:',
'Delta Hf (formation): 1 mol compound from elements in standard states. Elements = 0.',
'Delta Hc (combustion): 1 mol burns completely in excess O2.',
'Delta Hat (atomisation): 1 mol gaseous atoms from element in standard state.',
'Delta Hneut (neutralisation): acid + base to form 1 mol water.',
'',
'CALORIMETRY: q = mcDelta T (m=mass of solution in g, c=4.18 J/g/K, Delta T in K)',
'Then Delta H = -q/n (negative because heat gained by water = heat lost by reaction)',
'Assumptions: no heat loss, all heat to water, solution = density/specific heat of water.',
'',
'HESS LAW: Total Delta H independent of route (conservation of energy).',
'Using formation: Delta Hrxn = SUM(Delta Hf products) - SUM(Delta Hf reactants)',
'Using combustion: Delta Hrxn = SUM(Delta Hc reactants) - SUM(Delta Hc products)',
'Note reversal of signs between formation and combustion routes.',
'',
'BOND ENTHALPIES: Delta H = SUM(bonds broken) - SUM(bonds formed)',
'Breaking = endothermic. Forming = exothermic.',
'Bond enthalpies are MEAN values (only exact for diatomics) — less accurate than Hess.',
'',
'WORKED EXAMPLE: Calculate Delta Hf[CH4] given Delta Hc[C]=-393, Delta Hc[H2]=-286, Delta Hc[CH4]=-890',
'Delta H = [(-393) + 2(-286)] - [(-890)] = -965 + 890 = -75 kJ/mol',
'',
'COMMON MISTAKES: forgetting negative sign in Delta H=-q/n, using mass of solute not solution, confusing formation/combustion route signs',
'',
'TOPIC 7 — REDOX (DETAILED)',
'Oxidation: loss of electrons, increase in oxidation state.',
'Reduction: gain of electrons, decrease in oxidation state.',
'OIL RIG. Oxidising agent = gets reduced. Reducing agent = gets oxidised.',
'',
'OXIDATION STATE RULES: elements=0, monatomic ions=charge, O=-2 (peroxides -1), H=+1 (hydrides -1), F=-1 always, sum=overall charge.',
'',
'WORKED EXAMPLE: In H2SO4: 2(+1) + S + 4(-2) = 0, so S = +6.',
'In MnO4-: Mn + 4(-2) = -1, so Mn = +7.',
'',
'HALF EQUATIONS: balance atoms then balance charge with electrons.',
'Example: Zn -> Zn2+ + 2e- (oxidation). Cu2+ + 2e- -> Cu (reduction). Combined: Zn + Cu2+ -> Zn2+ + Cu.',
'',
'DISPROPORTIONATION: same element both oxidised AND reduced.',
'Example: Cl2 + 2NaOH -> NaCl + NaClO + H2O. Cl goes from 0 to -1 (reduction) AND 0 to +1 (oxidation).',
'',
'TOPIC 8 — GROUP 2 (ALKALINE EARTH METALS) (DETAILED)',
'Trends down group (Be Mg Ca Sr Ba): atomic radius increases, IE decreases, electronegativity decreases, reactivity increases.',
'',
'REACTIONS WITH WATER:',
'Mg: slow with cold water, fast with steam -> MgO + H2',
'Ca: steady with cold water -> Ca(OH)2 + H2',
'Sr: vigorous. Ba: very vigorous -> Ba(OH)2 + H2',
'Reactivity increases down group (easier to lose outer electrons).',
'',
'FLAME COLOURS: Ca orange-red, Sr red, Ba green.',
'',
'SOLUBILITY TRENDS:',
'Hydroxides: solubility INCREASES down group (Mg(OH)2 slightly soluble, Ba(OH)2 soluble)',
'Sulfates: solubility DECREASES down group (MgSO4 soluble, BaSO4 insoluble)',
'',
'TEST FOR SULFATE IONS: add dilute HCl then BaCl2 solution. White precipitate of BaSO4 = sulfate present.',
'Ba2+(aq) + SO42-(aq) -> BaSO4(s)',
'',
'TOPIC 9 — GROUP 7 (HALOGENS) (DETAILED)',
'Trends down group (F Cl Br I): atomic radius increases, electronegativity decreases, bp increases, reactivity DECREASES.',
'Colours: F2 pale yellow gas, Cl2 green-yellow gas, Br2 red-brown liquid, I2 grey-black solid (purple vapour).',
'',
'DISPLACEMENT: more reactive halogen displaces less reactive halide.',
'Cl2 + 2KBr -> 2KCl + Br2 (orange). Cl2 + 2KI -> 2KCl + I2 (brown). Br2 + KCl -> no reaction.',
'',
'HALIDE REDUCING POWER increases down group: I- > Br- > Cl-',
'',
'REACTIONS WITH CONC H2SO4:',
'NaCl: white fumes HCl only (no redox)',
'NaBr: initially HBr, then Br2 orange fumes + SO2 (H2SO4 reduced)',
'NaI: HI formed then extensive reduction -> I2 purple + S yellow + H2S rotten eggs',
'Shows I- is strongest reducing agent.',
'',
'SILVER HALIDE TEST: add dilute HNO3 then AgNO3.',
'Cl-: white AgCl, dissolves in dilute NH3',
'Br-: cream AgBr, dissolves in conc NH3 only',
'I-: yellow AgI, insoluble in NH3',
'',
'CHLORINE IN WATER: Cl2 + H2O -> HClO + HCl (disproportionation, Cl: 0 to +1 and -1)',
'HClO kills bacteria. Water purification: benefits (pathogen removal) vs risks (chlorinated organics).',
'',
'TOPIC 10 — KINETICS & EQUILIBRIA (DETAILED)',
'Rate = change in concentration / time (mol dm-3 s-1).',
'Factors: temperature, concentration, pressure, surface area, catalyst.',
'',
'COLLISION THEORY: particles must collide with E >= Ea AND correct orientation.',
'',
'MAXWELL-BOLTZMANN DISTRIBUTION:',
'Graph of number of molecules vs kinetic energy. Starts at origin, peaks, long tail right.',
'Higher T: curve flattens, shifts right, peak lower. More molecules above Ea.',
'Area right of Ea = molecules with enough energy to react.',
'',
'CATALYSTS: lower Ea via alternative pathway. On M-B diagram: Ea shifts left, more molecules above it.',
'NOT consumed. Does NOT change position of equilibrium (speeds both directions equally).',
'',
'DYNAMIC EQUILIBRIUM (closed system): forward rate = reverse rate. Concentrations constant but NOT necessarily equal.',
'',
'LE CHATELIER PRINCIPLE: system opposes change.',
'Increase [reactant] -> shifts right. Increase T -> shifts in endothermic direction.',
'Increase P -> shifts to fewer gas moles. Catalyst: NO EFFECT on position.',
'',
'WORKED EXAMPLE: N2 + 3H2 <=> 2NH3, Delta H = -92 kJ/mol',
'Increase P: shifts right (4 mol gas -> 2 mol). Increase T: shifts left (exothermic forward).',
'Catalyst (Fe): no position change, faster equilibrium. Remove NH3: shifts right.',
'',
'HABER PROCESS: compromise 450C + 200 atm + Fe catalyst. Low T = high yield but slow. High P = good yield but expensive.',
'',
'COMMON MISTAKES: saying catalyst shifts equilibrium, confusing shift with completion, forgetting pressure only affects gas mole differences.',
'',
];

const newSection = lines.join(NL);

code = code.substring(0, startIdx) + newSection + code.substring(endIdx);
fs.writeFileSync(PAGE_JS, code, 'utf8');

console.log('✅ WCH12 enriched! (' + lines.length + ' lines)');
console.log('   Old section: ' + oldSection.length + ' chars -> New: ' + newSection.length + ' chars');
console.log('');
console.log('   npm run dev -> test');
console.log('   git add . && git commit -m "Enrich WCH12 Topics 6-10" && git push');
