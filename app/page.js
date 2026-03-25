"use client";
import { useState, useRef, useEffect, useCallback } from "react";

/* ═══════════════════════════════════════════════════
   AGF STUDY COMPANION — MULTI-SUBJECT
   Palette: dark charcoal + muted green (AGF brand)
   ═══════════════════════════════════════════════════ */

const C = {
  bg: "#262626",
  bgLight: "#2e2e2e",
  bgCard: "#333333",
  bgInput: "#303030",
  green: "#4d9460",
  greenLight: "#5ba86d",
  greenDim: "rgba(77,148,96,0.15)",
  greenBorder: "rgba(77,148,96,0.3)",
  text: "#e8e5de",
  textMuted: "#9a9690",
  textDim: "#706b65",
  border: "rgba(255,255,255,0.07)",
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

Personality: Patient, warm, rigorous. Guide to understanding, don't just give answers. Intuition before formalism. British English. Concise.

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

Personality: Patient, warm, rigorous. Guide to understanding, don't just give answers. Intuition before formalism. British English. Concise.

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

Personality: Patient, warm, rigorous. Guide to understanding, don't just give answers. Intuition before formalism. British English. Concise.

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

Personality: Patient, warm, rigorous. Guide to understanding, don't just give answers. Intuition before formalism. British English. Concise.

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

Personality: Patient, warm, rigorous. Guide to understanding, don't just give answers. Intuition before formalism. British English. Concise.

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
    } else if (line) {
      elements.push(<span key={`t${i}`}><RichLine text={line} /><br /></span>);
    } else {
      elements.push(<br key={`br${i}`} />);
    }
  }
  return elements;
}

