/**
 * enrich-all-subjects.js
 * 
 * Replaces the TODO placeholder sections in all four subjects with
 * comprehensive teaching notes at Edexcel IAL standard.
 * 
 * Subjects enriched:
 *   1. Chemistry Unit 2 (WCH12) — Topics 6-10
 *   2. Physics Unit 1 (WPH11) — Topics 1-3
 *   3. Physics Unit 2 (WPH12) — Topics 4-6
 *   4. A-Level Maths (Pure) — All topics
 * 
 * Run:  node enrich-all-subjects.js
 * Test: npm run dev
 * Deploy: git add . && git commit -m "Enrich all subject notes — remove TODOs" && git push
 */

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, 'app', 'page.js');
let code = fs.readFileSync(FILE, 'utf8');

let replacements = 0;

function replaceBetween(startMarker, endMarker, newContent) {
  const startIdx = code.indexOf(startMarker);
  if (startIdx === -1) {
    console.error(`ERROR: Could not find start marker: "${startMarker.substring(0, 60)}..."`);
    return false;
  }
  const endIdx = code.indexOf(endMarker, startIdx + startMarker.length);
  if (endIdx === -1) {
    console.error(`ERROR: Could not find end marker: "${endMarker.substring(0, 60)}..."`);
    return false;
  }
  code = code.substring(0, startIdx) + newContent + code.substring(endIdx);
  replacements++;
  return true;
}

// ═══════════════════════════════════════════════════════════════
// 1. CHEMISTRY UNIT 2 (WCH12) — Replace Topics 6-10 + TODO
// ═══════════════════════════════════════════════════════════════

const CHEM2_START = `CHEMISTRY UNIT 2 NOTES (WCH12 — Edexcel IAL):`;
const CHEM2_END = `Only answer WCH12 content. Use diagram tags where relevant.`;

