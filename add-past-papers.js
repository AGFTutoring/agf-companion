#!/usr/bin/env node
/**
 * add-past-papers.js
 * 
 * Integrates real Edexcel past-paper MCQs into the AGF Study Companion quiz system.
 * 
 * What it does:
 * 1. Adds a PAST_PAPERS object containing 43 Physics Unit 1 (WPH11) questions from June 2010–2016
 * 2. Modifies fetchQuizQuestion to alternate between past-paper (instant) and AI-generated questions
 * 3. Adds a "June 2012 Q3" source badge on past-paper questions
 * 
 * Run: node add-past-papers.js
 * Then: npm run dev → test → git add . && git commit -m "Add past-paper question bank" && git push
 */

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, 'app', 'page.js');

if (!fs.existsSync(FILE)) {
  console.error('ERROR: app/page.js not found. Run this from the agf-companion root directory.');
  process.exit(1);
}

let src = fs.readFileSync(FILE, 'utf8');
const original = src;
let changes = 0;

function replaceBetween(startMarker, endMarker, newContent, label) {
  const startIdx = src.indexOf(startMarker);
  if (startIdx === -1) {
    console.warn(`  SKIP: "${label}" — start marker not found: ${startMarker.substring(0, 60)}...`);
    return false;
  }
  const endIdx = src.indexOf(endMarker, startIdx + startMarker.length);
  if (endIdx === -1) {
    console.warn(`  SKIP: "${label}" — end marker not found: ${endMarker.substring(0, 60)}...`);
    return false;
  }
  src = src.substring(0, startIdx) + newContent + src.substring(endIdx + endMarker.length);
  console.log(`  ✓ ${label}`);
  changes++;
  return true;
}

function insertAfter(marker, newContent, label) {
  const idx = src.indexOf(marker);
  if (idx === -1) {
    console.warn(`  SKIP: "${label}" — marker not found: ${marker.substring(0, 60)}...`);
    return false;
  }
  src = src.substring(0, idx + marker.length) + newContent + src.substring(idx + marker.length);
  console.log(`  ✓ ${label}`);
  changes++;
  return true;
}

function replaceFirst(oldStr, newStr, label) {
  const idx = src.indexOf(oldStr);
  if (idx === -1) {
    console.warn(`  SKIP: "${label}" — string not found: ${oldStr.substring(0, 80)}...`);
    return false;
  }
  src = src.substring(0, idx) + newStr + src.substring(idx + oldStr.length);
  console.log(`  ✓ ${label}`);
  changes++;
  return true;
}

console.log('\n=== AGF Study Companion: Past-Paper Integration ===\n');

// ─────────────────────────────────────────────
// STEP 1: Add the PAST_PAPERS object
// Insert it right before the CATALOG definition
// ─────────────────────────────────────────────
console.log('Step 1: Adding PAST_PAPERS question bank...');

const PAST_PAPERS_CODE = `

/* ═══════════════════════════════════════════════════
   PAST-PAPER QUESTION BANK
   Real Edexcel exam questions, extracted from official papers.
   Keyed by unit ID matching UNITS keys.
   ═══════════════════════════════════════════════════ */

const PAST_PAPERS = {
  phys1: ${fs.readFileSync(path.join(__dirname, 'wph11_past_paper_questions.json'), 'utf8').trim()},
};

`;

// Find the CATALOG definition to insert before it
const catalogMarker = 'const CATALOG';
if (src.indexOf(catalogMarker) !== -1) {
  insertAfter('\n' + catalogMarker, '', ''); // just to test
  // Actually insert before CATALOG
  const catIdx = src.indexOf(catalogMarker);
  src = src.substring(0, catIdx) + PAST_PAPERS_CODE + src.substring(catIdx);
  console.log('  ✓ PAST_PAPERS object added (43 Physics Unit 1 questions)');
  changes++;
} else {
  // Fallback: try inserting before SUBJECTS if old format
  const subjMarker = 'const SUBJECTS';
  if (src.indexOf(subjMarker) !== -1) {
    const subjIdx = src.indexOf(subjMarker);
    src = src.substring(0, subjIdx) + PAST_PAPERS_CODE + src.substring(subjIdx);
    console.log('  ✓ PAST_PAPERS object added before SUBJECTS (43 Physics Unit 1 questions)');
    changes++;
  } else {
    console.error('  ERROR: Could not find CATALOG or SUBJECTS to insert PAST_PAPERS before');
  }
}


