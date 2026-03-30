/**
 * enrich-maths.js
 * Enriches ONLY the A-Level Maths (Pure) system prompt notes.
 * Run after enrich-all-subjects.js if the Maths section failed.
 * 
 * Run:  node enrich-maths.js
 * Test: npm run dev
 * Deploy: git add . && git commit -m "Enrich Maths Pure notes" && git push
 */

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, 'app', 'page.js');
let code = fs.readFileSync(FILE, 'utf8');

// Find the maths system prompt section using a regex to be flexible
const startRe = /A-LEVEL MATHEMATICS NOTES \(Pure\/Core\):/;
const startMatch = code.match(startRe);
if (!startMatch) {
  console.error('ERROR: Could not find "A-LEVEL MATHEMATICS NOTES (Pure/Core):" in page.js');
  console.error('Searching for partial matches...');
  const partial = code.indexOf('A-LEVEL MATH');
  if (partial !== -1) {
    console.error('Found "A-LEVEL MATH" at position', partial);
    console.error('Context:', JSON.stringify(code.substring(partial, partial + 80)));
  } else {
    console.error('No match for "A-LEVEL MATH" at all.');
  }
  process.exit(1);
}

const startIdx = code.indexOf(startMatch[0]);
console.log('Found Maths start marker at position', startIdx);

// Find the end marker
const endMarker = 'Only answer A-Level Pure Maths content.';
const endIdx = code.indexOf(endMarker, startIdx);
if (endIdx === -1) {
  // Try alternative
  const altEnd = code.indexOf('Only answer A-Level Pure Maths', startIdx);
  if (altEnd === -1) {
    console.error('ERROR: Could not find end marker after Maths section');
    process.exit(1);
  }
}

const actualEndIdx = endIdx !== -1 ? endIdx : code.indexOf('Only answer A-Level Pure Maths', startIdx);
console.log('Found Maths end marker at position', actualEndIdx);

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

CAST diagram: All positive in Q1 (0-90°), Sin in Q2 (90-180°), Tan in Q3 (180-270°), Cos in Q4 (270-360°).
Exact values: sin 30° = 1/2, cos 30° = √3/2, tan 30° = 1/√3. sin 45° = cos 45° = 1/√2, tan 45° = 1. sin 60° = √3/2, cos 60° = 1/2, tan 60° = √3.

Sine rule: a/sin A = b/sin B = c/sin C. Use when you have a pair (angle + opposite side). Ambiguous case when finding angles.
Cosine rule: a² = b² + c² − 2bc cos A. Use when you have SAS or SSS.
Area of triangle: 1/2 ab sin C.

Radians: π rad = 180°. Convert: multiply by π/180 (deg to rad) or 180/π (rad to deg).
Arc length: s = rθ. Area of sector: A = 1/2 r²θ. (θ must be in radians.)

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

code = code.substring(0, startIdx) + MATHS_NOTES + code.substring(actualEndIdx);

fs.writeFileSync(FILE, code, 'utf8');
console.log('Done — Maths Pure notes enriched.');
console.log('');
console.log('Next: npm run dev, then git add . && git commit -m "Enrich Maths Pure notes" && git push');
