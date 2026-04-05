const fs = require('fs');

// ═══════════════════════════════════════════════════
// AGF Study Companion — Maths P4 Enrichment Patch
// Adds: Parametric equations, implicit differentiation,
//        integration by substitution, differential equations,
//        vectors (3D), connected rates of change
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

let patchCount = 0;

function patch(name, oldStr, newStr) {
  if (src.includes(oldStr)) {
    src = src.replace(oldStr, newStr);
    patchCount++;
    console.log(`✅ ${name}`);
  } else {
    console.log(`❌ ${name} — marker not found`);
    // Show nearby context for debugging
    const words = oldStr.substring(0, 40);
    const idx = src.indexOf(words.substring(0, 20));
    if (idx !== -1) {
      console.log(`   Partial match at index ${idx}`);
      console.log(`   Context: ${JSON.stringify(src.substring(idx, idx + 60))}`);
    }
  }
}

// ═══════════════════════════════════════════════════
// 1. ADD PARAMETRIC EQUATIONS (entirely new section)
//    Insert before DIFFERENTIAL EQUATIONS section
// ═══════════════════════════════════════════════════

patch(
  'Add PARAMETRIC EQUATIONS section',

  'DIFFERENTIAL EQUATIONS',

  `PARAMETRIC EQUATIONS (P4)
Parametric equations define x and y separately in terms of a parameter t (or theta).
To find dy/dx: use dy/dx = (dy/dt) / (dx/dt). This follows from the chain rule.
To convert to Cartesian form: eliminate the parameter between the two equations.
For trig parametric equations: use sin^2(t) + cos^2(t) = 1 or sec^2(t) - tan^2(t) = 1.
Example: x = 2cos(t), y = 3sin(t). Then cos(t) = x/2, sin(t) = y/3. So (x/2)^2 + (y/3)^2 = 1 — an ellipse.
Area under a parametric curve: integral of y dx = integral of y(dx/dt)dt. Change the limits to t-values.
Volume of revolution (parametric): V = pi integral of y^2 (dx/dt) dt. Change limits to t-values.
Second derivative: d^2y/dx^2 = d/dt(dy/dx) / (dx/dt). Differentiate dy/dx with respect to t, then divide by dx/dt.

IMPLICIT DIFFERENTIATION (P4 — detailed)
For equations not in y = f(x) form, differentiate both sides w.r.t. x using chain rule.
Key rule: d/dx(f(y)) = f'(y) * dy/dx. The dy/dx appears because y is a function of x.
Examples: d/dx(y^3) = 3y^2 dy/dx. d/dx(sin y) = cos y dy/dx. d/dx(e^y) = e^y dy/dx.
For products of x and y: use the product rule. d/dx(xy) = y + x dy/dx. d/dx(x^2 y) = 2xy + x^2 dy/dx.
After differentiating: collect all dy/dx terms on one side, factorise out dy/dx, solve for dy/dx.
Example: x^2 + y^2 - 3xy = -1. Differentiating: 2x + 2y dy/dx - (3y + 3x dy/dx) = 0. So dy/dx = (3y - 2x)/(2y - 3x).

CONNECTED RATES OF CHANGE (P4)
When rate involves time: "rate" means d/dt. "Rate of increase of area" = dA/dt.
Chain rule connects rates: dA/dt = (dA/dr) * (dr/dt). Set up the chain with matching variables.
Method: (1) identify variables and which rate you need, (2) form a chain with known rates, (3) differentiate any geometric formula needed, (4) substitute given values.
Example: radius increases at 2 cm/s, find rate of increase of area when r = 10. dA/dt = dA/dr * dr/dt = 2*pi*r * 2 = 40*pi cm^2/s.

DIFFERENTIAL EQUATIONS`
);

// ═══════════════════════════════════════════════════
// 2. ENRICH DIFFERENTIAL EQUATIONS section
//    Replace current brief content with detailed version
// ═══════════════════════════════════════════════════

