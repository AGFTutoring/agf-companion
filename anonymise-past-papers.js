#!/usr/bin/env node
/**
 * anonymise-past-papers.js
 * 
 * Removes source attribution from past-paper questions:
 * 1. Strips "source" and "number" fields from the PAST_PAPERS JSON
 * 2. Removes the source badge from the quiz UI
 */

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, 'app', 'page.js');
let src = fs.readFileSync(FILE, 'utf8');
let changes = 0;

console.log('\n=== Anonymise Past-Paper Questions ===\n');

// Step 1: Strip "source" and "number" fields from PAST_PAPERS JSON
// These appear as: "source":"June 2010","number":1, in the minified JSON
// Remove all occurrences of "source":"...", and "number":N,

const beforeLen = src.length;

// Remove "source":"anything", patterns (including the trailing comma)
src = src.replace(/"source":"[^"]*",/g, '');
// Remove "number":N, patterns
src = src.replace(/"number":\d+,/g, '');

const removedChars = beforeLen - src.length;
if (removedChars > 0) {
  console.log(`  ✓ Stripped source and number fields (removed ${removedChars} chars from ${Math.round(removedChars / 30)} questions)`);
  changes++;
} else {
  console.log('  SKIP: No source/number fields found (already anonymised?)');
}

// Step 2: Remove the source badge from quiz UI
// The badge code is: {quizQ.source && <span style={{...}}>{quizQ.source}{quizQ.number ? " Q"+quizQ.number : ""}</span>}
const badgePattern = '{quizQ.source &&';
const badgeIdx = src.indexOf(badgePattern);
if (badgeIdx !== -1) {
  // Find the closing of this JSX expression — it ends with </span>}
  const badgeEnd = src.indexOf('</span>}', badgeIdx);
  if (badgeEnd !== -1) {
    const fullEnd = badgeEnd + '</span>}'.length;
    // Also remove any trailing space
    const endWithSpace = src[fullEnd] === ' ' ? fullEnd + 1 : fullEnd;
    src = src.substring(0, badgeIdx) + src.substring(endWithSpace);
    console.log('  ✓ Source badge removed from quiz UI');
    changes++;
  }
} else {
  console.log('  SKIP: Source badge not found in UI');
}

// Save
if (changes > 0) {
  fs.writeFileSync(FILE, src, 'utf8');
  console.log(`\n✅ Done. ${changes} changes made.`);
  console.log('   Past-paper questions are now indistinguishable from AI-generated ones.');
  console.log('\nNext: npm run dev → test → git add . && git commit -m "Anonymise past-paper sources" && git push');
} else {
  console.log('\n⚠️  No changes made.');
}
