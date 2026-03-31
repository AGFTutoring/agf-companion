/**
 * AGF Companion — Fix button styling + shape diagrams + action line stripping
 * 
 * cd C:\Users\alast\Downloads\agf-companion
 * node patch-buttons-v2.js
 */

const fs = require('fs');
const path = require('path');

const PAGE_JS = path.join(__dirname, 'app', 'page.js');
let code = fs.readFileSync(PAGE_JS, 'utf8');
let steps = 0;

// ═══════════════════════════════════════════════════════════════
// FIX 1: Improve button styling — more subtle, AGF design system
// ═══════════════════════════════════════════════════════════════

const oldButtonStyle = `style={{padding:"6px 14px",borderRadius:6,border:"1px solid "+C.greenBorder,background:C.greenDim,color:C.green,fontSize:12,fontWeight:500,cursor:"pointer",display:"flex",alignItems:"center",gap:6,transition:"all 0.2s"}}`;

if (code.includes(oldButtonStyle)) {
  const newButtonStyle = `style={{padding:"7px 16px",borderRadius:20,border:"1px solid "+C.border,background:"transparent",color:C.textMuted,fontSize:11.5,fontWeight:500,cursor:"pointer",display:"flex",alignItems:"center",gap:6,transition:"all 0.2s",letterSpacing:"0.02em"}}`;
  code = code.replace(oldButtonStyle, newButtonStyle);
  
  // Also update hover states
  const oldHoverIn = `onMouseEnter={e=>{e.currentTarget.style.background=C.green;e.currentTarget.style.color=C.bg;}}`;
  const newHoverIn = `onMouseEnter={e=>{e.currentTarget.style.borderColor=C.green;e.currentTarget.style.color=C.green;e.currentTarget.style.background=C.greenDim;}}`;
  
  const oldHoverOut = `onMouseLeave={e=>{e.currentTarget.style.background=C.greenDim;e.currentTarget.style.color=C.green;}}`;
  const newHoverOut = `onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.textMuted;e.currentTarget.style.background="transparent";}}`;
  
  if (code.includes(oldHoverIn)) code = code.replace(oldHoverIn, newHoverIn);
  if (code.includes(oldHoverOut)) code = code.replace(oldHoverOut, newHoverOut);
  
  steps++;
  console.log('✅ Step ' + steps + ': Updated button styling (pill shape, subtle borders)');
}

// ═══════════════════════════════════════════════════════════════
// FIX 2: Fix action line stripping — catch all variations
// The regex needs to be more forgiving to catch partial matches
// ═══════════════════════════════════════════════════════════════

const oldRegex = `m.content.match(/📖.*Deeper notes.*🌍.*Real-world.*📚.*Quiz me/)`;
const newRegex = `m.content.match(/📖[^\\n]*Deeper notes[^\\n]*🌍[^\\n]*Real-world[^\\n]*📚[^\\n]*Quiz me[^\\n]*/)`;

if (code.includes(oldRegex)) {
  code = code.replace(oldRegex, newRegex);
  steps++;
  console.log('✅ Step ' + steps + ': Improved action line detection regex');
}

// Also fix the trimming to remove any trailing "on this" fragments
const oldClean = `const cleanContent = actionLine ? m.content.replace(actionLine[0], '').trimEnd() : m.content;`;
const newClean = `const cleanContent = actionLine ? m.content.replace(actionLine[0], '').replace(/\\n*on this\\s*$/,'').trimEnd() : m.content;`;

if (code.includes(oldClean)) {
  code = code.replace(oldClean, newClean);
  steps++;
  console.log('✅ Step ' + steps + ': Fixed "on this" fragment stripping');
}

// ═══════════════════════════════════════════════════════════════
// FIX 3: Tighten shape diagram rules in system prompt
// The AI is inserting irrelevant shapes (tetrahedral for CHBr₂ during naming topics)
// ═══════════════════════════════════════════════════════════════

const oldShapeRule = 'When explaining ANY molecular shape, ALWAYS include the matching [SHAPE:...] tag';
const newShapeRule = 'When the student ASKS about molecular shapes or VSEPR, include the matching [SHAPE:...] tag. Do NOT include shape diagrams when discussing naming, isomerism, mechanisms, or other non-shape topics';

const idx = code.indexOf(oldShapeRule);
if (idx !== -1) {
  code = code.replace(oldShapeRule, newShapeRule);
  steps++;
  console.log('✅ Step ' + steps + ': Tightened shape diagram rules (no irrelevant shapes)');
}

// ═══════════════════════════════════════════════════════════════
// WRITE
// ═══════════════════════════════════════════════════════════════

fs.writeFileSync(PAGE_JS, code, 'utf8');

if (steps === 0) {
  console.log('⚠️  No changes made.');
} else {
  console.log('\n✅ ' + steps + ' fix(es) applied!');
  console.log('\n📋 Next:');
  console.log('   npm run dev → test');
  console.log('   Buttons should now be subtle pill-shaped with border hover');
  console.log('   No more random shape diagrams in naming topics');
  console.log('   git add . && git commit -m "Fix button styling, shape rules, action stripping" && git push');
}