patch(
  'Enrich DIFFERENTIAL EQUATIONS section',

  `DIFFERENTIAL EQUATIONS
First order: dy/dx = f(x) — integrate directly.
Separable: dy/dx = g(x)h(y) — separate variables: integral of (1/h(y))dy = integral of g(x)dx.
General solution: includes +c. Particular solution: use initial conditions to find c.`,

  `DIFFERENTIAL EQUATIONS (P4 — detailed)
First order: dy/dx = f(x) — integrate directly. y = integral of f(x) dx + c.
Separable: dy/dx = f(x)g(y). Separate: (1/g(y)) dy = f(x) dx. Integrate both sides.
Key technique: factorise RHS first so it is a product of a function of x and a function of y.
Example: dy/dx = xy + x = x(y+1). So 1/(y+1) dy = x dx. Integrating: ln|y+1| = x^2/2 + c.
Tidying constants: if ln|y| = f(x) + c, then y = e^(f(x)+c) = e^c * e^(f(x)) = A*e^(f(x)) where A = e^c.
If ln y = x + c, write c = ln A, so ln y = ln A + x, hence y = Ae^x.
General solution: contains an arbitrary constant. Particular solution: substitute initial conditions (often t=0) to find the constant.
Forming differential equations from descriptions: "rate proportional to" means d/dt = k(...). "Falls" or "decreases" means negative sign.
Example: "temperature falls at rate proportional to temperature" gives dT/dt = -kT. Solution: T = T_0 * e^(-kt).
Exponential growth: dP/dt = kP gives P = P_0 * e^(kt). Half-life: t = ln(2)/k.`
);

// ═══════════════════════════════════════════════════
// 3. ENRICH INTEGRATION — add substitution detail and by parts detail
//    Insert after the reverse chain rule content
// ═══════════════════════════════════════════════════

patch(
  'Add INTEGRATION BY SUBSTITUTION and BY PARTS detail',

  `Trapezium rule: integral approx h/2`,

  `INTEGRATION BY SUBSTITUTION (P4 — detailed)
Used when reverse chain rule is not obvious. Substitution is usually given in the exam.
Method: (1) Let u = g(x). (2) Find du/dx, rearrange to get dx = du/g'(x). (3) Replace ALL x terms with u. (4) Integrate w.r.t. u. (5) Substitute back to x.
For definite integrals: change the limits when you change variable. Or change back to x and use original limits.
If u^2 = f(x), differentiate implicitly: 2u du = f'(x) dx, so dx = 2u du/f'(x). This avoids messy square roots.
Example: integral of x*sqrt(x+1) dx with u = x+1. Then x = u-1, dx = du. Integral becomes (u-1)*sqrt(u) du = (u^(3/2) - u^(1/2)) du.

INTEGRATION BY PARTS (P4 — detailed)
Formula: integral of u dv = uv - integral of v du. Choose u and dv wisely.
LIATE rule for choosing u (first in list = best choice for u): Logarithmic, Inverse trig, Algebraic, Trig, Exponential.
Example: integral of x*e^x dx. Let u = x (algebraic), dv = e^x dx. Then du = dx, v = e^x. Result: xe^x - e^x + c.
For integral of ln x dx: let u = ln x, dv = dx. Then du = 1/x dx, v = x. Result: x ln x - x + c.
Repeated IBP: if first IBP gives another product to integrate, apply IBP again. Keep tidy — compute second integral separately.
Cyclic IBP: integral of e^x sin x dx. IBP twice returns the original integral. Collect: 2I = e^x(sin x - cos x), so I = e^x(sin x - cos x)/2.

VOLUMES OF REVOLUTION (P4)
About x-axis: V = pi * integral from a to b of y^2 dx.
About y-axis: V = pi * integral from c to d of x^2 dy.
Parametric: V = pi * integral of y^2 (dx/dt) dt. Change limits to parameter values.
Subtract volumes for regions between curves: V = pi * integral of (y_outer^2 - y_inner^2) dx.

Trapezium rule: integral approx h/2`
);

