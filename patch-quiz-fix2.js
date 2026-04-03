/**
 * AGF Companion — Quiz UI Fix Part 2 (fixed)
 * cd C:\Users\alast\Downloads\agf-companion
 * node patch-quiz-fix2.js
 */

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, 'app', 'page.js');
let code = fs.readFileSync(FILE, 'utf8');
let changes = 0;

// FIX 1: Progress bar still uses (quizNum/10)
const oldProg = '(quizNum/10)*100}%';
if (code.includes(oldProg)) {
  code = code.replace(oldProg, '(quizNum/quizTotal)*100}%');
  changes++;
  console.log('Fix 1: Progress bar uses quizTotal');
}

// FIX 2: See Results button still uses >=10
const oldSR = 'quizNum>=10?"See Results"';
if (code.includes(oldSR)) {
  code = code.replace(oldSR, 'quizNum>=quizTotal?"See Results"');
  changes++;
  console.log('Fix 2: See Results uses quizTotal');
}

// FIX 3: nextQuestion limit
const oldNQ = 'if(quizNum>=10)';
if (code.includes(oldNQ)) {
  code = code.replace(oldNQ, 'if(quizNum>=quizTotal)');
  changes++;
  console.log('Fix 3: nextQuestion uses quizTotal');
}

// FIX 4: Replace solid progress bar with segmented
// Find the exact string from the live file
const oldBar = '<div style={{height:4,background:C.bgLight}}><div style={{height:"100%",width:`${(quizNum/quizTotal)*100}%`,background:C.green,transition:"width 0.4s ease",borderRadius:"0 2px 2px 0"}}/></div>';
if (code.includes(oldBar)) {
  const newBar = '<div style={{display:"flex",gap:3,padding:"8px 20px 4px",background:C.bg}}>{Array.from({length:quizTotal}).map((_,idx)=>{const qNum=idx+1;const h=quizHistory[idx];let col=C.border;if(h){col=h.correct?C.green:C.red;}else if(qNum===quizNum){col=C.green;}return <div key={idx} style={{flex:1,height:4,borderRadius:2,background:col,opacity:h||qNum===quizNum?1:0.25,transition:"all 0.3s"}}/>;})}</div>';
  code = code.replace(oldBar, newBar);
  changes++;
  console.log('Fix 4: Segmented progress bar');
}

// FIX 5: Add quiz picker before loading spinner
const loadingStr = '{loading&&!quizQ&&<div';
const quizSection = 'if(mode==="quiz"&&currentUnit){';
const qsIdx = code.indexOf(quizSection);
if (qsIdx !== -1) {
  const loadIdx = code.indexOf(loadingStr, qsIdx);
  if (loadIdx !== -1) {
    const picker = '{showQuizPicker&&!quizQ&&!loading&&<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"60px 20px",gap:24}}><div style={{fontSize:18,fontWeight:400,fontFamily:"\'DM Serif Display\',serif",color:C.text}}>How many questions?</div><div style={{display:"flex",gap:14}}>{[10,15,25].map(n=><button key={n} onClick={()=>startQuiz(n)} style={{padding:"18px 32px",borderRadius:10,border:"1px solid "+(n===15?C.green:C.border),background:n===15?C.greenDim:"transparent",color:n===15?C.green:C.textMuted,fontSize:22,fontWeight:600,fontFamily:"\'JetBrains Mono\',monospace",cursor:"pointer",transition:"all 0.2s",minWidth:85}} onMouseEnter={e=>{e.currentTarget.style.borderColor=C.green;e.currentTarget.style.color=C.green;e.currentTarget.style.background=C.greenDim;}} onMouseLeave={e=>{if(n!==15){e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.textMuted;e.currentTarget.style.background="transparent";}}}>{n}</button>)}</div><div style={{fontSize:12,color:C.textDim}}>Questions scale in difficulty as you progress</div></div>}';
    code = code.substring(0, loadIdx) + picker + code.substring(loadIdx);
    changes++;
    console.log('Fix 5: Quiz length picker added');
  }
}

// FIX 6: Make startQuiz accept total parameter
const oldStart = 'const startQuiz=useCallback(async()=>{';
if (code.includes(oldStart)) {
  code = code.replace(oldStart, 'const startQuiz=useCallback(async(total)=>{');
  const afterGuard = 'if(loading||!currentUnit)return;';
  const guardIdx = code.indexOf(afterGuard, code.indexOf('startQuiz=useCallback'));
  if (guardIdx !== -1) {
    const insertAt = guardIdx + afterGuard.length;
    code = code.substring(0, insertAt) + 'if(total){setQuizTotal(total);}setShowQuizPicker(false);' + code.substring(insertAt);
    changes++;
    console.log('Fix 6: startQuiz accepts total parameter');
  }
}

// FIX 7: Also clean up the old patch-quiz-ui.js that got committed
// (not code changes, just noting it)

fs.writeFileSync(FILE, code, 'utf8');
console.log('\n' + changes + ' fixes applied');
