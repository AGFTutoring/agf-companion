// fix-table-blockquote-dollar.js
// Three fixes to the message renderer:
// 1) Table cells containing an escaped pipe (the model writes \\| so an
//    inequality like |x-a| inside a cell doesn't break the column structure)
//    were being split on EVERY pipe, garbling that row. Now uses a lookbehind
//    so escaped pipes stay inside their cell, then unescapes them for display.
// 2) Blockquote lines ('> text') had no handling at all and showed the
//    literal '> ' -- now rendered as a styled quote block.
// 3) A genuine bug in the LAST patch: JavaScript's string.replace() treats
//    '$$' in a replacement string as a special escape for a single '$', so
//    the $$ block-math detection got silently written as single $ checks.
//    Restored to $$ here -- and this script uses a function as the
//    replacement (not a string) specifically so that can't happen again.
//
// Usage: place this file in your project root and run:
//   node fix-table-blockquote-dollar.js

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app', 'page.js');
let raw = fs.readFileSync(filePath, 'utf8');
const usesCRLF = raw.includes('\r\n');
let content = usesCRLF ? raw.replace(/\r\n/g, '\n') : raw;

const edits = [
  { label: 'fix $/$$ bug + add blockquote support', old: "} else if(line.startsWith(\"$\")&&line.endsWith(\"$\")&&line.length>4){\n      elements.push(<KatexBlock key={`tex${i}`} tex={line.slice(2,-2).trim()} display={true}/>);\n    } else if(line===\"$\"){\n      let j=i+1;const texLines=[];\n      while(j<lines.length&&lines[j].trim()!==\"$\"){texLines.push(lines[j]);j++;}\n      elements.push(<KatexBlock key={`texb${i}`} tex={texLines.join(\"\\n\").trim()} display={true}/>);\n      i=j;\n    } else if(line.startsWith(\"# \")){", new: "} else if(line.startsWith(\"$$\")&&line.endsWith(\"$$\")&&line.length>4){\n      elements.push(<KatexBlock key={`tex${i}`} tex={line.slice(2,-2).trim()} display={true}/>);\n    } else if(line===\"$$\"){\n      let j=i+1;const texLines=[];\n      while(j<lines.length&&lines[j].trim()!==\"$$\"){texLines.push(lines[j]);j++;}\n      elements.push(<KatexBlock key={`texb${i}`} tex={texLines.join(\"\\n\").trim()} display={true}/>);\n      i=j;\n    } else if(line.startsWith(\"> \")){\n      elements.push(<div key={`bq${i}`} style={{borderLeft:`3px solid ${C.greenBorder}`,paddingLeft:14,margin:\"10px 0\",fontStyle:\"italic\",color:\"rgba(255,255,255,0.82)\",fontSize:13.5,lineHeight:1.7}}><RichLine text={line.slice(2)}/></div>);\n    } else if(line.startsWith(\"# \")){" },
  { label: 'fix table cell escaped-pipe splitting', old: "const splitRow=(row)=>row.split(\"|\").slice(1,-1).map(c=>c.trim());", new: "const splitRow=(row)=>row.split(/(?<!\\\\)\\|/).slice(1,-1).map(c=>c.trim().replace(/\\\\\\|/g,\"|\"));" },
];

let appliedCount = 0;
const errors = [];

for (const edit of edits) {
  const occurrences = content.split(edit.old).length - 1;
  if (occurrences === 0) {
    errors.push(edit.label);
    console.error(`FAILED: ${edit.label} \u2014 anchor not found.`);
    continue;
  }
  if (occurrences > 1) {
    errors.push(edit.label);
    console.error(`FAILED: ${edit.label} \u2014 found ${occurrences} matches, expected 1.`);
    continue;
  }
  content = content.replace(edit.old, () => edit.new);
  appliedCount++;
  console.log(`OK: ${edit.label}`);
}

if (errors.length > 0) {
  console.error(`\n${errors.length} edit(s) failed -- review before committing.`);
} else {
  console.log('\nAll edits applied successfully.');
}

const output = usesCRLF ? content.replace(/\n/g, '\r\n') : content;
fs.writeFileSync(filePath, output, 'utf8');
console.log('\nNext steps: npm run dev, test a table with an inequality in a cell and ask for something quotable. Then commit & push.');