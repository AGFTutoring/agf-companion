/**
 * PATCH: Add difficulty picker to quiz setup + enrich maths (Sequences & Functions)
 * 
 * Run: node patch-difficulty-and-maths.js
 * Then: npm run dev  (test locally)
 * Then: git add . && git commit -m "Add difficulty picker and enrich maths sequences/functions" && git push
 */

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, 'app', 'page.js');
let src = fs.readFileSync(FILE, 'utf8');

function patch(label, oldStr, newStr) {
  if (!src.includes(oldStr)) {
    console.error(`❌ FAILED: "${label}" — marker not found`);
    process.exit(1);
  }
  if (src.indexOf(oldStr) !== src.lastIndexOf(oldStr)) {
    console.error(`❌ FAILED: "${label}" — marker found multiple times`);
    process.exit(1);
  }
  src = src.replace(oldStr, newStr);
  console.log(`✅ ${label}`);
}

// ═══════════════════════════════════════════════════
// 1. ADD quizDifficulty STATE
// ═══════════════════════════════════════════════════

patch(
  'Add quizDifficulty state',
  'const[showQuizPicker,setShowQuizPicker]=useState(false);',
  'const[showQuizPicker,setShowQuizPicker]=useState(false);\n  const[quizDifficulty,setQuizDifficulty]=useState("medium");'
);

// ═══════════════════════════════════════════════════
// 2. RESET quizDifficulty in resetQuiz
// ═══════════════════════════════════════════════════

patch(
  'Reset quizDifficulty in resetQuiz',
  'const resetQuiz=()=>{setQuizQ(null);setQuizNum(0);setQuizSelected(null);setQuizFeedback(null);setQuizScore(0);setQuizMaxScore(0);setQuizHistory([]);setQuizDone(false);setShowQuizPicker(false);setHintText(null);setHintLoading(false); setUsedPPIndices(new Set());};',
  'const resetQuiz=()=>{setQuizQ(null);setQuizNum(0);setQuizSelected(null);setQuizFeedback(null);setQuizScore(0);setQuizMaxScore(0);setQuizHistory([]);setQuizDone(false);setShowQuizPicker(false);setHintText(null);setHintLoading(false); setUsedPPIndices(new Set());setQuizDifficulty("medium");};'
);

// ═══════════════════════════════════════════════════
// 3. WIRE DIFFICULTY INTO fetchQuizQuestion
//    Replace the auto-scaling formula with one that uses quizDifficulty
// ═══════════════════════════════════════════════════

patch(
  'Wire difficulty into question generation',
  'const difficulty=Math.min(10,Math.max(1,Math.ceil((questionNumber/quizTotal)*10)));',
  'const diffBase=quizDifficulty==="easy"?1:quizDifficulty==="challenging"?5:3;const diffCeil=quizDifficulty==="easy"?4:quizDifficulty==="challenging"?10:7;const difficulty=Math.min(diffCeil,Math.max(diffBase,Math.round(diffBase+(diffCeil-diffBase)*(questionNumber/quizTotal))));'
);

// ═══════════════════════════════════════════════════
// 4. REPLACE QUIZ PICKER UI
//    Add difficulty selector alongside the existing length picker
// ═══════════════════════════════════════════════════

const OLD_PICKER = `showQuizPicker&&!quizQ&&!loading&&<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"60px 20px",gap:24}}><div style={{fontSize:18,fontWeight:400,fontFamily:"'DM Serif Display',serif",color:C.text}}>How many questions?</div><div style={{display:"flex",gap:14}}>{[10,15,25].map(n=><button key={n} onClick={()=>startQuiz(n)} style={{padding:"18px 32px",borderRadius:10,border:"1px solid "+(n===15?C.green:C.border),background:n===15?C.greenDim:"transparent",color:n===15?C.green:C.textMuted,fontSize:22,fontWeight:600,fontFamily:"'JetBrains Mono',monospace",cursor:"pointer",transition:"all 0.2s",minWidth:85}} onMouseEnter={e=>{e.currentTarget.style.borderColor=C.green;e.currentTarget.style.color=C.green;e.currentTarget.style.background=C.greenDim;}} onMouseLeave={e=>{if(n!==15){e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.textMuted;e.currentTarget.style.background="transparent";}}}>{n}</button>)}</div><div style={{fontSize:12,color:C.textDim}}>Questions scale in difficulty as you progress</div></div>}`;