// ─────────────────────────────────────────────
// STEP 2: Modify fetchQuizQuestion to use past papers
// Replace the function to check for available past papers first
// ─────────────────────────────────────────────
console.log('\nStep 2: Modifying fetchQuizQuestion for hybrid past-paper / AI generation...');

// We need to find the fetchQuizQuestion function and wrap its logic.
// The approach: add a helper function that picks a past-paper question,
// and modify fetchQuizQuestion to use it ~50% of the time.

// First, add the helper function for picking past-paper questions
// Find a good insertion point - right before fetchQuizQuestion

const fetchQStart = 'const fetchQuizQuestion';
const fetchIdx = src.indexOf(fetchQStart);
if (fetchIdx !== -1) {
  const helperCode = `
  // Pick a random past-paper question, avoiding previously used topics
  const pickPastPaper = (unitId, usedTopics, usedPPIndices) => {
    const bank = PAST_PAPERS[unitId];
    if (!bank || bank.length === 0) return null;
    // Filter out already-used questions and try to avoid repeat topics
    let candidates = bank.filter((q, i) => !usedPPIndices.has(i));
    if (candidates.length === 0) return null;
    // Prefer questions on topics not yet covered
    const freshTopic = candidates.filter(q => !usedTopics.includes(q.topic));
    if (freshTopic.length > 0) candidates = freshTopic;
    const pick = candidates[Math.floor(Math.random() * candidates.length)];
    const pickIdx = bank.indexOf(pick);
    return { ...pick, _ppIndex: pickIdx };
  };

  // Track which past-paper questions have been used in this quiz
  const [usedPPIndices, setUsedPPIndices] = useState(new Set());

  `;

  src = src.substring(0, fetchIdx) + helperCode + src.substring(fetchIdx);
  console.log('  ✓ pickPastPaper helper function added');
  changes++;
} else {
  console.warn('  SKIP: fetchQuizQuestion not found');
}

// Now modify the fetchQuizQuestion function body.
// We need to find the part where it calls the API and add a branch that
// serves past-paper questions instead for ~50% of questions.

// The key line is: setLoading(true);
// Right after it sets state, we insert the past-paper check.

// Find the pattern inside fetchQuizQuestion: after setHintText(null) and before the API call
const apiCallMarker = 'const difficulty = Math.min';
const apiCallIdx = src.indexOf(apiCallMarker);
if (apiCallIdx !== -1) {
  // Find the line with "const difficulty" and the "try {" after it
  // We want to insert our past-paper branch right before the try block
  const tryIdx = src.indexOf('try {', apiCallIdx);
  if (tryIdx !== -1) {
    // Also need to find the unit/subject ID. In the current code it uses currentSubject or currentUnit.
    // Check which variable name is used
    const usesCurrentUnit = src.indexOf('currentUnit') !== -1;
    const unitIdExpr = usesCurrentUnit ? 'activeUnit' : 'subject';
    
    const pastPaperBranch = `
    // 50% chance to serve a past-paper question (if available for this unit)
    const ppUnitId = ${usesCurrentUnit ? 'activeUnit' : 'subject'};
    if (questionNumber % 2 === 1 && PAST_PAPERS[ppUnitId]) {
      const prevTopics = quizHistory.map(h => h.topic).filter(Boolean);
      const pp = pickPastPaper(ppUnitId, prevTopics, usedPPIndices);
      if (pp) {
        setUsedPPIndices(prev => new Set([...prev, pp._ppIndex]));
        const { _ppIndex, ...cleanQ } = pp;
        setQuizQ(cleanQ);
        setLoading(false);
        return;
      }
    }
    `;
    
    src = src.substring(0, tryIdx) + pastPaperBranch + src.substring(tryIdx);
    console.log('  ✓ Past-paper branch added to fetchQuizQuestion');
    changes++;
  }
} else {
  console.warn('  SKIP: Could not find difficulty calculation in fetchQuizQuestion');
}