const CHEM2_NOTES = `CHEMISTRY UNIT 2 NOTES (WCH12 — Edexcel IAL):

TOPIC 6 — ENERGETICS
Enthalpy (H): heat content at constant pressure. ΔH = enthalpy change (kJ mol⁻¹).
Exothermic: ΔH < 0 (energy released to surroundings, temperature rises). Endothermic: ΔH > 0 (energy absorbed, temperature falls).
Standard conditions: 298 K, 100 kPa, 1 mol dm⁻³, all substances in standard states.

Standard enthalpy definitions (all per mole, standard conditions):
ΔHf° (formation): elements in standard states → 1 mol compound. ΔHf° of any element in its standard state = 0.
ΔHc° (combustion): 1 mol substance + excess O₂ → complete combustion products.
ΔHat° (atomisation): gaseous atoms from element in standard state (always endothermic).
ΔHneut° (neutralisation): acid + base → 1 mol H₂O. Strong acid + strong base ≈ −57.1 kJ mol⁻¹.

Hess's Law: ΔH for a reaction is independent of route, depends only on initial and final states (consequence of conservation of energy).
Using Hess cycles: ΔHrxn = Σ ΔHf°(products) − Σ ΔHf°(reactants). Or: ΔHrxn = Σ ΔHc°(reactants) − Σ ΔHc°(products). Note the sign flip for combustion route.

Bond enthalpy: energy to break 1 mol of a specific bond in gaseous molecules, all species gaseous.
Mean bond enthalpy: average across different molecules (e.g. O–H in water vs O–H in ethanol). Only exact for diatomic molecules (e.g. H–H, Cl–Cl).
ΔHrxn ≈ Σ(bonds broken) − Σ(bonds formed). Positive = endothermic, negative = exothermic.
Bond enthalpies give approximate ΔH — less accurate than Hess's Law with ΔHf° because mean values are used.

Calorimetry: q = mcΔT where m = mass of water (g), c = 4.18 J g⁻¹ K⁻¹, ΔT = temperature change.
Then ΔH = −q/n (negative because if water heats up, reaction is exothermic).
Sources of error: heat loss to surroundings, incomplete combustion, heat absorbed by calorimeter.

TOPIC 7 — REDOX
Oxidation: loss of electrons, increase in oxidation state. Reduction: gain of electrons, decrease in oxidation state.
OIL RIG: Oxidation Is Loss, Reduction Is Gain. Oxidising agent is reduced (accepts e⁻). Reducing agent is oxidised (donates e⁻).

Oxidation state rules (in order of priority):
F always −1. O usually −2 (except: peroxides −1, OF₂ +2). H usually +1 (except: metal hydrides −1).
Elements = 0. Monatomic ion = charge. Sum of oxidation states = overall charge.
Common traps: Na₂O₂ (O is −1 not −2), CrO₄²⁻ (Cr is +6), MnO₄⁻ (Mn is +7).

Half equations: split into oxidation and reduction. Balance atoms (add H₂O for O, H⁺ for H), then balance charge with electrons.
Combine: multiply so electron counts match, then add. Cancel species appearing on both sides.

Disproportionation: same element simultaneously oxidised AND reduced.
Example: Cl₂ + H₂O → HClO + HCl. Chlorine goes from 0 to +1 (in HClO) and 0 to −1 (in HCl).
Example: 2Cu⁺ → Cu²⁺ + Cu. Copper goes from +1 to +2 (oxidised) and +1 to 0 (reduced).

TOPIC 8 — GROUP 2 (ALKALINE EARTH METALS)
Trends down the group (Be → Mg → Ca → Sr → Ba):
Atomic radius increases (more electron shells). First ionisation energy decreases (outer electron further from nucleus, more shielded).
Reactivity increases down group (easier to lose 2 outer electrons). Electronegativity decreases.

Reactions with water:
Mg + H₂O(steam) → MgO + H₂ (very slow with cold water — thin oxide layer).
Ca + 2H₂O → Ca(OH)₂ + H₂ (steady fizzing, milky solution).
Sr + 2H₂O → Sr(OH)₂ + H₂ (vigorous). Ba + 2H₂O → Ba(OH)₂ + H₂ (very vigorous).
Reactivity increases down group — lower IE means electrons lost more easily.

Reactions with oxygen: 2Mg + O₂ → 2MgO (bright white flame). All form MO oxides.
Reactions with dilute acid: Mg + 2HCl → MgCl₂ + H₂ (vigorous fizzing).

Hydroxide solubility INCREASES down group: Mg(OH)₂ sparingly soluble → Ba(OH)₂ soluble.
Therefore pH of M(OH)₂ solutions increases down group.
Sulfate solubility DECREASES down group: MgSO₄ soluble → BaSO₄ insoluble.
Test for sulfate ions: add BaCl₂(aq) or Ba(NO₃)₂(aq) → white precipitate of BaSO₄ confirms sulfate. Acidify with HCl first to remove carbonates/sulfites.

Flame colours: Ca = orange-red, Sr = crimson red, Ba = pale green. (Li = red, Na = yellow, K = lilac for Group 1.)

Thermal decomposition of carbonates: MCO₃ → MO + CO₂. Temperature needed INCREASES down group (larger cations polarise CO₃²⁻ less, so harder to decompose).
Thermal decomposition of nitrates: similar trend — more stable down group.

TOPIC 9 — GROUP 7 (HALOGENS)
Trends down group (F → Cl → Br → I):
Atomic radius increases. Electronegativity decreases. Boiling point increases (stronger London forces with more electrons).
Reactivity DECREASES: harder to gain an electron as atom gets larger and shielded.
Cl₂ = pale green gas, Br₂ = red-brown liquid, I₂ = grey solid (purple vapour).

Displacement reactions: more reactive halogen displaces less reactive halide from solution.
Cl₂ + 2KBr → 2KCl + Br₂ (solution turns orange). Cl₂ + 2KI → 2KCl + I₂ (solution turns brown).
Br₂ + 2KI → 2KBr + I₂ (solution turns brown). Br₂ + 2KCl → no reaction.
This proves reactivity order: Cl₂ > Br₂ > I₂.

Halide reducing power INCREASES down group (I⁻ > Br⁻ > Cl⁻): larger ions lose electrons more easily.
Test with concentrated H₂SO₄:
NaCl + H₂SO₄ → NaHSO₄ + HCl (white fumes, steamy). Simple acid-base, no redox.
NaBr + H₂SO₄ → NaHSO₄ + HBr initially, then HBr reduces H₂SO₄: 2HBr + H₂SO₄ → Br₂ + SO₂ + 2H₂O. Orange fumes (Br₂), colourless gas (SO₂).
NaI + H₂SO₄ → strongest reducing agent. Produces I₂ (purple fumes), H₂S (rotten eggs), SO₂, and S (yellow solid). Multiple reduction products because I⁻ is powerful enough to reduce S from +6 all the way to −2.

Silver halide test: add dilute HNO₃ (to remove interfering ions), then AgNO₃(aq).
AgCl = white precipitate, soluble in dilute NH₃. AgBr = cream precipitate, soluble in concentrated NH₃. AgI = yellow precipitate, insoluble in NH₃.

Chlorine reactions:
Cl₂ + H₂O ⇌ HClO + HCl (disproportionation: Cl₂ from 0 → +1 and −1).
HClO is the active bleaching/sterilising agent. Used in water purification — kills bacteria.
Cl₂ + 2NaOH → NaCl + NaClO + H₂O (also disproportionation — used to make bleach).

TOPIC 10 — INTRO TO KINETICS & EQUILIBRIA
Rate of reaction: change in concentration per unit time (mol dm⁻³ s⁻¹).
Factors affecting rate: temperature, concentration, pressure (gases), surface area, catalyst.

Collision theory: for reaction to occur, particles must collide with:
(a) energy ≥ activation energy (Ea), AND (b) correct orientation.
Increasing temperature → particles move faster → more frequent collisions AND greater proportion with E ≥ Ea (this is the more important factor).
Increasing concentration/pressure → more particles per unit volume → more frequent collisions.
Increasing surface area → more exposed particles → more collisions per second.

Maxwell-Boltzmann distribution: shows distribution of molecular kinetic energies at a given temperature.
Shape: starts at origin, rises to a peak (most probable energy), then long tail to the right.
Higher temperature: peak shifts right and lowers, curve broadens. Area under curve stays the same (same number of molecules).
Key point: the area to the RIGHT of Ea represents molecules with enough energy to react. Higher T greatly increases this area.

Catalysts: provide an alternative reaction pathway with lower activation energy.
On M-B diagram: Ea line shifts LEFT, so more molecules exceed the new lower Ea.
Catalysts are not consumed — they participate then regenerate. They do NOT change ΔH or equilibrium position — they speed up both forward and reverse reactions equally.
Homogeneous catalyst: same phase as reactants. Heterogeneous catalyst: different phase (e.g. solid catalyst with gaseous reactants — surface adsorption).

`;

console.log('Enriching Chemistry Unit 2...');
replaceBetween(CHEM2_START, CHEM2_END, CHEM2_NOTES + CHEM2_END);

// ═══════════════════════════════════════════════════════════════
// 2. PHYSICS UNIT 1 (WPH11) — Replace Topics 1-3 + TODO
// ═══════════════════════════════════════════════════════════════

const PHYS1_START = `PHYSICS UNIT 1 NOTES (WPH11 — Edexcel IAL):`;
const PHYS1_END = `Only answer WPH11 content. Use [EQUATION:...] tags for key formulae.`;