const NEW_PICKER = `showQuizPicker&&!quizQ&&!loading&&<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"48px 20px",gap:32}}><div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:16}}><div style={{fontSize:18,fontWeight:400,fontFamily:"'DM Serif Display',serif",color:C.text}}>How many questions?</div><div style={{display:"flex",gap:14}}>{[10,15,25].map(n=>{const isDef=n===15;return <button key={n} onClick={()=>setQuizTotal(n)} style={{padding:"16px 28px",borderRadius:10,border:"1px solid "+(quizTotal===n?C.green:C.border),background:quizTotal===n?C.greenDim:"transparent",color:quizTotal===n?C.green:C.textMuted,fontSize:22,fontWeight:600,fontFamily:"'JetBrains Mono',monospace",cursor:"pointer",transition:"all 0.2s",minWidth:80}} onMouseEnter={e=>{e.currentTarget.style.borderColor=C.green;e.currentTarget.style.color=C.green;e.currentTarget.style.background=C.greenDim;}} onMouseLeave={e=>{if(quizTotal!==n){e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.textMuted;e.currentTarget.style.background="transparent";}}}>{n}</button>})}</div></div><div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:16}}><div style={{fontSize:18,fontWeight:400,fontFamily:"'DM Serif Display',serif",color:C.text}}>Difficulty</div><div style={{display:"flex",gap:10}}>{[{key:"easy",label:"Easy",desc:"Foundations"},{key:"medium",label:"Medium",desc:"Exam standard"},{key:"challenging",label:"Challenging",desc:"Stretch & A*"}].map(d=><button key={d.key} onClick={()=>setQuizDifficulty(d.key)} style={{padding:"14px 22px",borderRadius:10,border:"1px solid "+(quizDifficulty===d.key?C.green:C.border),background:quizDifficulty===d.key?C.greenDim:"transparent",cursor:"pointer",transition:"all 0.2s",minWidth:110,textAlign:"center"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=C.green;e.currentTarget.style.background=C.greenDim;}} onMouseLeave={e=>{if(quizDifficulty!==d.key){e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background="transparent";}}}><div style={{fontSize:14,fontWeight:600,color:quizDifficulty===d.key?C.green:C.textMuted,marginBottom:3,transition:"color 0.2s"}}>{d.label}</div><div style={{fontSize:10,color:C.textDim}}>{d.desc}</div></button>)}</div></div><button onClick={()=>startQuiz(quizTotal)} style={{padding:"12px 40px",borderRadius:8,border:"none",background:C.green,color:C.bg,fontSize:15,fontWeight:600,cursor:"pointer",transition:"all 0.2s",letterSpacing:"0.03em"}} onMouseEnter={e=>{e.currentTarget.style.background=C.greenLight;}} onMouseLeave={e=>{e.currentTarget.style.background=C.green;}}>Start Quiz</button></div>}`;

patch('Replace quiz picker UI with difficulty selector', OLD_PICKER, NEW_PICKER);

// ═══════════════════════════════════════════════════
// 5. ENRICH MATHS — SEQUENCES & SERIES
// ═══════════════════════════════════════════════════

const OLD_SEQUENCES = `SEQUENCES & SERIES
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
For (a + bx)^n: factor out a^n first, then expand (1 + bx/a)^n, valid when |bx/a| < 1.`;

const NEW_SEQUENCES = `SEQUENCES & SERIES

ARITHMETIC SEQUENCES
Definition: sequence with constant difference d between consecutive terms.
nth term: u_n = a + (n-1)d, where a = first term, d = common difference.
Sum of n terms: S_n = n/2 x (2a + (n-1)d) = n/2 x (first + last).
Arithmetic mean of a and b = (a+b)/2.
Finding a and d: set up simultaneous equations from two known terms.
Example: u_3 = 11, u_7 = 23 gives a + 2d = 11 and a + 6d = 23, so d = 3, a = 5.
Proving arithmetic: show u_(n+1) - u_n = constant for all n.

GEOMETRIC SEQUENCES
Definition: sequence with constant ratio r between consecutive terms.
nth term: u_n = ar^(n-1), where a = first term, r = common ratio.
Sum of n terms: S_n = a(1 - r^n)/(1 - r) [r not equal to 1].
Sum to infinity: S_inf = a/(1 - r), convergent ONLY when |r| < 1.
Geometric mean of a and b = sqrt(ab).
Finding a and r: u_5/u_2 = ar^4/(ar) = r^3, so r = cube root of the ratio.
Common mistakes: forgetting |r| < 1 condition for convergence. Mixing up u_n = ar^(n-1) vs ar^n.
Example: a = 8, r = 1/2. S_inf = 8/(1-0.5) = 16. Partial sums approach 16 but never reach it.

SIGMA NOTATION
Sum from r=1 to n of u_r means u_1 + u_2 + ... + u_n.
Properties: Sum of (au_r + bv_r) = a x Sum(u_r) + b x Sum(v_r). Can factor constants out.
Sum of first n natural numbers: Sum r = n(n+1)/2.
Can shift indices: Sum from r=1 to n = Sum from r=0 to n-1 with appropriate adjustment.

RECURRENCE RELATIONS
u_(n+1) = f(u_n) defines each term from the previous one. Need u_1 (or u_0) to generate terms.
Increasing: u_(n+1) > u_n for all n. Decreasing: u_(n+1) < u_n for all n.
Periodic: sequence repeats. Period k means u_(n+k) = u_n.
Convergent: terms approach a limit L. At the limit, L = f(L) — solve this equation.
Example: u_(n+1) = (u_n + 3)/2, u_1 = 1. Limit: L = (L+3)/2, so 2L = L + 3, L = 3.

BINOMIAL EXPANSION
(a + b)^n = Sum of nCr a^(n-r) b^r for r = 0 to n. nCr = n!/(r!(n-r)!). Pascal triangle gives coefficients.
For (1 + x)^n when n is a positive integer: (1+x)^n = 1 + nx + n(n-1)x^2/2! + n(n-1)(n-2)x^3/3! + ... (terminates after n+1 terms).
For n NOT a positive integer (fractional or negative): expansion is INFINITE, valid only when |x| < 1.
For (a + bx)^n: factor out a^n first: a^n(1 + bx/a)^n, then expand (1 + bx/a)^n, valid when |bx/a| < 1.
For (2 + 3x)^(-1): = 2^(-1)(1 + 3x/2)^(-1) = (1/2)(1 - 3x/2 + (3x/2)^2 - ...), valid when |3x/2| < 1, i.e. |x| < 2/3.
Approximation: substitute small x into expansion for numerical estimates. State range of validity.
Partial fractions + binomial: decompose first, expand each fraction separately.`;

