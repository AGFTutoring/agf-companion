const fs = require('fs');
const FILE = 'app/page.js';
let src = fs.readFileSync(FILE, 'utf8');
console.log('Read ' + FILE + ' (' + src.length + ' chars)');

const marker = 'onMouseLeave={e=>{e.currentTarget.style.background=C.green;}}>Start Quiz</button></div>}';

if (!src.includes(marker)) {
  console.log('ERROR: Marker not found');
  process.exit(1);
}

const replacement = 'onMouseLeave={e=>{e.currentTarget.style.background=C.green;}}>Start Quiz</button><div style={{marginTop:16,textAlign:"center",padding:"10px 20px",background:"rgba(77,148,96,0.06)",border:"1px solid rgba(77,148,96,0.15)",borderRadius:8,maxWidth:360,fontSize:13,color:C.textMuted,lineHeight:1.6}}>Have a pencil and paper ready for questions that need working out.</div></div>}';

src = src.replace(marker, replacement);
fs.writeFileSync(FILE, src);
console.log('Done - pencil note added');