const PHYS1_NOTES = `PHYSICS UNIT 1 NOTES (WPH11 — Edexcel IAL):

TOPIC 1 — MECHANICS
Quantities and units:
Scalars: magnitude only — speed, distance, mass, energy, temperature, time, power.
Vectors: magnitude AND direction — velocity, displacement, force, acceleration, momentum, weight.
SI base units: kg, m, s, A, K, mol, cd. Derived units: N = kg m s⁻², J = kg m² s⁻², W = kg m² s⁻³, Pa = kg m⁻¹ s⁻².

Vector addition: tip-to-tail method or parallelogram rule. Resultant = vector sum.
Resolving vectors into components: horizontal = F cos θ, vertical = F sin θ (where θ is angle to horizontal).
Equilibrium of forces: if 3 forces in equilibrium, they form a closed triangle.

Kinematics — SUVAT equations (constant acceleration only):
v = u + at
s = ut + ½at²
v² = u² + 2as
s = ½(u + v)t
s = vt − ½at²
where s = displacement, u = initial velocity, v = final velocity, a = acceleration, t = time.
CRITICAL: these ONLY apply when acceleration is constant. For changing acceleration, use calculus or v-t graphs.

Displacement-time graphs: gradient = velocity. Velocity-time graphs: gradient = acceleration, area under curve = displacement.
Acceleration-time graphs: area under curve = change in velocity.

Projectiles: treat horizontal and vertical components independently.
Horizontal: constant velocity (no acceleration, ignoring air resistance). vₓ = u cos θ.
Vertical: constant acceleration g = 9.81 m s⁻² downward. Initial vertical velocity uᵧ = u sin θ.
Time of flight, maximum height, range all derived from SUVAT applied to each component.
At maximum height: vertical velocity = 0. Range is maximum when launch angle = 45° (no air resistance).

Free fall and terminal velocity:
Free fall: only force acting is gravity, a = g = 9.81 m s⁻².
With air resistance: drag force increases with speed. Initially a ≈ g, then as speed increases, drag increases.
Terminal velocity: when drag = weight, resultant force = 0, acceleration = 0, velocity is constant.
For a falling object: W = mg downward, F_drag upward. At terminal velocity: F_drag = mg.

Newton's Laws:
1st Law (Inertia): object remains at rest or moves at constant velocity unless acted on by a resultant external force.
2nd Law: F = ma. Resultant force = mass × acceleration. F is in newtons, m in kg, a in m s⁻².
Also expressed as F = Δp/Δt (rate of change of momentum). This is the more general form.
3rd Law: when object A exerts a force on object B, object B exerts an equal and opposite force on object A.
Key: forces act on DIFFERENT objects, are the SAME type of force, and are equal in magnitude, opposite in direction.

Weight: W = mg (gravitational field strength g ≈ 9.81 N kg⁻¹ on Earth's surface).
Apparent weightlessness: occurs in free fall — all parts of the body accelerate at the same rate.

Moments and equilibrium:
Moment = force × perpendicular distance from the pivot (N m). Moment = Fd sin θ if force is at an angle.
Principle of moments: for a body in equilibrium, sum of clockwise moments = sum of anticlockwise moments about ANY point.
Couple: two equal, opposite, parallel forces separated by a distance d. Torque of couple = Fd (one force × perpendicular distance between them).
Conditions for equilibrium: (1) resultant force = 0 (ΣF = 0), AND (2) resultant moment about any point = 0 (Σmoments = 0).
Centre of gravity: point where entire weight of object can be considered to act. For uniform objects, it's the geometric centre.

TOPIC 2 — ENERGY & MOMENTUM
Work done: W = Fs cos θ (joules). θ = angle between force and displacement.
If force is perpendicular to displacement: W = 0 (e.g. centripetal force does no work).
Work done = area under force-displacement graph.

Kinetic energy: Eₖ = ½mv². Derived from work-energy theorem: W = ΔEₖ.
Gravitational potential energy: Eₚ = mgh (near Earth's surface, uniform field).
Elastic potential energy: E = ½Fx = ½kx² (energy stored in a stretched/compressed spring).

Conservation of energy: energy cannot be created or destroyed, only transferred between forms.
In any transfer: total energy before = total energy after. Some energy is always dissipated as heat (increasing entropy).

Power: P = W/t = energy transferred per unit time (watts, W).
Also: P = Fv (force × velocity). Useful for calculating driving force at constant speed.
Efficiency = (useful output energy / total input energy) × 100% = (useful output power / total input power) × 100%.

Momentum: p = mv (kg m s⁻¹). Momentum is a vector quantity.
Conservation of momentum: in a closed system (no external forces), total momentum before = total momentum after.
This applies to ALL collisions and explosions, regardless of whether they are elastic or inelastic.

Types of collision:
Elastic: both momentum AND kinetic energy conserved. Perfectly elastic collisions are rare (e.g. between gas molecules).
Inelastic: momentum conserved but kinetic energy is NOT conserved (some KE converted to heat, sound, deformation).
Perfectly inelastic: objects stick together after collision. Maximum KE loss, but momentum still conserved.
Explosions: total momentum before = 0, so total momentum after = 0. Objects move in opposite directions.

Impulse: FΔt = Δp = mv − mu (N s or kg m s⁻¹).
Impulse = area under force-time graph.
Applications: crumple zones, airbags, seatbelts — increase collision time Δt, reducing maximum force F for same impulse.

TOPIC 3 — MATERIALS
Density: ρ = m/V (kg m⁻³). Measured using mass balance and appropriate volume measurement (ruler for regular shapes, displacement for irregular).

Hooke's Law: F = kx, where k = spring constant (N m⁻¹), x = extension (m).
Valid up to the limit of proportionality. Beyond this, F and x are no longer linearly related.
Elastic limit: up to this point, material returns to original shape when force removed. Beyond it: permanent deformation.

Springs in combination:
Series: 1/k_total = 1/k₁ + 1/k₂ (softer — same force, more extension).
Parallel: k_total = k₁ + k₂ (stiffer — force shared between springs).

Elastic strain energy: E = ½Fx = ½kx² (area under F-x graph up to elastic limit).
Beyond elastic limit: energy = area under the loading curve. Energy recovered = area under unloading curve. Difference = energy dissipated as heat.

Stress, strain, and Young's modulus:
Stress: σ = F/A (Pa or N m⁻²). Force per unit cross-sectional area. Tensile stress = pulling apart; compressive stress = pushing together.
Strain: ε = ΔL/L₀ (no units). Fractional change in length. ΔL = extension, L₀ = original length.
Young's modulus: E = σ/ε = (F × L₀)/(A × ΔL) (Pa). Measures stiffness of a material.
High E = stiff (steel ≈ 200 GPa). Low E = flexible (rubber ≈ 0.01 GPa).

Stress-strain graphs — key features:
Linear region: stress ∝ strain (Hooke's Law). Gradient = Young's modulus.
Limit of proportionality: end of linear region.
Elastic limit: beyond this, permanent deformation occurs.
Yield point: stress at which large plastic deformation begins with little increase in stress (marked in some materials like mild steel).
Ultimate tensile stress (UTS): maximum stress the material can withstand.
Fracture point: material breaks. Stress may drop before fracture (necking).

Material classifications:
Ductile: large plastic deformation before fracture (copper, mild steel). Can be drawn into wires. Stress-strain curve shows long plastic region.
Brittle: fractures with little/no plastic deformation (glass, ceramics, cast iron). Breaks suddenly. Straight line then snap.
Polymeric: rubber shows large elastic strain (returns to original shape). Loading and unloading curves differ — area between = energy dissipated as heat (hysteresis).
Polythene: shows plastic deformation — does not return to original length.

Experimental determination of Young's modulus:
Method: long thin wire, fixed at one end, loaded at other. Measure extension with travelling microscope or vernier scale.
Measure: original length L₀ (metre rule), diameter d (micrometer, multiple readings, calculate mean), mass m added.
Calculate: F = mg, A = πd²/4, σ = F/A, ε = ΔL/L₀. Plot stress vs strain, gradient = E.
Why long thin wire? Maximises measurable extension for given stress → reduces percentage uncertainty.

`;

