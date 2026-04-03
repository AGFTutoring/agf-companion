/**
 * AGF Companion — Quiz UI Fix Part 2
 * Fixes the remaining hardcoded 10s and adds quiz picker + segmented progress
 * 
 * cd C:\Users\alast\Downloads\agf-companion
 * node patch-quiz-fix.js
 */

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, 'app', 'page.js');
let code = fs.readFileSync(FILE, 'utf8');
let changes = 0;

// ═══════════════════════════════════════════════════════════════
// FIX 1: Progress bar still uses (quizNum/10)*100%
// ═══════════════════════════════════════════════════════════════

const oldProg = '(quizNum/10)*100}%';
if (code.includes(oldProg)) {
  code = code.replace(oldProg, '(quizNum/quizTotal)*100}%');
  changes++;
  console.log('✅ Fix 1: Progress bar now uses quizTotal');
}

// ═══════════════════════════════════════════════════════════════
// FIX 2: "See Results" button still uses quizNum>=10
// ═══════════════════════════════════════════════════════════════

// There may be multiple — replace all
const oldSeeResults = 'quizNum>=10?"See Results"';
while (code.includes(oldSeeResults)) {
  code = code.replace(oldSeeResults, 'quizNum>=quizTotal?"See Results"');
  changes++;
}
if (changes > 0) console.log('✅ Fix 2: See Results button uses quizTotal');

// Also fix the nextQuestion limit if still hardcoded
const oldNextLimit = 'if(quizNum>=10)';
if (code.includes(oldNextLimit)) {
  code = code.replace(oldNextLimit, 'if(quizNum>=quizTotal)');
  changes++;
  console.log('✅ Fix 2b: nextQuestion limit uses quizTotal');
}

// ═══════════════════════════════════════════════════════════════
// FIX 3: Replace solid progress bar with segmented Gemini-style
// ═══════════════════════════════════════════════════════════════

// The progress bar div: height:4,background:C.bgLight with a child div inside
const progBarOuter = 'height:4,background:C.bgLight}}><div style={{height:"100%",width:`${(quizNum/quizTotal)*100}%`,background:C.green,transition:"width 0.4s ease",borderRadius:"0 2px 2px 0'}}/></div>';

// Since exact match is tricky with minified code, let's find it by markers
const progMarker1 = 'height:4,background:C.bgLight';
const progIdx = code.indexOf(progMarker1);

