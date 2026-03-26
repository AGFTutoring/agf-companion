"use client";
import { useState, useRef, useEffect, useCallback } from "react";

/* ═══════════════════════════════════════════════════
   AGF STUDY COMPANION — MULTI-SUBJECT
   Palette: charcoal grey + green (AGF brand)
   ═══════════════════════════════════════════════════ */

const C = {
  bg: "#1a1a1a",
  bgLight: "#222222",
  bgCard: "#2a2a2a",
  bgInput: "#242424",
  green: "#4d9460",
  greenLight: "#5ba86d",
  greenDim: "rgba(77,148,96,0.12)",
  greenBorder: "rgba(77,148,96,0.3)",
  gold: "#4d9460",      // alias to green for consistency
  goldDim: "rgba(77,148,96,0.12)",
  goldBorder: "rgba(77,148,96,0.3)",
  text: "#e8e5de",
  textMuted: "#9a9690",
  textDim: "#706b65",
  border: "rgba(255,255,255,0.08)",
  borderLight: "rgba(255,255,255,0.04)",
  red: "#e06060",
  amber: "#d4a24c",
};

/* ═══════════════════════════════════════════════════
   SUBJECT DEFINITIONS
   ═══════════════════════════════════════════════════ */

const SUBJECTS = {
  chem1: {
    id: "chem1",
    name: "Chemistry Unit 1",
    code: "WCH11",
    subtitle: "Structure, Bonding & Intro to Organic",
    colour: "#4d9460",
    icon: "⚗",
    placeholder: "Ask about Chemistry Unit 1...",
    prompts: [
      "Explain the shape of water",
      "Show me free radical substitution",
      "Quiz me on bonding",
      "Why does diamond have a high melting point?",
    ],
    welcome: `Hello! I'm your **AGF Study Companion**, powered by Alastair's diagnostic teaching method.

I'm loaded with **Chemistry Unit 1** (WCH11) — Structure, Bonding & Introduction to Organic Chemistry.

Here's the shape of water to get us started:

[SHAPE:bent:H₂O:104.5°]

• **Ask me anything** about the syllabus
• Say **"quiz me"** for practice questions
• Ask **"show me the mechanism for..."** to see reaction diagrams

What shall we work on?`,
    system: `You are the AGF Study Companion — an AI tutor created by Alastair Fisher of AGF Tutoring. You follow the AGF diagnostic method: Diagnose → Rebuild → Clarify → Test → Extend.

Personality: Patient, warm, rigorous. British English. Concise but thorough.

ASK MODE RULES — CRITICAL:
- ALWAYS give direct, clear, complete explanations. Teach the student — do not quiz them.
- NEVER ask the student questions back like "what do you think?" or "have a think about..."
- NEVER ask the student to work through something on their own — that is what Quiz mode is for.
- Instead: explain the concept clearly, show all the steps, use diagrams, give worked examples, and make sure the student walks away understanding it.
- If a student asks "explain X" — explain X fully. Do not turn it into a Socratic dialogue.
- Use intuition before formalism — explain WHY something works, not just the formula.

VISUAL DIAGRAMS — CRITICAL INSTRUCTIONS:
You MUST include diagram tags when explaining shapes, mechanisms, or key equations. Place each tag on its own line.

Available tags (use EXACTLY this syntax on a new line):

[SHAPE:tetrahedral:CH₄:109.5°]
[SHAPE:pyramidal:NH₃:107°]
[SHAPE:bent:H₂O:104.5°]
[SHAPE:trigonal_planar:BF₃:120°]
[SHAPE:linear:CO₂:180°]
[SHAPE:octahedral:SF₆:90°]

[MECHANISM:free_radical:CH₄ + Cl₂ → CH₃Cl + HCl]
[MECHANISM:electrophilic_addition:CH₂=CH₂ + HBr → CH₃CH₂Br]

[EQUATION:n = m / M]

[CONFIG:Fe:1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁶ 4s²]

Rules:
- When explaining ANY molecular shape, ALWAYS include the matching [SHAPE:...] tag
- When explaining ANY mechanism, ALWAYS include [MECHANISM:...] tag
- When stating a key formula, use [EQUATION:...] tag
- When showing electron configuration, use [CONFIG:...] tag
- You can change the formula/angle in shape tags

CHEMISTRY UNIT 1 NOTES (WCH11 — Edexcel IAL):

TOPIC 1 — FORMULAE & MOLES
n=m/M, c=n/V(dm³), pV=nRT(Pa,m³,K), molar vol=24.0dm³/mol at RTP
%yield=(actual/theoretical)×100, atom economy=(Mᵣ desired/ΣMᵣ all)×100
Empirical: %→moles→÷smallest→round. Molecular: Mᵣ÷EF mass

TOPIC 2 — ATOMIC STRUCTURE
Proton(+1,1,nucleus), Neutron(0,1,nucleus), Electron(−1,≈0,shells)
Config: 1s→2s→2p→3s→3p→4s→3d. s=2,p=6,d=10
Mass spec: vaporise→ionise→accelerate→deflect→detect. Mᵣ=molecular mass
IE anomalies: Be→B(2s→2p), N→O(paired 2p repulsion)

TOPIC 3 — BONDING & STRUCTURE
Ionic: transfer, giant lattice, high mp, conducts molten/dissolved
Covalent: sharing, VSEPR. Metallic: delocalised e⁻, lattice of + ions
VSEPR: LP-LP>LP-BP>BP-BP. Shapes: tetrahedral 109.5°, pyramidal 107°, bent 104.5°, trigonal planar 120°, linear 180°, octahedral 90°
IMFs: London(all,↑Mᵣ), dipole-dipole, H-bonding(H—F/O/N··lone pair)
Diamond: 4 bonds, hard, non-conductor. Graphite: 3 bonds, layers, conducts, slides

TOPIC 4 — ORGANIC & ALKANES
CₙH₂ₙ₊₂, saturated, bp↑chain length ↓branching
FRS: UV+halogen. Initiation→Propagation→Termination. Fish-hook arrows
Combustion: complete(CO₂+H₂O), incomplete(CO/C). Cracking: heat/catalyst

TOPIC 5 — ALKENES
CₙH₂ₙ, C=C(σ+π), restricted rotation→E/Z(CIP rules)
Electrophilic addition: HBr→bromoalkane, Br₂→dibromoalkane, steam+H₃PO₄→alcohol, H₂+Ni→alkane
Markovnikov: H to C with more H's. 3°>2°>1° carbocation stability
Tests: Br₂ water decolourises, KMnO₄ decolourises

Only answer WCH11 content. Use diagram tags liberally.`,
  },

  chem2: {
    id: "chem2",
    name: "Chemistry Unit 2",
    code: "WCH12",
    subtitle: "Energetics, Redox & Group Chemistry",
    colour: "#3d8b7a",
    icon: "🧪",
    placeholder: "Ask about Chemistry Unit 2...",
    prompts: [
      "Explain Hess's Law with an example",
      "What happens when Group 2 metals react with water?",
      "Quiz me on redox and oxidation states",
      "How do halides differ in reducing power?",
    ],
    welcome: `Hello! I'm your **AGF Study Companion**, powered by Alastair's diagnostic teaching method.

I'm loaded with **Chemistry Unit 2** (WCH12) — Energetics, Group Chemistry & Introduction to Organic Chemistry.

[EQUATION:ΔH = Σ bonds broken − Σ bonds formed]

• **Ask me anything** about the syllabus
• Say **"quiz me"** for practice questions
• Ask about **enthalpy, groups, halogens, or redox**

What shall we work on?`,
    system: `You are the AGF Study Companion — an AI tutor created by Alastair Fisher of AGF Tutoring. You follow the AGF diagnostic method: Diagnose → Rebuild → Clarify → Test → Extend.

Personality: Patient, warm, rigorous. British English. Concise but thorough.

ASK MODE RULES — CRITICAL:
- ALWAYS give direct, clear, complete explanations. Teach the student — do not quiz them.
- NEVER ask the student questions back like "what do you think?" or "have a think about..."
- NEVER ask the student to work through something on their own — that is what Quiz mode is for.
- Instead: explain the concept clearly, show all the steps, use diagrams, give worked examples, and make sure the student walks away understanding it.
- If a student asks "explain X" — explain X fully. Do not turn it into a Socratic dialogue.
- Use intuition before formalism — explain WHY something works, not just the formula.

VISUAL DIAGRAMS — CRITICAL INSTRUCTIONS:
Include diagram tags where relevant. Available tags:
[SHAPE:...], [MECHANISM:...], [EQUATION:...], [CONFIG:...]
Use EXACTLY the tag syntax on a new line.

CHEMISTRY UNIT 2 NOTES (WCH12 — Edexcel IAL):

TOPIC 6 — ENERGETICS
ΔH = enthalpy change (kJ/mol). Exothermic ΔH<0, endothermic ΔH>0.
Standard conditions: 298K, 100kPa, 1mol/dm³.
Hess's Law: ΔH independent of route. ΔHrxn = Σ bonds broken − Σ bonds formed.
ΔHf°(formation), ΔHc°(combustion), ΔHat°(atomisation), ΔHneut°(neutralisation).
Calorimetry: q=mcΔT, then ΔH=−q/n.
Bond enthalpy: mean values, only exact for diatomics. Use Hess cycles.

TOPIC 7 — REDOX
Oxidation: loss of electrons, increase in oxidation state.
Reduction: gain of electrons, decrease in oxidation state.
OIL RIG. Oxidation Is Loss, Reduction Is Gain.
Oxidation states: elements=0, ions=charge, O=−2(except peroxides−1), H=+1(except metal hydrides−1), F=−1 always.
Half equations: balance atoms, then electrons.
Disproportionation: same element both oxidised and reduced.

TOPIC 8 — GROUP 1 & 2
Group 2 trends: ↑atomic radius, ↓IE, ↑reactivity down group.
Reactions: Mg+H₂O(steam)→MgO+H₂. Ca/Sr/Ba+H₂O(cold)→M(OH)₂+H₂.
Oxides: MgO basic, solubility of hydroxides ↑ down group.
Sulfates: solubility ↓ down group. BaSO₄ insoluble → test for sulfate ions.
Flame colours: Li red, Na yellow, K lilac, Ca orange-red, Sr red, Ba green.

TOPIC 9 — GROUP 7 (HALOGENS)
Trend: ↑atomic radius, ↓electronegativity, ↓reactivity down group.
Displacement: more reactive halogen displaces less reactive halide.
Cl₂+2Br⁻→2Cl⁻+Br₂ (orange). Cl₂+2I⁻→2Cl⁻+I₂ (brown).
Halide reducing power ↑ down group: Cl⁻<Br⁻<I⁻.
NaX + H₂SO₄: NaCl→HCl(white fumes), NaBr→HBr then Br₂(orange), NaI→HI then I₂(purple)+H₂S(rotten eggs).
Silver halide test: AgNO₃+X⁻ → AgCl(white), AgBr(cream), AgI(yellow). Solubility in NH₃.
Chlorine in water: Cl₂+H₂O→HClO+HCl. Water purification, disproportionation.

TOPIC 10 — INTRO TO KINETICS & EQUILIBRIA
Rate affected by: temperature, concentration, pressure, surface area, catalyst.
Collision theory: particles must collide with E≥Ea and correct orientation.
Maxwell-Boltzmann distribution: higher T shifts curve right, more particles above Ea.
Catalysts lower Ea — provide alternative pathway.

TODO: Replace this section with Alastair's actual notes for more detailed coverage.

Only answer WCH12 content. Use diagram tags where relevant.`,
  },

  phys1: {
    id: "phys1",
    name: "Physics Unit 1",
    code: "WPH11",
    subtitle: "Mechanics & Materials",
    colour: "#5b7bbf",
    icon: "⚡",
    placeholder: "Ask about Physics Unit 1...",
    prompts: [
      "Explain SUVAT equations with an example",
      "What's the difference between stress and strain?",
      "Quiz me on Newton's laws",
      "How do you resolve forces on a slope?",
    ],
    welcome: `Hello! I'm your **AGF Study Companion**, powered by Alastair's diagnostic teaching method.

I'm loaded with **Physics Unit 1** (WPH11) — Mechanics, Materials & Waves.

[EQUATION:v = u + at]

• **Ask me anything** about the syllabus
• Say **"quiz me"** for practice questions
• Ask about **forces, motion, energy, or materials**

What shall we work on?`,
    system: `You are the AGF Study Companion — an AI tutor created by Alastair Fisher of AGF Tutoring. You follow the AGF diagnostic method: Diagnose → Rebuild → Clarify → Test → Extend.

Personality: Patient, warm, rigorous. British English. Concise but thorough.

ASK MODE RULES — CRITICAL:
- ALWAYS give direct, clear, complete explanations. Teach the student — do not quiz them.
- NEVER ask the student questions back like "what do you think?" or "have a think about..."
- NEVER ask the student to work through something on their own — that is what Quiz mode is for.
- Instead: explain the concept clearly, show all the steps, use diagrams, give worked examples, and make sure the student walks away understanding it.
- If a student asks "explain X" — explain X fully. Do not turn it into a Socratic dialogue.
- Use intuition before formalism — explain WHY something works, not just the formula.

VISUAL DIAGRAMS — use [EQUATION:...] tags for key formulae on their own line.

PHYSICS UNIT 1 NOTES (WPH11 — Edexcel IAL):

TOPIC 1 — MECHANICS
Scalars: magnitude only (speed, distance, mass, energy, temperature).
Vectors: magnitude + direction (velocity, displacement, force, acceleration, momentum).
Resolving vectors: horizontal = F cosθ, vertical = F sinθ.

SUVAT equations (constant acceleration):
v = u + at
s = ut + ½at²
v² = u² + 2as
s = ½(u+v)t
where s=displacement, u=initial velocity, v=final velocity, a=acceleration, t=time.

Projectiles: horizontal (constant v) and vertical (a=g=9.81ms⁻²) treated independently.
Free fall: a=g, air resistance increases with speed until terminal velocity (resultant F=0).

Newton's Laws:
1st: Object remains at rest or constant velocity unless acted on by resultant force.
2nd: F=ma (resultant force = mass × acceleration).
3rd: Every action has an equal and opposite reaction (on different objects, same type of force).

Moments: moment = force × perpendicular distance from pivot. Equilibrium: ΣF=0, Σmoments=0.
Couple: two equal, opposite, parallel forces. Torque = one force × distance between them.

TOPIC 2 — ENERGY & MOMENTUM
Work done: W = Fs cosθ (joules).
Kinetic energy: Ek = ½mv².
Gravitational PE: Ep = mgh.
Power: P = W/t = Fv.
Efficiency = useful output / total input × 100%.
Conservation of energy: energy cannot be created or destroyed, only transferred.

Momentum: p = mv (kg ms⁻¹). Conservation: total momentum before = total momentum after (closed system).
Impulse: FΔt = Δp = mv − mu.
Elastic collision: KE conserved. Inelastic: KE not conserved.

TOPIC 3 — MATERIALS
Density: ρ = m/V.
Hooke's Law: F = kx (up to limit of proportionality). Spring constant k (N/m).
Springs in series: 1/k_total = 1/k₁ + 1/k₂. In parallel: k_total = k₁ + k₂.
Elastic strain energy: E = ½Fx = ½kx².
Stress: σ = F/A (Pa). Strain: ε = ΔL/L (no units). Young's modulus: E = σ/ε = (FL)/(AΔL).
Stress-strain graphs: elastic region, yield point, plastic deformation, UTS, fracture.
Brittle: fractures with little plastic deformation. Ductile: stretches before breaking.
Polymers: rubber (large elastic strain), polythene (plastic deformation).

TODO: Replace this section with Alastair's actual notes for more detailed coverage.

Only answer WPH11 content. Use [EQUATION:...] tags for key formulae.`,
  },

  phys2: {
    id: "phys2",
    name: "Physics Unit 2",
    code: "WPH12",
    subtitle: "Waves & Electricity",
    colour: "#7b5bbf",
    icon: "🔌",
    placeholder: "Ask about Physics Unit 2...",
    prompts: [
      "Explain the difference between series and parallel circuits",
      "What is total internal reflection?",
      "Quiz me on waves",
      "How do you calculate resistance in a circuit?",
    ],
    welcome: `Hello! I'm your **AGF Study Companion**, powered by Alastair's diagnostic teaching method.

I'm loaded with **Physics Unit 2** (WPH12) — Waves & Electricity.

[EQUATION:V = IR]

• **Ask me anything** about the syllabus
• Say **"quiz me"** for practice questions
• Ask about **waves, optics, circuits, or electricity**

What shall we work on?`,
    system: `You are the AGF Study Companion — an AI tutor created by Alastair Fisher of AGF Tutoring. You follow the AGF diagnostic method: Diagnose → Rebuild → Clarify → Test → Extend.

Personality: Patient, warm, rigorous. British English. Concise but thorough.

ASK MODE RULES — CRITICAL:
- ALWAYS give direct, clear, complete explanations. Teach the student — do not quiz them.
- NEVER ask the student questions back like "what do you think?" or "have a think about..."
- NEVER ask the student to work through something on their own — that is what Quiz mode is for.
- Instead: explain the concept clearly, show all the steps, use diagrams, give worked examples, and make sure the student walks away understanding it.
- If a student asks "explain X" — explain X fully. Do not turn it into a Socratic dialogue.
- Use intuition before formalism — explain WHY something works, not just the formula.

VISUAL DIAGRAMS — use [EQUATION:...] tags for key formulae on their own line.

PHYSICS UNIT 2 NOTES (WPH12 — Edexcel IAL):

TOPIC 4 — WAVES
Wave types: transverse (oscillation ⊥ direction) — light, EM, water. Longitudinal (oscillation ∥ direction) — sound, P-waves.
v = fλ. T = 1/f. Amplitude, wavelength, frequency, period.
Phase difference: in phase (0°, 2π), antiphase (180°, π).
Superposition: waves combine — constructive (in phase), destructive (antiphase).
Stationary waves: two progressive waves, same f, opposite direction. Nodes (zero displacement), antinodes (max displacement).
Strings: f₁ = v/2L. Harmonics: fₙ = nf₁.
Diffraction: waves spread through gaps. Maximum when gap ≈ wavelength.
Young's double slit: λ = ax/D (a=slit separation, x=fringe spacing, D=screen distance).

TOPIC 5 — OPTICS
Refraction: Snell's law n₁sinθ₁ = n₂sinθ₂. n = c/v.
Total internal reflection: when θ > θc (critical angle). sinθc = n₂/n₁.
Applications: optical fibres (cladding prevents signal loss), endoscopes.
EM spectrum: radio, micro, IR, visible, UV, X-ray, gamma. All travel at c = 3×10⁸ ms⁻¹ in vacuum.

TOPIC 6 — ELECTRICITY
Current: I = ΔQ/Δt (A = C/s). Conventional current: + to −.
Potential difference: V = W/Q (V = J/C). EMF: energy per unit charge from source.
Resistance: R = V/I (Ω). Ohm's law: V∝I at constant temperature.
Resistivity: R = ρL/A.
I-V characteristics: ohmic conductor (straight line), filament lamp (curve — R increases with T), diode (forward bias conducts).
Power: P = IV = I²R = V²/R. Energy: E = Pt = IVt.

Series: same current, V_total = V₁+V₂, R_total = R₁+R₂.
Parallel: same V, I_total = I₁+I₂, 1/R_total = 1/R₁+1/R₂.
Potential divider: V_out = V_in × R₂/(R₁+R₂). Applications with LDR and thermistor.
EMF and internal resistance: ε = I(R+r). V = ε − Ir. Lost volts = Ir.

Kirchhoff's laws: 1st — ΣI at junction = 0. 2nd — Σε = ΣIR around loop.

TODO: Replace this section with Alastair's actual notes for more detailed coverage.

Only answer WPH12 content. Use [EQUATION:...] tags for key formulae.`,
  },

  maths: {
    id: "maths",
    name: "A-Level Maths",
    code: "Pure",
    subtitle: "Pure Mathematics (Core)",
    colour: "#bf8f3d",
    icon: "📐",
    placeholder: "Ask about A-Level Maths...",
    prompts: [
      "Explain completing the square step by step",
      "How do I differentiate from first principles?",
      "Quiz me on integration",
      "What are the factor and remainder theorems?",
    ],
    welcome: `Hello! I'm your **AGF Study Companion**, powered by Alastair's diagnostic teaching method.

I'm loaded with **A-Level Mathematics** — Pure / Core content.

[EQUATION:dy/dx = nxⁿ⁻¹]

• **Ask me anything** about the syllabus
• Say **"quiz me"** for practice questions
• Ask me to **work through a problem step by step**

What shall we work on?`,
    system: `You are the AGF Study Companion — an AI tutor created by Alastair Fisher of AGF Tutoring. You follow the AGF diagnostic method: Diagnose → Rebuild → Clarify → Test → Extend.

Personality: Patient, warm, rigorous. British English. Concise but thorough.

ASK MODE RULES — CRITICAL:
- ALWAYS give direct, clear, complete explanations. Teach the student — do not quiz them.
- NEVER ask the student questions back like "what do you think?" or "have a think about..."
- NEVER ask the student to work through something on their own — that is what Quiz mode is for.
- Instead: explain the concept clearly, show all the steps, use diagrams, give worked examples, and make sure the student walks away understanding it.
- If a student asks "explain X" — explain X fully. Do not turn it into a Socratic dialogue.
- Use intuition before formalism — explain WHY something works, not just the formula.

Use [EQUATION:...] tags for key formulae on their own line.

When working through problems, show EVERY step clearly. Use the structure:
**Step 1:** ...
**Step 2:** ...
etc.

A-LEVEL MATHEMATICS NOTES (Pure/Core):

ALGEBRA & FUNCTIONS
Quadratics: ax²+bx+c=0. Discriminant b²−4ac: >0 two real roots, =0 repeated, <0 no real roots.
Completing the square: a(x+b/2a)²−b²/4a+c. Vertex at (−b/2a, c−b²/4a).
Factor theorem: if f(a)=0 then (x−a) is a factor.
Remainder theorem: f(a) = remainder when f(x) divided by (x−a).
Algebraic fractions: factorise, cancel, partial fractions.
Surds: rationalise denominator — multiply by conjugate.
Indices: aᵐ×aⁿ=aᵐ⁺ⁿ, aᵐ÷aⁿ=aᵐ⁻ⁿ, (aᵐ)ⁿ=aᵐⁿ, a⁰=1, a⁻ⁿ=1/aⁿ, a^(1/n)=ⁿ√a.

COORDINATE GEOMETRY
Straight line: y−y₁=m(x−x₁), y=mx+c.
Gradient: m=(y₂−y₁)/(x₂−x₁). Parallel: m₁=m₂. Perpendicular: m₁×m₂=−1.
Distance: √((x₂−x₁)²+(y₂−y₁)²). Midpoint: ((x₁+x₂)/2, (y₁+y₂)/2).
Circle: (x−a)²+(y−b)²=r². Centre (a,b), radius r.
Tangent to circle: perpendicular to radius at point of contact.

SEQUENCES & SERIES
Arithmetic: uₙ=a+(n−1)d, Sₙ=n/2(2a+(n−1)d)=n/2(a+l).
Geometric: uₙ=arⁿ⁻¹, Sₙ=a(1−rⁿ)/(1−r). Sum to infinity S∞=a/(1−r) when |r|<1.
Binomial expansion: (a+b)ⁿ = Σ ⁿCᵣ aⁿ⁻ʳbʳ. Pascal's triangle. Valid for all n if |b/a|<1.

TRIGONOMETRY
sinθ, cosθ, tanθ=sinθ/cosθ. CAST diagram for signs in quadrants.
sin²θ+cos²θ=1. Sine rule: a/sinA=b/sinB. Cosine rule: a²=b²+c²−2bc cosA.
Radians: π rad=180°. Arc length s=rθ. Area of sector A=½r²θ.
Small angle approximations: sinθ≈θ, cosθ≈1−θ²/2, tanθ≈θ.

DIFFERENTIATION
First principles: f'(x) = lim(h→0) [f(x+h)−f(x)]/h.
Power rule: d/dx(xⁿ)=nxⁿ⁻¹. Chain rule: dy/dx = dy/du × du/dx.
Product rule: d/dx(uv)=u'v+uv'. Quotient rule: d/dx(u/v)=(u'v−uv')/v².
Stationary points: dy/dx=0. Nature: d²y/dx²>0 min, <0 max.
Tangent at (a,f(a)): y−f(a)=f'(a)(x−a). Normal: gradient −1/f'(a).

INTEGRATION
∫xⁿdx = xⁿ⁺¹/(n+1)+c (n≠−1). ∫1/x dx = ln|x|+c.
Definite integral: area under curve = ∫ₐᵇ f(x)dx.
Area between curves: ∫ₐᵇ [f(x)−g(x)]dx.
Integration by substitution, by parts: ∫u dv = uv − ∫v du.
Trapezium rule: ∫≈h/2[y₀+2(y₁+...+yₙ₋₁)+yₙ].

EXPONENTIALS & LOGARITHMS
eˣ: d/dx(eˣ)=eˣ, ∫eˣdx=eˣ+c. ln x: d/dx(ln x)=1/x.
Laws: log(ab)=loga+logb, log(a/b)=loga−logb, log(aⁿ)=nloga.
Solving: aˣ=b → x=ln b/ln a. Growth/decay: N=N₀eᵏᵗ.

VECTORS
Position vector, direction vector. a·b=|a||b|cosθ.
Magnitude: |a|=√(x²+y²+z²).

TODO: Replace this section with Alastair's actual notes for more detailed coverage.

Only answer A-Level Pure Maths content. Use [EQUATION:...] tags for key formulae. Show all working step by step.`,
  },
};

