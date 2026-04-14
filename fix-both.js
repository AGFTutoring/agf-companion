const fs = require('fs');
const FILE = 'app/page.js';
let src = fs.readFileSync(FILE, 'utf8');
let count = 0;

// Fix 1: Add setShowPaywall(false) to resetQuiz
const r1old = 'setQuizDone(false);setShowQuizPicker(false);setHintText';
const r1new = 'setQuizDone(false);setShowQuizPicker(false);setShowPaywall(false);setHintText';
if (src.includes(r1old) && !src.includes('setShowPaywall(false)')) {
  src = src.replace(r1old, r1new);
  count++;
  console.log('OK: Fix 1 - resetQuiz now clears paywall');
} else if (src.includes('setShowPaywall(false)')) {
  console.log('SKIP: Fix 1 already applied');
} else {
  console.log('FAIL: Fix 1 marker not found');
}

// Fix 2: resetQuiz before showing paywall in showQuizOptions
const r2old = 'quizzesUsed>=FREE_QUIZ_LIMIT){setShowPaywall(true)';
const r2new = 'quizzesUsed>=FREE_QUIZ_LIMIT){resetQuiz();setShowPaywall(true)';
if (src.includes(r2old) && !src.includes('resetQuiz();setShowPaywall(true)')) {
  src = src.replace(r2old, r2new);
  count++;
  console.log('OK: Fix 2 - resetQuiz before paywall');
} else if (src.includes('resetQuiz();setShowPaywall(true)')) {
  console.log('SKIP: Fix 2 already applied');
} else {
  console.log('FAIL: Fix 2 marker not found');
}

if (count > 0) {
  fs.writeFileSync(FILE, src, 'utf8');
  console.log('Done: ' + count + ' fixes applied');
} else {
  console.log('No changes needed');
}