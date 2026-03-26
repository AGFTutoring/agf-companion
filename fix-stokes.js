/**
 * fix-stokes.js
 * 
 * Replaces the Topic 3 — Materials section in app/page.js with
 * comprehensive Edexcel IAL Physics Unit 1 (WPH11) coverage.
 * 
 * Covers ALL spec points 23-32:
 *   23: Density
 *   24: Upthrust / Archimedes' principle
 *   25a: Stokes' Law F = 6pihrv
 *   25b: Conditions - small sphere, low speed, laminar flow; viscosity temperature dependent
 *   26: Core Practical 2 - falling-ball method for viscosity
 *   27: Hooke's Law
 *   28: Stress, strain, Young modulus
 *   29a/b: Force-extension graphs, key terms
 *   30: Stress-strain graphs, breaking stress
 *   31: Core Practical 3 - determine Young modulus
 *   32: Elastic strain energy
 * 
 * Usage:
 *   cd C:\Users\alast\Downloads\agf-companion
 *   node fix-stokes.js
 * 
 * Then deploy:
 *   git add .
 *   git commit -m "Enrich Physics Unit 1 materials - full spec coverage inc Stokes Law"
 *   git push
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app', 'page.js');

if (!fs.existsSync(filePath)) {
  console.error('\u274C Cannot find app/page.js');
  console.error('   Make sure you run this from the agf-companion folder:');
  console.error('   cd C:\\Users\\alast\\Downloads\\agf-companion');
  console.error('   node fix-stokes.js');
  process.exit(1);
}

let content = fs.readFileSync(filePath, 'utf-8');

// === The OLD Topic 3 section (exact match from current page.js) ===
const OLD_SECTION = `TOPIC 3 \u2014 MATERIALS
Density: \u03C1 = m/V.
Hooke\u2019s Law: F = kx (up to limit of proportionality). Spring constant k (N/m).
Springs in series: 1/k_total = 1/k\u2081 + 1/k\u2082. In parallel: k_total = k\u2081 + k\u2082.
Elastic strain energy: E = \u00BDFx = \u00BDkx\u00B2.
Stress: \u03C3 = F/A (Pa). Strain: \u03B5 = \u0394L/L (no units). Young\u2019s modulus: E = \u03C3/\u03B5 = (FL)/(A\u0394L).
Stress-strain graphs: elastic region, yield point, plastic deformation, UTS, fracture.
Brittle: fractures with little plastic deformation. Ductile: stretches before breaking.
Polymers: rubber (large elastic strain), polythene (plastic deformation).

TODO: Replace this section with Alastair\u2019s actual notes for more detailed coverage.`;

// === The NEW comprehensive Topic 3 section ===
const NEW_SECTION = `TOPIC 3 \u2014 MATERIALS (Spec points 23\u201332)

DENSITY (spec 23)
\u03C1 = m/V (kg m\u207B\u00B3). Measure mass with balance, volume by displacement or geometry.
Regular shapes: calculate V from dimensions. Irregular shapes: submerge in measuring cylinder, read volume displaced.
Common densities: water 1000 kg m\u207B\u00B3, aluminium 2700, steel 7800, air ~1.2.

UPTHRUST & ARCHIMEDES\u2019 PRINCIPLE (spec 24)
Upthrust = weight of fluid displaced. An object submerged in fluid experiences an upward force equal to the weight of fluid it pushes aside.
Upthrust F_up = \u03C1_fluid \u00D7 V_submerged \u00D7 g.
Object floats when upthrust \u2265 weight. Object sinks when weight > upthrust.
Apparent weight = true weight \u2212 upthrust.

VISCOUS DRAG & STOKES\u2019 LAW (spec 25a, 25b)
Viscosity (\u03B7, eta) = a measure of a fluid\u2019s resistance to flow. Units: Pa s (pascal-seconds) or N s m\u207B\u00B2.
Stokes\u2019 Law: F = 6\u03C0\u03B7rv \u2014 the drag force on a small sphere moving through a viscous fluid.
  F = viscous drag force (N), \u03B7 = viscosity of fluid (Pa s), r = radius of sphere (m), v = velocity (m s\u207B\u00B9).
CONDITIONS for Stokes\u2019 Law to apply:
  \u2022 Small spherical object
  \u2022 Low speed (slow-moving)
  \u2022 Laminar flow (smooth, streamlined flow \u2014 layers of fluid slide past each other without mixing)
  NOT valid for: turbulent flow (chaotic, eddying flow \u2014 occurs at higher speeds or with larger objects).
Laminar vs turbulent: laminar = smooth parallel streamlines; turbulent = chaotic with vortices/eddies.
Viscosity is TEMPERATURE DEPENDENT:
  \u2022 Liquids: viscosity DECREASES as temperature increases (molecules have more KE, overcome intermolecular forces more easily). E.g. warm honey flows faster.
  \u2022 Gases: viscosity INCREASES as temperature increases (faster molecules transfer more momentum between layers).

TERMINAL VELOCITY IN A VISCOUS FLUID
Ball bearing falling through viscous liquid (e.g. glycerol, oil):
  Three forces act: weight (mg) downward, upthrust (\u03C1_fluid \u00D7 V \u00D7 g) upward, viscous drag (6\u03C0\u03B7rv) upward.
  Ball accelerates initially. As v increases, drag increases. At terminal velocity: weight = upthrust + drag.
  mg = \u03C1_fluid \u00D7 V \u00D7 g + 6\u03C0\u03B7rv_terminal
  For a sphere: m = \u03C1_sphere \u00D7 (4/3)\u03C0r\u00B3, so:
  At terminal velocity: (4/3)\u03C0r\u00B3(\u03C1_sphere \u2212 \u03C1_fluid)g = 6\u03C0\u03B7rv_t
  Rearranging for viscosity: \u03B7 = 2r\u00B2g(\u03C1_sphere \u2212 \u03C1_fluid) / (9v_t)

CORE PRACTICAL 2 \u2014 FALLING-BALL METHOD FOR VISCOSITY (spec 26)
Method: Drop small ball bearings into tall tube of viscous liquid (e.g. glycerol). Measure terminal velocity.
  1. Measure diameter of ball bearing with micrometer (radius r).
  2. Measure distance between two markers on tube.
  3. Time the ball between markers (after it reaches terminal velocity \u2014 allow distance to accelerate first).
  4. v_t = distance / time.
  5. Calculate \u03B7 = 2r\u00B2g(\u03C1_ball \u2212 \u03C1_liquid) / (9v_t).
  Key points: ensure ball reaches terminal velocity before timing, use small balls for laminar flow, repeat for different sizes, temperature affects viscosity so keep constant.

HOOKE\u2019S LAW (spec 27)
\u0394F = k\u0394x. Force is proportional to extension UP TO the limit of proportionality.
k = spring constant / stiffness (N m\u207B\u00B9). Higher k = stiffer.
Springs in series: 1/k_total = 1/k\u2081 + 1/k\u2082 (same force, extensions add).
Springs in parallel: k_total = k\u2081 + k\u2082 (same extension, forces add).

FORCE-EXTENSION GRAPHS (spec 29a, 29b)
Key features on a force-extension graph:
  \u2022 Limit of proportionality (P): beyond this, F and x no longer proportional (graph stops being straight).
  \u2022 Elastic limit (E): beyond this, material won\u2019t return to original length. Permanent deformation begins.
  \u2022 Yield point: stress at which large plastic deformation occurs for little extra force (metals).
  \u2022 Elastic deformation: material returns to original shape when force removed. Energy recoverable.
  \u2022 Plastic deformation: permanent change in shape. Energy NOT fully recoverable.
Force-compression graphs: same principles, x = compression (shortening).
Loading/unloading: for rubber, curves differ (hysteresis loop \u2014 energy dissipated as heat). For metal below elastic limit, same path.

STRESS, STRAIN & YOUNG MODULUS (spec 28, 30, 31)
Stress: \u03C3 = F/A (Pa or N m\u207B\u00B2). Force per unit cross-sectional area. Tensile (stretching) or compressive (squashing).
Strain: \u03B5 = \u0394L/L (no units, dimensionless). Fractional change in length.
Young modulus: E = \u03C3/\u03B5 = (F \u00D7 L)/(A \u00D7 \u0394L). Units: Pa. Measures stiffness.
  High E = stiff (steel ~200 GPa). Low E = flexible (rubber ~0.01 GPa).

STRESS-STRAIN GRAPHS (spec 30)
  \u2022 Gradient in linear region = Young modulus.
  \u2022 Breaking stress (UTS): maximum stress before fracture.
  \u2022 Ductile materials (copper, mild steel): large plastic region before fracture. Can be drawn into wires.
  \u2022 Brittle materials (glass, cast iron, ceramic): fracture with little/no plastic deformation. Snap suddenly.
  \u2022 Polymers: rubber shows large elastic strain (returns); polythene shows plastic deformation (doesn\u2019t return).
  Exam trap: \u201Cstrong\u201D (high breaking stress) \u2260 \u201Cstiff\u201D (high Young modulus). Can be strong but flexible (Kevlar) or stiff but brittle (glass).

CORE PRACTICAL 3 \u2014 DETERMINE YOUNG MODULUS (spec 31)
Method: Long thin wire, fixed at one end, loaded with known masses.
  1. Measure original length L with metre rule.
  2. Measure diameter d with micrometer at several points, A = \u03C0(d/2)\u00B2.
  3. Add masses incrementally, measure extension \u0394L with ruler or travelling microscope.
  4. Plot stress-strain graph. Gradient = Young modulus.
  Key points: long wire gives larger extension, measure diameter in multiple places, ensure wire straight before loading, identify limit of proportionality.

ELASTIC STRAIN ENERGY (spec 32)
E_el = \u00BD F\u0394x = \u00BD k\u0394x\u00B2 (within limit of proportionality where F = k\u0394x).
Area under force-extension graph = elastic strain energy stored.
For non-linear graphs: estimate area by counting squares or trapezium rule.
Energy stored elastically is recoverable. Beyond elastic limit, some energy dissipated.`;

// === Do the replacement ===
if (!content.includes(OLD_SECTION)) {
  // Try a more flexible match in case of minor whitespace differences
  const marker1 = 'TOPIC 3';
  const marker2 = 'TODO: Replace this section';
  
  if (content.includes(marker1) && content.includes(marker2)) {
    console.log('\u26A0\uFE0F  Exact match failed, trying flexible match...');
    const start = content.indexOf(marker1);
    const todoEnd = content.indexOf(marker2);
    if (start > -1 && todoEnd > -1) {
      // Find the end of the TODO line
      const endOfTodo = content.indexOf('\n', todoEnd);
      const oldText = content.substring(start, endOfTodo > -1 ? endOfTodo : todoEnd + marker2.length);
      content = content.replace(oldText, NEW_SECTION);
      console.log('\u2705 Flexible match succeeded!');
    } else {
      console.error('\u274C Could not locate Topic 3 section boundaries.');
      process.exit(1);
    }
  } else {
    console.error('\u274C Could not find the old Topic 3 section in app/page.js');
    console.error('   The file may have already been updated.');
    console.error('   Check app/page.js manually for "TOPIC 3" section.');
    process.exit(1);
  }
} else {
  content = content.replace(OLD_SECTION, NEW_SECTION);
  console.log('\u2705 Exact match found and replaced!');
}

// === Write the updated file ===
fs.writeFileSync(filePath, content, 'utf-8');

console.log('');
console.log('\u2705 Topic 3 \u2014 Materials section updated successfully!');
console.log('');
console.log('   Added comprehensive coverage of spec points 23\u201332:');
console.log('   \u2022 Density (\u03C1 = m/V)');
console.log('   \u2022 Upthrust & Archimedes\u2019 principle');
console.log('   \u2022 Stokes\u2019 Law (F = 6\u03C0\u03B7rv) with conditions');
console.log('   \u2022 Laminar vs turbulent flow');
console.log('   \u2022 Viscosity & temperature dependence');
console.log('   \u2022 Terminal velocity in viscous fluid derivation');
console.log('   \u2022 Core Practical 2 \u2014 falling-ball viscosity method');
console.log('   \u2022 Hooke\u2019s Law with springs in series/parallel');
console.log('   \u2022 Force-extension graphs (all key terms)');
console.log('   \u2022 Stress, strain & Young modulus');
console.log('   \u2022 Stress-strain graphs (ductile, brittle, polymers)');
console.log('   \u2022 Core Practical 3 \u2014 determine Young modulus');
console.log('   \u2022 Elastic strain energy');
console.log('');
console.log('   Now deploy:');
console.log('   git add .');
console.log('   git commit -m "Enrich Physics Unit 1 materials - full spec coverage inc Stokes Law"');
console.log('   git push');
