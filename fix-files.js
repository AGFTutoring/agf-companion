// Run this with: node fix-files.js
// From: C:\Users\alast\Downloads\agf-companion

const fs = require('fs');
const path = require('path');

// ═══ FIX ROUTE.JS ═══
const routePath = path.join(__dirname, 'app', 'api', 'chat', 'route.js');
const newRoute = `export async function POST(req) {
  try {
    const { messages, system, mode } = await req.json();
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return Response.json({ error: { message: "API key not configured" } }, { status: 500 });
    }

    const maxTokens = mode === "quiz" ? 4000 : mode === "resources" ? 4000 : 1200;

    const body = {
      model: "claude-sonnet-4-20250514",
      max_tokens: maxTokens,
      system,
      messages,
    };

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return Response.json(data);
  } catch (err) {
    return Response.json({ error: { message: err.message || "Internal server error" } }, { status: 500 });
  }
}
`;
fs.writeFileSync(routePath, newRoute);
console.log('✓ route.js updated');

// ═══ FIX PAGE.JS ═══
const pagePath = path.join(__dirname, 'app', 'page.js');
let code = fs.readFileSync(pagePath, 'utf8');

// Fix 1: sendDirect signature (add displayText param if not already there)
if (!code.includes('displayText')) {
  code = code.replace(
    'const sendDirect = useCallback(async (text, overrideMode) => {',
    'const sendDirect = useCallback(async (text, overrideMode, displayText) => {'
  );
  // Fix the user message to show display text
  // Find the specific block inside sendDirect
  code = code.replace(
    /const userMsg = \{ role: "user", content: text \};\s*const next = \[\.\.\.msgs, userMsg\];\s*setMsgs\(next\);\s*setInput\(""\);\s*setLoading\(true\);\s*setErr\(null\);\s*const apiMsgs = next\.filter\(\(m, idx\) => !\(idx === 0 && m\.role === "assistant"\)\)\.map\(m => \(\{ role: m\.role, content: m\.content \}\)\);\s*if \(!apiMsgs\.length \|\| apiMsgs\[0\]\.role !== "user"\) apiMsgs\.unshift\(\{ role: "user", content: text \}\);/,
    `const userMsg = { role: "user", content: displayText || text };
    const next = [...msgs, userMsg];
    setMsgs(next);
    setInput("");
    setLoading(true);
    setErr(null);
    const apiMsgs = next.filter((m, idx) => !(idx === 0 && m.role === "assistant")).map(m => ({ role: m.role, content: m.content }));
    if (apiMsgs.length > 0) {
      apiMsgs[apiMsgs.length - 1] = { role: "user", content: text };
    }`
  );
  console.log('✓ sendDirect updated with displayText');
} else {
  console.log('· sendDirect already has displayText');
}

// Fix 2: Button click passes display text
if (code.includes('sendDirect(action.prompt, action.mode)}') && !code.includes('action.display)')) {
  code = code.replace(
    'sendDirect(action.prompt, action.mode)}',
    'sendDirect(action.prompt, action.mode, action.display)}'
  );
  console.log('✓ Button click updated');
} else {
  console.log('· Button click already updated or not found');
}

// Fix 3: Replace FOLLOW_UP_ACTIONS entirely
const oldActionsRegex = /const FOLLOW_UP_ACTIONS = \[[\s\S]*?\];/;
const newActions = `const FOLLOW_UP_ACTIONS = [
    { emoji: "📖", label: "I need more help with this", display: "📖 I need more help with this", prompt: "I need more help with this — please break the concept down further with simple analogies and visual diagrams. Use [SHAPE:...] tags for any molecular shapes, [EQUATION:...] for key formulae, [MECHANISM:...] for reaction mechanisms, and [CONFIG:...] for electron configurations. Explain it like you're tutoring me one-to-one." },
    { emoji: "🌍", label: "Real-world example", display: "🌍 Give me a real-world example", prompt: "Give me a real-world example or practical application that brings this theory to life. Make it vivid and memorable — something I'll actually remember in the exam." },
    { emoji: "📚", label: "Full revision notes", display: "📚 Generate full revision notes", mode: "resources", prompt: "Now produce COMPREHENSIVE REVISION NOTES on the topic we just discussed. These should be thorough enough for a student to revise from before an exam. Structure them as follows:\\n\\n## Key Definitions\\nEvery key term defined clearly and concisely.\\n\\n## Core Theory\\nThe essential concepts explained in a student-friendly way. Use EVERY relevant diagram tag:\\n- [SHAPE:...] for ALL molecular shapes (tetrahedral, pyramidal, bent, trigonal_planar, linear, octahedral)\\n- [EQUATION:...] for EVERY key equation or formula\\n- [MECHANISM:...] for ANY reaction mechanisms\\n- [CONFIG:...] for electron configurations\\nDo NOT skip diagrams — they are the most valuable part of these notes.\\n\\n## Worked Examples\\nAt least 2 fully worked exam-style problems with step-by-step solutions. Show every line of working.\\n\\n## Common Mistakes\\nThe 3-5 most common errors students make on this topic in exams, and how to avoid them.\\n\\n## Exam Tips\\nSpecific advice for answering questions on this topic — what examiners look for, how to pick up marks.\\n\\n## Quick Reference\\nA bullet-point summary of the absolute essentials — the things to memorise.\\n\\nMake these notes feel like they were written by an expert tutor, not copied from a textbook. Warm, clear, direct." },
  ];`;

if (oldActionsRegex.test(code)) {
  code = code.replace(oldActionsRegex, newActions);
  console.log('✓ FOLLOW_UP_ACTIONS replaced');
} else {
  console.log('✗ Could not find FOLLOW_UP_ACTIONS to replace');
}

fs.writeFileSync(pagePath, code);
console.log('\n✅ All done! Dev server should auto-reload.');
console.log('Test at http://localhost:3000');