function RichLine({ text }) {
  return text.split(/(\*\*.*?\*\*|\*.*?\*|`[^`]+`)/g).map((s, i) => {
    if (!s) return null;
    if (s.startsWith("**") && s.endsWith("**")) return <strong key={i} style={{ fontWeight: 600, color: C.text }}>{s.slice(2, -2)}</strong>;
    if (s.startsWith("*") && s.endsWith("*")) return <em key={i} style={{ fontStyle: "italic", color: C.text }}>{s.slice(1, -1)}</em>;
    if (s.startsWith("`") && s.endsWith("`")) return <code key={i} style={{ background: C.greenDim, padding: "1px 5px", borderRadius: 3, fontFamily: "'JetBrains Mono',monospace", fontSize: "0.88em", color: C.green }}>{s.slice(1, -1)}</code>;
    return <span key={i}>{s}</span>;
  });
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

Generate ONE exam-style question in the style of Edexcel IAL past papers.

JSON format:
{
  "question": "The question text here",
  "type": "mc" or "short" or "calculation" or "explain",
  "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
  "marks": 3,
  "topic": "bonding",
  "difficulty": 1-10
}

Rules:
- "options" array is ONLY included when type is "mc" (multiple choice). For other types, omit it or set to null.
- For mc: always exactly 4 options labelled A) B) C) D)
- marks should be 1-6 depending on difficulty
- difficulty ranges from 1 (easy, questions 1-3) to 10 (very hard, questions 8-10)
- Use proper scientific terminology and notation
- Questions must be realistic IAL exam questions
- Respond with ONLY the JSON object`;

  const QUIZ_MARK_SYSTEM = (subjectSystem) => subjectSystem + `

QUIZ MARKING MODE:
You must respond with ONLY a valid JSON object, no other text, no markdown fences.

Mark the student's answer to the given question. Be rigorous but fair, like an examiner.

JSON format:
{
  "correct": true or false or "partial",
  "score": 2,
  "maxScore": 3,
  "feedback": "Detailed diagnostic feedback explaining what was right/wrong and the correct answer with working. Use the AGF method — identify the misconception, explain clearly, give the correct approach.",
  "correctAnswer": "The model answer"
}

Rules:
- Be encouraging but honest
- For partial credit, award marks for correct working even if final answer is wrong
- Explain any misconceptions clearly
- Give the full correct answer with working
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
    setQuizFeedback(null);
    setHintText(null);
    const difficulty = Math.min(10, Math.max(1, Math.ceil(questionNumber * 1.1)));
    const prevTopics = quizHistory.map(h => h.topic).filter(Boolean);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: `Generate question ${questionNumber}/10. Difficulty: ${difficulty}/10. Mix of question types. ${prevTopics.length ? "Already covered topics: " + prevTopics.join(", ") + ". Try a different topic." : ""} Respond with ONLY JSON.` }],
          system: QUIZ_GEN_SYSTEM(currentSubject.system),
          mode: "quiz",
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      const text = data.content?.map(b => b.type === "text" ? b.text : "").filter(Boolean).join("\n") || "";
      const parsed = parseJSON(text);
      if (parsed && parsed.question) {
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

  // Need to call fetchQuizQuestion after quizNum updates for "next" — use effect
  const [pendingNext, setPendingNext] = useState(false);
  useEffect(() => {
    if (pendingNext && quizNum > 0) {
      fetchQuizQuestion(quizNum);
      setPendingNext(false);
    }
  }, [pendingNext, quizNum]);

  const submitAnswer = useCallback(async () => {
    if (!quizQ || loading) return;
    const answer = quizQ.type === "mc" ? quizSelected : quizSelected;
    if (!answer) return;
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: `Question: ${quizQ.question}${quizQ.options ? "\nOptions: " + quizQ.options.join(", ") : ""}\n[${quizQ.marks} marks]\n\nStudent's answer: ${answer}\n\nMark this answer. Respond with ONLY JSON.` }],
          system: QUIZ_MARK_SYSTEM(currentSubject.system),
          mode: "quiz",
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      const text = data.content?.map(b => b.type === "text" ? b.text : "").filter(Boolean).join("\n") || "";
      const parsed = parseJSON(text);
      if (parsed) {
        setQuizFeedback(parsed);
        const earned = parsed.score || 0;
        const max = parsed.maxScore || quizQ.marks || 0;
        setQuizScore(s => s + earned);
        setQuizMaxScore(s => s + max);
        setQuizHistory(h => [...h, {
          q: quizQ.question, answer, feedback: parsed.feedback,
          correct: parsed.correct, marks: earned, maxMarks: max,
          topic: quizQ.topic
        }]);
      } else {
        setQuizFeedback({ correct: false, score: 0, maxScore: quizQ.marks, feedback: "Could not parse feedback. Try the next question.", correctAnswer: "" });
      }
    } catch (e) { setErr(e.message); }
    finally { setLoading(false); }
  }, [quizQ, quizSelected, loading, currentSubject]);

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
    setHintLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: `Give me a hint for this question: ${quizQ.question}${quizQ.options ? "\nOptions: " + quizQ.options.join(", ") : ""}` }],
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

  /* ─── SUBJECT PICKER SCREEN ─── */
  if (!subject) {
    return (
      <div style={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: C.bg, fontFamily: "'DM Sans',sans-serif", color: C.text, padding: 20 }}>
        <div style={{ display: "flex", gap: 2, alignItems: "flex-end", height: 36, marginBottom: 12 }}>
          {[18, 28, 22, 14].map((h, i) => <div key={i} style={{ width: 5, height: h, background: C.green, borderRadius: 2 }} />)}
        </div>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 500, marginBottom: 4 }}>AGF Study Companion</div>
        <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 32 }}>Choose your subject to get started</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, width: "100%", maxWidth: 520 }}>
          {SUBJECT_LIST.map(s => (
            <button key={s.id} onClick={() => selectSubject(s.id)}
              style={{
                padding: "18px 16px", borderRadius: 10, cursor: "pointer",
                background: C.bgCard, border: `1px solid ${C.border}`,
                textAlign: "left", transition: "all 0.2s",
                display: "flex", flexDirection: "column", gap: 6,
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = s.colour; e.currentTarget.style.background = C.bgLight; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.bgCard; }}
            >
              <div style={{ fontSize: 20 }}>{s.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{s.name}</div>
              <div style={{ fontSize: 11, color: C.textMuted }}>{s.subtitle}</div>
              <div style={{ fontSize: 10, color: s.colour, fontWeight: 500, letterSpacing: "0.05em" }}>{s.code}</div>
            </button>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 24, fontSize: 10, color: C.textDim }}>
          Powered by AGF Tutoring · Grounded in curated notes
        </div>
      </div>
    );
  }

  const col = currentSubject.colour;

  /* ─── QUIZ RESULTS SCREEN ─── */
  if (mode === "quiz" && quizDone) {
    const pct = quizMaxScore > 0 ? Math.round((quizScore / quizMaxScore) * 100) : 0;
    const grade = pct >= 80 ? "A" : pct >= 70 ? "B" : pct >= 60 ? "C" : pct >= 50 ? "D" : "U";
    const weakTopics = [...new Set(quizHistory.filter(h => h.correct !== true).map(h => h.topic).filter(Boolean))];
    return (
      <div style={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column", background: C.bg, fontFamily: "'DM Sans',sans-serif", color: C.text }}>
        <div style={{ padding: "12px 18px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1, fontFamily: "'Cormorant Garamond',serif", fontSize: 16 }}>Quiz Complete — {currentSubject.name}</div>
          <button onClick={backToAsk} style={{ padding: "5px 14px", borderRadius: 4, fontSize: 11, border: `1px solid ${C.border}`, background: "transparent", color: C.textMuted, cursor: "pointer" }}>Back to Ask</button>
          <button onClick={startQuiz} style={{ padding: "5px 14px", borderRadius: 4, fontSize: 11, border: `1px solid ${col}`, background: `${col}22`, color: col, cursor: "pointer" }}>New Quiz</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
          {/* Score card */}
          <div style={{ textAlign: "center", padding: "30px 20px", background: C.bgCard, borderRadius: 12, border: `1px solid ${C.border}`, marginBottom: 20 }}>
            <div style={{ fontSize: 52, fontWeight: 700, color: col, fontFamily: "'JetBrains Mono',monospace" }}>{quizScore}/{quizMaxScore}</div>
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
            <div key={i} style={{ padding: "14px 18px", background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 8, marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.textMuted }}>Q{i + 1}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: h.correct === true ? C.green : h.correct === "partial" ? C.amber : C.red }}>
                  {h.marks}/{h.maxMarks} {h.correct === true ? "✓" : h.correct === "partial" ? "~" : "✗"}
                </div>
              </div>
              <div style={{ fontSize: 13, color: C.text, marginBottom: 4 }}>{h.q}</div>
              <div style={{ fontSize: 12, color: C.textMuted }}>Your answer: {h.answer}</div>
              {h.feedback && <div style={{ fontSize: 12, color: "rgba(232,229,222,0.7)", marginTop: 6, lineHeight: 1.6 }}>{h.feedback}</div>}
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ─── QUIZ QUESTION SCREEN ─── */
  if (mode === "quiz") {
    return (
      <div style={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column", background: C.bg, fontFamily: "'DM Sans',sans-serif", color: C.text }}>
        {/* Header */}
        <div style={{ padding: "12px 18px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 16 }}>{currentSubject.name} Quiz</div>
            <div style={{ fontSize: 10, color: C.textDim }}>Question {quizNum} of 10 · Score: {quizScore}/{quizMaxScore}</div>
          </div>
          <button onClick={backToAsk} style={{ padding: "5px 14px", borderRadius: 4, fontSize: 11, border: `1px solid ${C.border}`, background: "transparent", color: C.textMuted, cursor: "pointer" }}>Exit Quiz</button>
        </div>

        {/* Progress bar */}
        <div style={{ height: 4, background: C.bgLight }}>
          <div style={{ height: "100%", width: `${(quizNum / 10) * 100}%`, background: col, transition: "width 0.3s", borderRadius: "0 2px 2px 0" }} />
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px", display: "flex", flexDirection: "column", gap: 16 }}>
          {loading && !quizQ && (
            <div style={{ textAlign: "center", padding: 40, color: C.textMuted }}>
              <div style={{ display: "flex", gap: 5, justifyContent: "center", marginBottom: 12 }}>
                {[0, 1, 2].map(d => <div key={d} style={{ width: 8, height: 8, borderRadius: "50%", background: col, opacity: 0.3, animation: `p 1.2s ease-in-out ${d * 0.2}s infinite` }} />)}
              </div>
              Generating question {quizNum}...
            </div>
          )}

          {quizQ && (
            <>
              {/* Question card */}
              <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 12, padding: "20px 22px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: col, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Question {quizNum}/10
                  </span>
                  <span style={{ fontSize: 11, color: C.amber, fontWeight: 500 }}>[{quizQ.marks} mark{quizQ.marks !== 1 ? "s" : ""}]</span>
                </div>
                <div style={{ fontSize: 15, lineHeight: 1.7, color: C.text }}>{quizQ.question}</div>
                {quizQ.topic && <div style={{ marginTop: 10, fontSize: 10, color: C.textDim }}>Topic: {quizQ.topic}</div>}
              </div>

              {/* MC Options */}
              {quizQ.type === "mc" && quizQ.options && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {quizQ.options.map((opt, i) => {
                    const letter = opt.charAt(0);
                    const isSelected = quizSelected === opt;
                    const disabled = !!quizFeedback;
                    let borderCol = isSelected ? col : C.border;
                    let bgCol = isSelected ? `${col}22` : C.bgLight;
                    // After feedback, colour correct/incorrect
                    if (quizFeedback) {
                      const correctAns = (quizFeedback.correctAnswer || "").charAt(0).toUpperCase();
                      if (letter.toUpperCase() === correctAns) { borderCol = C.green; bgCol = "rgba(77,148,96,0.12)"; }
                      else if (isSelected && quizFeedback.correct !== true) { borderCol = C.red; bgCol = "rgba(224,96,96,0.08)"; }
                    }
                    return (
                      <button key={i} onClick={() => !disabled && setQuizSelected(opt)}
                        disabled={disabled}
                        style={{
                          display: "flex", alignItems: "center", gap: 12,
                          padding: "12px 16px", borderRadius: 8,
                          border: `1px solid ${borderCol}`, background: bgCol,
                          cursor: disabled ? "default" : "pointer",
                          transition: "all 0.15s", textAlign: "left",
                        }}
                        onMouseEnter={e => { if (!disabled && !isSelected) { e.currentTarget.style.borderColor = col; e.currentTarget.style.background = C.bgCard; } }}
                        onMouseLeave={e => { if (!disabled && !isSelected) { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.bgLight; } }}
                      >
                        <div style={{
                          width: 30, height: 30, borderRadius: 6, flexShrink: 0,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          border: `1px solid ${isSelected ? col : C.border}`,
                          background: isSelected ? col : "transparent",
                          color: isSelected ? "#fff" : C.textMuted,
                          fontSize: 13, fontWeight: 600, transition: "all 0.15s",
                        }}>{letter}</div>
                        <div style={{ fontSize: 13.5, color: C.text, lineHeight: 1.5 }}>{opt.slice(3).trim()}</div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Written answer */}
              {quizQ.type !== "mc" && !quizFeedback && (
                <div style={{ background: C.bgLight, border: `1px solid ${C.border}`, borderRadius: 8, padding: 4 }}>
                  <textarea
                    value={quizSelected || ""}
                    onChange={e => setQuizSelected(e.target.value)}
                    placeholder={quizQ.type === "calculation" ? "Show your working and final answer..." : quizQ.type === "explain" ? "Write your extended answer here..." : "Type your answer..."}
                    rows={quizQ.type === "explain" ? 8 : 4}
                    style={{
                      width: "100%", border: "none", outline: "none", resize: "vertical",
                      background: "transparent", color: C.text,
                      fontFamily: "'DM Sans',sans-serif", fontSize: 13.5,
                      padding: "10px 14px", lineHeight: 1.6, minHeight: 80,
                    }}
                  />
                </div>
              )}
              {quizQ.type !== "mc" && quizFeedback && (
                <div style={{ background: C.bgLight, border: `1px solid ${C.border}`, borderRadius: 8, padding: "12px 16px" }}>
                  <div style={{ fontSize: 11, color: C.textDim, marginBottom: 4 }}>Your answer:</div>
                  <div style={{ fontSize: 13, color: C.text, whiteSpace: "pre-wrap" }}>{quizSelected}</div>
                </div>
              )}

              {/* Hint */}
              {!quizFeedback && (
                <button onClick={getHint} disabled={hintLoading || !!hintText}
                  style={{
                    alignSelf: "flex-start", padding: "6px 14px", borderRadius: 6,
                    border: `1px solid ${C.border}`, background: "transparent",
                    color: C.amber, fontSize: 12, cursor: hintLoading || hintText ? "default" : "pointer",
                    opacity: hintText ? 0.6 : 1, transition: "all 0.2s",
                  }}>
                  {hintLoading ? "Loading hint..." : hintText ? "Hint used" : "💡 Hint"}
                </button>
              )}
              {hintText && !quizFeedback && (
                <div style={{ padding: "10px 14px", background: "rgba(212,162,76,0.08)", border: "1px solid rgba(212,162,76,0.2)", borderRadius: 8, fontSize: 13, color: C.amber, lineHeight: 1.6 }}>
                  💡 {hintText}
                </div>
              )}

              {/* Feedback */}
              {quizFeedback && (
                <div style={{
                  padding: "16px 18px", borderRadius: 10,
                  background: quizFeedback.correct === true ? "rgba(77,148,96,0.08)" : quizFeedback.correct === "partial" ? "rgba(212,162,76,0.08)" : "rgba(224,96,96,0.06)",
                  border: `1px solid ${quizFeedback.correct === true ? "rgba(77,148,96,0.25)" : quizFeedback.correct === "partial" ? "rgba(212,162,76,0.25)" : "rgba(224,96,96,0.15)"}`,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: quizFeedback.correct === true ? C.green : quizFeedback.correct === "partial" ? C.amber : C.red }}>
                      {quizFeedback.correct === true ? "✓ Correct!" : quizFeedback.correct === "partial" ? "~ Partially correct" : "✗ Not quite"}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: col }}>{quizFeedback.score}/{quizFeedback.maxScore} marks</span>
                  </div>
                  <div style={{ fontSize: 13, color: "rgba(232,229,222,0.8)", lineHeight: 1.7 }}>{quizFeedback.feedback}</div>
                  {quizFeedback.correctAnswer && quizFeedback.correct !== true && (
                    <div style={{ marginTop: 10, padding: "8px 12px", background: "rgba(77,148,96,0.08)", border: "1px solid rgba(77,148,96,0.15)", borderRadius: 6 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: C.green, marginBottom: 3 }}>Model answer:</div>
                      <div style={{ fontSize: 13, color: C.text, lineHeight: 1.6 }}>{quizFeedback.correctAnswer}</div>
                    </div>
                  )}
                </div>
              )}

              {/* Action buttons */}
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", paddingBottom: 20 }}>
                {!quizFeedback ? (
                  <button onClick={submitAnswer} disabled={!quizSelected || loading}
                    style={{
                      padding: "10px 24px", borderRadius: 8, border: "none",
                      background: quizSelected && !loading ? col : "rgba(255,255,255,0.04)",
                      color: quizSelected && !loading ? "#fff" : C.textDim,
                      fontSize: 14, fontWeight: 600, cursor: quizSelected && !loading ? "pointer" : "default",
                      transition: "all 0.2s",
                    }}>
                    {loading ? "Marking..." : "Submit Answer"}
                  </button>
                ) : (
                  <button onClick={nextQuestion}
                    style={{
                      padding: "10px 24px", borderRadius: 8, border: "none",
                      background: col, color: "#fff",
                      fontSize: 14, fontWeight: 600, cursor: "pointer",
                      transition: "all 0.2s",
                    }}>
                    {quizNum >= 10 ? "See Results" : `Next Question →`}
                  </button>
                )}
              </div>
            </>
          )}

          {err && <div style={{ padding: "8px 12px", borderRadius: 6, background: "rgba(224,96,96,0.08)", border: "1px solid rgba(224,96,96,0.15)", color: C.red, fontSize: 12 }}>{err}</div>}
          <div ref={endRef} />
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

  /* ─── MAIN CHAT SCREEN (ASK MODE) ─── */
  return (
    <div style={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column", background: C.bg, fontFamily: "'DM Sans',sans-serif", color: C.text }}>
      {/* HEADER */}
      <div style={{ padding: "12px 18px", display: "flex", alignItems: "center", gap: 12, borderBottom: `1px solid ${C.border}`, background: C.bg, flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 2, alignItems: "flex-end", height: 28, flexShrink: 0 }}>
          {[14, 22, 18, 10].map((h, i) => <div key={i} style={{ width: 4, height: h, background: col, borderRadius: 1.5 }} />)}
        </div>
        <div style={{ flex: 1, cursor: "pointer", position: "relative" }} onClick={() => setShowPicker(!showPicker)}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 16, fontWeight: 500, color: C.text, display: "flex", alignItems: "center", gap: 6 }}>
            AGF Study Companion
            <span style={{ fontSize: 10, color: C.textDim }}>▼</span>
          </div>
          <div style={{ fontSize: 9.5, color: C.textDim, letterSpacing: "0.1em", textTransform: "uppercase" }}>{currentSubject.code} · {currentSubject.name}</div>

          {/* SUBJECT DROPDOWN */}
          {showPicker && (
            <div style={{
              position: "absolute", top: "110%", left: 0, zIndex: 200,
              background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 8,
              boxShadow: "0 8px 32px rgba(0,0,0,0.5)", overflow: "hidden", minWidth: 220,
            }}>
              {SUBJECT_LIST.map(s => (
                <button key={s.id} onClick={(e) => { e.stopPropagation(); selectSubject(s.id); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 10, width: "100%",
                    padding: "10px 14px", border: "none", cursor: "pointer",
                    background: s.id === subject ? C.greenDim : "transparent",
                    borderLeft: s.id === subject ? `3px solid ${s.colour}` : "3px solid transparent",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={e => { if (s.id !== subject) e.currentTarget.style.background = C.bgLight; }}
                  onMouseLeave={e => { if (s.id !== subject) e.currentTarget.style.background = "transparent"; }}
                >
                  <span style={{ fontSize: 16 }}>{s.icon}</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: C.text, textAlign: "left" }}>{s.name}</div>
                    <div style={{ fontSize: 10, color: C.textDim, textAlign: "left" }}>{s.code}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          <button onClick={backToAsk} style={{
            padding: "5px 14px", borderRadius: 4, fontSize: 11, fontWeight: 500, cursor: "pointer",
            letterSpacing: "0.06em", textTransform: "uppercase", transition: "all 0.2s",
            border: `1px solid ${col}`, background: `${col}22`, color: col,
          }}>Ask</button>
          <button onClick={startQuiz} disabled={loading} style={{
            padding: "5px 14px", borderRadius: 4, fontSize: 11, fontWeight: 500,
            cursor: loading ? "default" : "pointer",
            letterSpacing: "0.06em", textTransform: "uppercase", transition: "all 0.2s",
            border: `1px solid ${C.border}`, background: "transparent", color: C.textDim,
          }}>Quiz</button>
        </div>
      </div>

      {/* MESSAGES */}
      <div style={{ flex: 1, overflowY: "auto", padding: "18px 14px", display: "flex", flexDirection: "column", gap: 14 }}
        onClick={() => showPicker && setShowPicker(false)}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", gap: 8, alignItems: "flex-start" }}>
            {m.role === "assistant" && (
              <div style={{ width: 24, height: 24, borderRadius: 4, flexShrink: 0, marginTop: 2, background: `${col}22`, border: `1px solid ${col}44`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ display: "flex", gap: 1, alignItems: "flex-end" }}>{[5, 8, 6].map((h, j) => <div key={j} style={{ width: 2, height: h, background: col, borderRadius: 1 }} />)}</div>
              </div>
            )}
            <div style={{
              maxWidth: m.role === "user" ? "72%" : "88%", padding: "10px 14px",
              borderRadius: m.role === "user" ? "10px 10px 2px 10px" : "10px 10px 10px 2px",
              background: m.role === "user" ? `${col}22` : "rgba(255,255,255,0.025)",
              border: m.role === "user" ? `1px solid ${col}44` : `1px solid ${C.border}`,
              fontSize: 13.5, lineHeight: 1.7,
              color: m.role === "user" ? C.text : "rgba(232,229,222,0.82)",
            }}>{parseAndRender(m.content)}</div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <div style={{ width: 24, height: 24, borderRadius: 4, flexShrink: 0, marginTop: 2, background: `${col}22`, border: `1px solid ${col}44`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ display: "flex", gap: 1, alignItems: "flex-end" }}>{[5, 8, 6].map((h, j) => <div key={j} style={{ width: 2, height: h, background: col, borderRadius: 1 }} />)}</div>
            </div>
            <div style={{ padding: "10px 14px", borderRadius: "10px 10px 10px 2px", background: "rgba(255,255,255,0.025)", border: `1px solid ${C.border}`, display: "flex", gap: 5 }}>
              {[0, 1, 2].map(d => <div key={d} style={{ width: 6, height: 6, borderRadius: "50%", background: col, opacity: 0.3, animation: `p 1.2s ease-in-out ${d * 0.2}s infinite` }} />)}
            </div>
          </div>
        )}
        {err && <div style={{ padding: "8px 12px", borderRadius: 6, background: "rgba(224,96,96,0.08)", border: "1px solid rgba(224,96,96,0.15)", color: C.red, fontSize: 12 }}>{err}</div>}
        <div ref={endRef} />
      </div>

      {/* QUICK PROMPTS */}
      {msgs.length <= 1 && currentSubject && (
        <div style={{ padding: "0 14px 8px", display: "flex", gap: 6, flexWrap: "wrap" }}>
          {currentSubject.prompts.map((p, i) => (
            <button key={i} onClick={() => { setInput(p); setTimeout(() => inputRef.current?.focus(), 50); }}
              style={{ padding: "5px 12px", borderRadius: 4, border: `1px solid ${C.border}`, background: "transparent", color: C.textDim, fontSize: 11, cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => { e.target.style.borderColor = col; e.target.style.color = col; }}
              onMouseLeave={e => { e.target.style.borderColor = C.border; e.target.style.color = C.textDim; }}>{p}</button>
          ))}
        </div>
      )}

      {/* INPUT */}
      <div style={{ padding: "8px 14px 14px", borderTop: `1px solid ${C.border}`, background: C.bg, flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end", background: C.bgInput, border: `1px solid ${C.border}`, borderRadius: 8, padding: "3px 3px 3px 14px" }}>
          <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder={currentSubject.placeholder}
            rows={1} style={{ flex: 1, border: "none", outline: "none", resize: "none", background: "transparent", color: C.text, fontFamily: "'DM Sans',sans-serif", fontSize: 13.5, padding: "8px 0", lineHeight: 1.5, maxHeight: 100, overflow: "auto" }} />
          <button onClick={send} disabled={!input.trim() || loading} style={{
            width: 34, height: 34, borderRadius: 6, border: "none",
            cursor: input.trim() && !loading ? "pointer" : "default",
            background: input.trim() && !loading ? col : "rgba(255,255,255,0.04)",
            color: input.trim() && !loading ? "#fff" : C.textDim,
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
