// Run with: node fix-stokes.js
// From: C:\Users\alast\Downloads\agf-companion

const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, 'app', 'page.js');
let code = fs.readFileSync(pagePath, 'utf8');

// Replace the entire TOPIC 3 section with comprehensive content from the PMT PDF
const newMaterials = `TOPIC 3 — MATERIALS (Spec 1.4.23-1.4.32)

1.4.23 DENSITY
Density (p) = mass per unit volume: p = m/V. Units: kg/m3.
A measure of how compact a substance is.

1.4.24 UPTHRUST & ARCHIMEDES' PRINCIPLE
Upthrust: the upward force on an object in a fluid due to pressure difference between top and bottom.
Bottom of object is deeper -> higher pressure -> larger force pushing up.
Archimedes' principle: upthrust = weight of fluid displaced.
Upthrust = p_fluid x V_displaced x g
If fully submerged: V_displaced = V_object.
Object floats when upthrust = weight (mg = p_fluid x V_submerged x g).

1.4.25 STOKES' LAW & VISCOSITY
Viscous drag force: the resistive force on an object moving through a fluid.
Stokes' Law: F = 6*pi*eta*r*v
  F = viscous drag force (N)
  eta = viscosity of fluid (Pa.s)
  r = radius of sphere (m)
  v = velocity of sphere (m/s)
Conditions for Stokes' Law: object is small and spherical, moves at low speed, laminar flow.
Laminar flow: smooth, layered flow with no mixing between layers.
Turbulent flow: chaotic, with mixing between layers — occurs at high speeds.
Viscosity: a measure of a fluid's resistance to flow (internal friction between layers).
Temperature dependence of viscosity:
  Liquids: viscosity DECREASES as temperature increases (flows more easily).
  Gases: viscosity INCREASES as temperature increases.
Terminal velocity in a fluid:
  At terminal velocity: Weight = Upthrust + Viscous drag
  mg = p_fluid x V x g + 6*pi*eta*r*v_t
  For a sphere: v_t = 2*r^2*g*(p_sphere - p_fluid) / (9*eta)
Measuring viscosity experiment: time a small ball bearing falling through fluid over measured distance at terminal velocity. Use Stokes' Law rearranged for eta.

1.4.26 HOOKE'S LAW
Hooke's Law: F = k*dx — extension is directly proportional to force (up to the limit of proportionality).
  k = spring constant / stiffness (N/m), dx = extension (m).
Springs in series: 1/k_total = 1/k1 + 1/k2 (weaker overall).
Springs in parallel: k_total = k1 + k2 (stiffer overall).

1.4.27 YOUNG MODULUS
Stress (sigma): force per unit cross-sectional area. sigma = F/A. Units: Pa (N/m2).
Strain (epsilon): fractional change in length. epsilon = dL/L. No units (it is a ratio).
Young modulus (E): E = stress/strain = sigma/epsilon = FL/(A*dL). Units: Pa.
Young modulus describes the stiffness of a MATERIAL (not an object).
Up to the limit of proportionality, stress is proportional to strain, so E is constant.

1.4.28 FORCE-EXTENSION & FORCE-COMPRESSION GRAPHS
Force-extension graph: straight line through origin = Hooke's Law obeyed.
Key points on the graph:
  Limit of proportionality (P): beyond this, F and x are no longer proportional.
  Elastic limit (E): beyond this, material deforms permanently (plastic deformation).
  Yield point: material stretches without increase in load.
Elastic deformation: returns to original shape when force removed. All energy stored as elastic strain energy.
Plastic deformation: permanent shape change. Energy dissipated as heat.
Force-compression graphs similar but beyond elastic limit, solids buckle rather than extend.

1.4.30 STRESS-STRAIN GRAPHS
Describe behaviour of a MATERIAL (not a specific object).
Ductile materials: large plastic region before fracture (e.g. copper, mild steel).
Brittle materials: little/no plastic deformation, fracture at low strain (e.g. glass, cast iron).
Plastic materials: large extension as load increases.
Breaking stress (UTS): maximum stress before fracture. Depends on conditions like temperature.

1.4.32 ELASTIC STRAIN ENERGY
Energy stored when a material is stretched or compressed.
E = 0.5*F*dx = 0.5*k*x^2 (area under force-extension graph).
Cannot use W = F*ds because force is variable during stretching.
Loading/unloading beyond elastic limit: unloading line parallel to loading line but shifted.
Area between loading and unloading curves = energy dissipated as heat (work done to permanently deform).`;

// Try to find and replace the old materials section
const topicStart = code.indexOf('TOPIC 3 — MATERIALS');
if (topicStart === -1) {
  console.log('x Could not find TOPIC 3 in Physics Unit 1');
  process.exit(1);
}

// Find where the next section starts (TODO or "Only answer")
let topicEnd = code.indexOf('TODO:', topicStart);
if (topicEnd === -1) topicEnd = code.indexOf('Only answer WPH11', topicStart);
if (topicEnd === -1) {
  console.log('x Could not find end of TOPIC 3');
  process.exit(1);
}

code = code.slice(0, topicStart) + newMaterials + '\n\n' + code.slice(topicEnd);

console.log('Done! Physics Unit 1 Materials section fully enriched:');
console.log('  1.4.23 Density');
console.log('  1.4.24 Upthrust & Archimedes Principle');
console.log('  1.4.25 Stokes Law & Viscosity (laminar/turbulent flow, temperature effects)');
console.log('  1.4.26 Hooke Law');
console.log('  1.4.27 Young Modulus');
console.log('  1.4.28 Force-extension & compression graphs');
console.log('  1.4.30 Stress-strain graphs');
console.log('  1.4.32 Elastic strain energy');

fs.writeFileSync(pagePath, code);
console.log('\nDeploy with:');
console.log('git add . && git commit -m "Enrich Physics materials with full spec content" && git push');
