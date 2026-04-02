/**
 * Kill "on this" forever - fix prompt + client stripping
 * cd C:\Users\alast\Downloads\agf-companion
 * node patch-onthis.js
 */
const fs = require('fs');
const f = 'app/page.js';
let c = fs.readFileSync(f, 'utf8');
let steps = 0;

// FIX 1: Change the action buttons instruction in the system prompt
// The AI is outputting "on this" because the prompt says "Quiz me on this"
// and the AI echoes the trailing fragment. Tell it to output nothing after the action line.
const oldAction = 'After EVERY response, end with exactly this action line (and NOTHING else after it — no extra text like "on this"):';
const newAction = 'After EVERY response, your FINAL line must be EXACTLY:\\n📖 **Deeper notes** · 🌍 **Real-world example** · 📚 **Quiz me on this**\\nDo NOT write anything after this line. No "on this", no extra text. This line must be the absolute last thing in your response.';

if (c.includes(oldAction)) {
  c = c.replace(oldAction, newAction);
  steps++;
  console.log('Done: rewrote action instruction');
}

// FIX 2: Fix client-side stripping - make it aggressive
// Current: const cleanContent = (actionLine ? m.content.replace(actionLine[0], '') : m.content).replace(/\n*on this\s*$/gm,'').replace(/^on this\s*$/gm,'').trimEnd();
// Problem: the regex might not match because of how the content ends

const oldClean = "const cleanContent = (actionLine ? m.content.replace(actionLine[0], '') : m.content).replace(/\\n*on this\\s*$/gm,'').replace(/^on this\\s*$/gm,'').trimEnd();";

if (c.includes(oldClean)) {
  const newClean = "const cleanContent = (actionLine ? m.content.replace(actionLine[0], '') : m.content).replace(/\\n*on this\\s*$/gm,'').replace(/^on this\\s*$/gm,'').replace(/on this\\s*$/,'').replace(/\\non this\\n/g,'\\n').trimEnd();";
  c = c.replace(oldClean, newClean);
  steps++;
  console.log('Done: enhanced on this stripping regex');
} else {
  // Try the original version that might not have been updated
  const origClean = "const cleanContent = actionLine ? m.content.replace(actionLine[0], '').trimEnd() : m.content;";
  if (c.includes(origClean)) {
    const newClean = "const cleanContent = (actionLine ? m.content.replace(actionLine[0], '') : m.content).replace(/\\n*on this\\s*$/gm,'').replace(/^on this\\s*$/gm,'').replace(/on this\\s*$/,'').trimEnd();";
    c = c.replace(origClean, newClean);
    steps++;
    console.log('Done: added on this stripping (from original)');
  } else {
    // Last resort: find cleanContent and show what's there
    const idx = c.indexOf('cleanContent');
    if (idx !== -1) {
      console.log('cleanContent found at ' + idx + ': ' + c.substring(idx, idx + 200));
    } else {
      console.log('WARNING: cleanContent not found at all');
    }
  }
}

fs.writeFileSync(f, c);
console.log('\\n' + steps + ' fixes applied');
console.log('git add . && git commit -m "Kill on this forever" && git push');
