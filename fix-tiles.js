// fix-tiles.js — Run from agf-companion root: node fix-tiles.js
// Makes the Admissions & Language tiles bigger (3-column, vertical layout)

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app', 'page.js');
let src = fs.readFileSync(filePath, 'utf8');
let changes = 0;

// The admissions tiles section has this pattern:
// {/* Other subjects — compact tiles */}
// <div style={{display:"grid",gridTemplateColumns:"repeat(4, 1fr)",gap:10}}>
// We need to change ONLY this grid, not the core subjects grid

// Strategy: find the "Admissions & Language" text, then find the next grid after it
const admIdx = src.indexOf('Admissions & Language');
if (admIdx === -1) {
  console.log('❌ Could not find "Admissions & Language" section');
  process.exit(1);
}

// Find the next "repeat(4, 1fr)" after the admissions marker
const gridSearch = 'repeat(4, 1fr)';
const gridIdx = src.indexOf(gridSearch, admIdx);
if (gridIdx === -1) {
  console.log('ℹ️  Grid is already changed from 4 columns (maybe already patched)');
  // Check if it's already 3
  const grid3 = src.indexOf('repeat(3, 1fr)', admIdx);
  if (grid3 > -1 && grid3 < admIdx + 500) {
    console.log('✅ Already 3-column grid');
  }
} else {
  src = src.substring(0, gridIdx) + 'repeat(3, 1fr)' + src.substring(gridIdx + gridSearch.length);
  console.log('✅ Changed admissions grid to 3 columns');
  changes++;
}

// Find the gap:10 right after the grid change (within 20 chars)
const gapSearch = 'gap:10';
const gapIdx = src.indexOf(gapSearch, admIdx);
if (gapIdx > -1 && gapIdx < admIdx + 500) {
  src = src.substring(0, gapIdx) + 'gap:14' + src.substring(gapIdx + gapSearch.length);
  console.log('✅ Increased grid gap to 14');
  changes++;
}

// Find tile padding in the admissions section
// The tile style starts after the grid definition
// Look for padding:"14px 16px" after the admissions marker
const padSearch = 'padding:"14px 16px"';
const padIdx = src.indexOf(padSearch, admIdx);
if (padIdx > -1 && padIdx < admIdx + 800) {
  src = src.substring(0, padIdx) + 'padding:"22px 20px"' + src.substring(padIdx + padSearch.length);
  console.log('✅ Increased tile padding');
  changes++;
}

// Find borderRadius:10 near the padding we just changed
const brSearch = 'borderRadius:10,cursor:"pointer"';
const brIdx = src.indexOf(brSearch, admIdx);
if (brIdx > -1 && brIdx < admIdx + 900) {
  src = src.substring(0, brIdx) + 'borderRadius:12,cursor:"pointer"' + src.substring(brIdx + brSearch.length);
  console.log('✅ Increased border radius to 12');
  changes++;
}

// Change tile layout from row to column
const rowSearch = 'display:"flex",alignItems:"center",gap:10,position:"relative"';
const rowIdx = src.indexOf(rowSearch, admIdx);
if (rowIdx > -1 && rowIdx < admIdx + 1000) {
  src = src.substring(0, rowIdx) + 'display:"flex",flexDirection:"column",gap:10,position:"relative"' + src.substring(rowIdx + rowSearch.length);
  console.log('✅ Changed to vertical layout');
  changes++;
}

// Make icon bigger (fontSize:20 → 28)
const iconSearch = '<span style={{fontSize:20}}>{s.icon}</span>';
const iconIdx = src.indexOf(iconSearch, admIdx);
if (iconIdx > -1 && iconIdx < admIdx + 2000) {
  src = src.substring(0, iconIdx) + '<span style={{fontSize:28}}>{s.icon}</span>' + src.substring(iconIdx + iconSearch.length);
  console.log('✅ Increased icon to 28px');
  changes++;
}

// Make name bigger (fontSize:14 → 17)
const nameSearch = 'fontSize:14,fontWeight:600,color:C.text';
const nameIdx = src.indexOf(nameSearch, admIdx);
if (nameIdx > -1 && nameIdx < admIdx + 2500) {
  src = src.substring(0, nameIdx) + 'fontSize:17,fontWeight:600,color:C.text' + src.substring(nameIdx + nameSearch.length);
  console.log('✅ Increased name to 17px');
  changes++;
}

if (changes > 0) {
  fs.writeFileSync(filePath, src, 'utf8');
  console.log(`\n✅ ${changes} changes applied to app/page.js`);
  console.log('Test with: npm run dev');
  console.log('Then commit: git add . && git commit -m "Bigger admissions tiles" && git push');
} else {
  console.log('\nNo changes needed');
}
