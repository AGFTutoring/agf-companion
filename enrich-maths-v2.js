/**
 * enrich-maths-v2.js
 * Matches the actual marker: "A-LEVEL MATHEMATICS NOTES (Pure/Core — Edexcel IAL P1/P2):"
 */

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, 'app', 'page.js');
let code = fs.readFileSync(FILE, 'utf8');

const startMarker = 'A-LEVEL MATHEMATICS NOTES (Pure/Core';
const startIdx = code.indexOf(startMarker);
if (startIdx === -1) {
  console.error('ERROR: Could not find Maths section');
  process.exit(1);
}

const endMarker = 'Only answer A-Level Pure Maths content.';
const endIdx = code.indexOf(endMarker, startIdx);
if (endIdx === -1) {
  console.error('ERROR: Could not find end marker');
  process.exit(1);
}

console.log('Found Maths section at position', startIdx);
console.log('Found end marker at position', endIdx);

const MATHS_NOTES = `A-LEVEL MATHEMATICS NOTES (Pure/Core — Edexcel IAL P1/P2):

ALGEBRA & FUNCTIONS
Quadratics: ax2 + bx + c = 0. Solve by factorising, completing the square, or quadratic formula: x = (-b +/- sqrt(b2-4ac))/(2a).
Discriminant: b2 - 4ac. If > 0: two distinct real roots. If = 0: one repeated root. If < 0: no real roots.
Completing the square: x2 + bx = (x + b/2)2 - b2/4. For ax2 + bx + c: a[(x + b/(2a))2 - (b2 - 4ac)/(4a2)].
Vertex of y = a(x - h)2 + k is at (h, k). Minimum if a > 0, maximum if a < 0.

Factor theorem: if f(a) = 0, then (x - a) is a factor of f(x). Use to factorise cubics: test small integer values.
Remainder theorem: when f(x) is divided by (x - a), the remainder is f(a).
Polynomial division: long division or synthetic division. If (x - a) is a factor, remainder = 0.

Algebraic fractions: factorise numerator and denominator, cancel common factors.
Adding/subtracting: find common denominator. Multiplying: multiply tops and bottoms. Dividing: flip and multiply.
Partial fractions: decompose e.g. (3x+5)/((x+1)(x+2)) = A/(x+1) + B/(x+2). Cover-up method or equating coefficients.
Repeated factor: A/(x+1) + B/(x+1)2 + C/(x+2). Improper fraction: divide first to get polynomial + proper fraction.

Surds: sqrt(a) x sqrt(b) = sqrt(ab). sqrt(a)/sqrt(b) = sqrt(a/b). Rationalise: multiply by conjugate.
Indices: a^m x a^n = a^(m+n), a^m / a^n = a^(m-n), (a^m)^n = a^(mn), a^0 = 1, a^(-n) = 1/a^n, a^(1/n) = nth root of a.
Solving index equations: if bases equal, equate powers. Otherwise take logs.

Inequalities: solve like equations BUT flip the sign when multiplying/dividing by negative.
Quadratic inequalities: solve equation first, sketch parabola, read off required region.

Functions: f(x) notation. Domain = set of inputs, range = set of outputs.
Composite: fg(x) = f(g(x)). Apply inner function first. Inverse: f-1(x) - reflect in y = x.
To find inverse: write y = f(x), swap x and y, solve for y. Domain of f-1 = range of f.
Modulus: |f(x)| - reflects negative parts in x-axis. f(|x|) - reflects right half in y-axis.

Transformations of graphs:
y = f(x) + a: translate up by a. y = f(x + a): translate left by a.
y = af(x): stretch vertically by factor a. y = f(ax): squash horizontally by factor 1/a.
y = -f(x): reflect in x-axis. y = f(-x): reflect in y-axis.

COORDINATE GEOMETRY
Straight lines: y - y1 = m(x - x1), or y = mx + c. Gradient: m = (y2 - y1)/(x2 - x1).
Parallel lines: same gradient (m1 = m2). Perpendicular lines: m1 x m2 = -1.
Distance: d = sqrt((x2-x1)2 + (y2-y1)2). Midpoint: M = ((x1+x2)/2, (y1+y2)/2).

Circles: (x - a)2 + (y - b)2 = r2. Centre (a, b), radius r.
Expanded form: x2 + y2 + 2gx + 2fy + c = 0. Centre (-g, -f), radius sqrt(g2 + f2 - c).
Tangent to circle at point P: perpendicular to radius OP at P. Find gradient of radius, negative reciprocal = gradient of tangent.
Properties: angle in semicircle = 90 degrees. Tangent is perpendicular to radius. Perpendicular from centre to chord bisects the chord.

Parametric equations: x = f(t), y = g(t). Convert to Cartesian: eliminate the parameter t.
dy/dx = (dy/dt)/(dx/dt). For parametric circles: x = a + r cos t, y = b + r sin t.

SEQUENCES & SERIES
Arithmetic sequences: common difference d. u_n = a + (n-1)d.
Sum: S_n = n/2 x (2a + (n-1)d) = n/2 x (first + last).
Arithmetic mean of a and b = (a+b)/2.

Geometric sequences: common ratio r. u_n = ar^(n-1).
Sum of n terms: S_n = a(1 - r^n)/(1 - r) [r not equal to 1].
Sum to infinity: S_inf = a/(1 - r), convergent only when |r| < 1.
Geometric mean of a and b = sqrt(ab).

Sigma notation: Sum from r=1 to n of u_r. Can split sums, factor constants.
Recurrence relations: u_(n+1) = f(u_n). Increasing if u_(n+1) > u_n, decreasing if u_(n+1) < u_n.

Binomial expansion:
(a + b)^n = Sum of nCr a^(n-r) b^r for r = 0 to n. nCr = n!/(r!(n-r)!). Pascal triangle.
For (1 + x)^n when n is a positive integer: (1+x)^n = 1 + nx + n(n-1)x2/2! + n(n-1)(n-2)x3/3! + ...
For n NOT a positive integer: expansion is infinite, valid only when |x| < 1.
For (a + bx)^n: factor out a^n first, then expand (1 + bx/a)^n, valid when |bx/a| < 1.

TRIGONOMETRY
Basic ratios: sin t = O/H, cos t = A/H, tan t = O/A = sin t/cos t.
Reciprocal functions: sec t = 1/cos t, cosec t = 1/sin t, cot t = 1/tan t = cos t/sin t.
Pythagorean identities: sin2 t + cos2 t = 1. 1 + tan2 t = sec2 t. 1 + cot2 t = cosec2 t.

CAST diagram: All positive in Q1 (0-90), Sin in Q2 (90-180), Tan in Q3 (180-270), Cos in Q4 (270-360).
Exact values: sin 30 = 1/2, cos 30 = sqrt(3)/2, tan 30 = 1/sqrt(3). sin 45 = cos 45 = 1/sqrt(2), tan 45 = 1. sin 60 = sqrt(3)/2, cos 60 = 1/2, tan 60 = sqrt(3).

Sine rule: a/sin A = b/sin B = c/sin C. Use when you have a pair (angle + opposite side). Ambiguous case when finding angles.
Cosine rule: a2 = b2 + c2 - 2bc cos A. Use when you have SAS or SSS.
Area of triangle: (1/2) ab sin C.

Radians: pi rad = 180 degrees. Convert: multiply by pi/180 (deg to rad) or 180/pi (rad to deg).
Arc length: s = r theta. Area of sector: A = (1/2) r2 theta. (theta must be in radians.)

Small angle approximations (theta in radians, theta small): sin t approx t, cos t approx 1 - t2/2, tan t approx t.

Compound angle formulae:
sin(A +/- B) = sin A cos B +/- cos A sin B.
cos(A +/- B) = cos A cos B -/+ sin A sin B. (Note: signs are opposite.)
tan(A +/- B) = (tan A +/- tan B)/(1 -/+ tan A tan B).

Double angle formulae (set B = A):
sin 2A = 2 sin A cos A.
cos 2A = cos2 A - sin2 A = 2cos2 A - 1 = 1 - 2sin2 A.
tan 2A = 2tan A/(1 - tan2 A).

R-formula: a sin t + b cos t = R sin(t + alpha), where R = sqrt(a2 + b2), tan alpha = b/a.
Useful for finding max/min values and solving equations.

Inverse trig functions: arcsin, arccos, arctan. Remember restricted domains.

DIFFERENTIATION
First principles: f'(x) = lim(h to 0) [f(x+h) - f(x)]/h. Proves the power rule for x^n.
Power rule: d/dx(x^n) = nx^(n-1). Works for all rational n.
Constant multiple: d/dx(kf) = kf'. Sum/difference: d/dx(f +/- g) = f' +/- g'.

Chain rule: dy/dx = (dy/du)(du/dx). Use when differentiating composite functions.
d/dx[f(g(x))] = f'(g(x)) x g'(x). Example: d/dx(sin 3x) = 3cos 3x.

Product rule: d/dx(uv) = u'v + uv'. Use when two functions are multiplied.
Quotient rule: d/dx(u/v) = (u'v - uv')/v2. Use when one function divides another.

Standard derivatives:
d/dx(sin x) = cos x. d/dx(cos x) = -sin x. d/dx(tan x) = sec2 x.
d/dx(e^x) = e^x. d/dx(e^(kx)) = ke^(kx). d/dx(ln x) = 1/x. d/dx(ln f(x)) = f'(x)/f(x).
d/dx(a^x) = a^x ln a.

Stationary points: set dy/dx = 0, solve for x.
Nature: d2y/dx2 > 0 means minimum. d2y/dx2 < 0 means maximum. d2y/dx2 = 0 means check with sign change of first derivative.
Points of inflection: d2y/dx2 = 0 AND sign change in d2y/dx2. Gradient can be zero (stationary) or non-zero.

Tangent at (a, f(a)): y - f(a) = f'(a)(x - a). Normal: y - f(a) = -1/f'(a) x (x - a).
Connected rates of change: use chain rule. dV/dt = (dV/dr)(dr/dt).

Implicit differentiation: differentiate both sides with respect to x, use chain rule on y terms (multiply by dy/dx).
Example: d/dx(y2) = 2y(dy/dx). Collect dy/dx terms on one side, factorise, solve.

INTEGRATION
Reverse of differentiation: integral of x^n dx = x^(n+1)/(n+1) + c (n not equal to -1).
integral of 1/x dx = ln|x| + c. integral of e^x dx = e^x + c. integral of e^(kx) dx = (1/k)e^(kx) + c.
integral of sin x dx = -cos x + c. integral of cos x dx = sin x + c. integral of sec2 x dx = tan x + c.

Definite integrals: integral from a to b of f(x) dx = F(b) - F(a). Gives signed area under curve.
Area between curve and x-axis: integral of |f(x)| dx. Split at roots if curve crosses x-axis.
Area between two curves: integral of [f(x) - g(x)] dx where f(x) > g(x) in [a,b].

Integration by substitution: let u = g(x), find du/dx, replace dx, change limits if definite.
Integration by parts: integral of u dv = uv - integral of v du. Choose u using LIATE (Log, Inverse trig, Algebraic, Trig, Exponential).
Sometimes need to apply twice or use the trick where integral of e^x sin x dx appears on both sides.

Partial fractions for integration: decompose, then integrate term by term. integral of A/(x+a) dx = A ln|x+a| + c.

Trapezium rule: integral approx h/2 [y0 + 2(y1 + y2 + ... + y(n-1)) + yn] where h = (b-a)/n.
Always an approximation. Overestimate for concave-up curves, underestimate for concave-down. More strips means better accuracy.

Differential equations:
Separate variables: dy/dx = f(x)g(y) leads to integral of (1/g(y))dy = integral of f(x)dx.
General solution includes + c. Particular solution: use initial conditions to find c.

EXPONENTIALS & LOGARITHMS
Exponential function: y = a^x. Base e: y = e^x (natural exponential). e approx 2.71828.
Special property: d/dx(e^x) = e^x. The function equals its own derivative.
Graphs: e^x always positive, passes through (0,1), increases rapidly. e^(-x) is reflection in y-axis (decay).

Natural logarithm: ln x = log base e of x. Inverse of e^x. Domain: x > 0. ln 1 = 0, ln e = 1.
d/dx(ln x) = 1/x. integral of (1/x) dx = ln|x| + c. d/dx(ln f(x)) = f'(x)/f(x).

Log laws: ln(ab) = ln a + ln b. ln(a/b) = ln a - ln b. ln(a^n) = n ln a. These hold for any base.
Change of base: log_a(b) = ln b / ln a = log b / log a.

Solving exponential equations: a^x = b leads to x = ln b / ln a. Or take ln of both sides.
Solving log equations: combine using log laws, then convert to exponential form.

Exponential growth/decay: N = N0 e^(kt). k > 0: growth. k < 0: decay. Half-life: t_half = ln 2 / |k|.
Modelling: recognise when rate of change is proportional to current value leads to dN/dt = kN leads to N = N0 e^(kt).

VECTORS
Vector notation: column vectors, i-j-k notation, or bold letters.
Position vector: vector from origin to a point. OA = a.
Displacement vector: AB = b - a (final position vector minus initial position vector).

Magnitude: |a| = sqrt(x2 + y2 + z2) for 3D. Unit vector: a-hat = a/|a|.
Addition: tip-to-tail. Subtraction: a - b = a + (-b). Scalar multiplication: ka scales magnitude by |k|.
Parallel vectors: a = kb for some scalar k.

Scalar (dot) product: a dot b = |a||b|cos t = x1x2 + y1y2 + z1z2.
If a dot b = 0, vectors are perpendicular. If a dot b > 0, angle is acute. If a dot b < 0, angle is obtuse.
Finding angle: cos t = (a dot b)/(|a||b|).

Vector equation of a line: r = a + td, where a = position vector of known point, d = direction vector, t = parameter.
Parallel lines: same direction vector (or scalar multiple). Intersection: set equal, solve for parameters, check consistency.

PROOF
Proof by deduction: logical argument from known facts to conclusion.
Proof by exhaustion: check all possible cases.
Proof by contradiction: assume the opposite is true, derive a contradiction, therefore original statement is true.
Disproof by counter-example: find ONE example where the statement fails.
Common proofs to know: sqrt(2) is irrational, there are infinitely many primes.

`;

code = code.substring(0, startIdx) + MATHS_NOTES + code.substring(endIdx);

fs.writeFileSync(FILE, code, 'utf8');
console.log('Maths Pure notes enriched successfully.');
console.log('Next: npm run dev, then git add . && git commit -m "Enrich Maths Pure notes" && git push');