// Also reset usedPPIndices when quiz resets
const resetQuizMarker = 'const resetQuiz';
const resetIdx = src.indexOf(resetQuizMarker);
if (resetIdx !== -1) {
  // Find setHintText(null) inside resetQuiz and add setUsedPPIndices after it
  const hintResetInReset = src.indexOf('setHintLoading(false)', resetIdx);
  if (hintResetInReset !== -1) {
    const semiIdx = src.indexOf(';', hintResetInReset);
    src = src.substring(0, semiIdx + 1) + ' setUsedPPIndices(new Set());' + src.substring(semiIdx + 1);
    console.log('  ✓ usedPPIndices reset added to resetQuiz');
    changes++;
  }
}


// ─────────────────────────────────────────────
// STEP 3: Add source badge to quiz UI
// Show "June 2012 Q3" for past-paper questions
// ─────────────────────────────────────────────
console.log('\nStep 3: Adding source badge to quiz UI...');

// Find the question number display in the quiz screen
// Looking for: {quizNum}. followed by the question text
// The pattern is: <span style={{ fontWeight: 600 }}>{quizNum}.</span>  {quizQ.question}

const questionDisplay = '{quizNum}.</span>';
const qdIdx = src.indexOf(questionDisplay);
if (qdIdx !== -1) {
  // Find the closing of this line — the question text display
  // After the question number, add a source badge if it's a past-paper question
  const afterQNum = qdIdx + questionDisplay.length;
  // Find the next occurrence of quizQ.question after this point
  const qTextIdx = src.indexOf('{quizQ.question}', afterQNum);
  if (qTextIdx !== -1) {
    // Insert source badge right before the question text
    const sourceBadge = `{quizQ.source && <span style={{display:"inline-block",marginLeft:8,padding:"2px 8px",borderRadius:4,fontSize:10,fontWeight:500,letterSpacing:"0.05em",background:"rgba(77,148,96,0.12)",border:"1px solid rgba(77,148,96,0.25)",color:"#4d9460"}}>{quizQ.source}{quizQ.number ? " Q"+quizQ.number : ""}</span>} `;
    src = src.substring(0, qTextIdx) + sourceBadge + src.substring(qTextIdx);
    console.log('  ✓ Source badge added (shows "June 2012 Q3" for past-paper questions)');
    changes++;
  }
} else {
  console.warn('  SKIP: Could not find question number display pattern');
}


// ─────────────────────────────────────────────
// SAVE
// ─────────────────────────────────────────────
console.log(`\n=== Summary ===`);
console.log(`Changes made: ${changes}`);

if (changes > 0 && src !== original) {
  fs.writeFileSync(FILE, src, 'utf8');
  console.log(`\n✅ app/page.js updated successfully.`);
  console.log(`\nNext steps:`);
  console.log(`  1. npm run dev   → test locally`);
  console.log(`  2. Open quiz for Physics Unit 1`);
  console.log(`  3. Questions 1, 3, 5, 7, 9 should be instant (past-paper)`);
  console.log(`  4. Questions 2, 4, 6, 8, 10 should be AI-generated (slight delay)`);
  console.log(`  5. Past-paper questions show green "June 2012 Q3" badge`);
  console.log(`  6. git add . && git commit -m "Add past-paper question bank for Physics Unit 1" && git push`);
} else {
  console.log(`\n⚠️  No changes were made. Check the warnings above.`);
}
