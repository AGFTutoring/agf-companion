const fs = require('fs');
const FILE = 'app/page.js';
let src = fs.readFileSync(FILE, 'utf8');
const old = 'const showQuizOptions=()=>{if(loading||!currentUnit)return;if(!isSubscribed&&quizzesUsed>=FREE_QUIZ_LIMIT){setShowPaywall(true);setMode("quiz");return;}setShowQuizPicker(true);setMode("quiz");};';
const fixed = 'const showQuizOptions=()=>{if(loading||!currentUnit)return;if(!isSubscribed&&quizzesUsed>=FREE_QUIZ_LIMIT){resetQuiz();setShowPaywall(true);setMode("quiz");return;}setShowQuizPicker(true);setMode("quiz");};';
if (src.includes(old)) {
  src = src.replace(old, fixed);
  fs.writeFileSync(FILE, src, 'utf8');
  console.log('OK: Fixed');
} else {
  console.log('FAIL: marker not found');
}