const SUBJECT_LIST = Object.values(SUBJECTS);

/* ═══════════════════════════════════════════════════
   SHAPE SVG COMPONENTS (unchanged)
   ═══════════════════════════════════════════════════ */

function ShapeSVG({ shape, formula, angle }) {
  const f = formula || "?";
  const a = angle || "";
  const S = { fill: "none", stroke: C.green, strokeWidth: 2 };
  const T = { fill: C.text, fontSize: 12, fontWeight: 600, fontFamily: "'DM Sans',sans-serif", textAnchor: "middle" };
  const L = { fill: C.textMuted, fontSize: 10, fontFamily: "'DM Sans',sans-serif", textAnchor: "middle" };
  const LP = { fill: "none", stroke: C.amber, strokeWidth: 1.5, strokeDasharray: "3,2" };
  const Label = { fill: C.green, fontSize: 11, fontWeight: 500, fontFamily: "'DM Sans',sans-serif", textAnchor: "middle" };
  const wrap = (children, vb = "0 0 200 180") => (
    <div style={{ background: C.bgLight, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 10px 8px", margin: "10px 0", textAlign: "center" }}>
      <svg viewBox={vb} style={{ width: "100%", maxWidth: 230, display: "block", margin: "0 auto" }}>{children}</svg>
    </div>
  );

  if (shape === "tetrahedral") return wrap(<>
    <circle cx="100" cy="78" r="15" fill={C.bgCard} {...S}/><text x="100" y="83" {...T}>C</text>
    <line x1="100" y1="63" x2="100" y2="20" {...S}/><text x="100" y="14" {...L}>H</text>
    <line x1="115" y1="78" x2="172" y2="58" {...S}/><text x="180" y="62" {...L}>H</text>
    <line x1="88" y1="91" x2="42" y2="138" {...S}/><text x="30" y="148" {...L}>H</text>
    <line x1="112" y1="91" x2="158" y2="138" {...S}/><text x="170" y="148" {...L}>H</text>
    <path d="M132,125 A38,38 0 0,0 152,100" fill="none" stroke={C.textDim} strokeWidth="1" strokeDasharray="3,2"/>
    <text x="155" y="118" fill={C.textMuted} fontSize="9" fontFamily="'DM Sans',sans-serif">{a}</text>
    <text x="100" y="172" {...Label}>{f} — Tetrahedral</text>
  </>);
  if (shape === "pyramidal") return wrap(<>
    <circle cx="100" cy="82" r="15" fill={C.bgCard} {...S}/><text x="100" y="87" {...T}>N</text>
    <line x1="100" y1="67" x2="100" y2="28" {...S}/><text x="100" y="22" {...L}>H</text>
    <line x1="87" y1="94" x2="38" y2="142" {...S}/><text x="26" y="152" {...L}>H</text>
    <line x1="113" y1="94" x2="162" y2="142" {...S}/><text x="174" y="152" {...L}>H</text>
    <ellipse cx="100" cy="60" rx="7" ry="4" {...LP}/><ellipse cx="100" cy="55" rx="7" ry="4" {...LP}/>
    <text x="122" y="52" fill={C.amber} fontSize="8" fontFamily="'DM Sans',sans-serif">lone pair</text>
    <text x="100" y="172" {...Label}>{f} — Pyramidal ({a})</text>
  </>);
  if (shape === "bent") return wrap(<>
    <circle cx="100" cy="65" r="15" fill={C.bgCard} {...S}/><text x="100" y="70" {...T}>O</text>
    <line x1="87" y1="77" x2="38" y2="125" {...S}/><text x="26" y="135" {...L}>H</text>
    <line x1="113" y1="77" x2="162" y2="125" {...S}/><text x="174" y="135" {...L}>H</text>
    <ellipse cx="86" cy="50" rx="7" ry="4" {...LP}/><ellipse cx="86" cy="45" rx="7" ry="4" {...LP}/>
    <ellipse cx="114" cy="50" rx="7" ry="4" {...LP}/><ellipse cx="114" cy="45" rx="7" ry="4" {...LP}/>
    <text x="100" y="36" fill={C.amber} fontSize="8" fontFamily="'DM Sans',sans-serif">2 lone pairs</text>
    <path d="M56,112 A45,45 0 0,0 78,90" fill="none" stroke={C.textDim} strokeWidth="1" strokeDasharray="3,2"/>
    <text x="46" y="96" fill={C.textMuted} fontSize="9" fontFamily="'DM Sans',sans-serif">{a}</text>
    <text x="100" y="160" {...Label}>{f} — Bent ({a})</text>
  </>, "0 0 200 165");
  if (shape === "trigonal_planar") return wrap(<>
    <circle cx="100" cy="78" r="15" fill={C.bgCard} {...S}/><text x="100" y="83" {...T}>B</text>
    <line x1="100" y1="63" x2="100" y2="20" {...S}/><text x="100" y="14" {...L}>F</text>
    <line x1="87" y1="91" x2="38" y2="140" {...S}/><text x="26" y="150" {...L}>F</text>
    <line x1="113" y1="91" x2="162" y2="140" {...S}/><text x="174" y="150" {...L}>F</text>
    <text x="100" y="172" {...Label}>{f} — Trigonal planar ({a})</text>
  </>);
  if (shape === "linear") return wrap(<>
    <circle cx="110" cy="35" r="14" fill={C.bgCard} {...S}/><text x="110" y="40" {...T}>C</text>
    <line x1="96" y1="35" x2="30" y2="35" {...S}/><line x1="93" y1="31" x2="33" y2="31" {...S}/>
    <line x1="124" y1="35" x2="190" y2="35" {...S}/><line x1="127" y1="31" x2="187" y2="31" {...S}/>
    <text x="18" y="40" {...L}>O</text><text x="202" y="40" {...L}>O</text>
    <text x="110" y="68" {...Label}>{f} — Linear ({a})</text>
  </>, "0 0 220 75");
  if (shape === "octahedral") return wrap(<>
    <circle cx="100" cy="90" r="14" fill={C.bgCard} {...S}/><text x="100" y="95" {...T}>S</text>
    <line x1="100" y1="76" x2="100" y2="22" {...S}/><text x="100" y="16" {...L}>F</text>
    <line x1="100" y1="104" x2="100" y2="158" {...S}/><text x="100" y="170" {...L}>F</text>
    <line x1="86" y1="90" x2="22" y2="90" {...S}/><text x="12" y="94" {...L}>F</text>
    <line x1="114" y1="90" x2="178" y2="90" {...S}/><text x="188" y="94" {...L}>F</text>
    <line x1="110" y1="80" x2="150" y2="42" stroke={C.green} strokeWidth="1.5" strokeDasharray="4,3"/><text x="158" y="40" fill={C.textMuted} fontSize="9">F</text>
    <line x1="90" y1="100" x2="50" y2="138" stroke={C.green} strokeWidth="1.5" strokeDasharray="4,3"/><text x="42" y="148" fill={C.textMuted} fontSize="9">F</text>
    <text x="100" y="186" {...Label}>{f} — Octahedral ({a})</text>
  </>, "0 0 200 192");
  return <div style={{ color: C.textMuted, fontSize: 12, padding: 8, background: C.bgLight, borderRadius: 8, margin: "6px 0" }}>Shape: {shape} {f} {a}</div>;
}

/* ═══ MECHANISM DIAGRAM ═══ */
function MechDiagram({ type, equation }) {
  const isFR = type === "free_radical";
  const step = (c) => ({ color: c, fontSize: 11, fontWeight: 600, fontFamily: "'DM Sans',sans-serif", marginTop: 8, marginBottom: 2 });
  const line = { color: C.text, fontSize: 13, fontFamily: "'JetBrains Mono',monospace", lineHeight: 1.9 };
  const dot = <span style={{ color: C.red, fontWeight: 700 }}>•</span>;
  const arr = (c) => <span style={{ color: c || C.green }}> → </span>;
  return (
    <div style={{ background: C.bgLight, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", margin: "10px 0" }}>
      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: C.green, marginBottom: 6, fontFamily: "'DM Sans',sans-serif", fontWeight: 600 }}>
        {isFR ? "Free Radical Substitution" : "Electrophilic Addition"}
      </div>
      <div style={line}>
        {isFR ? (<>
          <div style={step(C.amber)}>Initiation — homolytic fission (UV light)</div>
          <div>Cl—Cl {arr(C.amber)} 2Cl{dot}</div>
          <div style={step(C.green)}>Propagation — chain reaction</div>
          <div>Cl{dot} + CH₄ {arr()} CH₃{dot} + HCl</div>
          <div>CH₃{dot} + Cl₂ {arr()} CH₃Cl + Cl{dot}</div>
          <div style={step(C.textMuted)}>Termination — radicals combine</div>
          <div>2Cl{dot} {arr(C.textMuted)} Cl₂</div>
          <div>Cl{dot} + CH₃{dot} {arr(C.textMuted)} CH₃Cl</div>
          <div>2CH₃{dot} {arr(C.textMuted)} C₂H₆</div>
        </>) : (<>
          <div style={step(C.green)}>Step 1 — π bond attacks electrophile</div>
          <svg viewBox="0 0 280 55" style={{ width: "100%", maxWidth: 280, display: "block", margin: "4px 0" }}>
            <text x="5" y="30" fill={C.text} fontSize="13" fontFamily="'JetBrains Mono',monospace">C=C</text>
            <path d="M42,25 Q80,5 118,20" fill="none" stroke={C.amber} strokeWidth="2" markerEnd="url(#ca)"/>
            <defs><marker id="ca" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,2 L10,5 L0,8 z" fill={C.amber}/></marker></defs>
            <text x="55" y="12" fill={C.amber} fontSize="9" fontFamily="'DM Sans',sans-serif">curly arrow</text>
            <text x="122" y="30" fill={C.text} fontSize="13" fontFamily="'JetBrains Mono',monospace">H—Br</text>
            <text x="122" y="48" fill={C.textMuted} fontSize="9" fontFamily="'DM Sans',sans-serif">δ⁺    δ⁻</text>
          </svg>
          <div>C=C + H<sup>δ⁺</sup>—Br<sup>δ⁻</sup> {arr()} C—C⁺ + Br⁻</div>
          <div style={step(C.green)}>Step 2 — Nucleophilic attack</div>
          <div>Br⁻ {arr()} C⁺ (attacks carbocation)</div>
          <div style={{ marginTop: 8, color: C.green, fontSize: 12 }}>Overall: {equation}</div>
        </>)}
      </div>
    </div>
  );
}

function EqBox({ content }) {
  return (<div style={{ background: C.bgLight, border: `1px solid ${C.greenBorder}`, borderRadius: 8, padding: "8px 16px", margin: "6px 0", display: "inline-block", fontFamily: "'JetBrains Mono',monospace", fontSize: 15, fontWeight: 500, color: C.green }}>{content}</div>);
}

function ConfigBox({ element, config }) {
  return (<div style={{ background: C.bgLight, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 14px", margin: "6px 0", display: "inline-block" }}>
    <span style={{ color: C.amber, fontWeight: 600, fontSize: 14, fontFamily: "'DM Sans',sans-serif" }}>{element}: </span>
    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, color: C.green }}>{config}</span>
  </div>);
}

/* ═══ PARSER ═══ */
function parseAndRender(text) {
  const lines = text.split("\n");
  const elements = [];
  const tagRe = /^\[(\w+):(.+)\]$/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const m = line.match(tagRe);
    if (m) {
      const [, tag, params] = m;
      const p = params.split(":");
      if (tag === "SHAPE") elements.push(<ShapeSVG key={`s${i}`} shape={p[0]} formula={p[1]} angle={p[2]} />);
      else if (tag === "MECHANISM") elements.push(<MechDiagram key={`m${i}`} type={p[0]} equation={p.slice(1).join(":")} />);
      else if (tag === "EQUATION") elements.push(<EqBox key={`e${i}`} content={p.join(":")} />);
      else if (tag === "CONFIG") elements.push(<ConfigBox key={`c${i}`} element={p[0]} config={p.slice(1).join(":")} />);
    } else if (line.match(/^#{1,3}\s/)) {
      const level = line.match(/^(#{1,3})\s/)[1].length;
      const headerText = line.replace(/^#{1,3}\s+/, "");
      if (level === 1) {
        elements.push(
          <div key={`h${i}`} style={{
            fontSize: 20, fontWeight: 500,
            fontFamily: "'DM Serif Display',serif",
            color: C.green, letterSpacing: "-0.02em",
            marginTop: 20, marginBottom: 8,
            borderBottom: `2px solid ${C.greenBorder}`,
            paddingBottom: 10,
          }}><RichLine text={headerText} /></div>
        );
      } else {
        elements.push(
          <div key={`h${i}`} style={{
            fontSize: level === 2 ? 15 : 13.5,
            fontWeight: 600,
            fontFamily: "'Outfit',sans-serif",
            color: C.text,
            marginTop: 18, marginBottom: 8,
            paddingLeft: 12,
            borderLeft: `3px solid ${C.green}`,
          }}><RichLine text={headerText} /></div>
        );
      }
    } else if (line.match(/^[-•]\s/)) {
      const bulletText = line.replace(/^[-•]\s+/, "");
      const tagMatch = bulletText.match(/^\[(\w+):([^\]]+)\]$/);
      if (tagMatch && tagMatch[1] === "EQUATION") {
        elements.push(<div key={`be${i}`} style={{ paddingLeft: 16, marginBottom: 4 }}><EqBox content={tagMatch[2].trim()} /></div>);
      } else {
        elements.push(
          <div key={`b${i}`} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 4, paddingLeft: 8 }}>
            <span style={{ color: C.green, fontSize: 6, marginTop: 7, flexShrink: 0 }}>●</span>
            <span style={{ flex: 1, lineHeight: 1.7 }}><RichLine text={bulletText} /></span>
          </div>
        );
      }
    } else if (line.match(/^\d+\.\s/)) {
      const num = line.match(/^(\d+)\./)[1];
      const listText = line.replace(/^\d+\.\s+/, "");
      elements.push(
        <div key={`n${i}`} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 6, paddingLeft: 8 }}>
          <span style={{ color: C.green, fontSize: 13, fontWeight: 700, minWidth: 22, flexShrink: 0, fontFamily: "'JetBrains Mono',monospace" }}>{num}.</span>
          <span style={{ flex: 1, lineHeight: 1.7 }}><RichLine text={listText} /></span>
        </div>
      );
    } else if (line.match(/^---+$/)) {
      elements.push(<div key={`hr${i}`} style={{ height: 1, background: C.border, margin: "14px 0" }} />);
    } else if (line) {
      elements.push(<span key={`t${i}`}><RichLine text={line} /><br /></span>);
    } else {
      elements.push(<br key={`br${i}`} />);
    }
  }
  return elements;
}

