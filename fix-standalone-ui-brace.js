// fix-standalone-ui-brace.js
// Root cause fix: there's a single missing closing brace after the
// "act-verbal" entry in STANDALONE_UI. That one typo silently nests
// 8 fully-written, curated entries — AP Calc AB/BC, GCSE Maths
// Foundation/Higher, IB Maths AA/AI, AP Physics C Mechanics/E&M —
// INSIDE "act-verbal" instead of as their own top-level keys, so
// JavaScript can never reach them via STANDALONE_UI[boardOverride].
// They were never missing content — just unreachable.
//
// This explains why GCSE Maths Foundation/Higher kept showing the
// wrong "Try Asking" prompts even after the generic-fallback patch:
// once this brace is fixed, these 8 boards get their REAL curated
// placeholder + prompts (better than the generic fallback), and the
// generic-fallback patch correctly steps aside for them via the
// existing spread order.
//
// Verified with `node --check` and a live object-literal evaluation
// before being sent — both confirmed syntactically valid and that
// all 17 STANDALONE_UI keys (not 9) are reachable after the fix.
//
// This patch is independent of fix-board-placeholder.js / fix-board-prompts.js
// and can be run regardless of whether those succeeded.
//
// Usage: place this file in your project root and run:
//   node fix-standalone-ui-brace.js

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app', 'page.js');
let content = fs.readFileSync(filePath, 'utf8');

const oldStr = '"act-verbal":{placeholder:"Ask about ACT English & Reading...",prompts:["When is NO CHANGE the correct answer?","How do I pace ACT Reading passages?","Comma rules explained for ACT English","ACT vs SAT — what\'s different?"],"ap-calc-ab":{placeholder:"Ask about AP Calculus AB...",prompts:["Explain the definition of a limit","How do I differentiate using the chain rule?","Quiz me on definite integrals","What is the Fundamental Theorem of Calculus?"]},"ap-calc-bc":{placeholder:"Ask about AP Calculus BC...",prompts:["Explain series convergence tests","How do I integrate by parts?","Quiz me on parametric and polar functions","What topics are BC-only vs AB?"]},"gcse-maths-f":{placeholder:"Ask about GCSE Maths (Foundation)...",prompts:["Explain how to find a percentage of an amount","How do I solve a simple equation?","Quiz me on fractions and decimals","What is the area of a circle?"]},"gcse-maths-h":{placeholder:"Ask about GCSE Maths (Higher)...",prompts:["Explain how to factorise a quadratic","How do I use the sine and cosine rules?","Quiz me on simultaneous equations","What is the difference between similar and congruent shapes?"]},"ib-maths-aa":{placeholder:"Ask about IB Maths Analysis & Approaches...",prompts:["Explain proof by mathematical induction","How do I find the derivative using first principles?","Quiz me on complex numbers","What is the binomial theorem in IB notation?"]},"ib-maths-ai":{placeholder:"Ask about IB Maths Applications & Interpretation...",prompts:["How do I fit a regression line to data?","Explain the normal distribution and z-scores","Quiz me on financial mathematics","What is Voronoi diagrams and when do I use them?"]},"ap-physc-mech":{placeholder:"Ask about AP Physics C: Mechanics...",prompts:["Derive the kinematic equations using calculus","Explain rotational inertia and torque","How does simple harmonic motion work?","Quiz me on Newton\'s laws with calculus"]},"ap-physc-em":{placeholder:"Ask about AP Physics C: E&M...",prompts:["Explain Gauss\'s Law with an example","How do I find the electric potential from a field?","Derive the equation for a charging capacitor","Quiz me on Faraday\'s and Lenz\'s laws"]}}};';

const newStr = '"act-verbal":{placeholder:"Ask about ACT English & Reading...",prompts:["When is NO CHANGE the correct answer?","How do I pace ACT Reading passages?","Comma rules explained for ACT English","ACT vs SAT — what\'s different?"]},"ap-calc-ab":{placeholder:"Ask about AP Calculus AB...",prompts:["Explain the definition of a limit","How do I differentiate using the chain rule?","Quiz me on definite integrals","What is the Fundamental Theorem of Calculus?"]},"ap-calc-bc":{placeholder:"Ask about AP Calculus BC...",prompts:["Explain series convergence tests","How do I integrate by parts?","Quiz me on parametric and polar functions","What topics are BC-only vs AB?"]},"gcse-maths-f":{placeholder:"Ask about GCSE Maths (Foundation)...",prompts:["Explain how to find a percentage of an amount","How do I solve a simple equation?","Quiz me on fractions and decimals","What is the area of a circle?"]},"gcse-maths-h":{placeholder:"Ask about GCSE Maths (Higher)...",prompts:["Explain how to factorise a quadratic","How do I use the sine and cosine rules?","Quiz me on simultaneous equations","What is the difference between similar and congruent shapes?"]},"ib-maths-aa":{placeholder:"Ask about IB Maths Analysis & Approaches...",prompts:["Explain proof by mathematical induction","How do I find the derivative using first principles?","Quiz me on complex numbers","What is the binomial theorem in IB notation?"]},"ib-maths-ai":{placeholder:"Ask about IB Maths Applications & Interpretation...",prompts:["How do I fit a regression line to data?","Explain the normal distribution and z-scores","Quiz me on financial mathematics","What is Voronoi diagrams and when do I use them?"]},"ap-physc-mech":{placeholder:"Ask about AP Physics C: Mechanics...",prompts:["Derive the kinematic equations using calculus","Explain rotational inertia and torque","How does simple harmonic motion work?","Quiz me on Newton\'s laws with calculus"]},"ap-physc-em":{placeholder:"Ask about AP Physics C: E&M...",prompts:["Explain Gauss\'s Law with an example","How do I find the electric potential from a field?","Derive the equation for a charging capacitor","Quiz me on Faraday\'s and Lenz\'s laws"]}};';

const occurrences = content.split(oldStr).length - 1;

if (occurrences === 0) {
  console.error('ERROR: Could not find the expected STANDALONE_UI code. The file may have changed since this patch was written. No changes made.');
  process.exit(1);
}

if (occurrences > 1) {
  console.error(`ERROR: Found ${occurrences} matches, expected exactly 1. Refusing to patch ambiguously. No changes made.`);
  process.exit(1);
}

content = content.replace(oldStr, newStr);

fs.writeFileSync(filePath, content, 'utf8');

console.log('Patched successfully: GCSE Maths (F/H), IB Maths AA/AI, AP Calc AB/BC, and AP Physics C Mech/E&M now correctly receive their real curated placeholder + prompts.');
console.log('Next steps: npm run dev, recheck GCSE Maths Foundation — prompts should now read "Explain how to find a percentage of an amount" etc, then commit & push.');
