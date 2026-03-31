/**
 * Add LibreTexts organic URLs to the chem1 system prompt
 * 
 * cd C:\Users\alast\Downloads\agf-companion
 * node patch-actions.js
 */

const fs = require('fs');
const path = require('path');

const PAGE_JS = path.join(__dirname, 'app', 'page.js');
let code = fs.readFileSync(PAGE_JS, 'utf8');

// The target string is inside the template literal on line 1087
// We search for it exactly as it appears in the JS source
const target = 'Only provide external URLs if the student explicitly asks';
const idx = code.indexOf(target);

if (idx === -1) {
  console.log('Could not find target text. Checking alternatives...');
  // Try partial matches
  const alt1 = code.indexOf('Only provide external');
  const alt2 = code.indexOf('where can I read more');
  console.log('  "Only provide external" at:', alt1);
  console.log('  "where can I read more" at:', alt2);
  if (alt1 !== -1) {
    console.log('  Context:', JSON.stringify(code.substring(alt1, alt1 + 100)));
  }
  process.exit(1);
}

// Insert the LibreTexts URLs just before the target line
const insert = [
  '• IUPAC Naming & Organic → LibreTexts Organic Chemistry I (Liu): https://chem.libretexts.org/Bookshelves/Organic_Chemistry/Organic_Chemistry_I_(Liu)/02%3A_Fundamental_of_Organic_Structures/2.02%3A_Nomenclature_of_Alkanes',
  '• Alkenes & E/Z Isomerism → LibreTexts: https://chem.libretexts.org/Bookshelves/Organic_Chemistry/Organic_Chemistry_(Morsch_et_al.)/07:_Alkenes-_Structure_and_Reactivity/7.04:_Naming_Alkenes',
  '• Free Radical Substitution → LibreTexts: https://chem.libretexts.org/Bookshelves/Organic_Chemistry/Organic_Chemistry_I_(Liu)/09:_Free_Radical_Substitution_Reaction_of_Alkanes',
].join('\\n');

// Check if already added (prevent double-apply)
if (code.includes('IUPAC Naming & Organic')) {
  console.log('LibreTexts organic URLs already present. No changes needed.');
  process.exit(0);
}

code = code.substring(0, idx) + insert + '\\n' + code.substring(idx);

fs.writeFileSync(PAGE_JS, code, 'utf8');
console.log('Done — added 3 LibreTexts URLs for organic topics');
console.log('');
console.log('git add . && git commit -m "Add LibreTexts organic URLs" && git push');