console.log('Enriching Physics Unit 1...');
replaceBetween(PHYS1_START, PHYS1_END, PHYS1_NOTES + PHYS1_END);

// ═══════════════════════════════════════════════════════════════
// 3. PHYSICS UNIT 2 (WPH12) — Replace Topics 4-6 + TODO
// ═══════════════════════════════════════════════════════════════

const PHYS2_START = `PHYSICS UNIT 2 NOTES (WPH12 — Edexcel IAL):`;
const PHYS2_END = `Only answer WPH12 content. Use [EQUATION:...] tags for key formulae.`;

const PHYS2_NOTES = `PHYSICS UNIT 2 NOTES (WPH12 — Edexcel IAL):

TOPIC 4 — WAVES
Wave basics:
Progressive wave: transfers energy from one place to another without transferring matter.
Transverse: oscillation perpendicular to direction of energy transfer (light, EM waves, water surface waves, S-waves).
Longitudinal: oscillation parallel to direction of energy transfer (sound, P-waves, ultrasound). Consist of compressions and rarefactions.

Key definitions:
Amplitude (A): maximum displacement from equilibrium position.
Wavelength (λ): minimum distance between two points in phase (e.g. crest to crest).
Frequency (f): number of complete oscillations per second (Hz = s⁻¹).
Period (T): time for one complete oscillation. T = 1/f.
Wave speed: v = fλ. Also v = λ/T.

Phase and phase difference:
In phase: phase difference = 0 (or 2π, 4π, etc.) — oscillate together.
In antiphase: phase difference = π (or 180°) — oscillate exactly opposite.
Phase difference in radians: Δφ = 2π × (Δx/λ), where Δx = path difference.

Wave intensity: I = P/A (W m⁻²). Power per unit area perpendicular to wave direction.
Intensity ∝ amplitude²: I ∝ A². Double the amplitude → four times the intensity.
For point source: I = P/(4πr²). Inverse square law — intensity ∝ 1/r².

Superposition: when two or more waves meet, the resultant displacement = vector sum of individual displacements.
Constructive interference: waves in phase, amplitudes add. Path difference = nλ (n = 0, 1, 2, ...).
Destructive interference: waves in antiphase, amplitudes cancel. Path difference = (n + ½)λ.
Coherent sources: same frequency AND constant phase difference — required for stable interference pattern.

Stationary (standing) waves: formed when two progressive waves of same frequency, same amplitude, travel in opposite directions and superpose.
Nodes: points of zero displacement (destructive interference). Antinodes: points of maximum displacement (constructive interference).
Distance between adjacent nodes = λ/2. All points between two nodes oscillate in phase. Points on opposite sides of a node are in antiphase.
Energy: NOT transferred along a stationary wave (energy stored between nodes).

Stationary waves on strings:
Fundamental frequency (1st harmonic): f₁ = v/(2L) — one antinode, two nodes (at ends).
2nd harmonic: f₂ = 2f₁ = v/L. 3rd harmonic: f₃ = 3f₁. nth harmonic: fₙ = nf₁ = nv/(2L).
v = √(T/μ) where T = tension, μ = mass per unit length.

Stationary waves in air columns:
Closed pipe (one end closed): only ODD harmonics. f₁ = v/(4L). f₃ = 3v/(4L), f₅ = 5v/(4L), etc.
Open pipe (both ends open): all harmonics. f₁ = v/(2L).

Diffraction: spreading of waves through a gap or around an obstacle.
Maximum diffraction when gap width ≈ wavelength. Much larger gap → minimal spreading. Much smaller gap → wave mostly reflected.
Single slit diffraction produces a central maximum (brightest, widest) with weaker subsidiary maxima either side.

Young's double-slit experiment: demonstrates wave nature of light via interference.
Two coherent sources (slits) → alternating bright and dark fringes on a screen.
λ = ax/D where a = slit separation, x = fringe spacing, D = slit-to-screen distance.
Bright fringes: path difference = nλ. Dark fringes: path difference = (n + ½)λ.
White light produces: central white fringe, then spectra either side (red fringes wider because λ_red > λ_violet).

Diffraction gratings: many parallel slits. Much sharper, brighter maxima than double slit.
d sin θ = nλ, where d = slit spacing (= 1/N, N = lines per metre), θ = angle of nth order maximum, n = order number.
Maximum number of orders: n_max = d/λ (round down).

TOPIC 5 — OPTICS & EM SPECTRUM
Refraction: change in direction when wave enters medium of different optical density.
Caused by change in wave speed. Frequency stays constant, wavelength changes.
Towards normal: entering denser medium (slower). Away from normal: entering less dense medium (faster).

Refractive index: n = c/v (ratio of speed of light in vacuum to speed in medium). Always ≥ 1.
Snell's law: n₁ sin θ₁ = n₂ sin θ₂. If n₁ < n₂: ray bends towards normal. If n₁ > n₂: ray bends away from normal.
Also: n = λ_vacuum/λ_medium = sin θ₁/sin θ₂ (when going from vacuum/air into medium).

Total internal reflection (TIR):
Occurs when light travels from denser to less dense medium AND angle of incidence > critical angle.
Critical angle: sin θc = n₂/n₁ (where n₁ > n₂). For glass-air: sin θc = 1/n_glass.
At exactly θc: refracted ray travels along boundary (θ₂ = 90°).
Applications: optical fibres (light trapped by TIR between core and cladding). Cladding: protects fibre, prevents signal loss via crossover between fibres, maintains TIR.
Signal degradation in optical fibres: absorption (signal weakens), modal dispersion (different path lengths → pulse broadening), material dispersion (different wavelengths travel at different speeds).

Electromagnetic spectrum (all EM waves travel at c = 3.00 × 10⁸ m s⁻¹ in vacuum):
Radio (longest λ) → Microwave → Infrared → Visible → Ultraviolet → X-ray → Gamma (shortest λ, highest f and energy).
All are transverse waves. All can be polarised. E = hf (photon energy, for later units).
Visible light: red (≈ 700 nm) to violet (≈ 400 nm).

Polarisation: transverse waves can be polarised (oscillation restricted to one plane). Longitudinal waves CANNOT be polarised.
Unpolarised light: oscillates in all planes perpendicular to direction of travel.
Polaroid filter: transmits only one plane of oscillation. Two crossed polaroids block all light.
Malus's Law: I = I₀ cos²θ (intensity through analyser at angle θ to polariser).
Applications: polaroid sunglasses (reduce glare from reflected light, which is partially polarised).

TOPIC 6 — ELECTRICITY
Electric current: rate of flow of charge. I = ΔQ/Δt (A = C s⁻¹). 1 ampere = 1 coulomb per second.
Conventional current: flows from + to − (direction positive charges would move). Electron flow: − to +.
In metals: charge carriers are delocalised electrons. In electrolytes: positive and negative ions.

Potential difference (p.d.): energy transferred per unit charge. V = W/Q (V = J C⁻¹).
1 volt = 1 joule per coulomb. P.d. across a component = energy converted from electrical to other forms per coulomb.
EMF (electromotive force): energy transferred per unit charge BY the source. EMF = total energy supplied per coulomb.
Difference: EMF is energy input to circuit; p.d. is energy output across a component.

Resistance: R = V/I (Ω). Opposition to current flow.
Ohm's Law: V ∝ I at constant temperature (for ohmic conductors). R = V/I is the definition; Ohm's law is V ∝ I.
Resistivity: ρ = RA/L (Ω m). Property of the material, not the component. R = ρL/A.
Factors affecting resistance: length (R ∝ L), cross-sectional area (R ∝ 1/A), material (resistivity ρ), temperature.

I-V characteristics:
Ohmic conductor (e.g. metal wire at constant T): straight line through origin. Constant R.
Filament lamp: curve — R increases as temperature increases (metal ions vibrate more, impede electron flow).
Thermistor (NTC): R decreases as temperature increases (more charge carriers freed at higher T).
LDR: R decreases as light intensity increases.
Diode: very high R in reverse bias (no current). Low R in forward bias above threshold voltage (≈ 0.6V for silicon). Current flows in one direction only.

Electrical power and energy:
P = IV = I²R = V²/R (watts). E = Pt = IVt = QV (joules).
Kilowatt-hour: 1 kWh = 3.6 × 10⁶ J (energy used by 1 kW device in 1 hour).

Series circuits:
Same current through all components: I_total = I₁ = I₂.
P.d. shared: V_total = V₁ + V₂.
Resistance adds: R_total = R₁ + R₂ + R₃.

Parallel circuits:
Same p.d. across all branches: V_total = V₁ = V₂.
Current shared: I_total = I₁ + I₂.
Resistance: 1/R_total = 1/R₁ + 1/R₂. (Total resistance is LESS than smallest individual resistance.)

Potential divider: V_out = V_in × R₂/(R₁ + R₂).
With LDR: in dark, LDR resistance high → if LDR is R₁, V_out increases. Applications: automatic lighting, temperature sensing.
With thermistor: at high temperature, thermistor R drops.

EMF and internal resistance:
Every real source has internal resistance r. EMF: ε = I(R + r) = IR + Ir.
Terminal p.d.: V = ε − Ir. As current increases, terminal p.d. decreases.
Lost volts: v = Ir (p.d. across internal resistance, wasted as heat inside battery).
When I = 0 (open circuit): V = ε. When short-circuited: I = ε/r (maximum current).
Experimental determination: measure V and I for different R. Plot V against I: y-intercept = ε, gradient = −r.

Kirchhoff's Laws:
1st Law (junction rule): ΣI in = ΣI out at any junction. Based on conservation of charge.
2nd Law (loop rule): Σε = ΣIR around any closed loop. Based on conservation of energy.
Apply to complex circuits: choose loops, assign current directions, write equations, solve simultaneously.

Conservation of charge and energy underpin all circuit analysis.

`;

