/**
 * AGF Companion — Add [DISPLAYED:...] dynamic structural formula renderer
 * 
 * Draws beautiful zig-zag skeletal formulae with:
 * - Bond-line structure matching textbook conventions
 * - Substituents in teal with clear bonds
 * - Carbon numbering with circled numbers and dashed leader lines
 * - Double bond shown with parallel lines
 * 
 * Tag: [DISPLAYED:chainLength:doubleBondPos:substituents:direction:label]
 * Example: [DISPLAYED:6:3:Cl@2,F@1:rtl:2-chloro-1-fluorohex-3-ene]
 * 
 * cd C:\Users\alast\Downloads\agf-companion
 * node patch-displayed.js
 */

const fs = require('fs');
const path = require('path');

const PAGE_JS = path.join(__dirname, 'app', 'page.js');
let code = fs.readFileSync(PAGE_JS, 'utf8');
let steps = 0;

// ═══════════════════════════════════════════════════════════════
// 1. ADD DisplayedFormulaSVG COMPONENT (before parseAndRender)
// ═══════════════════════════════════════════════════════════════

const componentCode = `
function DisplayedFormulaSVG({chain,dbond,subs,dir,label}){
  const n=parseInt(chain)||4;const db=parseInt(dbond)||0;
  const sp=80,zig=40,sx=60,by=170,sl=50,ny=by+85;
  const cs=[];for(let i=0;i<n;i++){cs.push({x:sx+i*sp,y:by+(i%2===0?0:-zig),num:dir==="rtl"?n-i:i+1});}
  const w=Math.max(sx*2+(n-1)*sp+80,400),h=ny+45;
  const parsed=(subs||"").split(",").filter(Boolean).map(s=>{const[g,p]=s.split("@");return{g:g.trim(),p:parseInt(p)};}).filter(s=>s.g&&!isNaN(s.p));
  const gc=g=>["F","Cl","Br","I"].includes(g)?"#5DCAA5":["OH","NH2"].includes(g)?"#e06060":"#4d9460";
  const sd=i=>i%2===0?1:-1;
  return(<div style={{background:C.bgLight,border:"1px solid "+C.border,borderRadius:10,padding:"10px 6px 6px",margin:"10px 0",textAlign:"center",overflowX:"auto"}}>
    <svg viewBox={"0 0 "+w+" "+h} style={{width:"100%",maxWidth:Math.min(w,600),display:"block",margin:"0 auto"}}>
      {label&&<text x={w/2} y={20} textAnchor="middle" fill={C.green} fontSize={12} fontWeight={500} fontFamily="'DM Sans',sans-serif">{label}</text>}
      {cs.map((c,i)=>{if(i>=n-1)return null;const nx=cs[i+1];
        const cNum=dir==="ltr"?(i+1):n-i;const isDB=(cNum===db);
        return(<g key={"b"+i}>
          <line x1={c.x} y1={c.y} x2={nx.x} y2={nx.y} stroke={C.text} strokeWidth={2} strokeLinecap="round"/>
          {isDB&&<line x1={c.x+(i%2===0?3:-3)} y1={c.y+8} x2={nx.x+(i%2===0?3:-3)} y2={nx.y+8} stroke={C.text} strokeWidth={2} strokeLinecap="round" opacity={0.4}/>}
        </g>);
      })}
      {parsed.map((s,si)=>{
        const ci=cs.findIndex(c=>c.num===s.p);if(ci===-1)return null;
        const c=cs[ci];const d=sd(ci);const ey=c.y+d*sl;
        return(<g key={"s"+si}>
          <line x1={c.x} y1={c.y} x2={c.x} y2={ey} stroke={gc(s.g)} strokeWidth={2} strokeLinecap="round"/>
          <circle cx={c.x} cy={ey+(d>0?15:-15)} r={15} fill={C.bgLight} stroke={gc(s.g)} strokeWidth={1}/>
          <text x={c.x} y={ey+(d>0?15:-15)} textAnchor="middle" dominantBaseline="central" fill={gc(s.g)} fontSize={14} fontWeight={600} fontFamily="'DM Sans',sans-serif">{s.g}</text>
        </g>);
      })}
      {cs.map((c,i)=>(<g key={"n"+i}>
        <line x1={c.x} y1={Math.max(c.y+8,c.y-8)} x2={c.x} y2={ny-15} stroke="rgba(255,255,255,0.04)" strokeWidth={0.5} strokeDasharray="3,3"/>
        <circle cx={c.x} cy={ny} r={13} fill="none" stroke={C.green} strokeWidth={1} opacity={0.6}/>
        <text x={c.x} y={ny} textAnchor="middle" dominantBaseline="central" fill={C.green} fontSize={12} fontWeight={500} fontFamily="'JetBrains Mono',monospace">{c.num}</text>
      </g>))}
      {db>0&&<><rect x={w/2-25} y={ny+18} width={50} height={18} rx={9} fill="none" stroke={C.amber} strokeWidth={1} opacity={0.7}/>
        <text x={w/2} y={ny+27} textAnchor="middle" dominantBaseline="central" fill={C.amber} fontSize={11} fontFamily="'JetBrains Mono',monospace">C=C</text></>}
    </svg>
  </div>);
}
`;