function RichLine({ text }) {
  return text.split(/(\*\*.*?\*\*|\*.*?\*|`[^`]+`|\[EQUATION:[^\]]+\])/g).map((s, i) => {
    if (!s) return null;
    if (s.startsWith("**") && s.endsWith("**")) return <strong key={i} style={{ fontWeight: 600, color: C.text }}>{s.slice(2, -2)}</strong>;
    if (s.startsWith("*") && s.endsWith("*")) return <em key={i} style={{ fontStyle: "italic", color: C.text }}>{s.slice(1, -1)}</em>;
    if (s.startsWith("`") && s.endsWith("`")) return <code key={i} style={{ background: C.greenDim, padding: "1px 5px", borderRadius: 3, fontFamily: "'JetBrains Mono',monospace", fontSize: "0.88em", color: C.green }}>{s.slice(1, -1)}</code>;
    if (s.startsWith("[EQUATION:") && s.endsWith("]")) {
      const content = s.slice(10, -1).trim();
      return <span key={i} style={{ display: "inline-block", background: C.bgLight, border: `1px solid ${C.greenBorder}`, borderRadius: 5, padding: "1px 8px", fontFamily: "'JetBrains Mono',monospace", fontSize: "0.9em", fontWeight: 500, color: C.green, margin: "0 2px" }}>{content}</span>;
    }
    return <span key={i}>{s}</span>;
  });
}

/* ═══ NOTES VIEW COMPONENT ═══ */
function NotesView({ data, subject, onClose }) {
  if (!data) return null;
  const col = subject?.colour || C.green;

  return (
    <div style={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column", background: C.bg, fontFamily: "'Outfit',sans-serif", color: C.text }}>
      {/* Header */}
      <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: 17, letterSpacing: "-0.02em" }}>
            AGF<span style={{ color: C.green }}>tutoring</span>
            <span style={{ fontSize: 13, color: C.textMuted, fontFamily: "'Outfit',sans-serif" }}> · Revision Notes</span>
          </div>
          <div style={{ fontSize: 10.5, color: C.textDim, letterSpacing: "0.06em", textTransform: "uppercase", marginTop: 1 }}>
            {subject?.icon} {subject?.code} · {subject?.name}
          </div>
        </div>
        <button onClick={onClose} style={{ padding: "8px 18px", borderRadius: 6, fontSize: 12, fontWeight: 600, border: `1px solid ${C.green}`, background: C.greenDim, color: C.green, cursor: "pointer" }}>
          ← Back to Chat
        </button>
      </div>

      {/* Notes Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 20px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          {/* Title */}
          <div style={{ marginBottom: 32, textAlign: "center" }}>
            <div style={{ fontSize: 10, color: C.green, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 8, fontWeight: 500 }}>
              {subject?.code} · Revision Notes
            </div>
            <h1 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 28, fontWeight: 400, color: C.text, margin: 0, letterSpacing: "-0.02em" }}>
              {data.title}
            </h1>
            {data.subtitle && (
              <div style={{ fontSize: 14, color: C.textMuted, marginTop: 6 }}>{data.subtitle}</div>
            )}
            <div style={{ width: 50, height: 2, background: C.green, margin: "16px auto 0", borderRadius: 1 }} />
          </div>

          {/* Sections */}
          {data.sections.map((section, idx) => (
            <NotesSection key={idx} section={section} index={idx} col={col} />
          ))}

          {/* Footer */}
          <div style={{ textAlign: "center", padding: "32px 0 16px", fontSize: 10, color: C.textDim }}>
            Powered by AGF Tutoring · Grounded in curated notes
          </div>
        </div>
      </div>
    </div>
  );
}

function NotesSection({ section, index, col }) {
  const s = section;

  // Section header (for titled sections)
  const SectionHeader = ({ title, num }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 32, marginBottom: 16 }}>
      {num !== undefined && (
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fontWeight: 600, color: C.green, opacity: 0.5 }}>
          {String(num).padStart(2, "0")}
        </span>
      )}
      <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 20, fontWeight: 400, color: C.text, margin: 0, letterSpacing: "-0.02em" }}>
        {title}
      </h2>
    </div>
  );

  if (s.type === "definitions") {
    return (
      <div>
        <SectionHeader title={s.title} num={index + 1} />
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {s.items?.map((item, i) => (
            <div key={i} style={{ borderLeft: `3px solid ${C.green}`, paddingLeft: 16, paddingTop: 4, paddingBottom: 4 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 3 }}>{item.term}</div>
              <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.6 }}>{item.definition}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (s.type === "equations") {
    return (
      <div>
        <SectionHeader title={s.title} num={index + 1} />
        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
          {s.items?.map((item, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "12px 18px",
              borderBottom: i < s.items.length - 1 ? `1px solid ${C.borderLight}` : "none",
            }}>
              <span style={{ fontSize: 13, color: C.textMuted, flex: 1 }}>{item.label}</span>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 15, fontWeight: 500, color: C.green, textAlign: "right" }}>
                {item.equation}
              </span>
              {item.units && (
                <span style={{ fontSize: 10, color: C.textDim, marginLeft: 10, minWidth: 60, textAlign: "right" }}>{item.units}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (s.type === "content") {
    return (
      <div>
        <SectionHeader title={s.title} num={index + 1} />
        {s.paragraphs?.map((p, i) => (
          <p key={i} style={{ fontSize: 13.5, color: "rgba(255,255,255,0.8)", lineHeight: 1.8, margin: "0 0 12px" }}>{p}</p>
        ))}
        {s.bullets && s.bullets.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
            {s.bullets.map((b, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", paddingLeft: 4 }}>
                <span style={{ color: C.green, fontSize: 6, marginTop: 7, flexShrink: 0 }}>●</span>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.7 }}>{b}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (s.type === "table") {
    return (
      <div>
        {s.title && <SectionHeader title={s.title} num={index + 1} />}
        <div style={{ overflowX: "auto", borderRadius: 10, border: `1px solid ${C.border}` }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: C.bgCard }}>
                {s.headers?.map((h, i) => (
                  <th key={i} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600, color: C.text, borderBottom: `1px solid ${C.border}`, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {s.rows?.map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : C.bgCard }}>
                  {row.map((cell, j) => (
                    <td key={j} style={{ padding: "10px 14px", color: j === 0 ? C.text : C.textMuted, fontWeight: j === 0 ? 500 : 400, borderBottom: i < s.rows.length - 1 ? `1px solid ${C.borderLight}` : "none" }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (s.type === "tip") {
    return (
      <div style={{
        margin: "20px 0", padding: "14px 18px", borderRadius: 10,
        background: "rgba(77,148,96,0.06)", border: `1px solid rgba(77,148,96,0.15)`,
        display: "flex", gap: 12, alignItems: "flex-start",
      }}>
        <span style={{ fontSize: 18, flexShrink: 0 }}>💡</span>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.green, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>Exam Tip</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", lineHeight: 1.7 }}>{s.text}</div>
        </div>
      </div>
    );
  }

  if (s.type === "warning") {
    return (
      <div style={{
        margin: "20px 0", padding: "14px 18px", borderRadius: 10,
        background: "rgba(212,162,76,0.06)", border: `1px solid rgba(212,162,76,0.15)`,
        display: "flex", gap: 12, alignItems: "flex-start",
      }}>
        <span style={{ fontSize: 18, flexShrink: 0 }}>⚠️</span>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.amber, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>Watch Out</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", lineHeight: 1.7 }}>{s.text}</div>
        </div>
      </div>
    );
  }

  if (s.type === "worked_example") {
    return (
      <div style={{
        margin: "20px 0", padding: "18px 20px", borderRadius: 10,
        background: C.bgCard, border: `1px solid ${C.border}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <span style={{ fontSize: 18 }}>⭐</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: C.green, textTransform: "uppercase", letterSpacing: "0.08em" }}>Worked Example</span>
        </div>
        {s.question && (
          <div style={{ fontSize: 14, fontWeight: 500, color: C.text, marginBottom: 12, lineHeight: 1.6 }}>{s.question}</div>
        )}
        {s.solution && (
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.9, fontFamily: "'JetBrains Mono',monospace", whiteSpace: "pre-wrap", background: C.bgLight, padding: "12px 16px", borderRadius: 8, border: `1px solid ${C.borderLight}` }}>
            {s.solution}
          </div>
        )}
      </div>
    );
  }

  // Fallback
  return null;
}


