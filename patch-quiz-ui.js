/**
 * AGF Companion — Quiz UI Redesign (Gemini-style)
 * 
 * Changes:
 * 1. Quiz length picker (10, 15, 25 questions) before quiz starts
 * 2. Segmented progress bar (dashes like Gemini) instead of fill bar
 * 3. Red/green score counter pills in header (✗ 2 / ✓ 5)
 * 4. Hardcoded 10 replaced with dynamic quizTotal
 * 5. Cleaner option card styling with left accent border
 * 
 * cd C:\Users\alast\Downloads\agf-companion
 * node patch-quiz-ui.js
 */

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, 'app', 'page.js');
let code = fs.readFileSync(FILE, 'utf8');
let changes = 0;

// ═══════════════════════════════════════════════════════════════
// STEP 1: Add quizTotal state variable (after quizDone state)
// ═══════════════════════════════════════════════════════════════

const afterQuizDone = 'const [quizDone, setQuizDone] = useState(false);';
if (code.includes(afterQuizDone)) {
  code = code.replace(afterQuizDone, 
    afterQuizDone + '\n  const [quizTotal, setQuizTotal] = useState(10);\n  const [showQuizPicker, setShowQuizPicker] = useState(false);'
  );
  changes++;
  console.log('✅ Step 1: Added quizTotal and showQuizPicker state');
}

// ═══════════════════════════════════════════════════════════════
// STEP 2: Update resetQuiz to also reset quizTotal picker
// ═══════════════════════════════════════════════════════════════

const oldReset = 'setQuizDone(false);';
// Find it in resetQuiz context (near setHintText)
const resetIdx = code.indexOf('setQuizDone(false);');
if (resetIdx !== -1) {
  // Check if this is in the resetQuiz function (near setHintText)
  const nearbyCode = code.substring(Math.max(0, resetIdx - 200), resetIdx + 50);
  if (nearbyCode.includes('setHintText') || nearbyCode.includes('setQuizScore')) {
    code = code.substring(0, resetIdx) + 'setQuizDone(false);setShowQuizPicker(false);' + code.substring(resetIdx + oldReset.length);
    changes++;
    console.log('✅ Step 2: Updated resetQuiz');
  }
}

// ═══════════════════════════════════════════════════════════════
// STEP 3: Replace hardcoded "10" quiz limit with quizTotal
// ═══════════════════════════════════════════════════════════════

// In nextQuestion: quizNum >= 10
const oldLimit = 'if (quizNum >= 10)';
// There might be multiple — we want the one in nextQuestion
const limitIdx = code.indexOf(oldLimit);
if (limitIdx !== -1) {
  code = code.substring(0, limitIdx) + 'if (quizNum >= quizTotal)' + code.substring(limitIdx + oldLimit.length);
  changes++;
  console.log('✅ Step 3a: Updated nextQuestion limit');
}

// quizNum >= 10 ? "See Results" : "Next" (in the button text)
const oldBtnText = 'quizNum >= 10 ? "See Results"';
if (code.includes(oldBtnText)) {
  code = code.replace(oldBtnText, 'quizNum >= quizTotal ? "See Results"');
  changes++;
  console.log('✅ Step 3b: Updated button text limit');
}

// ═══════════════════════════════════════════════════════════════
// STEP 4: Replace startQuiz to show picker instead of starting immediately
// ═══════════════════════════════════════════════════════════════

const oldStartQuiz = 'const startQuiz = useCallback(async () => {';
const oldStartQuizEnd = '}, [loading, currentUnit]);';
// We need to find the complete startQuiz function
const startIdx = code.indexOf(oldStartQuiz);
if (startIdx !== -1) {
  // Find the matching end
  let searchFrom = startIdx + oldStartQuiz.length;
  const endIdx = code.indexOf(oldStartQuizEnd, searchFrom);
  if (endIdx !== -1) {
    const oldFunc = code.substring(startIdx, endIdx + oldStartQuizEnd.length);
    const newFunc = `const startQuiz = useCallback(async (total) => {
    if (loading || !currentUnit) return;
    const t = total || quizTotal;
    setQuizTotal(t);
    setMode("quiz");
    resetQuiz();
    setShowQuizPicker(false);
    setQuizNum(1);
    await fetchQuizQuestion(1);
  }, [loading, currentUnit, quizTotal]);
  
  const showQuizOptions = () => {
    if (loading || !currentUnit) return;
    setShowQuizPicker(true);
    setMode("quiz");
  };`;
    code = code.replace(oldFunc, newFunc);
    changes++;
    console.log('✅ Step 4: Replaced startQuiz with picker flow');
  }
}

