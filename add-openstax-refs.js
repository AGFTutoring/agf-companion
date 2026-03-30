#!/usr/bin/env node
/**
 * add-openstax-refs.js
 * 
 * Adds OpenStax reference instructions and topic-to-URL mappings to each
 * subject's system prompt. The AI will cite specific chapters with clickable
 * links in both Ask mode and Quiz feedback.
 * 
 * Run: node add-openstax-refs.js
 */

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, 'app', 'page.js');
let src = fs.readFileSync(FILE, 'utf8');
const original = src;
let changes = 0;

console.log('\n=== AGF Study Companion: OpenStax Reference Integration ===\n');

// ─── REFERENCE BLOCKS ───
// Each block is appended to the END of the relevant system prompt,
// just before the closing backtick. We find "Only answer WXX content" 
// and insert before it.

const PHYS1_REFS = `

OPENSTAX REFERENCES — CRITICAL INSTRUCTION:
After explaining any topic, include a "Further reading" line with a direct OpenStax link.
Format: 📖 **Further reading:** [Topic Name — OpenStax University Physics](URL)
In quiz feedback, add the link after your explanation of the correct answer.
Use these exact URLs mapped to WPH11 topics:

TOPIC → URL MAPPING:
Scalars & vectors → https://openstax.org/books/university-physics-volume-1/pages/2-1-scalars-and-vectors-a-geometric-approach
SUVAT / kinematics → https://openstax.org/books/university-physics-volume-1/pages/3-4-motion-with-constant-acceleration
Projectile motion → https://openstax.org/books/university-physics-volume-1/pages/4-3-projectile-motion
Free fall → https://openstax.org/books/university-physics-volume-1/pages/3-5-free-fall
Newton's 1st law → https://openstax.org/books/university-physics-volume-1/pages/5-2-newtons-first-law
Newton's 2nd law (F=ma) → https://openstax.org/books/university-physics-volume-1/pages/5-3-newtons-second-law
Newton's 3rd law → https://openstax.org/books/university-physics-volume-1/pages/5-4-newtons-third-law
Friction & drag → https://openstax.org/books/university-physics-volume-1/pages/6-2-friction
Work done → https://openstax.org/books/university-physics-volume-1/pages/7-1-work
Kinetic energy → https://openstax.org/books/university-physics-volume-1/pages/7-2-kinetic-energy
Potential energy → https://openstax.org/books/university-physics-volume-1/pages/8-1-potential-energy-of-a-system
Conservation of energy → https://openstax.org/books/university-physics-volume-1/pages/8-3-conservation-of-energy
Power → https://openstax.org/books/university-physics-volume-1/pages/7-4-power
Momentum & impulse → https://openstax.org/books/university-physics-volume-1/pages/9-2-impulse-and-collisions
Conservation of momentum → https://openstax.org/books/university-physics-volume-1/pages/9-3-conservation-of-linear-momentum
Collisions → https://openstax.org/books/university-physics-volume-1/pages/9-4-types-of-collisions
Moments & torque → https://openstax.org/books/university-physics-volume-1/pages/12-1-conditions-for-static-equilibrium
Stress, strain & Young's modulus → https://openstax.org/books/university-physics-volume-1/pages/12-3-stress-strain-and-elastic-modulus
Elasticity → https://openstax.org/books/university-physics-volume-1/pages/12-4-elasticity-and-plasticity
Density → https://openstax.org/books/university-physics-volume-1/pages/14-1-fluids-density-and-pressure
Hooke's Law → https://openstax.org/books/university-physics-volume-1/pages/15-1-simple-harmonic-motion

Always pick the most relevant URL for the topic being discussed.`;


