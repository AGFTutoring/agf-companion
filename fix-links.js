/**
 * fix-links.js v3
 * Replaces the RichLine function using exact string matching.
 * 
 * Run from: C:\Users\alast\Downloads\agf-companion
 *   node fix-links.js
 *   npm run dev
 *   git add . && git commit -m "Add clickable link support" && git push
 */

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, 'app', 'page.js');
let code = fs.readFileSync(FILE, 'utf8');

// Find the exact old function by matching its unique content
const OLD_PATTERN = 'function RichLine({text}){return text.split(/(\\*\\*.*?\\*\\*|\\*.*?\\*|`[^`]+`)/g)';

const idx = code.indexOf(OLD_PATTERN);
if (idx === -1) {
  console.error('ERROR: Could not find RichLine function pattern');
  console.error('Searching for alternatives...');
  
  const alt1 = code.indexOf('function RichLine');
  if (alt1 !== -1) {
    console.error('Found "function RichLine" at position ' + alt1);
    console.error('Next 200 chars: ' + JSON.stringify(code.substring(alt1, alt1 + 200)));
  }
  process.exit(1);
}

// Find the end: look for "});}" which closes the .map() and the function
// Search from the found position
const endPattern = '<span key={i}>{s}</span>;});}';
const endIdx = code.indexOf(endPattern, idx);

if (endIdx === -1) {
  console.error('ERROR: Could not find end of RichLine function');
  process.exit(1);
}

const fullEnd = endIdx + endPattern.length;
const oldFunc = code.substring(idx, fullEnd);

console.log('Found RichLine function (' + oldFunc.length + ' chars, starting at position ' + idx + ')');

// Build the new function - note: this is JSX so backticks and template literals must be careful
const newFunc = [
  'function RichLine({text}){return text.split(/(\\[.*?\\]\\(https?:\\/\\/.*?\\)|https?:\\/\\/[^\\s)]+|\\*\\*.*?\\*\\*|\\*.*?\\*|`[^`]+`)/g).map((s,i)=>{',
  'if(!s)return null;',
  'const mdLink=s.match(/^\\[(.+?)\\]\\((https?:\\/\\/.+?)\\)$/);',
  'if(mdLink)return <a key={i} href={mdLink[2]} target="_blank" rel="noopener noreferrer" style={{color:C.green,textDecoration:"underline",textUnderlineOffset:"3px"}}>{mdLink[1]}</a>;',
  'if(s.match(/^https?:\\/\\//))return <a key={i} href={s} target="_blank" rel="noopener noreferrer" style={{color:C.green,textDecoration:"underline",textUnderlineOffset:"3px",wordBreak:"break-all",fontSize:"0.92em"}}>{s}</a>;',
  'if(s.startsWith("**")&&s.endsWith("**"))return <strong key={i} style={{fontWeight:600,color:C.text}}>{s.slice(2,-2)}</strong>;',
  'if(s.startsWith("*")&&s.endsWith("*"))return <em key={i} style={{fontStyle:"italic",color:C.text}}>{s.slice(1,-1)}</em>;',
  'if(s.startsWith("`")&&s.endsWith("`"))return <code key={i} style={{background:C.greenDim,padding:"2px 7px",borderRadius:4,fontFamily:"\'JetBrains Mono\',monospace",fontSize:"0.85em",color:C.green,border:`1px solid ${C.greenBorder}`}}>{s.slice(1,-1)}</code>;',
  'return <span key={i}>{s}</span>;});}',
].join('\n');

code = code.substring(0, idx) + newFunc + code.substring(fullEnd);

fs.writeFileSync(FILE, code, 'utf8');
console.log('Done - RichLine updated with link support');
console.log('');
console.log('Links will render as:');
console.log('  [text](url) -> green clickable link, opens in new tab');
console.log('  https://example.com -> green clickable link, opens in new tab');
console.log('');
console.log('Next:');
console.log('  npm run dev');
console.log('  git add . && git commit -m "Add clickable link support" && git push');
