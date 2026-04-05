const fs = require('fs');
const FILE = 'app/page.js';
let src = fs.readFileSync(FILE, 'utf8');
console.log(`✅ Read ${FILE} (${src.length} chars)`);

// The "Start Quiz" button on the quiz setup screen
// We need to find it and add a note just before it
// The button text is ">Start Quiz</button>" in the quiz picker section

const marker = '>Start Quiz</button>';

if (!src.includes(marker)) {
  console.log('❌ Could not find Start Quiz button');
  // Try alternatives
  ['Start Quiz', 'start Quiz', 'Start quiz'].forEach(s => {
    const i = src.indexOf(s);
    if (i !== -1) console.log(`  Found "${s}" at index ${i}`);
  });
  process.exit(1);
}

// Find the quiz picker's Start Quiz button (not the results screen "New Quiz")
// The quiz picker section has showQuizPicker before it
const pickerIdx = src.indexOf('showQuizPicker');
const startBtnIdx = src.indexOf(marker, pickerIdx);

if (startBtnIdx === -1) {
  console.log('❌ Could not find Start Quiz in quiz picker context');
  process.exit(1);
}

// We want to insert a note div BEFORE the Start Quiz button
// Find the <button that contains "Start Quiz"
// Walk backwards from ">Start Quiz" to find the <button
let btnStart = startBtnIdx;
while (btnStart > 0 && src.substring(btnStart - 7, btnStart) !== '<button') {
  btnStart--;
}

// Insert a pencil note div before the button
const pencilNote = `<div style={{textAlign:"center",padding:"12px 20px",background:"rgba(77,148,96,0.06)",border:"1px solid rgba(77,148,96,0.15)",borderRadius:8,maxWidth:380,fontSize:13,color:C.textMuted,lineHeight:1.6}}>\\u270F\\uFE0F Have a pencil and paper ready \\u2014 some questions will need working out.</div>`;

src = src.substring(0, btnStart) + pencilNote + src.substring(btnStart);

console.log('✅ Added pencil-and-paper note to quiz setup screen');

fs.writeFileSync(FILE, src);
console.log(`File size: ${src.length} chars`);
console.log('\nNext steps:');
console.log('  npm run dev');
console.log('  # Check quiz setup screen shows the pencil note');
console.log('  git add .');
console.log('  git commit -m "Add pencil-and-paper reminder to quiz setup"');
console.log('  git push');
console.log('  del patch-pencil-note.js');
