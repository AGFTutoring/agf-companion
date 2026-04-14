const fs = require('fs');
const FILE = 'app/page.js';
let src = fs.readFileSync(FILE, 'utf8');

const old = 'const resetQuiz=()=>{setQuizQ(null);setQuizNum(0);setQuizSelected(null);setQuizFeedback(null);setQuizScore(0);setQuizMaxScore(0);setQuizHistory([]);setQuizDone(false);setShowQuizPicker(false);setHintText(null);setHintLoading(false); setUsedPPIndices(new Set());setQuizDifficulty("medium");};';
const fixed = 'const resetQuiz=()=>{setQuizQ(null);setQuizNum(0);setQuizSelected(null);setQuizFeedback(null);setQuizScore(0);setQuizMaxScore(0);setQuizHistory([]);setQuizDone(false);setShowQuizPicker(false);setShowPaywall(false);setHintText(null);setHintLoading(false); setUsedPPIndices(new Set());setQuizDifficulty("medium");};';

if (src.includes(old)) {
  src = src.replace(old, fixed);
  fs.writeFileSync(FILE, src, 'utf8');
  console.log('OK: Added setShowPaywall(false) to resetQuiz');
} else {
  console.log('FAIL: marker not found');
}
