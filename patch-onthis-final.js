/**
 * AGF Companion — Nuclear "on this" kill + remove action line from AI output entirely
 * 
 * The root cause: the AI outputs "📚 **Quiz me on this**" and sometimes the regex
 * strips the emoji line but leaves "on this" as a dangling fragment. Other times
 * the AI wraps it differently. 
 * 
 * Fix strategy:
 * 1. Change system prompt to NOT output the action line at all — the UI renders the buttons
 * 2. Remove the action-line detection regex (no longer needed)
 * 3. Always render the action buttons after every assistant message
 * 4. Keep aggressive "on this" stripping as a safety net
 * 
 * cd C:\Users\alast\Downloads\agf-companion
 * node patch-onthis-final.js
 */

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, 'app', 'page.js');
let code = fs.readFileSync(FILE, 'utf8');
let changes = 0;

// ═══════════════════════════════════════════════════════════════
// FIX 1: Change system prompt — stop telling AI to output the action line
// ═══════════════════════════════════════════════════════════════

// Find the instruction that tells the AI to output the action line
const oldInstruction = `After EVERY response, your FINAL line must be EXACTLY:\\n📖 **Deeper notes** · 🌍 **Real-world example** · 📚 **Quiz me on this**\\nDo NOT write anything after this line. No "on this", no extra text. This line must be the absolute last thing in your response.`;

