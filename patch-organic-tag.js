/**
 * AGF Companion — Add [ORGANIC:...] tag + fix IUPAC tie-breaker
 * cd C:\Users\alast\Downloads\agf-companion
 * node patch-organic-tag.js
 */
const fs = require('fs');
const path = require('path');
const PAGE_JS = path.join(__dirname, 'app', 'page.js');
let code = fs.readFileSync(PAGE_JS, 'utf8');
let steps = 0;

// 1. ADD [ORGANIC:...] RENDERER
const configCheck = 'else if(tag==="CONFIG")';
if (code.includes(configCheck)) {
  const idx = code.indexOf(configCheck);
  const organicHandler = 'else if(tag==="ORGANIC")elements.push(<div key={`org${i}`} style={{background:C.bgLight,border:`1px solid ${C.border}`,borderRadius:10,padding:"14px 18px",margin:"10px 0",fontFamily:"\'JetBrains Mono\',monospace",fontSize:13,lineHeight:1.7,color:C.text,whiteSpace:"pre",overflowX:"auto"}}>{p.join(":").replace(/\\\\n/g,"\\n")}</div>);\n      ';
  code = code.substring(0, idx) + organicHandler + code.substring(idx);
  steps++;
  console.log('Done: added [ORGANIC:...] renderer');
}

// 2. ADD [ORGANIC:...] TO SYSTEM PROMPT TAGS
const eqTag = '[EQUATION:n = m / M]';
if (code.includes(eqTag) && !code.includes('[ORGANIC:')) {
  code = code.replace(eqTag, eqTag + '\\n\\n[ORGANIC:displayed structural formula with numbering — use monospace pre-formatted text]');
  steps++;
  console.log('Done: added [ORGANIC:...] to system prompt tags');
}

// 3. ADD ORGANIC TAG USAGE TO RULES
const configRule = 'When showing electron configuration, use [CONFIG:...] tag';
if (code.includes(configRule) && !code.includes('ORGANIC:')) {
  code = code.replace(configRule, configRule + '\\n- When showing structural formulae with carbon numbering for IUPAC naming, use [ORGANIC:...] tag. Show the chain with vertical bonds for substituents and carbon numbers below. Use \\\\n for line breaks inside the tag.');
  steps++;
  console.log('Done: added ORGANIC tag usage rule');
}

// 4. ADD TIE-BREAKER RULES
const verification = 'VERIFICATION: Count total carbons';
if (code.includes(verification)) {
  const tieBreaker = 'NUMBERING TIE-BREAKER (CRITICAL — apply when C=C has same locant from both ends):\\n' +
    '1. Try BOTH numbering directions explicitly\\n' +
    '2. List all substituent positions for each direction\\n' +
    '3. Compare the first point of difference — choose the direction giving the LOWER number\\n' +
    '4. If still tied, give the lower number to the substituent that comes first ALPHABETICALLY\\n' +
    '5. ALWAYS show both numbering attempts before stating the answer\\n\\n' +
    'WORKED TIE-BREAKER EXAMPLE:\\n' +
    'CH3CH2CH=CHCH(Cl)CH2F (6C chain, C=C)\\n' +
    'Left-to-right: C=C at 3, Cl at 5, F at 6 -> 5-chloro-6-fluorohex-3-ene\\n' +
    'Right-to-left: C=C at 3, Cl at 2, F at 1 -> 2-chloro-1-fluorohex-3-ene\\n' +
    'C=C same (3) both ways -> tie-breaker: first alphabetically is chloro -> Cl at 2 < Cl at 5 -> RIGHT-TO-LEFT wins\\n' +
    'Correct: 2-chloro-1-fluorohex-3-ene\\n\\n' +
    'SELF-CHECK: Before giving ANY IUPAC name, ALWAYS try numbering from BOTH ends, compare, verify carbon count. Never give a name without checking both directions.\\n\\n';
  code = code.replace(verification, tieBreaker + verification);
  steps++;
  console.log('Done: added tie-breaker rules + self-check');
}

fs.writeFileSync(PAGE_JS, code, 'utf8');
console.log('\\n' + steps + ' patches applied');
console.log('git add . && git commit -m "Add ORGANIC tag + IUPAC tie-breaker" && git push');
