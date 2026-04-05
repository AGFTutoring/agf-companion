const fs = require('fs');
const FILE = 'app/page.js';
let src = fs.readFileSync(FILE, 'utf8');
console.log('Read ' + FILE + ' (' + src.length + ' chars)');

// Insert AP Calculus content before the FREE RESOURCES block in the maths prompt
const mathsArea = src.indexOf('A-LEVEL MATHEMATICS NOTES');
const freeResIdx = src.indexOf('FREE RESOURCES', mathsArea);

if (mathsArea === -1 || freeResIdx === -1) {
  console.log('ERROR: Could not find insertion point');
  process.exit(1);
}

const apContent = `AP CALCULUS AB (College Board)
OpenStax reference: Calculus Volumes 1-2 at openstax.org/books/calculus-volume-1

UNIT 1 — LIMITS AND CONTINUITY
Limit definition: lim(x->a) f(x) = L means f(x) approaches L as x approaches a.
One-sided limits: lim(x->a+) and lim(x->a-). Limit exists only if both sides agree.
Limit laws: sum, difference, product, quotient, power rules. lim(x->a)[f(x)+g(x)] = lim f + lim g.
Squeeze theorem: if g(x) <= f(x) <= h(x) and lim g = lim h = L, then lim f = L.
Key limits: lim(x->0) sin(x)/x = 1. lim(x->0) (1-cos(x))/x = 0. lim(x->inf) (1+1/n)^n = e.
Continuity: f is continuous at a if (1) f(a) exists, (2) lim(x->a) f(x) exists, (3) lim(x->a) f(x) = f(a).
Types of discontinuity: removable (hole), jump, infinite (asymptote).
Intermediate Value Theorem (IVT): if f is continuous on [a,b] and k is between f(a) and f(b), then there exists c in (a,b) with f(c) = k.
Horizontal asymptotes: lim(x->inf) f(x) = L. Vertical asymptotes: lim(x->a) f(x) = infinity.

UNIT 2 — DIFFERENTIATION: DEFINITION AND FUNDAMENTAL PROPERTIES
Definition: f'(x) = lim(h->0) [f(x+h) - f(x)] / h. Derivative at a point: f'(a) = lim(x->a) [f(x)-f(a)]/(x-a).
Differentiability implies continuity (but not vice versa). Not differentiable at corners, cusps, vertical tangents, discontinuities.
Basic rules: d/dx(c) = 0. d/dx(x^n) = nx^(n-1). d/dx(e^x) = e^x. d/dx(ln x) = 1/x.
d/dx(sin x) = cos x. d/dx(cos x) = -sin x. d/dx(tan x) = sec^2 x.
Sum/difference rule: d/dx[f+g] = f'+g'. Constant multiple: d/dx[cf] = cf'.

UNIT 3 — DIFFERENTIATION: COMPOSITE, IMPLICIT, AND INVERSE FUNCTIONS
Chain rule: d/dx[f(g(x))] = f'(g(x)) * g'(x). "Derivative of outer times derivative of inner."
Implicit differentiation: differentiate both sides w.r.t. x, collect dy/dx terms, solve.
Inverse function derivative: if g = f^(-1), then g'(x) = 1/f'(g(x)).
d/dx(a^x) = a^x ln(a). d/dx(log_a(x)) = 1/(x ln a).
Higher-order derivatives: f''(x), f'''(x). Velocity = s'(t), acceleration = v'(t) = s''(t).

UNIT 4 — CONTEXTUAL APPLICATIONS OF DIFFERENTIATION
Related rates: identify variables, write equation relating them, differentiate w.r.t. time, substitute known values.
Linear approximation: f(a+h) approx f(a) + f'(a)*h. Tangent line approximation.
L'Hopital's Rule: if lim f(x)/g(x) gives 0/0 or inf/inf, then lim f(x)/g(x) = lim f'(x)/g'(x).
Motion: position s(t), velocity v(t) = s'(t), acceleration a(t) = v'(t). Speed = |v(t)|.
Particle changes direction when v(t) changes sign. Total distance = integral of |v(t)|.

UNIT 5 — ANALYTICAL APPLICATIONS OF DIFFERENTIATION
Mean Value Theorem (MVT): if f continuous on [a,b] and differentiable on (a,b), then there exists c with f'(c) = [f(b)-f(a)]/(b-a).
Extreme Value Theorem: continuous function on closed interval has absolute max and min.
Critical points: where f'(x) = 0 or f'(x) undefined. Candidates for extrema.
First derivative test: f' changes + to - means local max; - to + means local min.
Second derivative test: f'(c)=0 and f''(c)>0 means local min; f''(c)<0 means local max.
Concavity: f''>0 concave up, f''<0 concave down. Inflection point where concavity changes.
Optimization: find critical points, test endpoints, determine absolute max/min.
Curve sketching: domain, intercepts, symmetry, asymptotes, intervals of increase/decrease, concavity, inflection points.

UNIT 6 — INTEGRATION AND ACCUMULATION OF CHANGE
Riemann sums: left, right, midpoint, trapezoidal approximations. n subintervals of width dx = (b-a)/n.
Definite integral: integral from a to b of f(x)dx = lim(n->inf) of Riemann sum. Net signed area.
Fundamental Theorem of Calculus Part 1: if F(x) = integral from a to x of f(t)dt, then F'(x) = f(x).
Fundamental Theorem Part 2: integral from a to b of f(x)dx = F(b) - F(a) where F' = f.
Properties: integral of [f+g] = integral f + integral g. integral from a to a = 0. integral from a to b = -integral from b to a.
Basic antiderivatives: integral of x^n = x^(n+1)/(n+1) + C. integral of 1/x = ln|x| + C. integral of e^x = e^x + C.
integral of sin x = -cos x + C. integral of cos x = sin x + C. integral of sec^2 x = tan x + C.
U-substitution: integral of f(g(x))*g'(x)dx. Let u = g(x), du = g'(x)dx.

UNIT 7 — DIFFERENTIAL EQUATIONS
Separable DEs: dy/dx = f(x)g(y). Separate: (1/g(y))dy = f(x)dx. Integrate both sides.
General solution includes +C. Particular solution: use initial condition to find C.
Slope fields: visual representation of dy/dx at grid of points. Solution curves follow the field.
Exponential growth/decay: dy/dt = ky gives y = y_0 * e^(kt). k>0 growth, k<0 decay.

UNIT 8 — APPLICATIONS OF INTEGRATION
Average value: f_avg = (1/(b-a)) * integral from a to b of f(x)dx.
Area between curves: integral from a to b of [f(x) - g(x)]dx where f(x) >= g(x).
Volume by discs: V = pi * integral of [R(x)]^2 dx (rotation about x-axis).
Volume by washers: V = pi * integral of [R(x)^2 - r(x)^2] dx (hollow solid).
Volume by cross-sections: V = integral of A(x)dx where A(x) is known cross-section area (squares, semicircles, equilateral triangles, etc.).

AP CALCULUS BC — ADDITIONAL TOPICS (beyond AB)

UNIT 9 — PARAMETRIC EQUATIONS, POLAR COORDINATES, AND VECTOR-VALUED FUNCTIONS
Parametric: x = f(t), y = g(t). dy/dx = (dy/dt)/(dx/dt). d2y/dx2 = d/dt(dy/dx) / (dx/dt).
Arc length (parametric): L = integral of sqrt[(dx/dt)^2 + (dy/dt)^2] dt.
Polar coordinates: x = r cos(theta), y = r sin(theta). r = f(theta).
Area in polar: A = (1/2) integral of r^2 d(theta).
Vector-valued functions: r(t) = <x(t), y(t)>. Velocity = r'(t). Speed = |r'(t)|. Acceleration = r''(t).

UNIT 10 — INFINITE SEQUENCES AND SERIES
Sequences: {a_n}. Convergent if lim(n->inf) a_n = L exists and is finite.
Series: sum of a_n from n=1 to infinity. Partial sums S_n = a_1 + a_2 + ... + a_n. Converges if lim S_n exists.
Geometric series: sum of ar^n. Converges if |r| < 1, sum = a/(1-r).
Divergence test: if lim a_n is not 0, series diverges. (Converse NOT true.)
Integral test: if f is positive, decreasing, continuous, then sum a_n and integral of f(x) both converge or both diverge.
p-series: sum of 1/n^p. Converges if p > 1, diverges if p <= 1. Harmonic series (p=1) diverges.
Comparison test: compare with known convergent/divergent series.
Limit comparison test: if lim(a_n/b_n) = c > 0, then both converge or both diverge.
Alternating series test: if |a_n| decreasing and lim a_n = 0, then alternating series converges.
Ratio test: lim |a_(n+1)/a_n| = L. L<1 converges absolutely, L>1 diverges, L=1 inconclusive.
Root test: lim |a_n|^(1/n) = L. Same criteria as ratio test.
Absolute vs conditional convergence.
Taylor series: f(x) = sum of f^(n)(a)/n! * (x-a)^n. Maclaurin series: Taylor at a = 0.
Key Maclaurin series: e^x = sum x^n/n!. sin x = sum (-1)^n x^(2n+1)/(2n+1)!. cos x = sum (-1)^n x^(2n)/(2n)!.
1/(1-x) = sum x^n for |x| < 1. ln(1+x) = sum (-1)^(n+1) x^n/n for |x| <= 1.
Radius and interval of convergence: use ratio test. Check endpoints separately.
Taylor polynomial error bound (Lagrange): |R_n(x)| <= M|x-a|^(n+1)/(n+1)! where M = max|f^(n+1)| on interval.
Alternating series error bound: |error| <= |first omitted term|.
Power series operations: differentiate and integrate term by term within interval of convergence.

AP EXAM FORMAT
Section I: Multiple Choice (45 questions, 105 minutes). Part A: no calculator. Part B: calculator allowed.
Section II: Free Response (6 questions, 90 minutes). Part A: calculator allowed. Part B: no calculator.
Scoring: MC worth 50%, FRQ worth 50%. Each FRQ usually worth 9 points.
Show all work on FRQs. Justify answers with theorems by name (IVT, MVT, FTC, etc.).
Calculator skills needed: graph functions, solve equations, numerical derivatives, definite integrals.

`;

src = src.substring(0, freeResIdx) + apContent + src.substring(freeResIdx);

console.log('Done - added AP Calculus AB and BC content');
fs.writeFileSync(FILE, src);
console.log('File size: ' + src.length + ' chars');
