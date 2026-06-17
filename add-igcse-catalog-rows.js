// add-igcse-catalog-rows.js
// Run this AFTER add-igcse-core-extended.js. The BOARD_CONTEXT edits
// from that script already succeeded (it told you so) — this script
// only does the 3 catalog rows that failed, fixed for the CRLF
// (Windows-style) line endings your local file actually has.
//
// Usage: place this file in your project root and run:
//   node add-igcse-catalog-rows.js

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app', 'page.js');
let raw = fs.readFileSync(filePath, 'utf8');

const usesCRLF = raw.includes('\r\n');
// Normalize to \n for matching, convert back to \r\n at the end if needed.
let content = usesCRLF ? raw.replace(/\r\n/g, '\n') : raw;

function safeReplace(content, oldStr, newStr, label) {
  const occurrences = content.split(oldStr).length - 1;
  if (occurrences === 0) {
    throw new Error(`Could not find anchor for "${label}". It may already be patched, or the file changed. No changes made for this section.`);
  }
  if (occurrences > 1) {
    throw new Error(`Found ${occurrences} matches for "${label}", expected exactly 1. Refusing to patch ambiguously.`);
  }
  return content.replace(oldStr, newStr);
}

const edits = [
  {
    label: 'catalog chemistry',
    old: '{ system: "GCSE / IGCSE", boards: [\n        { board: "Foundation", unitKey: "chem1", boardId: "gcse-chem-f" },\n        { board: "Higher", unitKey: "chem1", boardId: "gcse-chem-h" },\n      ]},',
    new: '{ system: "GCSE / IGCSE", boards: [\n        { board: "Foundation", unitKey: "chem1", boardId: "gcse-chem-f" },\n        { board: "Higher", unitKey: "chem1", boardId: "gcse-chem-h" },\n      ]},\n      { system: "IGCSE (Cambridge)", boards: [\n        { board: "Core", unitKey: "chem1", boardId: "igcse-chem-core" },\n        { board: "Extended", unitKey: "chem1", boardId: "igcse-chem-extended" },\n      ]},'
  },
  {
    label: 'catalog physics',
    old: '{ system: "GCSE / IGCSE", boards: [\n        { board: "Foundation", unitKey: "phys1", boardId: "gcse-phys-f" },\n        { board: "Higher", unitKey: "phys1", boardId: "gcse-phys-h" },\n      ]},',
    new: '{ system: "GCSE / IGCSE", boards: [\n        { board: "Foundation", unitKey: "phys1", boardId: "gcse-phys-f" },\n        { board: "Higher", unitKey: "phys1", boardId: "gcse-phys-h" },\n      ]},\n      { system: "IGCSE (Cambridge)", boards: [\n        { board: "Core", unitKey: "phys1", boardId: "igcse-phys-core" },\n        { board: "Extended", unitKey: "phys1", boardId: "igcse-phys-extended" },\n      ]},'
  },
  {
    label: 'catalog maths',
    old: '{ system: "GCSE / IGCSE", boards: [\n        { board: "Foundation", unitKey: "maths", boardId: "gcse-maths-f" },\n        { board: "Higher", unitKey: "maths", boardId: "gcse-maths-h" },\n      ]},',
    new: '{ system: "GCSE / IGCSE", boards: [\n        { board: "Foundation", unitKey: "maths", boardId: "gcse-maths-f" },\n        { board: "Higher", unitKey: "maths", boardId: "gcse-maths-h" },\n      ]},\n      { system: "IGCSE (Cambridge)", boards: [\n        { board: "Core", unitKey: "maths", boardId: "igcse-maths-core" },\n        { board: "Extended", unitKey: "maths", boardId: "igcse-maths-extended" },\n      ]},'
  },
];

let appliedCount = 0;
const errors = [];

for (const edit of edits) {
  try {
    content = safeReplace(content, edit.old, edit.new, edit.label);
    appliedCount++;
    console.log(`OK: ${edit.label}`);
  } catch (err) {
    errors.push(`${edit.label}: ${err.message}`);
    console.error(`FAILED: ${edit.label} \u2014 ${err.message}`);
  }
}

if (errors.length > 0) {
  console.error(`\n${errors.length} of ${edits.length} edits failed. Writing file with only the ${appliedCount} successful edits applied.`);
} else {
  console.log(`\nAll ${appliedCount} edits applied successfully.`);
}

// Convert back to CRLF if that's what the file originally used.
const output = usesCRLF ? content.replace(/\n/g, '\r\n') : content;

fs.writeFileSync(filePath, output, 'utf8');

console.log('\nNext steps: npm run dev, check Chemistry/Physics/Maths pickers for a new "IGCSE (Cambridge)" row with Core/Extended buttons, then commit & push.');
