// fix-katex-rendering.js
// Adds real LaTeX rendering (KaTeX) for equation content that uses LaTeX
// syntax (e.g. AP Calculus's \\lim, \\frac, $$...$$ etc). EqBox now detects
// LaTeX commands and typesets them properly via KaTeX; if content has no
// LaTeX commands (i.e. all the existing Chemistry/Physics/Maths equations,
// which use plain Unicode notation) it falls back to the exact same plain-box
// rendering as before -- zero visual change for anything already working.
// Also adds support for standalone $$...$$ block-math lines, which weren't
// wrapped in [EQUATION:...] tags at all and were showing as raw text.
//
// IMPORTANT: run 'npm install katex' BEFORE 'npm run dev' or the build will
// fail with a missing-module error -- this script only edits source files,
// it doesn't install the package for you.
//
// Usage: place this file in your project root and run:
//   node fix-katex-rendering.js
//   npm install katex
//   npm run dev

const fs = require('fs');
const path = require('path');

function patchFile(filePath, edits) {
  let raw = fs.readFileSync(filePath, 'utf8');
  const usesCRLF = raw.includes('\r\n');
  let content = usesCRLF ? raw.replace(/\r\n/g, '\n') : raw;
  let appliedCount = 0;
  const errors = [];
  for (const edit of edits) {
    const occurrences = content.split(edit.old).length - 1;
    if (occurrences === 0) {
      errors.push(edit.label);
      console.error(`FAILED: ${edit.label} \u2014 anchor not found. May already be patched, or the file changed.`);
      continue;
    }
    if (occurrences > 1) {
      errors.push(edit.label);
      console.error(`FAILED: ${edit.label} \u2014 found ${occurrences} matches, expected 1.`);
      continue;
    }
    content = content.replace(edit.old, edit.new);
    appliedCount++;
    console.log(`OK: ${edit.label}`);
  }
  const output = usesCRLF ? content.replace(/\n/g, '\r\n') : content;
  fs.writeFileSync(filePath, output, 'utf8');
  return { appliedCount, errors };
}

const pageEdits = [
  { label: 'add katex import', old: "import { useState, useRef, useEffect, useCallback } from \"react\";", new: "import { useState, useRef, useEffect, useCallback } from \"react\";\nimport katex from \"katex\";" },
  { label: 'EqBox LaTeX-aware rendering + KatexBlock helper', old: "function EqBox({content}){return(<div style={{background:C.bgLight,border:`1px solid ${C.greenBorder}`,borderRadius:8,padding:\"8px 16px\",margin:\"6px 0\",display:\"inline-block\",fontFamily:\"'JetBrains Mono',monospace\",fontSize:15,fontWeight:500,color:C.green}}>{content}</div>);}", new: "function KatexBlock({tex,display}){\n  let html=\"\";\n  try{html=katex.renderToString(tex,{throwOnError:false,displayMode:!!display});}\n  catch(e){html=null;}\n  if(html===null)return <div style={{background:C.bgLight,border:`1px solid ${C.greenBorder}`,borderRadius:8,padding:\"8px 16px\",margin:\"6px 0\",fontFamily:\"'JetBrains Mono',monospace\",fontSize:14,color:C.green,whiteSpace:\"pre-wrap\",overflowX:\"auto\"}}>{tex}</div>;\n  return <div style={{margin:\"10px 0\",overflowX:\"auto\",color:C.green}} dangerouslySetInnerHTML={{__html:html}}/>;\n}\nfunction EqBox({content}){\n  const isLatex=/\\\\[a-zA-Z]+/.test(content);\n  if(isLatex){\n    let html=\"\";\n    try{html=katex.renderToString(content,{throwOnError:false,displayMode:true});}\n    catch(e){html=null;}\n    if(html!==null)return <div style={{background:C.bgLight,border:`1px solid ${C.greenBorder}`,borderRadius:8,padding:\"10px 16px\",margin:\"6px 0\",overflowX:\"auto\",color:C.green}} dangerouslySetInnerHTML={{__html:html}}/>;\n  }\n  return(<div style={{background:C.bgLight,border:`1px solid ${C.greenBorder}`,borderRadius:8,padding:\"8px 16px\",margin:\"6px 0\",display:\"inline-block\",fontFamily:\"'JetBrains Mono',monospace\",fontSize:15,fontWeight:500,color:C.green}}>{content}</div>);\n}" },
  { label: 'standalone $$...$$ block math support', old: "} else if(hrRe.test(line)){\n      elements.push(<div key={`hr${i}`} style={{height:1,background:C.border,margin:\"14px 0\"}}/>);\n    } else if(line.startsWith(\"# \")){", new: "} else if(hrRe.test(line)){\n      elements.push(<div key={`hr${i}`} style={{height:1,background:C.border,margin:\"14px 0\"}}/>);\n    } else if(line.startsWith(\"$$\")&&line.endsWith(\"$$\")&&line.length>4){\n      elements.push(<KatexBlock key={`tex${i}`} tex={line.slice(2,-2).trim()} display={true}/>);\n    } else if(line===\"$$\"){\n      let j=i+1;const texLines=[];\n      while(j<lines.length&&lines[j].trim()!==\"$$\"){texLines.push(lines[j]);j++;}\n      elements.push(<KatexBlock key={`texb${i}`} tex={texLines.join(\"\\n\").trim()} display={true}/>);\n      i=j;\n    } else if(line.startsWith(\"# \")){" },
];
const layoutEdits = [
  { label: 'KaTeX CSS link', old: "        <link\n          href=\"https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap\"\n          rel=\"stylesheet\"\n        />\n      </head>", new: "        <link\n          href=\"https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap\"\n          rel=\"stylesheet\"\n        />\n        <link\n          href=\"https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css\"\n          rel=\"stylesheet\"\n          crossOrigin=\"anonymous\"\n        />\n      </head>" }
];

console.log('--- app/page.js ---');
const r1 = patchFile(path.join(__dirname, 'app', 'page.js'), pageEdits);
console.log('--- app/layout.js ---');
const r2 = patchFile(path.join(__dirname, 'app', 'layout.js'), layoutEdits);

const totalErrors = r1.errors.length + r2.errors.length;
if (totalErrors > 0) {
  console.error(`\n${totalErrors} edit(s) failed -- review before committing.`);
} else {
  console.log('\nAll edits applied successfully.');
  console.log('\nIMPORTANT NEXT STEP: run \u2018npm install katex\u2019 now, before npm run dev, or the app will fail to build.');
}