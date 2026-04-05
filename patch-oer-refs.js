const fs = require('fs');

// ═══════════════════════════════════════════════════
// AGF Study Companion — OER References Patch
// Adds free resource links to all 5 subject system prompts
// ═══════════════════════════════════════════════════

const FILE = 'app/page.js';
let src;
try {
  src = fs.readFileSync(FILE, 'utf8');
  console.log(`✅ Read ${FILE} (${src.length} chars)`);
} catch (e) {
  console.error(`❌ Cannot read ${FILE}. Are you in the agf-companion folder?`);
  process.exit(1);
}

let count = 0;

function patch(name, marker, replacement) {
  if (src.includes(marker)) {
    src = src.replace(marker, replacement);
    count++;
    console.log(`✅ ${name}`);
  } else {
    console.log(`❌ ${name} — marker not found`);
  }
}

// ═══════════════════════════════════════════════════
// 1. CHEMISTRY UNIT 1 (WCH11)
// ═══════════════════════════════════════════════════

patch(
  'Add OER refs to Chemistry 1',
  'Only answer WCH11 content. Use diagram tags liberally.',
  `FREE RESOURCES — when students want to read further, direct them to these:
- OpenStax Chemistry 2e (free textbook): openstax.org/books/chemistry-2e — Ch 2 (atoms), Ch 3 (moles), Ch 6 (electron config), Ch 7 (bonding & VSEPR), Ch 10.1 (intermolecular forces), Ch 20 (organic intro)
- LibreTexts Chemistry: chem.libretexts.org — searchable, detailed notes on every topic
- PhET Simulations (interactive): phet.colorado.edu — try "Molecule Shapes", "Build a Molecule", "States of Matter"
- Khan Academy: khanacademy.org/science/chemistry — video explanations
- Chemguide (UK A-Level focused): chemguide.co.uk — excellent for bonding, organic mechanisms
Say: "For more detail, see [resource] — it's free at [URL]." Do not reproduce content from these sources.

Only answer WCH11 content. Use diagram tags liberally.`
);

// ═══════════════════════════════════════════════════
// 2. CHEMISTRY UNIT 2 (WCH12)
// ═══════════════════════════════════════════════════

patch(
  'Add OER refs to Chemistry 2',
  'Only answer WCH12 content. Use diagram tags where relevant.',
  `FREE RESOURCES — when students want to read further, direct them to these:
- OpenStax Chemistry 2e: openstax.org/books/chemistry-2e — Ch 5 (thermochemistry/enthalpy), Ch 4.2 (redox), Ch 12 (kinetics), Ch 13 (equilibria), Ch 17 (electrochemistry)
- LibreTexts: chem.libretexts.org — Group 2: search "s-Block Elements/Group 2", Halogens: search "Group 17"
- PhET Simulations: phet.colorado.edu — try "Reactants Products and Leftovers", "Acid-Base Solutions"
- Khan Academy: khanacademy.org/science/chemistry — video explanations
- Chemguide: chemguide.co.uk — excellent for group chemistry, redox, energetics
Say: "For more detail, see [resource] — it's free at [URL]." Do not reproduce content from these sources.

Only answer WCH12 content. Use diagram tags where relevant.`
);

// ═══════════════════════════════════════════════════
// 3. PHYSICS UNIT 1 (WPH11)
// ═══════════════════════════════════════════════════

patch(
  'Add OER refs to Physics 1',
  'Only answer WPH11 content. Use [EQUATION:...] tags for key formulae.',
  `FREE RESOURCES — when students want to read further, direct them to these:
- OpenStax University Physics Vol 1: openstax.org/books/university-physics-volume-1 — Ch 3 (motion), Ch 5 (Newton's Laws), Ch 7-8 (energy), Ch 9 (momentum), Ch 12.3 (stress/strain/Young's modulus)
- LibreTexts Physics: phys.libretexts.org — search for any topic
- PhET Simulations: phet.colorado.edu — try "Forces and Motion", "Energy Skate Park", "Masses and Springs", "Hooke's Law"
- The Physics Classroom: physicsclassroom.com — excellent conceptual explanations with animations
- Khan Academy: khanacademy.org/science/physics — video explanations
- A-Level Physics Online: alevelphysicsonline.com — UK-focused video lessons
Say: "For more detail, see [resource] — it's free at [URL]." Do not reproduce content from these sources.

Only answer WPH11 content. Use [EQUATION:...] tags for key formulae.`
);

// ═══════════════════════════════════════════════════
// 4. PHYSICS UNIT 2 (WPH12)
// ═══════════════════════════════════════════════════

patch(
  'Add OER refs to Physics 2',
  'Only answer WPH12 content. Use [EQUATION:...] tags for key formulae.',
  `FREE RESOURCES — when students want to read further, direct them to these:
- OpenStax University Physics Vol 1: openstax.org/books/university-physics-volume-1 — Ch 16-17 (waves & sound)
- OpenStax University Physics Vol 2: openstax.org/books/university-physics-volume-2 — Ch 9 (current/resistance), Ch 10 (DC circuits)
- OpenStax University Physics Vol 3: openstax.org/books/university-physics-volume-3 — Ch 1 (refraction/Snell's Law), Ch 3 (interference), Ch 4 (diffraction)
- PhET Simulations: phet.colorado.edu — try "Circuit Construction Kit", "Wave on a String", "Bending Light", "Wave Interference"
- The Physics Classroom: physicsclassroom.com — excellent for waves, circuits, light
- Khan Academy: khanacademy.org/science/physics — video explanations
Say: "For more detail, see [resource] — it's free at [URL]." Do not reproduce content from these sources.

Only answer WPH12 content. Use [EQUATION:...] tags for key formulae.`
);

// ═══════════════════════════════════════════════════
// 5. A-LEVEL MATHS (Pure)
// ═══════════════════════════════════════════════════

patch(
  'Add OER refs to Maths',
  'Only answer A-Level Pure Maths content. Use [EQUATION:...] tags for key formulae. Show all working step by step.',
  `FREE RESOURCES — when students want to read further, direct them to these:
- OpenStax Algebra & Trig 2e: openstax.org/books/algebra-and-trigonometry-2e — functions, trig, sequences, vectors
- OpenStax Calculus Vol 1: openstax.org/books/calculus-volume-1 — differentiation rules, chain/product/quotient, integration
- OpenStax Calculus Vol 2: openstax.org/books/calculus-volume-2 — integration by parts, partial fractions, differential equations, parametric equations
- LibreTexts Maths: math.libretexts.org — searchable, detailed notes
- GeoGebra: geogebra.org — interactive graphing calculator for visualising functions, transformations, calculus
- Khan Academy: khanacademy.org/math — video explanations for algebra, trig, calculus
- Wolfram MathWorld: mathworld.wolfram.com — comprehensive maths reference
Say: "For more detail, see [resource] — it's free at [URL]." Do not reproduce content from these sources.

Only answer A-Level Pure Maths content. Use [EQUATION:...] tags for key formulae. Show all working step by step.`
);

// ═══════════════════════════════════════════════════
// WRITE OUTPUT
// ═══════════════════════════════════════════════════

fs.writeFileSync(FILE, src);
console.log(`\n✅ Done. ${count}/5 subjects updated with OER references.`);
console.log(`File size: ${src.length} chars`);
console.log('\nNext steps:');
console.log('  npm run dev');
console.log('  # Test: ask any subject "where can I read more about this?" and check it recommends free resources');
console.log('  git add .');
console.log('  git commit -m "Add OER reference links to all subject system prompts"');
console.log('  git push');
console.log('  del patch-oer-refs.js');