// ═══════════════════════════════════════════════════
// 4. ENRICH VECTORS section
//    Replace current brief content with detailed 3D version
// ═══════════════════════════════════════════════════

patch(
  'Enrich VECTORS section',

  `VECTORS
Position vector: from origin to point. Direction vector: shows direction of line.
Magnitude: |a| = sqrt(x^2 + y^2 + z^2). Unit vector: a_hat = a/|a|.
Vector equation of line: r = a + lambda*b (position + parameter * direction).
Scalar product: a.b = |a||b|cos(theta) = x1x2 + y1y2 + z1z2.
Perpendicular vectors: a.b = 0. Parallel: a = kb for some scalar k.
Angle between vectors: cos(theta) = (a.b)/(|a||b|).`,

  `VECTORS (P4 — detailed, 3D)
Position vector: OA = vector from origin to point A. Components: a = (x, y, z).
Magnitude: |a| = sqrt(x^2 + y^2 + z^2). Unit vector: a_hat = a/|a|. Distance between A and B: |AB| = |b - a|.
Parallel vectors: a is parallel to b if a = kb for some scalar k. Show AB parallel to CD to prove collinearity.
Vector equation of line: r = a + lambda*d, where a is a point on the line and d is the direction vector.
To show a point lies on a line: substitute the point into r = a + lambda*d and check all three components give the same lambda.

SCALAR PRODUCT (DOT PRODUCT)
a.b = x1x2 + y1y2 + z1z2 = |a||b|cos(theta).
Perpendicular test: a.b = 0 means vectors are perpendicular (90 degrees).
Angle between two vectors: cos(theta) = (a.b)/(|a||b|). Always gives acute or obtuse angle.
Angle between two LINES: use the direction vectors. If cos(theta) is negative, the acute angle is 180 - theta.

INTERSECTION OF TWO LINES
Set r1 = r2: equate components to get 3 equations in 2 unknowns (lambda and mu).
Solve 2 equations, check the solution satisfies the 3rd. If yes: lines intersect (substitute back to find point).
If no: lines are skew (not parallel and do not intersect in 3D).

NEAREST POINT ON A LINE TO A POINT
Let P be the general point on the line: P = a + lambda*d. Let Q be the given point.
Vector QP = P - Q = (a + lambda*d) - q. For nearest point: QP perpendicular to d, so QP.d = 0.
Solve for lambda, then find P. Distance = |QP|.`
);

// ═══════════════════════════════════════════════════
// 5. Add PARTIAL FRACTIONS enrichment with quadratic denominators
//    Find and extend existing partial fractions content
// ═══════════════════════════════════════════════════

const pfMarker = `Partial fractions: proper fractions only (divide first if improper).`;

if (src.includes(pfMarker)) {
  patch(
    'Enrich PARTIAL FRACTIONS with quadratic and repeated factors',
    pfMarker,
    `Partial fractions: proper fractions only (degree of numerator < degree of denominator; divide first if improper).
Improper fractions: use algebraic long division first to get quotient + remainder/divisor, then split the remainder.`
  );
} else {
  console.log('⚠️  Partial fractions marker not found — may already be enriched');
}

// ═══════════════════════════════════════════════════
// WRITE OUTPUT
// ═══════════════════════════════════════════════════

fs.writeFileSync(FILE, src);
console.log(`\n✅ All patches applied. ${patchCount} successful.`);
console.log(`File size: ${src.length} chars`);
console.log('\nNext steps:');
console.log('  npm run dev');
console.log('  # Test: ask maths questions about parametric equations, implicit differentiation, vectors');
console.log('  git add .');
console.log('  git commit -m "Enrich maths P4: parametric, implicit diff, substitution, vectors, diff equations"');
console.log('  git push');
console.log('  del enrich-maths-p4.js');