// Insert before the parseAndRender function
const parseMarker = 'function parseAndRender(';
if (code.includes(parseMarker) && !code.includes('DisplayedFormulaSVG')) {
  code = code.replace(parseMarker, componentCode + '\n' + parseMarker);
  steps++;
  console.log('Step ' + steps + ': Added DisplayedFormulaSVG component');
}

// ═══════════════════════════════════════════════════════════════
// 2. ADD [DISPLAYED:...] TAG HANDLER TO parseAndRender
// ═══════════════════════════════════════════════════════════════

// Find where ORGANIC tag is handled (or EQUATION if ORGANIC isn't there)
const organicCheck = 'tag==="ORGANIC"';
const equationCheck = 'tag==="EQUATION"';

let insertTarget = organicCheck;
if (!code.includes(organicCheck)) {
  insertTarget = equationCheck;
}

if (code.includes(insertTarget)) {
  // Find the end of this handler's elements.push(...); and add DISPLAYED after
  const idx = code.indexOf(insertTarget);
  const afterHandler = code.indexOf('else if(tag===', idx + insertTarget.length);
  
  if (afterHandler !== -1) {
    const displayedHandler = 'else if(tag==="DISPLAYED"){const dp=params.split(":");elements.push(<DisplayedFormulaSVG key={`df${i}`} chain={dp[0]} dbond={dp[1]} subs={dp[2]} dir={dp[3]} label={dp[4]}/>);}\n      ';
    code = code.substring(0, afterHandler) + displayedHandler + code.substring(afterHandler);
    steps++;
    console.log('Step ' + steps + ': Added [DISPLAYED:...] tag handler');
  }
}

// ═══════════════════════════════════════════════════════════════
// 3. ADD [DISPLAYED:...] TO SYSTEM PROMPT AVAILABLE TAGS
// ═══════════════════════════════════════════════════════════════

const orgPromptTag = '[ORGANIC:displayed structural formula with numbering';
if (code.includes(orgPromptTag)) {
  code = code.replace(orgPromptTag, 
    '[DISPLAYED:chainLength:doubleBondPos:substituents:direction:label — draws a beautiful zig-zag skeletal formula with numbered carbons]\\n' +
    'Examples:\\n' +
    '[DISPLAYED:6:3:Cl@2,F@1:rtl:2-chloro-1-fluorohex-3-ene]\\n' +
    '[DISPLAYED:4:2::ltr:but-2-ene]\\n' +
    '[DISPLAYED:5:0:CH3@2,CH3@3:ltr:2,3-dimethylpentane]\\n' +
    '[DISPLAYED:3:0::ltr:propane]\\n\\n' +
    '[ORGANIC:displayed structural formula with numbering'
  );
  steps++;
  console.log('Step ' + steps + ': Added [DISPLAYED:...] examples to system prompt');
}

// ═══════════════════════════════════════════════════════════════
// 4. UPDATE THE ORGANIC RULE TO PREFER DISPLAYED
// ═══════════════════════════════════════════════════════════════

const oldOrgRule = 'When discussing IUPAC naming, ALWAYS use [ORGANIC:...]';
if (code.includes(oldOrgRule)) {
  code = code.replace(oldOrgRule, 'When discussing IUPAC naming, ALWAYS use [DISPLAYED:...] tag to show the structure. Use [ORGANIC:...] only as fallback');
  steps++;
  console.log('Step ' + steps + ': Updated naming rule to prefer DISPLAYED tag');
} else {
  // Try the older rule
  const olderRule = 'When showing structural formulae with carbon numbering for IUPAC naming';
  if (code.includes(olderRule)) {
    const ruleEnd = code.indexOf('\\n', code.indexOf(olderRule) + olderRule.length);
    if (ruleEnd !== -1) {
      const oldRule = code.substring(code.indexOf(olderRule), ruleEnd);
      code = code.replace(oldRule, 'When discussing IUPAC naming, ALWAYS use [DISPLAYED:chainLength:doubleBondPos:substituents:direction:label] to show the numbered structure. Parameters: chain=number of carbons, dbond=C=C position (0 if none), subs=comma-separated Group@Position, dir=ltr or rtl, label=IUPAC name');
      steps++;
      console.log('Step ' + steps + ': Updated naming rule to prefer DISPLAYED tag (alt)');
    }
  }
}

fs.writeFileSync(PAGE_JS, code, 'utf8');

console.log('\n' + steps + ' patches applied');
console.log('\nTest with: "Name CH3CH2CH=CHCH(Cl)CH2F"');
console.log('Should show beautiful zig-zag SVG with numbered carbons');
console.log('\ngit add . && git commit -m "Add DISPLAYED formula renderer" && git push');