console.log('Enriching Physics Unit 2...');
replaceBetween(PHYS2_START, PHYS2_END, PHYS2_NOTES + PHYS2_END);

// ═══════════════════════════════════════════════════════════════
// 4. A-LEVEL MATHS (Pure) — Replace all topics + TODO
// ═══════════════════════════════════════════════════════════════

const MATHS_START = `A-LEVEL MATHEMATICS NOTES (Pure/Core):`;
const MATHS_END = `Only answer A-Level Pure Maths content. Use [EQUATION:...] tags for key formulae. Show all working step by step.`;

const MATHS_NOTES = `A-LEVEL MATHEMATICS NOTES (Pure/Core):

ALGEBRA & FUNCTIONS
Quadratics: ax² + bx + c = 0. Solve by factorising, completing the square, or quadratic formula: x = (−b ± √(b²−4ac))/(2a).
Discriminant: b² − 4ac. If > 0: two distinct real roots. If = 0: one repeated root. If < 0: no real roots.
Completing the square: x² + bx = (x + b/2)² − b²/4. For ax² + bx + c: a[(x + b/(2a))² − (b² − 4ac)/(4a²)].
Vertex of y = a(x − h)² + k is at (h, k). Minimum if a > 0, maximum if a < 0.

Factor theorem: if f(a) = 0, then (x − a) is a factor of f(x). Use to factorise cubics: test small integer values.
Remainder theorem: when f(x) is divided by (x − a), the remainder is f(a).
Polynomial division: long division or synthetic division. If (x − a) is a factor, remainder = 0.

Algebraic fractions: factorise numerator and denominator, cancel common factors.
Adding/subtracting: find common denominator. Multiplying: multiply tops and bottoms. Dividing: flip and multiply.
Partial fractions: decompose e.g. (3x+5)/((x+1)(x+2)) = A/(x+1) + B/(x+2). Cover-up method or equating coefficients.
Repeated factor: A/(x+1) + B/(x+1)² + C/(x+2). Improper fraction: divide first to get polynomial + proper fraction.

Surds: √a × √b = √(ab). √a/√b = √(a/b). Rationalise: multiply by conjugate. a/(b+√c) × (b−√c)/(b−√c) = a(b−√c)/(b²−c).
Indices: aᵐ × aⁿ = aᵐ⁺ⁿ, aᵐ ÷ aⁿ = aᵐ⁻ⁿ, (aᵐ)ⁿ = aᵐⁿ, a⁰ = 1, a⁻ⁿ = 1/aⁿ, a^(1/n) = ⁿ√a, a^(m/n) = (ⁿ√a)ᵐ.
Solving index equations: if bases equal, equate powers. Otherwise take logs.

Inequalities: solve like equations BUT flip the sign when multiplying/dividing by negative.
Quadratic inequalities: solve equation first, sketch parabola, read off required region.
Set notation: {x : x > 3}, or x ∈ (3, ∞). Intersection ∩, union ∪.

Functions: f(x) notation. Domain = set of inputs, range = set of outputs.
Composite: fg(x) = f(g(x)). Apply inner function first. Inverse: f⁻¹(x) — reflect in y = x.
To find inverse: write y = f(x), swap x and y, solve for y. Domain of f⁻¹ = range of f.
Modulus: |f(x)| — reflects negative parts in x-axis. f(|x|) — reflects right half in y-axis.

Transformations of graphs:
y = f(x) + a → translate up by a. y = f(x + a) → translate left by a.
y = af(x) → stretch vertically by factor a. y = f(ax) → squash horizontally by factor 1/a.
y = −f(x) → reflect in x-axis. y = f(−x) → reflect in y-axis.

COORDINATE GEOMETRY
Straight lines: y − y₁ = m(x − x₁), or y = mx + c. Gradient: m = (y₂ − y₁)/(x₂ − x₁).
Parallel lines: same gradient (m₁ = m₂). Perpendicular lines: m₁ × m₂ = −1.
Distance: d = √((x₂−x₁)² + (y₂−y₁)²). Midpoint: M = ((x₁+x₂)/2, (y₁+y₂)/2).

Circles: (x − a)² + (y − b)² = r². Centre (a, b), radius r.
Expanded form: x² + y² + 2gx + 2fy + c = 0. Centre (−g, −f), radius √(g² + f² − c).
Tangent to circle at point P: perpendicular to radius OP at P. Find gradient of radius, negative reciprocal = gradient of tangent.
Properties: angle in semicircle = 90°. Tangent is perpendicular to radius. Perpendicular from centre to chord bisects the chord.

Parametric equations: x = f(t), y = g(t). Convert to Cartesian: eliminate the parameter t.
dy/dx = (dy/dt)/(dx/dt). For parametric circles: x = a + r cos t, y = b + r sin t.

SEQUENCES & SERIES
Arithmetic sequences: common difference d. uₙ = a + (n−1)d.
Sum: Sₙ = n/2 × (2a + (n−1)d) = n/2 × (first + last).
Arithmetic mean of a and b = (a+b)/2.

Geometric sequences: common ratio r. uₙ = arⁿ⁻¹.
Sum of n terms: Sₙ = a(1 − rⁿ)/(1 − r) [r ≠ 1].
Sum to infinity: S∞ = a/(1 − r), convergent only when |r| < 1.
Geometric mean of a and b = √(ab).

Sigma notation: Σ from r=1 to n of uᵣ. Can split sums, factor constants.
Recurrence relations: uₙ₊₁ = f(uₙ). Increasing if uₙ₊₁ > uₙ, decreasing if uₙ₊₁ < uₙ.

Binomial expansion:
(a + b)ⁿ = Σ ⁿCᵣ aⁿ⁻ʳ bʳ for r = 0 to n. ⁿCᵣ = n!/(r!(n−r)!). Pascal's triangle.
For (1 + x)ⁿ when n is a positive integer: (1+x)ⁿ = 1 + nx + n(n−1)x²/2! + n(n−1)(n−2)x³/3! + ...
For n NOT a positive integer: expansion is infinite, valid only when |x| < 1.
For (a + bx)ⁿ: factor out aⁿ first → aⁿ(1 + bx/a)ⁿ, then expand, valid when |bx/a| < 1.

TRIGONOMETRY
Basic ratios: sin θ = O/H, cos θ = A/H, tan θ = O/A = sin θ/cos θ.
Reciprocal functions: sec θ = 1/cos θ, cosec θ = 1/sin θ, cot θ = 1/tan θ = cos θ/sin θ.
Pythagorean identities: sin²θ + cos²θ ≡ 1. 1 + tan²θ ≡ sec²θ. 1 + cot²θ ≡ cosec²θ.

CAST diagram: All positive in Q1 (0–90°), Sin in Q2 (90–180°), Tan in Q3 (180–270°), Cos in Q4 (270–360°).
Exact values: sin 30° = ½, cos 30° = √3/2, tan 30° = 1/√3. sin 45° = cos 45° = 1/√2, tan 45° = 1. sin 60° = √3/2, cos 60° = ½, tan 60° = √3.

Sine rule: a/sin A = b/sin B = c/sin C. Use when you have a pair (angle + opposite side). Ambiguous case when finding angles.
Cosine rule: a² = b² + c² − 2bc cos A. Use when you have SAS or SSS.
Area of triangle: ½ab sin C.

Radians: π rad = 180°. Convert: multiply by π/180 (deg to rad) or 180/π (rad to deg).
Arc length: s = rθ. Area of sector: A = ½r²θ. (θ must be in radians.)

Small angle approximations (θ in radians, θ small): sin θ ≈ θ, cos θ ≈ 1 − θ²/2, tan θ ≈ θ.

Compound angle formulae:
sin(A ± B) = sin A cos B ± cos A sin B.
cos(A ± B) = cos A cos B ∓ sin A sin B. (Note: signs are opposite.)
tan(A ± B) = (tan A ± tan B)/(1 ∓ tan A tan B).

Double angle formulae (set B = A):
sin 2A = 2 sin A cos A.
cos 2A = cos²A − sin²A = 2cos²A − 1 = 1 − 2sin²A.
tan 2A = 2tan A/(1 − tan²A).

R-formula: a sin θ + b cos θ = R sin(θ + α), where R = √(a² + b²), tan α = b/a.
Or: a sin θ + b cos θ = R cos(θ − β). Useful for finding max/min values and solving equations.

Inverse trig functions: arcsin, arccos, arctan. Remember restricted domains.

DIFFERENTIATION
First principles: f'(x) = lim(h→0) [f(x+h) − f(x)]/h. Proves the power rule for xⁿ.
Power rule: d/dx(xⁿ) = nxⁿ⁻¹. Works for all rational n.
Constant multiple: d/dx(kf) = kf'. Sum/difference: d/dx(f ± g) = f' ± g'.

Chain rule: dy/dx = (dy/du)(du/dx). Use when differentiating composite functions.
d/dx[f(g(x))] = f'(g(x)) × g'(x). Example: d/dx(sin 3x) = 3cos 3x.

Product rule: d/dx(uv) = u'v + uv'. Use when two functions are multiplied.
Quotient rule: d/dx(u/v) = (u'v − uv')/v². Use when one function divides another.

Standard derivatives:
d/dx(sin x) = cos x. d/dx(cos x) = −sin x. d/dx(tan x) = sec²x.
d/dx(eˣ) = eˣ. d/dx(e^(kx)) = ke^(kx). d/dx(ln x) = 1/x. d/dx(ln f(x)) = f'(x)/f(x).
d/dx(aˣ) = aˣ ln a.

Stationary points: set dy/dx = 0, solve for x.
Nature: d²y/dx² > 0 → minimum. d²y/dx² < 0 → maximum. d²y/dx² = 0 → check with sign change of first derivative.
Points of inflection: d²y/dx² = 0 AND sign change in d²y/dx². Gradient can be zero (stationary) or non-zero.

Tangent at (a, f(a)): y − f(a) = f'(a)(x − a). Normal: y − f(a) = −1/f'(a) × (x − a).
Connected rates of change: use chain rule. dV/dt = (dV/dr)(dr/dt).

Implicit differentiation: differentiate both sides with respect to x, use chain rule on y terms (multiply by dy/dx).
Example: d/dx(y²) = 2y(dy/dx). Collect dy/dx terms on one side, factorise, solve.

INTEGRATION
Reverse of differentiation: ∫xⁿ dx = xⁿ⁺¹/(n+1) + c (n ≠ −1).
∫1/x dx = ln|x| + c. ∫eˣ dx = eˣ + c. ∫e^(kx) dx = (1/k)e^(kx) + c.
∫sin x dx = −cos x + c. ∫cos x dx = sin x + c. ∫sec²x dx = tan x + c.

Definite integrals: ∫ₐᵇ f(x) dx = F(b) − F(a). Gives signed area under curve.
Area between curve and x-axis: ∫ₐᵇ |f(x)| dx. Split at roots if curve crosses x-axis.
Area between two curves: ∫ₐᵇ [f(x) − g(x)] dx where f(x) > g(x) in [a,b].
Area between curve and y-axis: integrate x = g(y) with respect to y, or use ∫ₐᵇ x dy.

Integration by substitution: let u = g(x), find du/dx, replace dx, change limits if definite.
Integration by parts: ∫u dv = uv − ∫v du. Choose u using LIATE (Log, Inverse trig, Algebraic, Trig, Exponential).
Sometimes need to apply twice (e.g. ∫x²eˣ dx) or use the trick where ∫eˣ sin x dx appears on both sides.

Partial fractions for integration: decompose, then integrate term by term. ∫A/(x+a) dx = A ln|x+a| + c.

Trapezium rule: ∫ₐᵇ f(x) dx ≈ h/2 [y₀ + 2(y₁ + y₂ + ... + yₙ₋₁) + yₙ] where h = (b−a)/n.
Always an approximation. Overestimate for concave-up curves, underestimate for concave-down. More strips → better accuracy.

Differential equations:
Separate variables: dy/dx = f(x)g(y) → ∫(1/g(y))dy = ∫f(x)dx.
General solution includes + c. Particular solution: use initial conditions to find c.

EXPONENTIALS & LOGARITHMS
Exponential function: y = aˣ. Base e: y = eˣ (natural exponential). e ≈ 2.71828.
Special property: d/dx(eˣ) = eˣ. The function equals its own derivative.
Graphs: eˣ always positive, passes through (0,1), increases rapidly. e⁻ˣ is reflection in y-axis (decay).

Natural logarithm: ln x = logₑ x. Inverse of eˣ. Domain: x > 0. ln 1 = 0, ln e = 1.
d/dx(ln x) = 1/x. ∫(1/x) dx = ln|x| + c. d/dx(ln f(x)) = f'(x)/f(x).

Log laws: ln(ab) = ln a + ln b. ln(a/b) = ln a − ln b. ln(aⁿ) = n ln a. These hold for any base.
Change of base: logₐ b = ln b / ln a = log b / log a.

Solving exponential equations: aˣ = b → x = ln b / ln a. Or take ln of both sides.
Solving log equations: combine using log laws, then convert to exponential form.

Exponential growth/decay: N = N₀eᵏᵗ. k > 0: growth. k < 0: decay. Half-life: t₁/₂ = ln 2 / |k|.
Modelling: recognise when rate of change is proportional to current value → dN/dt = kN → N = N₀eᵏᵗ.

VECTORS
Vector notation: column vectors, i-j-k notation, or bold letters.
Position vector: vector from origin to a point. OA = a.
Displacement vector: AB = b − a (final position vector minus initial position vector).

Magnitude: |a| = √(x² + y² + z²) for 3D. Unit vector: â = a/|a|.
Addition: tip-to-tail. Subtraction: a − b = a + (−b). Scalar multiplication: ka scales magnitude by |k|.
Parallel vectors: a = kb for some scalar k.

Scalar (dot) product: a · b = |a||b|cos θ = x₁x₂ + y₁y₂ + z₁z₂.
If a · b = 0, vectors are perpendicular. If a · b > 0, angle is acute. If a · b < 0, angle is obtuse.
Finding angle: cos θ = (a · b)/(|a||b|).

Vector equation of a line: r = a + td, where a = position vector of known point, d = direction vector, t = parameter.
Parallel lines: same direction vector (or scalar multiple). Intersection: set equal, solve for parameters, check consistency.

PROOF
Proof by deduction: logical argument from known facts to conclusion.
Proof by exhaustion: check all possible cases.
Proof by contradiction: assume the opposite is true, derive a contradiction, therefore original statement is true.
Disproof by counter-example: find ONE example where the statement fails.
Common proofs to know: √2 is irrational, there are infinitely many primes.

`;