// ═══════════════════════════════════════════════════════════════
// STEP 5: Replace the progress bar with segmented Gemini-style
// ═══════════════════════════════════════════════════════════════

// Old progress bar
const oldProgress = `<div style={{ height: 4, background: C.bgLight }}>
          <div style={{ height: "100%", width: \`\${(quizNum / 10) * 100}%\`, background: C.gold, transition: "width 0.4s ease", borderRadius: "0 2px 2px 0" }} />
        </div>`;

// Try to find it — might be minified
const oldProgressMin = code.match(/\{\/\*\s*Progress bar\s*\*\/\}[\s\S]*?<div style=\{\{height:4/);

// Find by unique pattern
const progSearch = 'height: 4, background: C.bgLight';
const progSearchMin = 'height:4,background:C.bgLight';

let progIdx = code.indexOf(progSearch);
if (progIdx === -1) progIdx = code.indexOf(progSearchMin);

if (progIdx !== -1) {
  // Find the start of this div (go back to find "<div")
  let divStart = code.lastIndexOf('<div', progIdx);
  // Find the closing </div> after it
  let depth = 0;
  let pos = divStart;
  let divEnd = -1;
  while (pos < code.length && pos < progIdx + 500) {
    if (code.substring(pos, pos + 4) === '<div') depth++;
    if (code.substring(pos, pos + 6) === '</div>') {
      depth--;
      if (depth === 0) { divEnd = pos + 6; break; }
    }
    pos++;
  }
  
  if (divEnd !== -1) {
    // Also check for comment before it
    let blockStart = divStart;
    const beforeDiv = code.substring(Math.max(0, divStart - 40), divStart);
    if (beforeDiv.includes('Progress bar')) {
      blockStart = code.lastIndexOf('{/*', divStart);
      if (blockStart === -1 || blockStart < divStart - 50) blockStart = divStart;
    }
    
    const oldBlock = code.substring(blockStart, divEnd);
    const newBlock = `{/* Segmented progress bar */}
        <div style={{display:"flex",gap:3,padding:"8px 20px",background:C.bg}}>
          {Array.from({length:quizTotal}).map((_,idx)=>{
            const qNum=idx+1;
            const histEntry=quizHistory[idx];
            let color=C.border;
            if(histEntry){color=histEntry.correct?C.green:C.red;}
            else if(qNum===quizNum){color=C.green;}
            return <div key={idx} style={{flex:1,height:4,borderRadius:2,background:color,opacity:histEntry||qNum===quizNum?1:0.3,transition:"all 0.3s"}}/>;
          })}
        </div>`;
    code = code.replace(oldBlock, newBlock);
    changes++;
    console.log('✅ Step 5: Replaced progress bar with segmented style');
  } else {
    console.log('⚠️  Step 5: Could not find progress bar end');
  }
} else {
  console.log('⚠️  Step 5: Could not find progress bar');
}

// ═══════════════════════════════════════════════════════════════
// STEP 6: Update the header quiz counter from /10 to /quizTotal
// ═══════════════════════════════════════════════════════════════

// quizNum}/10 or quizNum}/10
const oldCounter = '{quizNum}/10';
while (code.includes(oldCounter)) {
  code = code.replace(oldCounter, '{quizNum}/{quizTotal}');
  changes++;
}
console.log('✅ Step 6: Updated quiz counters to use quizTotal');

// Also in generating question text
const oldGenText = 'Generating question {quizNum}...';
if (code.includes(oldGenText)) {
  code = code.replace(oldGenText, 'Generating question {quizNum} of {quizTotal}...');
  changes++;
  console.log('✅ Step 6b: Updated generating text');
}

// ═══════════════════════════════════════════════════════════════
// STEP 7: Update the quiz difficulty scaling for variable length
// ═══════════════════════════════════════════════════════════════

const oldDifficulty = 'const difficulty = Math.min(10, Math.max(1, Math.ceil(questionNumber * 1.1)));';
if (code.includes(oldDifficulty)) {
  code = code.replace(oldDifficulty,
    'const difficulty = Math.min(10, Math.max(1, Math.ceil((questionNumber / quizTotal) * 10)));'
  );
  changes++;
  console.log('✅ Step 7: Updated difficulty scaling for variable quiz length');
} else {
  // Try minified version
  const oldDiffMin = 'const difficulty=Math.min(10,Math.max(1,Math.ceil(questionNumber*1.1)));';
  if (code.includes(oldDiffMin)) {
    code = code.replace(oldDiffMin,
      'const difficulty=Math.min(10,Math.max(1,Math.ceil((questionNumber/quizTotal)*10)));'
    );
    changes++;
    console.log('✅ Step 7 (min): Updated difficulty scaling');
  }
}

// ═══════════════════════════════════════════════════════════════
// STEP 8: Update generate question prompt with quizTotal
// ═══════════════════════════════════════════════════════════════

const oldGenPrompt = 'Generate question ${questionNumber}/10.';
if (code.includes(oldGenPrompt)) {
  code = code.replace(oldGenPrompt, 'Generate question ${questionNumber}/${quizTotal}.');
  changes++;
  console.log('✅ Step 8: Updated generation prompt');
}

// ═══════════════════════════════════════════════════════════════
// STEP 9: Add quiz length picker screen
// Insert it in the quiz mode section, before the loading/question display
// ═══════════════════════════════════════════════════════════════

// Find where the quiz content area starts (after progress bar)
const quizContentMarker = '{/* Content */}';
const quizContentMarkerMin = 'overflowY:"auto"';

// Find the quiz content area
let contentIdx = -1;
// Look for the content div inside the quiz mode section
const quizModeMarker = 'if (mode === "quiz")';
const quizModeMarkerMin = 'if(mode==="quiz")';
let quizModeIdx = code.indexOf(quizModeMarker);
if (quizModeIdx === -1) quizModeIdx = code.indexOf(quizModeMarkerMin);

if (quizModeIdx !== -1) {
  // Find the content area after the progress bar in this section
  const afterQuizMode = code.substring(quizModeIdx);
  const contentMatch = afterQuizMode.indexOf('overflowY:"auto"');
  if (contentMatch !== -1) {
    // Find the opening > of this div
    let searchPos = quizModeIdx + contentMatch;
    // Go forward to find the closing > of the style prop and the >
    let braceDepth = 0;
    let divContentStart = -1;
    for (let p = searchPos; p < searchPos + 200; p++) {
      if (code[p] === '{') braceDepth++;
      if (code[p] === '}') {
        braceDepth--;
        if (braceDepth === 0) {
          // Find the > after this
          const nextGt = code.indexOf('>', p);
          if (nextGt !== -1) {
            divContentStart = nextGt + 1;
            break;
          }
        }
      }
    }
    
    if (divContentStart !== -1) {
      const pickerUI = `
          {/* Quiz length picker */}
          {showQuizPicker && !quizQ && !loading && (
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"60px 20px",gap:24}}>
              <div style={{fontSize:18,fontWeight:400,fontFamily:"'DM Serif Display',serif",color:C.text}}>How many questions?</div>
              <div style={{display:"flex",gap:12}}>
                {[10,15,25].map(n=>(
                  <button key={n} onClick={()=>startQuiz(n)}
                    style={{padding:"16px 28px",borderRadius:10,border:"1px solid "+(n===15?C.green:C.border),background:n===15?C.greenDim:"transparent",color:n===15?C.green:C.textMuted,fontSize:20,fontWeight:600,fontFamily:"'JetBrains Mono',monospace",cursor:"pointer",transition:"all 0.2s",minWidth:80}}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor=C.green;e.currentTarget.style.color=C.green;e.currentTarget.style.background=C.greenDim;}}
                    onMouseLeave={e=>{if(n!==15){e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.textMuted;e.currentTarget.style.background="transparent";}}}
                  >{n}</button>
                ))}
              </div>
              <div style={{fontSize:12,color:C.textDim}}>Questions scale in difficulty as you progress</div>
            </div>
          )}
`;
      code = code.substring(0, divContentStart) + pickerUI + code.substring(divContentStart);
      changes++;
      console.log('✅ Step 9: Added quiz length picker UI');
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// STEP 10: Update the Quiz button in header to show picker
// ═══════════════════════════════════════════════════════════════

// The Quiz button currently calls startQuiz directly
// We need it to call showQuizOptions instead
const oldQuizBtn = 'onClick={startQuiz}';
if (code.includes(oldQuizBtn)) {
  code = code.replace(oldQuizBtn, 'onClick={showQuizOptions}');
  changes++;
  console.log('✅ Step 10: Quiz button now shows length picker');
}

// ═══════════════════════════════════════════════════════════════
// STEP 11: Add option card left accent border on selection
// ═══════════════════════════════════════════════════════════════

// Find option card border styling and add borderLeft
const oldOptionBorder = 'border: `1.5px solid ${borderColor}`';
const oldOptionBorderMin = 'border:`1.5px solid ${borderColor}`';
const optBorderTarget = code.includes(oldOptionBorder) ? oldOptionBorder : oldOptionBorderMin;

if (code.includes(optBorderTarget)) {
  code = code.replace(optBorderTarget, 
    optBorderTarget + ',borderLeft:`3px solid ${borderColor}`'
  );
  changes++;
  console.log('✅ Step 11: Added left accent border on option cards');
}

// ═══════════════════════════════════════════════════════════════
// STEP 12: Style the score counters as pills (like Gemini)
// ═══════════════════════════════════════════════════════════════

// Wrong counter
const oldWrongCounter = `{wrongCount > 0 && <span style={{ color: C.red, display: "flex", alignItems: "center", gap: 3 }}>✗ {wrongCount}</span>}`;
const oldWrongCounterMin = `{wrongCount>0&&<span style={{color:C.red,display:"flex",alignItems:"center",gap:3}}>\u2717 {wrongCount}</span>}`;

// Try both formatted and minified
let wrongFound = false;
if (code.includes('wrongCount > 0')) {
  // Non-minified — skip this, likely minified in live file
}

// Use a regex approach for the score pills
const wrongPillRegex = /\{wrongCount\s*>\s*0\s*&&\s*<span\s+style=\{\{[^}]*color:\s*C\.red[^}]*\}\}>\s*[✗✕✘×\u2717\u2715]\s*\{wrongCount\}<\/span>\}/;
const correctPillRegex = /\{correctCount\s*>\s*0\s*&&\s*<span\s+style=\{\{[^}]*color:\s*C\.green[^}]*\}\}>\s*[✓✔\u2713]\s*\{correctCount\}<\/span>\}/;

const wrongMatch = code.match(wrongPillRegex);
const correctMatch = code.match(correctPillRegex);

if (wrongMatch) {
  code = code.replace(wrongMatch[0], 
    `{wrongCount>0&&<span style={{color:"#fff",background:"rgba(224,96,96,0.8)",padding:"2px 10px",borderRadius:12,fontSize:12,fontWeight:600,display:"flex",alignItems:"center",gap:4}}>\u2717 {wrongCount}</span>}`
  );
  changes++;
  console.log('✅ Step 12a: Styled wrong counter as pill');
}

if (correctMatch) {
  code = code.replace(correctMatch[0],
    `{correctCount>0&&<span style={{color:"#fff",background:"rgba(77,148,96,0.8)",padding:"2px 10px",borderRadius:12,fontSize:12,fontWeight:600,display:"flex",alignItems:"center",gap:4}}>\u2713 {correctCount}</span>}`
  );
  changes++;
  console.log('✅ Step 12b: Styled correct counter as pill');
}

// ═══════════════════════════════════════════════════════════════
// WRITE
// ═══════════════════════════════════════════════════════════════

fs.writeFileSync(FILE, code, 'utf8');
console.log(`\n${changes} changes applied`);
console.log('\ngit add .');
console.log('git commit -m "Redesign quiz UI: length picker, segmented progress, score pills"');
console.log('git push');