if (code.includes(oldInstruction)) {
  code = code.replace(oldInstruction, 
    `Do NOT include any action buttons, emoji lines, or "📖 Deeper notes / 🌍 Real-world / 📚 Quiz me" text at the end of your responses. The UI adds interactive buttons automatically. Just end your response with your teaching content.`
  );
  changes++;
  console.log('✅ Fix 1: Updated system prompt to stop AI outputting action line');
} else {
  console.log('⚠️  Fix 1: Could not find exact system prompt instruction, trying alternate...');
  // Try to find it with the encoded characters
  const altPattern = /After EVERY response, your FINAL line must be EXACTLY:[^"]*?"on this"[^.]*?absolute last thing in your response\./;
  if (altPattern.test(code)) {
    code = code.replace(altPattern,
      `Do NOT include any action buttons, emoji lines, or "Deeper notes / Real-world / Quiz me" text at the end of your responses. The UI adds interactive buttons automatically. Just end your response with your teaching content.`
    );
    changes++;
    console.log('✅ Fix 1 (alt): Updated system prompt');
  } else {
    console.log('❌ Fix 1: Could not find instruction — will need manual check');
  }
}

// Also remove the template line that follows
const templateLine = `📖 **Deeper notes** · 🌍 **Real-world example** · 📚 **Quiz me on this**`;
if (code.includes(templateLine)) {
  // Remove it and any surrounding \n
  code = code.replace('\\n' + templateLine, '');
  code = code.replace(templateLine + '\\n', '');
  code = code.replace(templateLine, '');
  changes++;
  console.log('✅ Fix 1b: Removed template action line from system prompt');
}

// ═══════════════════════════════════════════════════════════════
// FIX 2: Replace the action-line detection with always-show buttons
// ═══════════════════════════════════════════════════════════════

// Find the current rendering block
const oldRenderBlock = `  const actionLine = m.content.match(/ðŸ"–.*Deeper notes.*ðŸŒ.*Real-world.*ðŸ"š.*Quiz me/);
  const cleanContent = (actionLine ? m.content.replace(actionLine[0], '') : m.content).split('\\n').filter(line=>line.trim()!=='on this').join('\\n').trimEnd();
  return <>
    {parseAndRender(cleanContent)}
    {actionLine && m.role==="assistant" && (`;

const newRenderBlock = `  const cleanContent = m.content.replace(/📖[^\\n]*Deeper notes[^\\n]*🌍[^\\n]*Real-world[^\\n]*📚[^\\n]*Quiz me[^\\n]*/g,'').replace(/📖[^\\n]*🌍[^\\n]*📚[^\\n]*/g,'').split('\\n').filter(line=>!/^\\s*(on this|\\*\\*on this\\*\\*)\\s*$/.test(line)&&!/^📖|^🌍|^📚/.test(line.trim())).join('\\n').replace(/\\n{3,}/g,'\\n\\n').trimEnd();
  return <>
    {parseAndRender(cleanContent)}
    {m.role==="assistant" && i>0 && (`;

if (code.includes(oldRenderBlock)) {
  code = code.replace(oldRenderBlock, newRenderBlock);
  changes++;
  console.log('✅ Fix 2: Replaced action-line detection with always-show buttons');
} else {
  console.log('⚠️  Fix 2: Could not find exact render block, trying byte-level match...');
  
  // The file has mojibake characters — try matching with those
  const mojibakePattern = /const actionLine = m\.content\.match\(\/ðŸ"–\.\*Deeper notes\.\*ðŸŒ\.\*Real-world\.\*ðŸ"š\.\*Quiz me\/\);\s*const cleanContent = \(actionLine \? m\.content\.replace\(actionLine\[0\], ''\) : m\.content\)\.split\('\\n'\)\.filter\(line=>line\.trim\(\)!=='on this'\)\.join\('\\n'\)\.trimEnd\(\);\s*return <>\s*\{parseAndRender\(cleanContent\)\}\s*\{actionLine && m\.role==="assistant" && \(/;
  
  if (mojibakePattern.test(code)) {
    code = code.replace(mojibakePattern, newRenderBlock);
    changes++;
    console.log('✅ Fix 2 (mojibake match): Replaced render block');
  } else {
    // Last resort: find by unique surrounding code
    const marker1 = 'const actionLine = m.content.match(';
    const marker2 = '{actionLine && m.role==="assistant" && (';
    const idx1 = code.indexOf(marker1);
    const idx2 = code.indexOf(marker2);
    
    if (idx1 !== -1 && idx2 !== -1 && idx2 > idx1) {
      const oldBlock = code.substring(idx1, idx2 + marker2.length);
      const replacement = `const cleanContent = m.content.replace(/\\u{1F4D6}[^\\n]*Deeper notes[^\\n]*\\u{1F30D}[^\\n]*Real-world[^\\n]*\\u{1F4DA}[^\\n]*Quiz me[^\\n]*/gu,'').split('\\n').filter(line=>!/^\\s*(on this|\\*\\*on this\\*\\*)\\s*$/.test(line)&&!/^\\u{1F4D6}|^\\u{1F30D}|^\\u{1F4DA}/u.test(line.trim())).join('\\n').replace(/\\n{3,}/g,'\\n\\n').trimEnd();
  return <>
    {parseAndRender(cleanContent)}
    {m.role==="assistant" && i>0 && (`;
      code = code.replace(oldBlock, replacement);
      changes++;
      console.log('✅ Fix 2 (marker match): Replaced render block');
    } else {
      console.log('❌ Fix 2: Could not find render block at all');
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// FIX 3: Also clean up the "When the student clicks one of these" block
// that references "on this" in the system prompt
// ═══════════════════════════════════════════════════════════════

const oldClickBlock = `- 📚 Quiz me on this → Generate a targeted quiz question on the specific topic just discussed.`;
const newClickBlock = `- 📚 Quiz me → Generate a targeted quiz question on the specific topic just discussed.`;
if (code.includes(oldClickBlock)) {
  code = code.replace(oldClickBlock, newClickBlock);
  changes++;
  console.log('✅ Fix 3: Cleaned "on this" from click instruction');
}

// ═══════════════════════════════════════════════════════════════
// WRITE
// ═══════════════════════════════════════════════════════════════

fs.writeFileSync(FILE, code, 'utf8');
console.log(`\n${changes} fixes applied`);
console.log('git add . && git commit -m "Stop AI outputting action line, always show buttons" && git push');
