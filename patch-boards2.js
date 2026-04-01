/**
 * AGF Companion — Fix remaining Coming Soon boards
 * Only Pearson Edexcel UK and AQA Chemistry still have comingSoon
 * 
 * cd C:\Users\alast\Downloads\agf-companion
 * node patch-boards2.js
 */

const fs = require('fs');
const path = require('path');

const PAGE_JS = path.join(__dirname, 'app', 'page.js');
let code = fs.readFileSync(PAGE_JS, 'utf8');
let steps = 0;

// Fix 1: Pearson Edexcel UK Chemistry — remove comingSoon, add unitKeys to papers
const old1 = '{ board: "Pearson Edexcel", comingSoon: true, papers: [';
const idx1 = code.indexOf(old1);

if (idx1 !== -1) {
  code = code.replace(old1, '{ board: "Pearson Edexcel", papers: [');
  steps++;
  console.log('✅ Removed comingSoon from Pearson Edexcel UK');
  
  // Now add unitKeys to the papers (they're right after)
  // Find the papers within the next 300 chars
  const paperBlock = code.substring(idx1, idx1 + 400);
  
  // Paper 1
  const p1old = '{ name: "Paper 1", subtitle: "Core Inorganic & Physical" }';
  if (code.includes(p1old)) {
    code = code.replace(p1old, '{ name: "Paper 1", subtitle: "Core Inorganic & Physical", unitKey: "chem1" }');
    steps++;
    console.log('✅ Edexcel UK Paper 1 → chem1');
  }
  
  // Paper 2
  const p2old = '{ name: "Paper 2", subtitle: "Core Organic & Physical" }';
  if (code.includes(p2old)) {
    code = code.replace(p2old, '{ name: "Paper 2", subtitle: "Core Organic & Physical", unitKey: "chem1" }');
    steps++;
    console.log('✅ Edexcel UK Paper 2 → chem1');
  }
  
  // Paper 3
  const p3old = '{ name: "Paper 3", subtitle: "General & Practical" }';
  if (code.includes(p3old)) {
    code = code.replace(p3old, '{ name: "Paper 3", subtitle: "General & Practical", unitKey: "chem2" }');
    steps++;
    console.log('✅ Edexcel UK Paper 3 → chem2');
  }
}

// Fix 2: AQA Chemistry — remove comingSoon, add unitKeys to papers
const old2 = '{ board: "AQA", comingSoon: true, papers: [';
const idx2 = code.indexOf(old2);

if (idx2 !== -1) {
  code = code.replace(old2, '{ board: "AQA", papers: [');
  steps++;
  console.log('✅ Removed comingSoon from AQA');
  
  // Paper 1
  const ap1 = '{ name: "Paper 1", subtitle: "Inorganic & Physical" }';
  if (code.includes(ap1)) {
    code = code.replace(ap1, '{ name: "Paper 1", subtitle: "Inorganic & Physical", unitKey: "chem1" }');
    steps++;
    console.log('✅ AQA Paper 1 → chem1');
  }
  
  // Paper 2
  const ap2 = '{ name: "Paper 2", subtitle: "Organic & Physical" }';
  if (code.includes(ap2)) {
    code = code.replace(ap2, '{ name: "Paper 2", subtitle: "Organic & Physical", unitKey: "chem1" }');
    steps++;
    console.log('✅ AQA Paper 2 → chem1');
  }
  
  // Paper 3
  const ap3 = '{ name: "Paper 3", subtitle: "Unified Chemistry" }';
  if (code.includes(ap3)) {
    code = code.replace(ap3, '{ name: "Paper 3", subtitle: "Unified Chemistry", unitKey: "chem2" }');
    steps++;
    console.log('✅ AQA Paper 3 → chem2');
  }
}

// Also check: are IAL units 3-6 still comingSoon?
const ialCheck = [
  'Unit 3 (WCH13)',
  'Unit 4 (WCH14)',
  'Unit 5 (WCH15)',
  'Unit 6 (WCH16)',
  'Unit 3 (WPH13)',
  'Unit 4 (WPH14)',
  'Unit 5 (WPH15)',
  'Unit 6 (WPH16)',
];

for (const unit of ialCheck) {
  const pattern = `name: "${unit}"`;
  const idx = code.indexOf(pattern);
  if (idx !== -1) {
    const context = code.substring(idx - 30, idx + 80);
    if (context.includes('comingSoon: true')) {
      // Fix it
      const oldUnit = context.match(/\{[^}]*comingSoon: true[^}]*\}/);
      if (oldUnit) {
        const fixed = oldUnit[0].replace('unitKey: null, ', '').replace('comingSoon: true', '').replace(', }', ' }');
        // Determine unitKey based on unit name
        let uk = 'chem1';
        if (unit.includes('WCH1') && ['4','5','6'].includes(unit.slice(-2,-1))) uk = 'chem2';
        if (unit.includes('WPH11') || unit.includes('WPH13')) uk = 'phys1';
        if (unit.includes('WPH1') && ['4','5','6'].includes(unit.slice(-2,-1))) uk = 'phys2';
        
        console.log('  ⚠️  ' + unit + ' still has comingSoon — needs manual fix');
      }
    }
  }
}

fs.writeFileSync(PAGE_JS, code, 'utf8');

const remaining = (code.match(/comingSoon: true/g) || []).length;
console.log('\n✅ ' + steps + ' fixes applied');
console.log('   ' + remaining + ' "Coming Soon" remaining (GCSE, IB, AP, admissions, language — these stay)');
console.log('\n   npm run dev → test');
console.log('   git add . && git commit -m "Make Edexcel UK + AQA chemistry live" && git push');