if (progIdx !== -1) {
  // Go backwards to find the opening <div
  let start = code.lastIndexOf('<div', progIdx);
  // Go forward to find the closing </div> — there's an inner div and outer div
  // Pattern: <div style={{height:4...}}><div style={{...}}/></div>
  let searchFrom = progIdx;
  // Find the </div> that closes the outer progress bar div
  // The inner div is self-closing (/>), then </div> closes the outer
  const selfClose = code.indexOf('/>', searchFrom);
  if (selfClose !== -1) {
    const outerClose = code.indexOf('</div>', selfClose);
    if (outerClose !== -1) {
      const end = outerClose + 6;
      const oldBlock = code.substring(start, end);
      
      const newBlock = `<div style={{display:"flex",gap:3,padding:"8px 20px 4px",background:C.bg}}>{Array.from({length:quizTotal}).map((_,idx)=>{const qNum=idx+1;const h=quizHistory[idx];let col=C.border;if(h){col=h.correct?C.green:C.red;}else if(qNum===quizNum){col=C.green;}return <div key={idx} style={{flex:1,height:4,borderRadius:2,background:col,opacity:h||qNum===quizNum?1:0.25,transition:"all 0.3s"}}/>;})}</div>`;
      
      code = code.replace(oldBlock, newBlock);
      changes++;
      console.log('✅ Fix 3: Replaced progress bar with segmented style');
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// FIX 4: Add quiz length picker screen
// We insert it right after the loading check in the quiz content area
// ═══════════════════════════════════════════════════════════════

// Find: {loading&&!quizQ&& in the quiz section
// We want to add the picker BEFORE the loading spinner
const loadingMarker = 'loading&&!quizQ&&';
// Find it in the quiz mode section (not the results section)
const quizSectionStart = code.indexOf('if(mode==="quiz"&&currentUnit){');
if (quizSectionStart !== -1) {
  const loadingIdx = code.indexOf(loadingMarker, quizSectionStart);
  if (loadingIdx !== -1) {
    // Go back to find the { before loading
    let braceIdx = loadingIdx - 1;
    while (braceIdx > quizSectionStart && code[braceIdx] !== '{') braceIdx--;
    
    if (braceIdx > quizSectionStart) {
      const pickerCode = `{showQuizPicker&&!quizQ&&!loading&&<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"60px 20px",gap:24}}><div style={{fontSize:18,fontWeight:400,fontFamily:"'DM Serif Display',serif",color:C.text}}>How many questions?</div><div style={{display:"flex",gap:14}}>{[10,15,25].map(n=><button key={n} onClick={()=>startQuiz(n)} style={{padding:"18px 32px",borderRadius:10,border:"1px solid "+(n===15?C.green:C.border),background:n===15?C.greenDim:"transparent",color:n===15?C.green:C.textMuted,fontSize:22,fontWeight:600,fontFamily:"'JetBrains Mono',monospace",cursor:"pointer",transition:"all 0.2s",minWidth:85}} onMouseEnter={e=>{e.currentTarget.style.borderColor=C.green;e.currentTarget.style.color=C.green;e.currentTarget.style.background=C.greenDim;}} onMouseLeave={e=>{if(n!==15){e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.textMuted;e.currentTarget.style.background="transparent";}}}>{n}</button>)}</div><div style={{fontSize:12,color:C.textDim}}>Questions scale in difficulty as you progress</div></div>}`;
      
      code = code.substring(0, braceIdx) + pickerCode + code.substring(braceIdx);
      changes++;
      console.log('✅ Fix 4: Added quiz length picker UI');
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// FIX 5: Make showQuizOptions show the picker instead of starting quiz
// Check if startQuiz still auto-starts or if it needs the picker flow
// ═══════════════════════════════════════════════════════════════

// Check if showQuizOptions already exists
if (!code.includes('const showQuizOptions')) {
  // Add it after the startQuiz function
  const startQuizEnd = 'fetchQuizQuestion(1);';
  const lastStartQuizEnd = code.lastIndexOf(startQuizEnd);
  if (lastStartQuizEnd !== -1) {
    // Find the end of the useCallback closing
    const afterFetch = code.indexOf('}', lastStartQuizEnd + startQuizEnd.length);
    // Find the closing of useCallback
    let searchPos = afterFetch;
    for (let i = 0; i < 5; i++) {
      const nextClose = code.indexOf(');', searchPos);
      if (nextClose !== -1) {
        // Check if this looks like the useCallback closing
        const between = code.substring(searchPos, nextClose + 2);
        if (between.includes('currentUnit')) {
          const insertPoint = nextClose + 2;
          const showQuizFunc = '\n  const showQuizOptions=()=>{if(loading||!currentUnit)return;setShowQuizPicker(true);setMode("quiz");resetQuiz();};';
          code = code.substring(0, insertPoint) + showQuizFunc + code.substring(insertPoint);
          changes++;
          console.log('✅ Fix 5: Added showQuizOptions function');
          break;
        }
        searchPos = nextClose + 2;
      }
    }
  }
} else {
  console.log('ℹ️  Fix 5: showQuizOptions already exists');
}

// ═══════════════════════════════════════════════════════════════
// FIX 6: Ensure startQuiz accepts a total parameter
// ═══════════════════════════════════════════════════════════════

// Check current startQuiz signature
const oldStartSig = 'const startQuiz=useCallback(async()=>{';
if (code.includes(oldStartSig)) {
  code = code.replace(oldStartSig, 'const startQuiz=useCallback(async(total)=>{');
  // Also add setQuizTotal at the start of the function
  const afterStartSig = 'if(loading||!currentUnit)return;';
  if (code.includes(afterStartSig)) {
    code = code.replace(afterStartSig, 
      'if(loading||!currentUnit)return;const t=total||quizTotal;setQuizTotal(t);setShowQuizPicker(false);');
    changes++;
    console.log('✅ Fix 6: startQuiz now accepts total parameter');
  }
} else {
  // Check if already updated
  if (code.includes('const startQuiz=useCallback(async(total)=>{')) {
    console.log('ℹ️  Fix 6: startQuiz already accepts total');
  }
}

// ═══════════════════════════════════════════════════════════════
// WRITE
// ═══════════════════════════════════════════════════════════════

fs.writeFileSync(FILE, code, 'utf8');
console.log(`\n${changes} fixes applied`);
console.log('\ngit add .');
console.log('git commit -m "Fix quiz UI: segmented progress, length picker, dynamic total"');
console.log('git push');
