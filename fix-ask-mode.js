// Run with: node fix-ask-mode.js
// From: C:\Users\alast\Downloads\agf-companion

const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, 'app', 'page.js');
let code = fs.readFileSync(pagePath, 'utf8');

// The old personality instruction appears in every subject's system prompt
const oldPersonality = 'Personality: Patient, warm, rigorous. Guide to understanding, don\'t just give answers. Intuition before formalism. British English. Concise.';

const newPersonality = `Personality: Patient, warm, rigorous. British English. Concise but thorough.

ASK MODE RULES — CRITICAL:
- ALWAYS give direct, clear, complete explanations. Teach the student — do not quiz them.
- NEVER ask the student questions back like "what do you think?" or "have a think about..."
- NEVER ask the student to work through something on their own — that is what Quiz mode is for.
- Instead: explain the concept clearly, show all the steps, use diagrams, give worked examples, and make sure the student walks away understanding it.
- If a student asks "explain X" — explain X fully. Do not turn it into a Socratic dialogue.
- Use intuition before formalism — explain WHY something works, not just the formula.`;

const count = (code.match(new RegExp(oldPersonality.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;

if (count > 0) {
  code = code.replaceAll(oldPersonality, newPersonality);
  console.log(`✓ Updated ${count} subject system prompts`);
  console.log('  Ask mode will now teach directly instead of asking questions back');
} else {
  console.log('✗ Could not find the personality instruction to replace');
  console.log('  Looking for:', oldPersonality.slice(0, 60) + '...');
  
  // Try a more flexible search
  const matches = code.match(/Personality:.*?Guide to understanding.*?Concise\./g);
  if (matches) {
    console.log('  Found similar strings:', matches.length);
    matches.forEach((m, i) => console.log(`  ${i + 1}: "${m.slice(0, 80)}..."`));
  }
}

fs.writeFileSync(pagePath, code);
console.log('\n✅ Done! Dev server should auto-reload.');
console.log('Test: ask "Explain Newton\'s third law" — it should explain directly, not ask you to think about it.');