console.log('Enriching A-Level Maths...');
replaceBetween(MATHS_START, MATHS_END, MATHS_NOTES + MATHS_END);

// ═══════════════════════════════════════════════════════════════
// WRITE OUTPUT
// ═══════════════════════════════════════════════════════════════

fs.writeFileSync(FILE, code, 'utf8');

console.log('');
console.log(`✅ ${replacements}/4 subjects enriched successfully`);

if (replacements < 4) {
  console.log('⚠️  Some replacements failed — check error messages above');
} else {
  console.log('');
  console.log('All TODO markers have been replaced with comprehensive teaching notes.');
  console.log('');
  console.log('Content added:');
  console.log('  • WCH12: Energetics (Hess cycles, calorimetry, bond enthalpies), Redox (half-equations,');
  console.log('    disproportionation), Group 2 (reactions, solubility trends, thermal decomposition),');
  console.log('    Group 7 (displacement, conc H₂SO₄ reactions, silver halide test, chlorine chemistry),');
  console.log('    Kinetics (collision theory, Maxwell-Boltzmann, catalysts)');
  console.log('');
  console.log('  • WPH11: Mechanics (vectors, SUVAT, projectiles, Newtons Laws, moments, equilibrium),');
  console.log('    Energy & Momentum (work, KE, GPE, conservation, impulse, collisions, power),');
  console.log('    Materials (Hookes Law, springs, stress-strain, Youngs modulus, material types)');
  console.log('');
  console.log('  • WPH12: Waves (progressive, stationary, superposition, diffraction, Youngs slits,');
  console.log('    diffraction gratings), Optics (refraction, Snells law, TIR, optical fibres, EM spectrum,');
  console.log('    polarisation), Electricity (current, p.d., resistance, I-V curves, series/parallel,');
  console.log('    potential dividers, EMF, internal resistance, Kirchhoffs laws)');
  console.log('');
  console.log('  • Pure Maths: Algebra (quadratics, factor/remainder, partial fractions, surds, indices),');
  console.log('    Coordinate geometry (lines, circles, parametric), Sequences (AP, GP, binomial),');
  console.log('    Trigonometry (compound angles, double angle, R-formula), Differentiation (chain,');
  console.log('    product, quotient, implicit, standard results), Integration (substitution, by parts,');
  console.log('    trapezium rule, differential equations), Exp & Log, Vectors, Proof');
  console.log('');
  console.log('Next steps:');
  console.log('  1. npm run dev       (test locally — try each subject)');
  console.log('  2. git add .');
  console.log('  3. git commit -m "Enrich all subject notes — comprehensive teaching content"');
  console.log('  4. git push');
}