const PHYS2_REFS = `

OPENSTAX REFERENCES — CRITICAL INSTRUCTION:
After explaining any topic, include a "Further reading" line with a direct OpenStax link.
Format: 📖 **Further reading:** [Topic Name — OpenStax](URL)
In quiz feedback, add the link after your explanation of the correct answer.

TOPIC → URL MAPPING (University Physics Vol 1 & 2):
Wave types & properties → https://openstax.org/books/university-physics-volume-1/pages/16-1-traveling-waves
Wave equation v=fλ → https://openstax.org/books/university-physics-volume-1/pages/16-2-mathematics-of-waves
Superposition → https://openstax.org/books/university-physics-volume-1/pages/16-5-interference-of-waves
Stationary waves → https://openstax.org/books/university-physics-volume-1/pages/16-6-standing-waves-and-resonance
Sound waves → https://openstax.org/books/university-physics-volume-1/pages/17-1-sound-waves
Diffraction → https://openstax.org/books/university-physics-volume-3/pages/4-1-single-slit-diffraction
Refraction & Snell's law → https://openstax.org/books/university-physics-volume-3/pages/1-7-total-internal-reflection
Total internal reflection → https://openstax.org/books/university-physics-volume-3/pages/1-7-total-internal-reflection
EM spectrum → https://openstax.org/books/university-physics-volume-2/pages/16-3-energy-carried-by-electromagnetic-waves
Current & charge → https://openstax.org/books/university-physics-volume-2/pages/9-1-electrical-current
Resistance & Ohm's law → https://openstax.org/books/university-physics-volume-2/pages/9-3-resistivity-and-resistance
I-V characteristics → https://openstax.org/books/university-physics-volume-2/pages/9-4-ohms-law
Power in circuits → https://openstax.org/books/university-physics-volume-2/pages/9-5-electrical-energy-and-power
Series & parallel circuits → https://openstax.org/books/university-physics-volume-2/pages/10-3-resistors-in-series-and-parallel
Potential dividers → https://openstax.org/books/university-physics-volume-2/pages/10-3-resistors-in-series-and-parallel
EMF & internal resistance → https://openstax.org/books/university-physics-volume-2/pages/10-2-resistors-in-series-and-parallel
Kirchhoff's laws → https://openstax.org/books/university-physics-volume-2/pages/10-4-kirchhoffs-rules

Always pick the most relevant URL for the topic being discussed.`;


const CHEM1_REFS = `

OPENSTAX REFERENCES — CRITICAL INSTRUCTION:
After explaining any topic, include a "Further reading" line with a direct OpenStax link.
Format: 📖 **Further reading:** [Topic Name — OpenStax Chemistry 2e](URL)
In quiz feedback, add the link after your explanation of the correct answer.

TOPIC → URL MAPPING (Chemistry 2e):
Moles & formulae → https://openstax.org/books/chemistry-2e/pages/3-1-formula-mass-and-the-mole-concept
Empirical & molecular formulae → https://openstax.org/books/chemistry-2e/pages/3-2-determining-empirical-and-molecular-formulas
Atomic structure → https://openstax.org/books/chemistry-2e/pages/2-3-atomic-structure-and-symbolism
Electron configuration → https://openstax.org/books/chemistry-2e/pages/6-4-electronic-structure-of-atoms-electron-configurations
Mass spectrometry → https://openstax.org/books/chemistry-2e/pages/2-3-atomic-structure-and-symbolism
Ionisation energy → https://openstax.org/books/chemistry-2e/pages/6-5-periodic-variations-in-element-properties
Ionic bonding → https://openstax.org/books/chemistry-2e/pages/7-2-covalent-bonding
Covalent bonding → https://openstax.org/books/chemistry-2e/pages/7-2-covalent-bonding
VSEPR & molecular shapes → https://openstax.org/books/chemistry-2e/pages/7-6-molecular-structure-and-polarity
Intermolecular forces → https://openstax.org/books/chemistry-2e/pages/10-1-intermolecular-forces
Metallic bonding → https://openstax.org/books/chemistry-2e/pages/10-5-the-solid-state-of-matter
Organic chemistry & alkanes → https://openstax.org/books/chemistry-2e/pages/20-1-hydrocarbons
Alkenes → https://openstax.org/books/chemistry-2e/pages/20-1-hydrocarbons

Always pick the most relevant URL for the topic being discussed.`;


const CHEM2_REFS = `

OPENSTAX REFERENCES — CRITICAL INSTRUCTION:
After explaining any topic, include a "Further reading" line with a direct OpenStax link.
Format: 📖 **Further reading:** [Topic Name — OpenStax Chemistry 2e](URL)
In quiz feedback, add the link after your explanation of the correct answer.

TOPIC → URL MAPPING (Chemistry 2e):
Enthalpy & thermochemistry → https://openstax.org/books/chemistry-2e/pages/5-2-calorimetry
Hess's Law → https://openstax.org/books/chemistry-2e/pages/5-3-enthalpy
Bond enthalpies → https://openstax.org/books/chemistry-2e/pages/7-5-strengths-of-ionic-and-covalent-bonds
Oxidation states & redox → https://openstax.org/books/chemistry-2e/pages/4-2-classifying-chemical-reactions
Half equations → https://openstax.org/books/chemistry-2e/pages/17-2-galvanic-cells
Group 1 & 2 → https://openstax.org/books/chemistry-2e/pages/18-1-periodicity
Group 7 (halogens) → https://openstax.org/books/chemistry-2e/pages/18-4-structure-and-general-properties-of-the-nonmetals
Collision theory & rates → https://openstax.org/books/chemistry-2e/pages/12-1-chemical-reaction-rates
Catalysts → https://openstax.org/books/chemistry-2e/pages/12-7-catalysis

Always pick the most relevant URL for the topic being discussed.`;


