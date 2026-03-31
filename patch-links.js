/**
 * AGF Companion — Fix Further Reading Links
 * Adds LibreTexts URLs for organic naming and updates source selection logic
 * 
 * cd C:\Users\alast\Downloads\agf-companion
 * node patch-links.js
 */

const fs = require('fs');
const path = require('path');

const PAGE_JS = path.join(__dirname, 'app', 'page.js');
let code = fs.readFileSync(PAGE_JS, 'utf8');
let steps = 0;

// ═══════════════════════════════════════════════════════════════
// STEP 1: Find and replace the organic chemistry URL mappings
// ═══════════════════════════════════════════════════════════════

// The current mapping has generic OpenStax links for organic topics
// Replace with specific LibreTexts links where they're better

const oldOrgLinks = 'Organic chemistry & alkanes → https://openstax.org/books/chemistry-2e/pages/20-1-hydrocarbons';
const newOrgLinks = 'Organic chemistry & alkanes → https://chem.libretexts.org/Bookshelves/Organic_Chemistry/Organic_Chemistry_I_(Liu)/02%3A_Fundamental_of_Organic_Structures/2.04%3A_IUPAC_Naming_of_Organic_Compounds_with_Functional_Groups';

if (code.includes(oldOrgLinks)) {
  code = code.replace(oldOrgLinks, newOrgLinks);
  steps++;
  console.log('✅ Step ' + steps + ': Updated organic/alkanes link to LibreTexts IUPAC naming');
}

const oldAlkeneLink = 'Alkenes → https://openstax.org/books/chemistry-2e/pages/20-1-hydrocarbons';
const newAlkeneLink = 'Alkenes & E/Z isomerism → https://chem.libretexts.org/Bookshelves/Organic_Chemistry/Supplemental_Modules_(Organic_Chemistry)/Alkenes';

if (code.includes(oldAlkeneLink)) {
  code = code.replace(oldAlkeneLink, newAlkeneLink);
  steps++;
  console.log('✅ Step ' + steps + ': Updated alkenes link to LibreTexts alkenes module');
}

// ═══════════════════════════════════════════════════════════════
// STEP 2: Update the "Further reading" instruction
// ═══════════════════════════════════════════════════════════════

// Find the instruction that says to always use OpenStax format
const oldInstruction = 'Always pick the most relevant URL for the topic being discussed.';
const newInstruction = 'Always pick the most relevant URL for the specific topic being discussed. Use LibreTexts when it has a more targeted page (especially for organic naming, isomerism, mechanisms). Use OpenStax for broader physical/inorganic topics. Never link to a generic or tangentially related page — if no URL in the mapping fits the specific question, omit the Further Reading line rather than linking to something irrelevant.';

if (code.includes(oldInstruction)) {
  code = code.replace(oldInstruction, newInstruction);
  steps++;
  console.log('✅ Step ' + steps + ': Updated Further Reading instruction (pick best source, omit if irrelevant)');
}

// ═══════════════════════════════════════════════════════════════
// STEP 3: Add LibreTexts links to the main references block
// ═══════════════════════════════════════════════════════════════

// The chem1 system prompt has a FREE TEXTBOOK REFERENCES section
// Add LibreTexts organic links there too

const oldRefs = 'All also on LibreTexts: https://chem.libretexts.org/Bookshelves/General_Chemistry/Chemistry_2e_(OpenStax)';
const newRefs = 'All also on LibreTexts: https://chem.libretexts.org/Bookshelves/General_Chemistry/Chemistry_2e_(OpenStax)\\n• IUPAC Naming → LibreTexts Organic Chemistry: https://chem.libretexts.org/Bookshelves/Organic_Chemistry/Organic_Chemistry_I_(Liu)/02%3A_Fundamental_of_Organic_Structures/2.04%3A_IUPAC_Naming_of_Organic_Compounds_with_Functional_Groups\\n• Alkenes & Isomerism → LibreTexts: https://chem.libretexts.org/Bookshelves/Organic_Chemistry/Supplemental_Modules_(Organic_Chemistry)/Alkenes';

if (code.includes(oldRefs)) {
  code = code.replace(oldRefs, newRefs);
  steps++;
  console.log('✅ Step ' + steps + ': Added LibreTexts organic links to references block');
}

// ═══════════════════════════════════════════════════════════════
// WRITE
// ═══════════════════════════════════════════════════════════════

fs.writeFileSync(PAGE_JS, code, 'utf8');

if (steps === 0) {
  console.log('⚠️  No changes made — the link text may have already been updated or differs from expected.');
  console.log('   Run: Select-String -Path app\\page.js -Pattern "openstax|libretexts" -Context 0,0');
} else {
  console.log('\n✅ ' + steps + ' patch(es) applied!');
  console.log('\n📋 Next:');
  console.log('   npm run dev → test');
  console.log('   Ask about IUPAC naming → Further Reading should now link to LibreTexts');
  console.log('   git add . && git commit -m "Fix Further Reading links: LibreTexts for organic" && git push');
}