patch('Enrich maths Sequences & Series', OLD_SEQUENCES, NEW_SEQUENCES);

// ═══════════════════════════════════════════════════
// 6. ENRICH MATHS — FUNCTIONS
// ═══════════════════════════════════════════════════

const OLD_FUNCTIONS = `Functions: f(x) notation. Domain = set of inputs, range = set of outputs.
Composite: fg(x) = f(g(x)). Apply inner function first. Inverse: f-1(x) - reflect in y = x.
To find inverse: write y = f(x), swap x and y, solve for y. Domain of f-1 = range of f.
Modulus: |f(x)| - reflects negative parts in x-axis. f(|x|) - reflects right half in y-axis.`;

const NEW_FUNCTIONS = `FUNCTIONS (detailed)
Definition: a function maps each input to exactly one output. f: x -> f(x). Written f(x) or f: x |-> 2x + 1.
Domain: the set of all valid inputs (x-values). Range: the set of all outputs (y-values).
Notation: f(x) means "f of x". f(3) means substitute x = 3.

Types of function:
One-to-one: each output comes from exactly one input. Has an inverse. Passes horizontal line test.
Many-to-one: different inputs can give same output (e.g. x^2). Does NOT have a full inverse unless domain is restricted.

COMPOSITE FUNCTIONS
fg(x) = f(g(x)): apply g first, then f to the result. Order matters: fg is NOT the same as gf in general.
Domain of fg: x must be in domain of g, AND g(x) must be in domain of f.
Example: f(x) = x^2, g(x) = x + 3. fg(x) = f(x+3) = (x+3)^2. gf(x) = g(x^2) = x^2 + 3.
To solve fg(x) = k: substitute the composite expression and solve.

INVERSE FUNCTIONS
f^(-1)(x) undoes f: f^(-1)(f(x)) = x and f(f^(-1)(x)) = x.
Method to find: (1) write y = f(x), (2) swap x and y, (3) rearrange for y = f^(-1)(x).
Domain of f^(-1) = range of f. Range of f^(-1) = domain of f.
Graph: y = f^(-1)(x) is the reflection of y = f(x) in the line y = x.
Self-inverse: f^(-1) = f. Example: f(x) = 1/x is self-inverse because swapping gives x = 1/y, so y = 1/x.
Only one-to-one functions have inverses. For many-to-one functions, restrict the domain first.

MODULUS FUNCTION
|x| = x if x >= 0, -x if x < 0. Always non-negative.
y = |f(x)|: take the graph of f(x), reflect any parts below the x-axis above it.
y = f(|x|): take the right half of y = f(x) (x >= 0) and reflect it in the y-axis. Left half mirrors right.
Solving |f(x)| = k: solve f(x) = k and f(x) = -k. Check solutions are valid.
Solving |f(x)| = |g(x)|: square both sides to get f(x)^2 = g(x)^2, or solve f(x) = g(x) and f(x) = -g(x).
Inequalities with modulus: |f(x)| < k means -k < f(x) < k. |f(x)| > k means f(x) > k or f(x) < -k.`;

patch('Enrich maths Functions', OLD_FUNCTIONS, NEW_FUNCTIONS);

// ═══════════════════════════════════════════════════
// WRITE OUTPUT
// ═══════════════════════════════════════════════════

fs.writeFileSync(FILE, src);
console.log('\n✅ All patches applied successfully. Run npm run dev to test.');
