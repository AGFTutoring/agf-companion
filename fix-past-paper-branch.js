#!/usr/bin/env node
/**
 * fix-past-paper-branch.js
 * 
 * Injects the past-paper branching logic into fetchQuizQuestion.
 * The previous script skipped this because of minified code formatting.
 */

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, 'app', 'page.js');
let src = fs.readFileSync(FILE, 'utf8');
const original = src;

console.log('\n=== Fix: Inject past-paper branch into fetchQuizQuestion ===\n');

// The minified fetchQuizQuestion starts with:
// setHintText(null);const difficulty=Math.min(10,...
// We need to insert the past-paper check right after setHintText(null); and before const difficulty=

const marker = 'setHintText(null);const difficulty=Math.min';
const idx = src.indexOf(marker);

if (idx === -1) {
  console.error('ERROR: Could not find the marker in fetchQuizQuestion.');
  console.log('Searching for alternatives...');
  
  // Try alternate patterns
  const alt1 = 'setHintText(null);const difficulty';
  const alt2 = 'setQuizFeedback(false);setHintText(null);';
  console.log('Alt1:', src.indexOf(alt1) !== -1 ? 'FOUND' : 'not found');
  console.log('Alt2:', src.indexOf(alt2) !== -1 ? 'FOUND' : 'not found');
  process.exit(1);
}

// Insert the past-paper branch right after setHintText(null);
const insertPoint = idx + 'setHintText(null);'.length;

const branchCode = `const ppUnitId=activeUnit;if(questionNumber%2===1&&PAST_PAPERS[ppUnitId]){const prevTopics=quizHistory.map(h=>h.topic).filter(Boolean);const pp=pickPastPaper(ppUnitId,prevTopics,usedPPIndices);if(pp){setUsedPPIndices(prev=>new Set([...prev,pp._ppIndex]));const{_ppIndex,...cleanQ}=pp;setQuizQ(cleanQ);setLoading(false);return;}}`;

src = src.substring(0, insertPoint) + branchCode + src.substring(insertPoint);

console.log('✓ Past-paper branch injected into fetchQuizQuestion');
console.log('  → Odd questions (1,3,5,7,9) will try past-paper bank first');
console.log('  → Even questions (2,4,6,8,10) will always use AI generation');

fs.writeFileSync(FILE, src, 'utf8');
console.log('\n✅ app/page.js updated.');
console.log('\nNext: npm run dev → test Physics Unit 1 quiz → git add . && git commit -m "Wire past-paper questions into quiz" && git push');
