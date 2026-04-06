const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, 'app', 'page.js');
let src = fs.readFileSync(FILE, 'utf8');
const original = src;
let count = 0;

function patch(label, marker, replacement) {
  if (src.includes(marker)) {
    src = src.replace(marker, replacement);
    console.log("  OK: " + label);
    count++;
  } else {
    console.log("  FAIL: " + label);
    const short = marker.substring(0, 80).replace(/\r/g, '\\r').replace(/\n/g, '\\n');
    console.log("     Looking for: " + short);
  }
}

console.log('\nSAT/ACT Enrichment Patch\n');

// Find exact markers from the file
const funcLine = 'FUNCTIONS\r\nf(x) notation: substitute x value. Composite: (f\u2218g)(x) = f(g(x)).';

const newContent1 = 'STATISTICS & DATA ANALYSIS\r\nMean = sum / count. Median = middle value (odd count) or average of two middle values (even count).\r\nMode = most frequent value. Range = max \u2212 min.\r\nWeighted average: \u03a3(value \u00d7 weight) / \u03a3weights.\r\nStandard deviation: measures spread from the mean. Low SD = tightly clustered. High SD = spread out.\r\n~68% of data within 1 SD of mean, ~95% within 2 SD, ~99.7% within 3 SD (for normal distributions).\r\nAdding/subtracting a constant to all values: mean shifts, SD unchanged.\r\nMultiplying all values by a constant: both mean and SD multiply by that constant.\r\nOutliers: values far from the mean. Outliers affect mean and SD more than median and IQR.\r\nInterquartile range (IQR) = Q3 \u2212 Q1 (middle 50% of data). Resistant to outliers.\r\nBox plots: show min, Q1, median, Q3, max. Skew: longer whisker = skewed that direction.\r\nTwo-way tables: rows and columns represent categories. Read carefully \u2014 "of those who..." means use that row/column total, not grand total.\r\nConditional from tables: P(A|B) = count(A and B) / count(B). The "given" condition determines the denominator.\r\nScatterplots: positive association (up-right), negative (down-right), none (random scatter).\r\nLine of best fit: y = mx + b. Slope m = predicted change in y per unit increase in x. y-intercept b = predicted y when x = 0.\r\nResidual = actual \u2212 predicted. Residual plot should show random scatter (no pattern = good fit).\r\nr (correlation coefficient): \u22121 to +1. Closer to \u00b11 = stronger linear relationship. r\u00b2 = proportion of variance explained.\r\n\r\nEXPONENTIALS & LOGARITHMS\r\nExponential growth: y = a(1 + r)^t where a = initial value, r = growth rate, t = time.\r\nExponential decay: y = a(1 \u2212 r)^t.\r\nCompound interest: A = P(1 + r/n)^(nt) where P = principal, r = annual rate, n = compounds per year, t = years.\r\nContinuous growth: A = Pe^(rt).\r\nDoubling time: if growth rate is r per period, doubling time \u2248 70/r (rule of 70) or exact: t = ln(2)/ln(1+r).\r\nHalf-life: amount remaining = initial \u00d7 (1/2)^(t/h) where h = half-life period.\r\nLogarithms: log_b(x) = y means b^y = x. Common log: log = log base 10. Natural log: ln = log base e.\r\nLog rules: log(ab) = log a + log b. log(a/b) = log a \u2212 log b. log(a^n) = n log a.\r\nSolving: 2^x = 32 \u2192 x = 5. Or: 3^x = 50 \u2192 x = ln(50)/ln(3) \u2248 3.56.\r\nSAT tip: growth/decay problems often ask "what does the number represent?" \u2014 identify initial value vs rate vs time.\r\nExample: P = 1200(1.03)^t. Initial = 1200. Growth rate = 3% per period. After 5 periods: P = 1200(1.03)^5 \u2248 1391.\r\n\r\nFUNCTIONS\r\nf(x) notation: substitute x value. Composite: (f\u2218g)(x) = f(g(x)).';

patch('Add Statistics & Data + Exponentials sections', funcLine, newContent1);

// 2. Expand TEST STRATEGY
const stratMarker = 'TEST STRATEGY\r\nRead question carefully \u2014 what EXACTLY is being asked?\r\nPick Numbers strategy: when variables in answer choices, substitute easy numbers.\r\nBacksolving: plug answer choices into the problem.\r\nEstimate and eliminate: rule out obviously wrong answers.';

const newStrat = 'TEST STRATEGY\r\nRead question carefully \u2014 what EXACTLY is being asked? Underline the actual question.\r\nPick Numbers: when answer choices contain variables, substitute easy numbers (2, 3, 5 \u2014 avoid 0 and 1). Evaluate each choice with your numbers. Only one answer will match.\r\nBacksolving: start with answer choice C (middle value). If too big, try A/B. If too small, try D. Works best for "what value of x" questions.\r\nEstimate and eliminate: rule out obviously wrong answers. If the question asks for 20% of 80, and one answer is 400, eliminate immediately.\r\nUnit analysis: if the question involves rates (miles/hour, $/unit), check that your answer has the right units.\r\nGrid-in tips: no negative answers on grid-ins. Reduce fractions or convert to decimals. Start from leftmost column.\r\nTime management: 1.5 minutes per question average. Flag hard ones and return. Never leave blanks (no penalty for guessing on Digital SAT).\r\nData questions: always read axis labels, units, and titles before interpreting graphs. Watch for broken axes or non-zero baselines.\r\nPercent vs percentage point: "increased by 5%" vs "increased by 5 percentage points" are different. 20% + 5 percentage points = 25%. 20% increased by 5% = 21%.\r\nWord problem translation: "is" = equals, "of" = multiply, "per" = divide, "more than" = add, "less than" = subtract.';

patch('Expand test strategies', stratMarker, newStrat);

// 3. Add quiz weighting note
if (!src.includes('QUIZ TOPIC WEIGHTING:')) {
  const endMarker = 'Only answer SAT/ACT Math content. Use [EQUATION:...] tags for key formulae. Show all working step by step.';
  patch('Add SAT vs ACT quiz weighting', endMarker, 'QUIZ TOPIC WEIGHTING:\r\nFor SAT-style quizzes: ~35% algebra (linear equations, inequalities, systems), ~35% advanced math (quadratics, polynomials, functions, exponentials), ~15% problem solving & data (statistics, probability, ratios, percents), ~15% geometry & trigonometry.\r\nFor ACT-style quizzes: more emphasis on geometry, trigonometry, and combinatorics than SAT.\r\nDefault to SAT weighting unless student specifies ACT.\r\n\r\nOnly answer SAT/ACT Math content. Use [EQUATION:...] tags for key formulae. Show all working step by step.');
} else {
  console.log('  SKIP: Quiz weighting already present');
}

if (src !== original) {
  fs.writeFileSync(FILE, src, 'utf8');
  console.log('\nDone: ' + count + ' patches applied.');
} else {
  console.log('\nNo changes made.');
}
