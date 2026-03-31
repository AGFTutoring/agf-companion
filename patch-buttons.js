/**
 * AGF Companion — Make action buttons clickable
 * Detects the action button line in AI responses and renders as clickable pills
 * 
 * cd C:\Users\alast\Downloads\agf-companion
 * node patch-buttons.js
 */

const fs = require('fs');
const path = require('path');

const PAGE_JS = path.join(__dirname, 'app', 'page.js');
let code = fs.readFileSync(PAGE_JS, 'utf8');
let steps = 0;

// ═══════════════════════════════════════════════════════════════
// STEP 1: Add action button detection to parseAndRender
// ═══════════════════════════════════════════════════════════════

// Find the parseAndRender function — it starts with "function parseAndRender(text){"
const parseStart = code.indexOf('function parseAndRender(text){');
if (parseStart === -1) {
  console.error('Could not find parseAndRender function');
  process.exit(1);
}

// We need to add a check at the start of the line processing loop
// The action buttons line contains all three emojis
// We'll detect it and return a special marker, then handle it in the message renderer

// Instead of modifying parseAndRender (which is complex minified code),
// we'll intercept at the message rendering level — where {parseAndRender(m.content)} is called
// We'll wrap it to detect and strip the action line, then render buttons separately

// Find where messages are rendered with parseAndRender
const renderPattern = '{parseAndRender(m.content)}';
const renderIdx = code.indexOf(renderPattern);

if (renderIdx === -1) {
  console.error('Could not find {parseAndRender(m.content)}');
  process.exit(1);
}

// Replace the message content rendering to detect and handle action buttons
const oldRender = '{parseAndRender(m.content)}';
const newRender = `{(()=>{
  const actionLine = m.content.match(/📖.*Deeper notes.*🌍.*Real-world.*📚.*Quiz me/);
  const cleanContent = actionLine ? m.content.replace(actionLine[0], '').trimEnd() : m.content;
  return <>
    {parseAndRender(cleanContent)}
    {actionLine && m.role==="assistant" && (
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:12,paddingTop:10,borderTop:"1px solid "+C.border}}>
        {[
          {icon:"📖",label:"Deeper notes",prompt:"Give me detailed revision notes on what we just discussed. Include definitions, key formulae, worked examples, exam tips, and common mistakes."},
          {icon:"🌍",label:"Real-world example",prompt:"Give me a vivid real-world example or everyday application of the concept we just discussed."},
          {icon:"📚",label:"Quiz me on this",prompt:"Quiz me with an exam-style question on the topic we just discussed."}
        ].map((btn,bi)=>(
          <button key={bi} onClick={()=>{setInput(btn.prompt);setTimeout(()=>{send();},100);}}
            style={{padding:"6px 14px",borderRadius:6,border:"1px solid "+C.greenBorder,background:C.greenDim,color:C.green,fontSize:12,fontWeight:500,cursor:"pointer",display:"flex",alignItems:"center",gap:6,transition:"all 0.2s"}}
            onMouseEnter={e=>{e.currentTarget.style.background=C.green;e.currentTarget.style.color=C.bg;}}
            onMouseLeave={e=>{e.currentTarget.style.background=C.greenDim;e.currentTarget.style.color=C.green;}}
          >{btn.icon} {btn.label}</button>
        ))}
      </div>
    )}
  </>;
})()}`;

code = code.replace(oldRender, newRender);
steps++;
console.log('✅ Step ' + steps + ': Made action buttons clickable');

// ═══════════════════════════════════════════════════════════════
// STEP 2: Fix the send function reference
// The buttons call send() but need input to be set first
// Actually, let's use a direct approach — call send with the prompt directly
// We need a helper that bypasses the input state
// ═══════════════════════════════════════════════════════════════

// Actually the above approach has a timing issue — setInput + send() won't work
// because send reads from the input state which hasn't updated yet.
// Better approach: create a sendDirect function or use the existing send logic inline.

// Let's fix the button onClick to set input and trigger send on next tick
// The setTimeout(100) should handle it, but let's make it more robust
// by using a ref pattern. Actually, the simplest fix is to just set the input
// and let the user click send — or better, directly construct the message.

// Replace the button onClick with a direct message approach
const oldButtonClick = `onClick={()=>{setInput(btn.prompt);setTimeout(()=>{send();},100);}}`;
const newButtonClick = `onClick={()=>{const t=btn.prompt;const userMsg={role:"user",content:t};setMsgs(p=>[...p,userMsg]);setLoading(true);setErr(null);(async()=>{try{const apiMsgs=[...msgs,userMsg].filter((m2,idx)=>!(idx===0&&m2.role==="assistant")).map(m2=>({role:m2.role,content:m2.content}));if(!apiMsgs.length||apiMsgs[0].role!=="user")apiMsgs.unshift({role:"user",content:t});const res=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:apiMsgs,system:currentUnit.system,mode:"ask"})});const data=await res.json();if(data.error)throw new Error(data.error.message);const reply=data.content?.map(b=>b.type==="text"?b.text:"").filter(Boolean).join("\\n")||"Sorry, I couldn't generate a response.";setMsgs(p=>[...p,{role:"assistant",content:reply}]);}catch(e){setErr(e.message);}finally{setLoading(false);}})();}}`;

if (code.includes(oldButtonClick)) {
  code = code.replace(oldButtonClick, newButtonClick);
  steps++;
  console.log('✅ Step ' + steps + ': Wired buttons to send messages directly');
}


// ═══════════════════════════════════════════════════════════════
// WRITE
// ═══════════════════════════════════════════════════════════════

fs.writeFileSync(PAGE_JS, code, 'utf8');

if (steps === 0) {
  console.log('⚠️  No changes made.');
} else {
  console.log('\n✅ ' + steps + ' patch(es) applied!');
  console.log('\n📋 Next:');
  console.log('   npm run dev → test');
  console.log('   The 📖 🌍 📚 buttons should now be green clickable pills');
  console.log('   git add . && git commit -m "Make action buttons clickable" && git push');
}
