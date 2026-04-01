/**
 * AGF Companion — Fix token limit + "on this" fragment
 * 
 * cd C:\Users\alast\Downloads\agf-companion
 * node patch-fix.js
 */

const fs = require('fs');
const path = require('path');
let steps = 0;

// FIX 1: Increase max_tokens for ask mode (1200 -> 3000)
const ROUTE_JS = path.join(__dirname, 'app', 'api', 'chat', 'route.js');
let route = fs.readFileSync(ROUTE_JS, 'utf8');

const oldTokens = 'const maxTokens = mode === "quiz" ? 4000 : mode === "resources" ? 4000 : 1200;';
const newTokens = 'const maxTokens = mode === "quiz" ? 4000 : mode === "resources" ? 4000 : 3000;';

if (route.includes(oldTokens)) {
  route = route.replace(oldTokens, newTokens);
  fs.writeFileSync(ROUTE_JS, route, 'utf8');
  steps++;
  console.log('Done: ask mode max_tokens 1200 -> 3000');
} else {
  console.log('Token limit line not found (may already be updated)');
}

// FIX 2: Tell AI not to output "on this" after action buttons
const PAGE_JS = path.join(__dirname, 'app', 'page.js');
let code = fs.readFileSync(PAGE_JS, 'utf8');

const oldInstr = 'After EVERY response, end with exactly these three action buttons on their own line:';
const newInstr = 'After EVERY response, end with exactly this action line (and NOTHING else after it — no extra text like "on this"):';

if (code.includes(oldInstr)) {
  code = code.replace(oldInstr, newInstr);
  fs.writeFileSync(PAGE_JS, code, 'utf8');
  steps++;
  console.log('Done: updated action instruction to prevent "on this"');
}

console.log('\n' + steps + ' fix(es) applied');
console.log('git add . && git commit -m "Fix token limit + on this" && git push');
