const fs = require('fs');
const FILE = 'app/page.js';
let src = fs.readFileSync(FILE, 'utf8');
console.log('Read ' + FILE + ' (' + src.length + ' chars)');

// Insert S1 + M1 content BEFORE the OER references block in the maths system prompt
// The OER block starts with "FREE RESOURCES"
const marker = 'FREE RESOURCES — when students want to read further, direct them to these:\\n- OpenStax Algebra';

if (!src.includes(marker)) {
  // Try without the newline escape (might be literal in the file)
  console.log('Primary marker not found, trying alternative...');
}

// Use a simpler, more reliable marker
const simpleMarker = 'FREE RESOURCES';
const mathsPromptArea = src.indexOf('A-LEVEL MATHEMATICS NOTES');
const freeResIdx = src.indexOf(simpleMarker, mathsPromptArea);

if (mathsPromptArea === -1 || freeResIdx === -1) {
  console.log('ERROR: Could not find maths system prompt or FREE RESOURCES marker');
  process.exit(1);
}

// Find the exact position where FREE RESOURCES starts in the maths prompt
// We want to insert our content just before it
const insertContent = `STATISTICS 1 (S1 / WST01 — Applied Maths)

DATA REPRESENTATION
Variables: qualitative (non-numerical) vs quantitative (numerical). Continuous (any value in range) vs discrete (specific values only).
Frequency distributions: frequency tables, cumulative frequency. Grouped data: class boundaries, class widths.
Histograms: frequency density = frequency / class width. Area of bar = frequency. Unequal class widths common.
Cumulative frequency curves: plot upper class boundary vs cumulative frequency. Use to estimate median, quartiles, percentiles.
Stem and leaf diagrams: ordered digits as leaves. Back-to-back for comparing distributions. Always include a key.
Box plots: show min, Q1, median, Q3, max. Outliers: values beyond Q1 - 1.5*IQR or Q3 + 1.5*IQR.
Skewness: positive skew (mean > median > mode, tail to right), negative skew (mean < median < mode, tail to left), symmetric (mean = median = mode).

MEASURES OF LOCATION AND SPREAD
Mean: x_bar = sum(x)/n or sum(fx)/sum(f). Affected by outliers.
Median: middle value when ordered. Q2. Not affected by outliers.
Mode: most frequent value. Can have no mode or multiple modes.
Range: max - min. Interquartile range: IQR = Q3 - Q1. Measures spread of middle 50%.
Variance: Var = sum(x^2)/n - (mean)^2 = Sxx/n. Standard deviation: s = sqrt(variance).
Coding: if y = (x-a)/b then y_bar = (x_bar - a)/b and s_y = s_x / |b|. Use to simplify calculations.

PROBABILITY
P(A) = n(A)/n(S) for equally likely outcomes. 0 <= P(A) <= 1. P(not A) = 1 - P(A).
Addition rule: P(A or B) = P(A) + P(B) - P(A and B). For mutually exclusive: P(A and B) = 0.
Conditional probability: P(A|B) = P(A and B)/P(B). Independent events: P(A|B) = P(A), so P(A and B) = P(A)*P(B).
Tree diagrams: multiply along branches, add between branches. Always check probabilities sum to 1.
Venn diagrams: useful for visualising unions, intersections, complements.

CORRELATION AND REGRESSION
Scatter diagrams: plot bivariate data. Identify positive, negative, or no correlation.
Product moment correlation coefficient (PMCC): r = Sxy / sqrt(Sxx * Syy). -1 <= r <= 1.
Sxx = sum(x^2) - n*(x_bar)^2. Syy = sum(y^2) - n*(y_bar)^2. Sxy = sum(xy) - n*(x_bar)*(y_bar).
r near +1: strong positive linear correlation. r near -1: strong negative. r near 0: weak/no linear correlation.
Regression line: y = a + bx where b = Sxy/Sxx and a = y_bar - b*x_bar.
Only interpolate (predict within data range). Extrapolation (outside range) is unreliable.
Explanatory variable (x): independent. Response variable (y): dependent.

DISCRETE RANDOM VARIABLES
Probability distribution: table of values and probabilities. Sum of all P(X=x) = 1.
Expected value: E(X) = sum(x * P(X=x)). This is the theoretical mean.
Variance: Var(X) = E(X^2) - [E(X)]^2 where E(X^2) = sum(x^2 * P(X=x)).
E(aX + b) = aE(X) + b. Var(aX + b) = a^2 Var(X).
Discrete uniform distribution: each value equally likely. If X takes values 1,2,...,n then E(X) = (n+1)/2.

NORMAL DISTRIBUTION
Notation: X ~ N(mu, sigma^2). mu = mean, sigma = standard deviation, sigma^2 = variance.
Standard normal: Z ~ N(0, 1). Standardise: Z = (X - mu)/sigma.
P(X < a) = P(Z < (a - mu)/sigma). Use tables or calculator for P(Z < z).
Symmetry: P(Z > z) = P(Z < -z) = 1 - P(Z < z).
Finding mu or sigma: set up equation using Z = (X - mu)/sigma and solve.

MECHANICS 1 (M1 / WME01 — Applied Maths)

MODELLING ASSUMPTIONS
Particle: object with mass but no size. Rigid body: fixed shape, does not deform.
Light: has no mass (light string, light pulley). Smooth: no friction. Rough: friction acts.
Inextensible: string does not stretch (connected particles have same acceleration).
Uniform: constant density (centre of mass at geometric centre).
Bead: particle with a hole, can slide on wire/string. Peg: fixed point, string can slide over it.
Rod: rigid, does not bend. Lamina: flat 2D object, negligible thickness.

KINEMATICS (SUVAT)
s = displacement, u = initial velocity, v = final velocity, a = acceleration, t = time.
v = u + at. s = ut + (1/2)at^2. v^2 = u^2 + 2as. s = (1/2)(u+v)t.
Units must be consistent. Convert km/h to m/s: divide by 3.6.
Vertical motion: a = g = 9.8 m/s^2 downwards. State positive direction.
At highest point: v = 0 (momentarily at rest). Time up = time down (if returning to same height).
Velocity-time graphs: gradient = acceleration. Area under graph = displacement. Negative area = displacement in opposite direction.
Displacement-time graphs: gradient = velocity.

FORCES AND NEWTON'S LAWS
Weight: W = mg (downwards). Normal reaction: R perpendicular to surface. Tension: T along string.
Newton 1: if resultant force = 0 then object is in equilibrium (stationary or constant velocity).
Newton 2: F = ma. Resultant force = mass x acceleration. Always resolve in direction of motion.
Newton 3: action and reaction are equal and opposite (on DIFFERENT objects, same type of force).
Connected particles: use F = ma for each particle separately or for the whole system.
Pulleys: if smooth, tension is same on both sides. Heavier side accelerates down.
Resolving forces on a slope: component along slope = mg sin(theta), component perpendicular = mg cos(theta).

FRICTION
F <= mu*R (friction force <= coefficient of friction x normal reaction).
At the point of sliding (limiting equilibrium): F = mu*R.
Friction opposes motion (or the tendency to move). Direction: opposite to motion.
On a rough slope: if on the point of sliding down, friction acts up the slope. F = mu*R = mu*mg*cos(theta).

MOMENTUM AND IMPULSE
Momentum: p = mv (kg m/s). Vector quantity (has direction).
Conservation of momentum: total momentum before = total momentum after (in a closed system, no external forces).
m1*u1 + m2*u2 = m1*v1 + m2*v2. Careful with signs (direction matters).
Impulse: I = F*t = change in momentum = mv - mu. Units: Ns.
Elastic collision: kinetic energy conserved. Inelastic: KE not conserved (some lost to heat/sound/deformation).
Coefficient of restitution: e = (separation speed)/(approach speed). 0 <= e <= 1. e = 1 perfectly elastic, e = 0 perfectly inelastic.

MOMENTS
Moment of a force = force x perpendicular distance from pivot. Units: Nm.
Clockwise vs anticlockwise moments. For equilibrium: sum of clockwise moments = sum of anticlockwise moments.
Couple: two equal, opposite, parallel forces. Torque = one force x distance between them.
Uniform rod: weight acts at centre (midpoint). Non-uniform: weight acts at centre of mass.
Tilting problems: reaction at the point about to lift off = 0.

`;

// Insert before FREE RESOURCES in the maths prompt
src = src.substring(0, freeResIdx) + insertContent + src.substring(freeResIdx);

console.log('Done - added Statistics 1 and Mechanics 1 to maths system prompt');
fs.writeFileSync(FILE, src);
console.log('File size: ' + src.length + ' chars');