const MATHS_REFS = `

OPENSTAX REFERENCES — CRITICAL INSTRUCTION:
After explaining any topic, include a "Further reading" line with a direct OpenStax link.
Format: 📖 **Further reading:** [Topic Name — OpenStax](URL)
In quiz feedback, add the link after your explanation of the correct answer.

TOPIC → URL MAPPING:
Quadratics → https://openstax.org/books/algebra-and-trigonometry-2e/pages/2-5-quadratic-equations
Completing the square → https://openstax.org/books/algebra-and-trigonometry-2e/pages/2-5-quadratic-equations
Factor & remainder theorems → https://openstax.org/books/algebra-and-trigonometry-2e/pages/5-5-zeros-of-polynomial-functions
Surds & indices → https://openstax.org/books/algebra-and-trigonometry-2e/pages/1-3-radicals-and-rational-exponents
Straight lines → https://openstax.org/books/algebra-and-trigonometry-2e/pages/2-2-linear-equations-in-one-variable
Circles → https://openstax.org/books/algebra-and-trigonometry-2e/pages/8-2-graphs-of-the-other-trigonometric-functions
Arithmetic sequences → https://openstax.org/books/algebra-and-trigonometry-2e/pages/13-2-arithmetic-sequences
Geometric sequences → https://openstax.org/books/algebra-and-trigonometry-2e/pages/13-3-geometric-sequences
Binomial expansion → https://openstax.org/books/algebra-and-trigonometry-2e/pages/13-6-binomial-theorem
Trigonometry → https://openstax.org/books/algebra-and-trigonometry-2e/pages/7-2-right-triangle-trigonometry
Sine & cosine rules → https://openstax.org/books/algebra-and-trigonometry-2e/pages/10-1-non-right-triangles-law-of-sines
Radians → https://openstax.org/books/algebra-and-trigonometry-2e/pages/7-1-angles
Differentiation → https://openstax.org/books/calculus-volume-1/pages/3-2-the-derivative-as-a-function
Chain rule → https://openstax.org/books/calculus-volume-1/pages/3-6-the-chain-rule
Product & quotient rules → https://openstax.org/books/calculus-volume-1/pages/3-3-differentiation-rules
Stationary points → https://openstax.org/books/calculus-volume-1/pages/4-3-maxima-and-minima
Integration → https://openstax.org/books/calculus-volume-1/pages/5-2-the-definite-integral
Integration by parts → https://openstax.org/books/calculus-volume-1/pages/3-1-integration-by-parts
Exponentials & logarithms → https://openstax.org/books/algebra-and-trigonometry-2e/pages/6-1-exponential-functions

Always pick the most relevant URL for the topic being discussed.`;


// ─── INJECT INTO SYSTEM PROMPTS ───

function injectRefs(marker, refs, label) {
  const idx = src.indexOf(marker);
  if (idx === -1) {
    console.warn(`  SKIP: "${label}" — marker not found: ${marker.substring(0, 50)}`);
    return;
  }
  // Check if already injected
  if (src.indexOf('OPENSTAX REFERENCES', Math.max(0, idx - 5000)) !== -1 && 
      src.indexOf('OPENSTAX REFERENCES', Math.max(0, idx - 5000)) < idx) {
    console.log(`  SKIP: "${label}" — OpenStax refs already present`);
    return;
  }
  src = src.substring(0, idx) + refs + '\n\n' + src.substring(idx);
  console.log(`  ✓ ${label}`);
  changes++;
}

console.log('Injecting OpenStax references into system prompts...\n');

injectRefs('Only answer WPH11 content.', PHYS1_REFS, 'Physics Unit 1 (WPH11)');
injectRefs('Only answer WPH12 content.', PHYS2_REFS, 'Physics Unit 2 (WPH12)');
injectRefs('Only answer WCH11 content.', CHEM1_REFS, 'Chemistry Unit 1 (WCH11)');
injectRefs('Only answer WCH12 content.', CHEM2_REFS, 'Chemistry Unit 2 (WCH12)');
injectRefs('Only answer A-Level Pure Maths content.', MATHS_REFS, 'A-Level Maths (Pure)');


// ─── SAVE ───
console.log(`\n=== Summary ===`);
console.log(`Changes made: ${changes}`);

if (changes > 0 && src !== original) {
  fs.writeFileSync(FILE, src, 'utf8');
  console.log(`\n✅ app/page.js updated.`);
  console.log(`\nThe AI will now include clickable OpenStax links after explanations.`);
  console.log(`Example: 📖 Further reading: Newton's Second Law — OpenStax University Physics`);
  console.log(`\nNext: npm run dev → test → git add . && git commit -m "Add OpenStax references" && git push`);
} else {
  console.log(`\n⚠️  No changes made.`);
}
