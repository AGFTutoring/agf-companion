/**
 * Remove duplicate quiz picker
 * cd C:\Users\alast\Downloads\agf-companion
 * node patch-dedup.js
 */
const fs = require('fs');
const FILE = require('path').join(__dirname, 'app', 'page.js');
let code = fs.readFileSync(FILE, 'utf8');

const picker = '{showQuizPicker&&!quizQ&&!loading&&<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"60px 20px",gap:24}}><div style={{fontSize:18,fontWeight:400,fontFamily:"\'DM Serif Display\',serif",color:C.text}}>How many questions?</div>';

const first = code.indexOf(picker);
const second = code.indexOf(picker, first + 1);

if (first !== -1 && second !== -1) {
  // Find the end of the second picker block
  // It ends with: progress</div></div>}
  const endMarker = 'progress</div></div>}';
  const endIdx = code.indexOf(endMarker, second);
  if (endIdx !== -1) {
    const removeEnd = endIdx + endMarker.length;
    code = code.substring(0, second) + code.substring(removeEnd);
    fs.writeFileSync(FILE, code, 'utf8');
    console.log('Done: removed duplicate quiz picker');
  }
} else {
  console.log('No duplicate found');
}