/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════ */
export default function Home() {
  const [subject, setSubject] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [mode, setMode] = useState("ask");
  const [showPicker, setShowPicker] = useState(false);

  // Quiz state
  const [quizQ, setQuizQ] = useState(null); // current parsed question
  const [quizNum, setQuizNum] = useState(0); // 0-9
  const [quizSelected, setQuizSelected] = useState(null); // selected MC option or typed answer
  const [quizFeedback, setQuizFeedback] = useState(null); // feedback after answering
  const [quizScore, setQuizScore] = useState(0);
  const [quizMaxScore, setQuizMaxScore] = useState(0);
  const [quizHistory, setQuizHistory] = useState([]); // array of {q, answer, feedback, correct, marks, maxMarks}
  const [quizDone, setQuizDone] = useState(false);
  const [hintText, setHintText] = useState(null);
  const [hintLoading, setHintLoading] = useState(false);

  // Notes view state
  const [showNotes, setShowNotes] = useState(false);
  const [notesData, setNotesData] = useState(null);
  const [notesLoading, setNotesLoading] = useState(false);

  const endRef = useRef(null);
  const inputRef = useRef(null);

  const currentSubject = subject ? SUBJECTS[subject] : null;

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, loading, quizFeedback, quizQ]);
  useEffect(() => { if (subject && mode === "ask") inputRef.current?.focus(); }, [subject, mode]);

  const selectSubject = (id) => {
    setSubject(id);
    setMsgs([{ role: "assistant", content: SUBJECTS[id].welcome }]);
    setErr(null);
    setInput("");
    setMode("ask");
    resetQuiz();
    setShowPicker(false);
  };

  const resetQuiz = () => {
    setQuizQ(null); setQuizNum(0); setQuizSelected(null); setQuizFeedback(null);
    setQuizScore(0); setQuizMaxScore(0); setQuizHistory([]); setQuizDone(false);
    setHintText(null); setHintLoading(false);
  };

  const QUIZ_GEN_SYSTEM = (subjectSystem) => subjectSystem + `

QUIZ QUESTION GENERATION MODE:
You must respond with ONLY a valid JSON object, no other text, no markdown fences, no explanation.

Generate ONE multiple-choice exam-style question in the style of Edexcel IAL past papers.

JSON format:
{
  "question": "The question text here",
  "options": [
    {"label": "A", "text": "First option text"},
    {"label": "B", "text": "Second option text"},
    {"label": "C", "text": "Third option text"},
    {"label": "D", "text": "Fourth option text"}
  ],
  "correctLabel": "C",
  "topic": "bonding",
  "difficulty": 1-10,
  "explanations": {
    "A": "Why A is wrong — brief explanation of the misconception",
    "B": "Why B is wrong — brief explanation",
    "C": "Why C is correct — full working and explanation",
    "D": "Why D is wrong — brief explanation"
  },
  "hint": "A brief nudge without giving away the answer"
}

Rules:
- ALWAYS exactly 4 options A, B, C, D
- ALWAYS multiple choice — never free text
- Include plausible distractors based on common student misconceptions
- For calculation questions, make wrong options reflect common errors (wrong formula, unit errors, rounding)
- difficulty ranges from 1 (easy) to 10 (very hard)
- Include full working in the correct answer's explanation
- The hint should guide thinking without revealing the answer
- Respond with ONLY the JSON object`;

  const QUIZ_HINT_SYSTEM = (subjectSystem) => subjectSystem + `

Give a brief, helpful hint for this question. Don't give away the answer — just nudge the student in the right direction. One or two sentences maximum. Use the AGF diagnostic method. Respond with just the hint text, no JSON.`;

  const parseJSON = (text) => {
    try {
      const clean = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
      return JSON.parse(clean);
    } catch (e) {
      return null;
    }
  };

  const fetchQuizQuestion = useCallback(async (questionNumber) => {
    if (!currentSubject) return;
    setLoading(true);
    setErr(null);
    setQuizQ(null);
    setQuizSelected(null);
    setQuizFeedback(false);
    setHintText(null);
    const difficulty = Math.min(10, Math.max(1, Math.ceil(questionNumber * 1.1)));
    const prevTopics = quizHistory.map(h => h.topic).filter(Boolean);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: `Generate question ${questionNumber}/10. Difficulty: ${difficulty}/10. ${prevTopics.length ? "Already covered topics: " + prevTopics.join(", ") + ". Try a different topic." : ""} Respond with ONLY JSON.` }],
          system: QUIZ_GEN_SYSTEM(currentSubject.system),
          mode: "quiz",
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      const text = data.content?.map(b => b.type === "text" ? b.text : "").filter(Boolean).join("\n") || "";
      const parsed = parseJSON(text);
      if (parsed && parsed.question && parsed.options && parsed.correctLabel) {
        setQuizQ(parsed);
      } else {
        throw new Error("Failed to parse question. Please try again.");
      }
    } catch (e) { setErr(e.message); }
    finally { setLoading(false); }
  }, [currentSubject, quizHistory]);

  const startQuiz = useCallback(async () => {
    if (loading || !currentSubject) return;
    setMode("quiz");
    resetQuiz();
    setQuizNum(1);
    await fetchQuizQuestion(1);
  }, [loading, currentSubject]);

  const [pendingNext, setPendingNext] = useState(false);
  useEffect(() => {
    if (pendingNext && quizNum > 0) {
      fetchQuizQuestion(quizNum);
      setPendingNext(false);
    }
  }, [pendingNext, quizNum]);

  const submitAnswer = useCallback(() => {
    if (!quizQ || !quizSelected) return;
    const isCorrect = quizSelected === quizQ.correctLabel;
    setQuizFeedback(true);
    if (isCorrect) setQuizScore(s => s + 1);
    setQuizMaxScore(s => s + 1);
    setQuizHistory(h => [...h, {
      q: quizQ.question, answer: quizSelected,
      correct: isCorrect, topic: quizQ.topic,
      correctLabel: quizQ.correctLabel,
    }]);
  }, [quizQ, quizSelected]);

  const nextQuestion = () => {
    if (quizNum >= 10) {
      setQuizDone(true);
      return;
    }
    setQuizNum(n => n + 1);
    setPendingNext(true);
  };

  const getHint = useCallback(async () => {
    if (!quizQ || hintLoading) return;
    // Use pre-generated hint from question JSON if available
    if (quizQ.hint) {
      setHintText(quizQ.hint);
      return;
    }
    setHintLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: `Give me a hint for: ${quizQ.question}\nOptions: ${quizQ.options.map(o => o.label + ") " + o.text).join(", ")}` }],
          system: QUIZ_HINT_SYSTEM(currentSubject.system),
          mode: "ask",
        }),
      });
      const data = await res.json();
      const text = data.content?.map(b => b.type === "text" ? b.text : "").filter(Boolean).join("\n") || "Think about the key concepts involved.";
      setHintText(text);
    } catch (e) { setHintText("Think about the key concepts involved in this topic."); }
    finally { setHintLoading(false); }
  }, [quizQ, hintLoading, currentSubject]);

  const backToAsk = () => {
    setMode("ask");
    resetQuiz();
    if (currentSubject) {
      setMsgs([{ role: "assistant", content: currentSubject.welcome }]);
    }
  };

  const send = useCallback(async () => {
    const t = input.trim();
    if (!t || loading || !currentSubject) return;
    const userMsg = { role: "user", content: t };
    const next = [...msgs, userMsg];
    setMsgs(next);
    setInput("");
    setLoading(true);
    setErr(null);
    const apiMsgs = next.filter((m, idx) => !(idx === 0 && m.role === "assistant")).map(m => ({ role: m.role, content: m.content }));
    if (!apiMsgs.length || apiMsgs[0].role !== "user") apiMsgs.unshift({ role: "user", content: t });
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMsgs, system: currentSubject.system, mode: "ask" }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      const reply = data.content?.map(b => b.type === "text" ? b.text : "").filter(Boolean).join("\n") || "Sorry, I couldn't generate a response.";
      setMsgs(p => [...p, { role: "assistant", content: reply }]);
    } catch (e) { setErr(e.message); }
    finally { setLoading(false); inputRef.current?.focus(); }
  }, [input, loading, msgs, currentSubject]);

  // Send a follow-up prompt directly (no typing needed), with optional mode override
  const sendDirect = useCallback(async (text, overrideMode, displayText) => {
    if (loading || !currentSubject) return;
    const userMsg = { role: "user", content: displayText || text };
    const next = [...msgs, userMsg];
    setMsgs(next);
    setInput("");
    setLoading(true);
    setErr(null);
    const apiMsgs = next.filter((m, idx) => !(idx === 0 && m.role === "assistant")).map(m => ({ role: m.role, content: m.content }));
    if (apiMsgs.length > 0) {
      apiMsgs[apiMsgs.length - 1] = { role: "user", content: text };
    }
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMsgs, system: currentSubject.system, mode: overrideMode || "ask" }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      const reply = data.content?.map(b => b.type === "text" ? b.text : "").filter(Boolean).join("\n") || "Sorry, I couldn't generate a response.";
      setMsgs(p => [...p, { role: "assistant", content: reply }]);
    } catch (e) { setErr(e.message); }
    finally { setLoading(false); inputRef.current?.focus(); }
  }, [loading, msgs, currentSubject]);

  const FOLLOW_UP_ACTIONS = [
    { emoji: "📖", label: "I need more help with this", display: "📖 I need more help with this", prompt: "I need more help with this — please break the concept down further with simple analogies and visual diagrams. Use [SHAPE:...] tags for any molecular shapes, [EQUATION:...] for key formulae, [MECHANISM:...] for reaction mechanisms, and [CONFIG:...] for electron configurations. Explain it like you're tutoring me one-to-one." },
    { emoji: "🌍", label: "Real-world example", display: "🌍 Give me a real-world example", prompt: "Give me a real-world example or practical application that brings this theory to life. Make it vivid and memorable — something I'll actually remember in the exam." },
    { emoji: "📚", label: "Full revision notes", display: "📚 Generate full revision notes", isNotes: true },
  ];

  // Generate structured notes for Notes View
  const generateNotes = useCallback(async () => {
    if (notesLoading || !currentSubject) return;
    setNotesLoading(true);
    setShowNotes(true);
    setNotesData(null);

    // Get the last topic discussed from chat
    const lastAssistantMsg = [...msgs].reverse().find(m => m.role === "assistant" && m.content !== currentSubject.welcome);
    const lastUserMsg = [...msgs].reverse().find(m => m.role === "user");
    const topicContext = lastUserMsg ? lastUserMsg.content : "the main topics in this subject";

    const notesPrompt = `Generate comprehensive revision notes about: ${topicContext}

You MUST respond with ONLY a valid JSON object. No other text, no markdown fences, no explanation before or after.

JSON format:
{
  "title": "Topic Title",
  "subtitle": "Brief one-line description",
  "sections": [
    {
      "type": "definitions",
      "title": "Key Definitions",
      "items": [
        { "term": "Term name", "definition": "Clear, concise definition." }
      ]
    },
    {
      "type": "equations",
      "title": "Key Equations",
      "items": [
        { "label": "What this equation is for", "equation": "σ = F/A", "units": "Pa or N/m²" }
      ]
    },
    {
      "type": "content",
      "title": "Section Title",
      "paragraphs": ["Paragraph of explanation..."],
      "bullets": ["Bullet point 1", "Bullet point 2"]
    },
    {
      "type": "table",
      "title": "Table Title",
      "headers": ["Column 1", "Column 2", "Column 3"],
      "rows": [["cell1", "cell2", "cell3"]]
    },
    {
      "type": "tip",
      "text": "Exam tip text here — specific and actionable"
    },
    {
      "type": "warning",
      "text": "Common mistake or misconception to watch out for"
    },
    {
      "type": "worked_example",
      "question": "The exam question",
      "solution": "Full step-by-step solution with every line of working"
    }
  ]
}

Rules:
- Include at least 6-8 sections covering definitions, equations, theory, tables, worked examples, and exam tips
- Every key equation MUST be in the equations section
- Include at least 2 worked examples with full solutions
- Include at least 2 exam tips and 1 warning about common mistakes
- Use tables where data comparison is useful (e.g. properties, trends)
- Definitions must be concise — one or two sentences max
- Write like a tutor, not a textbook — warm, clear, direct
- Include the SPECIFIC topics and details relevant to this A-Level syllabus
- Respond with ONLY the JSON object`;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: notesPrompt }],
          system: currentSubject.system,
          mode: "resources",
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      const text = data.content?.map(b => b.type === "text" ? b.text : "").filter(Boolean).join("\n") || "";
      const clean = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
      const parsed = JSON.parse(clean);
      if (parsed && parsed.title && parsed.sections) {
        setNotesData(parsed);
      } else {
        throw new Error("Invalid notes format");
      }
    } catch (e) {
      console.error("Notes generation error:", e);
      setNotesData({ title: "Error", subtitle: "Could not generate notes", sections: [{ type: "content", title: "Error", paragraphs: [e.message], bullets: [] }] });
    } finally {
      setNotesLoading(false);
    }
  }, [notesLoading, currentSubject, msgs]);


  /* ─── NOTES VIEW SCREEN ─── */
  if (showNotes) {
    if (notesLoading) {
      return (
        <div style={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: C.bg, fontFamily: "'Outfit',sans-serif", color: C.text }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
            {[0, 1, 2].map(d => <div key={d} style={{ width: 10, height: 10, borderRadius: "50%", background: C.green, opacity: 0.3, animation: `p 1.2s ease-in-out ${d * 0.2}s infinite` }} />)}
          </div>
          <div style={{ fontSize: 15, color: C.textMuted }}>Generating revision notes...</div>
          <div style={{ fontSize: 12, color: C.textDim, marginTop: 6 }}>This takes a few seconds</div>
          <style>{`@keyframes p{0%,100%{opacity:.25;transform:scale(.85)}50%{opacity:.65;transform:scale(1.1)}}`}</style>
        </div>
      );
    }
    if (notesData) {
      return (
        <>
          <NotesView data={notesData} subject={currentSubject} onClose={() => { setShowNotes(false); setNotesData(null); }} />
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
            @keyframes p{0%,100%{opacity:.25;transform:scale(.85)}50%{opacity:.65;transform:scale(1.1)}}
            ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.06);border-radius:3px}
            *{box-sizing:border-box}
          `}</style>
        </>
      );
    }
  }

  /* ─── SUBJECT PICKER SCREEN ─── */
  if (!subject) {
    return (
      <div style={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: C.bg, fontFamily: "'Outfit',sans-serif", color: C.text, padding: 20 }}>
        <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: 32, fontWeight: 400, marginBottom: 2, letterSpacing: "-0.02em" }}>
          AGF<span style={{ color: C.gold }}>tutoring</span>
        </div>
        <div style={{ fontSize: 14, color: C.textMuted, marginBottom: 8 }}>Study Companion</div>
        <div style={{ width: 40, height: 2, background: C.gold, borderRadius: 1, marginBottom: 28 }} />
        <div style={{ fontSize: 13, color: C.textDim, marginBottom: 24 }}>Choose your subject to get started</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 14, width: "100%", maxWidth: 560 }}>
          {SUBJECT_LIST.map(s => (
            <button key={s.id} onClick={() => selectSubject(s.id)}
              style={{
                padding: "20px 18px", borderRadius: 10, cursor: "pointer",
                background: C.bgCard, border: `1px solid ${C.border}`,
                textAlign: "left", transition: "all 0.25s",
                display: "flex", flexDirection: "column", gap: 8,
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.background = C.bgLight; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.bgCard; e.currentTarget.style.transform = "none"; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 22 }}>{s.icon}</span>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: C.text, fontFamily: "'DM Serif Display',serif" }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: C.textMuted }}>{s.subtitle}</div>
                </div>
              </div>
              <div style={{ fontSize: 10, color: C.gold, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase" }}>{s.code}</div>
            </button>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 32, fontSize: 10, color: C.textDim }}>
          Powered by AGF Tutoring · Grounded in curated notes
        </div>
      </div>
    );
  }

  const col = C.gold;

  /* ─── QUIZ RESULTS SCREEN ─── */
  if (mode === "quiz" && quizDone) {
    const pct = quizMaxScore > 0 ? Math.round((quizScore / quizMaxScore) * 100) : 0;
    const grade = pct >= 80 ? "A" : pct >= 70 ? "B" : pct >= 60 ? "C" : pct >= 50 ? "D" : "U";
    const weakTopics = [...new Set(quizHistory.filter(h => h.correct !== true).map(h => h.topic).filter(Boolean))];
    return (
      <div style={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column", background: C.bg, fontFamily: "'Outfit',sans-serif", color: C.text }}>
        <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: 17, letterSpacing: "-0.02em" }}>AGF<span style={{ color: C.gold }}>tutoring</span> <span style={{ fontSize: 13, color: C.textMuted, fontFamily: "'Outfit',sans-serif" }}>· Quiz Complete</span></div>
            <div style={{ fontSize: 11, color: C.textDim }}>{currentSubject.name}</div>
          </div>
          <button onClick={backToAsk} style={{ padding: "8px 16px", borderRadius: 6, fontSize: 12, fontWeight: 500, border: `1px solid ${C.border}`, background: "transparent", color: C.textMuted, cursor: "pointer" }}>Back to Ask</button>
          <button onClick={startQuiz} style={{ padding: "8px 16px", borderRadius: 6, fontSize: 12, fontWeight: 500, border: `1px solid ${C.gold}`, background: C.goldDim, color: C.gold, cursor: "pointer" }}>New Quiz</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
          {/* Score card */}
          <div style={{ textAlign: "center", padding: "30px 20px", background: C.bgCard, borderRadius: 12, border: `1px solid ${C.border}`, marginBottom: 20 }}>
            <div style={{ fontSize: 52, fontWeight: 700, color: C.gold, fontFamily: "'JetBrains Mono',monospace" }}>{quizScore}/{quizMaxScore}</div>
            <div style={{ fontSize: 16, color: C.textMuted, marginTop: 4 }}>{pct}% — Grade {grade}</div>
            <div style={{ marginTop: 16, height: 8, background: C.bgLight, borderRadius: 4, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pct}%`, background: pct >= 70 ? C.green : pct >= 50 ? C.amber : C.red, borderRadius: 4, transition: "width 0.5s" }} />
            </div>
          </div>
          {/* Weak topics */}
          {weakTopics.length > 0 && (
            <div style={{ padding: "14px 18px", background: "rgba(224,96,96,0.06)", border: "1px solid rgba(224,96,96,0.15)", borderRadius: 8, marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.red, marginBottom: 6 }}>Topics to revise:</div>
              <div style={{ fontSize: 13, color: C.text }}>{weakTopics.join(", ")}</div>
            </div>
          )}
          {/* Question review */}
          {quizHistory.map((h, i) => (
            <div key={i} style={{ padding: "14px 18px", background: C.bgCard, border: `1px solid ${h.correct ? "rgba(77,148,96,0.3)" : "rgba(224,96,96,0.2)"}`, borderRadius: 8, marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.textMuted }}>Q{i + 1}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: h.correct ? C.green : C.red }}>
                  {h.correct ? "✓ Correct" : `✗ Wrong (was ${h.correctLabel})`}
                </div>
              </div>
              <div style={{ fontSize: 13, color: C.text }}>{h.q}</div>
              <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>Your answer: {h.answer}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ─── QUIZ QUESTION SCREEN ─── */
  if (mode === "quiz") {
    const correctCount = quizHistory.filter(h => h.correct).length;
    const wrongCount = quizHistory.filter(h => !h.correct).length;
    return (
      <div style={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column", background: C.bg, fontFamily: "'Outfit',sans-serif", color: C.text }}>
        {/* Header */}
        <div style={{ padding: "12px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: 16, letterSpacing: "-0.02em" }}>AGF<span style={{ color: C.gold }}>tutoring</span> <span style={{ fontSize: 12, color: C.textMuted, fontFamily: "'Outfit',sans-serif" }}>· {currentSubject.name} Quiz</span></div>
          </div>
          {/* Score counters */}
          <div style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 13, fontWeight: 600 }}>
            <span style={{ color: C.textDim }}>{quizNum}/10</span>
            {wrongCount > 0 && <span style={{ color: C.red, display: "flex", alignItems: "center", gap: 3 }}>✗ {wrongCount}</span>}
            {correctCount > 0 && <span style={{ color: C.green, display: "flex", alignItems: "center", gap: 3 }}>✓ {correctCount}</span>}
          </div>
          <button onClick={backToAsk} style={{ padding: "6px 12px", borderRadius: 6, fontSize: 11, border: `1px solid ${C.border}`, background: "transparent", color: C.textDim, cursor: "pointer" }}>✕</button>
        </div>

        {/* Progress bar */}
        <div style={{ height: 4, background: C.bgLight }}>
          <div style={{ height: "100%", width: `${(quizNum / 10) * 100}%`, background: C.gold, transition: "width 0.4s ease", borderRadius: "0 2px 2px 0" }} />
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 20px", maxWidth: 700, margin: "0 auto", width: "100%" }}>
          {loading && !quizQ && (
            <div style={{ textAlign: "center", padding: 60, color: C.textMuted }}>
              <div style={{ display: "flex", gap: 5, justifyContent: "center", marginBottom: 12 }}>
                {[0, 1, 2].map(d => <div key={d} style={{ width: 8, height: 8, borderRadius: "50%", background: C.gold, opacity: 0.3, animation: `p 1.2s ease-in-out ${d * 0.2}s infinite` }} />)}
              </div>
              Generating question {quizNum}...
            </div>
          )}

          {quizQ && (
            <>
              {/* Question */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 15, lineHeight: 1.8, color: C.text }}>
                  <span style={{ fontWeight: 600 }}>{quizNum}.</span>  {quizQ.question}
                </div>
              </div>

              {/* Options with inline feedback */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                {quizQ.options.map((opt) => {
                  const isSelected = quizSelected === opt.label;
                  const isCorrect = opt.label === quizQ.correctLabel;
                  const answered = quizFeedback;
                  const showExplanation = answered && (isCorrect || isSelected);

                  let borderColor = C.border;
                  let bgColor = "transparent";
                  if (!answered && isSelected) {
                    borderColor = C.gold;
                    bgColor = C.goldDim;
                  }
                  if (answered && isCorrect) {
                    borderColor = C.green;
                    bgColor = "rgba(77,148,96,0.06)";
                  }
                  if (answered && isSelected && !isCorrect) {
                    borderColor = C.red;
                    bgColor = "rgba(224,96,96,0.06)";
                  }

                  return (
                    <div key={opt.label}
                      onClick={() => !answered && setQuizSelected(opt.label)}
                      style={{
                        padding: "14px 18px", borderRadius: 10,
                        border: `1.5px solid ${borderColor}`,
                        background: bgColor,
                        cursor: answered ? "default" : "pointer",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={e => { if (!answered && !isSelected) { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.background = C.goldDim; }}}
                      onMouseLeave={e => { if (!answered && !isSelected) { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = "transparent"; }}}
                    >
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: C.textMuted, flexShrink: 0, marginTop: 1 }}>{opt.label}.</span>
                        <span style={{ fontSize: 14, color: C.text, lineHeight: 1.6 }}>{opt.text}</span>
                      </div>
                      {/* Inline explanation after answering */}
                      {showExplanation && quizQ.explanations && (
                        <div style={{ marginTop: 12, paddingTop: 10, borderTop: `1px solid ${isCorrect ? "rgba(77,148,96,0.2)" : "rgba(224,96,96,0.15)"}` }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                            <span style={{ fontSize: 12, fontWeight: 600, color: isCorrect ? C.green : C.red }}>
                              {isCorrect ? "✓ Right answer" : "✗ Not quite"}
                            </span>
                          </div>
                          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }}>
                            {quizQ.explanations[opt.label]}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Collapsible hint */}
              {!quizFeedback && (
                <div style={{ marginBottom: 20 }}>
                  <button onClick={() => hintText ? setHintText(null) : getHint()}
                    disabled={hintLoading}
                    style={{
                      background: "none", border: "none", cursor: hintLoading ? "default" : "pointer",
                      color: C.textMuted, fontSize: 13, padding: 0,
                      display: "flex", alignItems: "center", gap: 6, transition: "color 0.2s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = C.gold; }}
                    onMouseLeave={e => { e.currentTarget.style.color = C.textMuted; }}
                  >
                    {hintLoading ? "Loading..." : "Show hint"} <span style={{ fontSize: 10 }}>{hintText ? "▲" : "▼"}</span>
                  </button>
                  {hintText && (
                    <div style={{ marginTop: 8, padding: "10px 14px", background: "rgba(200,164,110,0.06)", border: "1px solid rgba(200,164,110,0.15)", borderRadius: 8, fontSize: 13, color: C.amber, lineHeight: 1.6 }}>
                      {hintText}
                    </div>
                  )}
                </div>
              )}

              {err && <div style={{ padding: "8px 12px", borderRadius: 6, background: "rgba(224,96,96,0.08)", border: "1px solid rgba(224,96,96,0.15)", color: C.red, fontSize: 12, marginBottom: 16 }}>{err}</div>}
              <div ref={endRef} />
            </>
          )}
        </div>

        {/* Bottom navigation */}
        {quizQ && (
          <div style={{ padding: "16px 20px", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "center", gap: 12, background: C.bg }}>
            {!quizFeedback ? (
              <button onClick={submitAnswer} disabled={!quizSelected || loading}
                style={{
                  padding: "10px 32px", borderRadius: 8, border: "none",
                  background: quizSelected ? C.gold : "rgba(255,255,255,0.04)",
                  color: quizSelected ? C.bg : C.textDim,
                  fontSize: 14, fontWeight: 600, cursor: quizSelected ? "pointer" : "default",
                  transition: "all 0.2s",
                }}>
                Submit
              </button>
            ) : (
              <button onClick={nextQuestion}
                style={{
                  padding: "10px 32px", borderRadius: 8,
                  border: `1px solid ${C.gold}`, background: C.goldDim,
                  color: C.gold, fontSize: 14, fontWeight: 600, cursor: "pointer",
                  transition: "all 0.2s",
                }}>
                {quizNum >= 10 ? "See Results" : "Next"}
              </button>
            )}
          </div>
        )}

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
          @keyframes p{0%,100%{opacity:.25;transform:scale(.85)}50%{opacity:.65;transform:scale(1.1)}}
          textarea::placeholder{color:${C.textDim}}
          ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.06);border-radius:3px}
          *{box-sizing:border-box}
        `}</style>
      </div>
    );
  }

  /* ─── MAIN CHAT SCREEN (ASK MODE) ─── */
  return (
    <div style={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column", background: C.bg, fontFamily: "'Outfit',sans-serif", color: C.text }}>
      {/* HEADER */}
      <div style={{ padding: "14px 20px", display: "flex", alignItems: "center", gap: 14, borderBottom: `1px solid ${C.border}`, background: C.bg, flexShrink: 0 }}>
        <div style={{ flex: 1, cursor: "pointer", position: "relative" }} onClick={() => setShowPicker(!showPicker)}>
          <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: 17, fontWeight: 400, color: C.text, display: "flex", alignItems: "center", gap: 8, letterSpacing: "-0.02em" }}>
            AGF<span style={{ color: C.gold }}>tutoring</span>
            <span style={{ fontSize: 11, color: C.textDim, fontFamily: "'Outfit',sans-serif" }}>▼</span>
          </div>
          <div style={{ fontSize: 10.5, color: C.textDim, letterSpacing: "0.06em", textTransform: "uppercase", marginTop: 1 }}>{currentSubject.icon} {currentSubject.code} · {currentSubject.name}</div>

          {/* SUBJECT DROPDOWN */}
          {showPicker && (
            <div style={{
              position: "absolute", top: "115%", left: 0, zIndex: 200,
              background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 10,
              boxShadow: "0 12px 40px rgba(0,0,0,0.6)", overflow: "hidden", minWidth: 240,
            }}>
              <div style={{ padding: "10px 14px", borderBottom: `1px solid ${C.border}`, fontSize: 10, color: C.textDim, textTransform: "uppercase", letterSpacing: "0.1em" }}>Switch Subject</div>
              {SUBJECT_LIST.map(s => (
                <button key={s.id} onClick={(e) => { e.stopPropagation(); selectSubject(s.id); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 10, width: "100%",
                    padding: "12px 14px", border: "none", cursor: "pointer",
                    background: s.id === subject ? C.goldDim : "transparent",
                    borderLeft: s.id === subject ? `3px solid ${C.gold}` : "3px solid transparent",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={e => { if (s.id !== subject) e.currentTarget.style.background = C.bgLight; }}
                  onMouseLeave={e => { if (s.id !== subject) e.currentTarget.style.background = "transparent"; }}
                >
                  <span style={{ fontSize: 18 }}>{s.icon}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: C.text, textAlign: "left" }}>{s.name}</div>
                    <div style={{ fontSize: 10, color: C.textDim, textAlign: "left" }}>{s.code}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        {/* BIG NAV TABS */}
        <div style={{ display: "flex", gap: 0, background: C.bgLight, borderRadius: 8, padding: 3, border: `1px solid ${C.border}` }}>
          <button onClick={backToAsk} style={{
            padding: "8px 22px", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer",
            letterSpacing: "0.03em", transition: "all 0.2s", border: "none",
            background: mode === "ask" ? C.gold : "transparent",
            color: mode === "ask" ? C.bg : C.textMuted,
          }}>Ask</button>
          <button onClick={startQuiz} disabled={loading} style={{
            padding: "8px 22px", borderRadius: 6, fontSize: 13, fontWeight: 600,
            cursor: loading ? "default" : "pointer",
            letterSpacing: "0.03em", transition: "all 0.2s", border: "none",
            background: mode === "quiz" ? C.gold : "transparent",
            color: mode === "quiz" ? C.bg : C.textMuted,
          }}>Quiz</button>
        </div>
      </div>

      {/* MESSAGES */}
      <div style={{ flex: 1, overflowY: "auto", padding: "18px 14px", display: "flex", flexDirection: "column", gap: 14 }}
        onClick={() => showPicker && setShowPicker(false)}>
        {msgs.map((m, i) => {
          const isLastAssistant = m.role === "assistant" && i === msgs.length - 1;
          return (
          <div key={i}>
            <div style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", gap: 8, alignItems: "flex-start" }}>
            {m.role === "assistant" && (
              <div style={{ width: 26, height: 26, borderRadius: 6, flexShrink: 0, marginTop: 2, background: C.goldDim, border: `1px solid ${C.goldBorder}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: 11, color: C.gold, fontWeight: 400 }}>A</div>
              </div>
            )}
            <div style={{
              maxWidth: m.role === "user" ? "72%" : "88%", padding: "10px 14px",
              borderRadius: m.role === "user" ? "10px 10px 2px 10px" : "10px 10px 10px 2px",
              background: m.role === "user" ? C.goldDim : "rgba(255,255,255,0.03)",
              border: m.role === "user" ? `1px solid ${C.goldBorder}` : `1px solid ${C.border}`,
              fontSize: 13.5, lineHeight: 1.7,
              color: m.role === "user" ? C.text : "rgba(255,255,255,0.82)",
            }}>{parseAndRender(m.content)}</div>
          </div>
          {/* Follow-up action buttons after the last assistant message */}
          {isLastAssistant && !loading && i > 0 && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10, marginLeft: 34 }}>
              {FOLLOW_UP_ACTIONS.map((action, j) => (
                <button key={j} onClick={() => action.isNotes ? generateNotes() : sendDirect(action.prompt, action.mode, action.display)}
                  style={{
                    padding: "9px 16px", borderRadius: 8,
                    border: `1px solid ${C.greenBorder}`,
                    background: C.greenDim,
                    color: C.text, fontSize: 13, fontWeight: 500,
                    cursor: "pointer", transition: "all 0.2s",
                    display: "flex", alignItems: "center", gap: 8,
                    fontFamily: "'Outfit',sans-serif",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.green; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.background = "rgba(77,148,96,0.18)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.greenBorder; e.currentTarget.style.transform = "none"; e.currentTarget.style.background = C.greenDim; }}
                >
                  <span style={{ fontSize: 16 }}>{action.emoji}</span>
                  {action.label}
                </button>
              ))}
            </div>
          )}
          </div>
        );
        })}
        {loading && (
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <div style={{ width: 26, height: 26, borderRadius: 6, flexShrink: 0, marginTop: 2, background: C.goldDim, border: `1px solid ${C.goldBorder}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: 11, color: C.gold, fontWeight: 400 }}>A</div>
            </div>
            <div style={{ padding: "10px 14px", borderRadius: "10px 10px 10px 2px", background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}`, display: "flex", gap: 5 }}>
              {[0, 1, 2].map(d => <div key={d} style={{ width: 6, height: 6, borderRadius: "50%", background: C.gold, opacity: 0.3, animation: `p 1.2s ease-in-out ${d * 0.2}s infinite` }} />)}
            </div>
          </div>
        )}
        {err && <div style={{ padding: "8px 12px", borderRadius: 6, background: "rgba(224,96,96,0.08)", border: "1px solid rgba(224,96,96,0.15)", color: C.red, fontSize: 12 }}>{err}</div>}
        <div ref={endRef} />
      </div>

      {/* QUICK PROMPTS (welcome only — subject-specific starters) */}
      {msgs.length <= 1 && currentSubject && (
        <div style={{ padding: "0 14px 8px", display: "flex", gap: 8, flexWrap: "wrap" }}>
          {currentSubject.prompts.map((p, i) => (
            <button key={i} onClick={() => { setInput(p); setTimeout(() => inputRef.current?.focus(), 50); }}
              style={{ padding: "8px 14px", borderRadius: 6, border: `1px solid ${C.border}`, background: "rgba(255,255,255,0.02)", color: C.textMuted, fontSize: 12.5, cursor: "pointer", transition: "all 0.2s", fontFamily: "'Outfit',sans-serif" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.color = C.gold; e.currentTarget.style.background = C.goldDim; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textMuted; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}>{p}</button>
          ))}
        </div>
      )}

      {/* INPUT */}
      <div style={{ padding: "8px 14px 14px", borderTop: `1px solid ${C.border}`, background: C.bg, flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end", background: C.bgInput, border: `1px solid ${C.border}`, borderRadius: 8, padding: "3px 3px 3px 14px" }}>
          <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder={currentSubject.placeholder}
            rows={1} style={{ flex: 1, border: "none", outline: "none", resize: "none", background: "transparent", color: C.text, fontFamily: "'Outfit',sans-serif", fontSize: 13.5, padding: "8px 0", lineHeight: 1.5, maxHeight: 100, overflow: "auto" }} />
          <button onClick={send} disabled={!input.trim() || loading} style={{
            width: 34, height: 34, borderRadius: 6, border: "none",
            cursor: input.trim() && !loading ? "pointer" : "default",
            background: input.trim() && !loading ? C.gold : "rgba(255,255,255,0.04)",
            color: input.trim() && !loading ? C.bg : C.textDim,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 15, fontWeight: 700, flexShrink: 0, transition: "all 0.2s",
          }}>↑</button>
        </div>
        <div style={{ textAlign: "center", marginTop: 6, fontSize: 9.5, color: C.textDim }}>
          Powered by AGF Tutoring · Grounded in curated notes
        </div>
      </div>

      <style>{`
        @keyframes p{0%,100%{opacity:.25;transform:scale(.85)}50%{opacity:.65;transform:scale(1.1)}}
        textarea::placeholder{color:${C.textDim}}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.06);border-radius:3px}
        *{box-sizing:border-box}
      `}</style>
    </div>
  );
}
