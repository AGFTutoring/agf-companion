/**
 * patch-stripe-complete.js
 * 
 * Adds to page.js:
 * 1. Subscription state (quizzesUsed, dailyMsgs, isSubscribed, showPaywall)
 * 2. Quiz paywall gate (3 free quizzes)
 * 3. Ask message gate (20 free messages/day)
 * 4. Paywall screen with Stripe Checkout redirect
 * 5. Subscription verify on page load (URL param + localStorage)
 * 6. Quiz counter increment on quiz completion
 * 
 * Run: node patch-stripe-complete.js
 * From: C:\Users\alast\Downloads\agf-companion
 */

const fs = require("fs");
const FILE = "app/page.js";

if (!fs.existsSync(FILE)) {
  console.error("ERROR: " + FILE + " not found.");
  console.error("Run: cd C:\\Users\\alast\\Downloads\\agf-companion");
  process.exit(1);
}

let src = fs.readFileSync(FILE, "utf8");
const original = src;
let count = 0;

function find(label, ...candidates) {
  for (const c of candidates) {
    if (src.includes(c)) return c;
  }
  console.log("  MISS: " + label + " — no marker found");
  return null;
}

// ═══════════════════════════════════════════════════════════════
// 1. Add constants + subscription state after mode state
// ═══════════════════════════════════════════════════════════════
if (src.includes("isSubscribed") || src.includes("FREE_QUIZ_LIMIT")) {
  console.log("  SKIP: Subscription state already present");
} else {
  const modeMarker = find("mode state",
    'const[mode,setMode]=useState("ask");',
    'const [mode, setMode] = useState("ask");'
  );
  if (modeMarker) {
    const stateBlock = `${modeMarker}

  // ═══ SUBSCRIPTION & LIMITS ═══
  const FREE_QUIZ_LIMIT = 3;
  const FREE_MSG_LIMIT = 20;
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [quizzesUsed, setQuizzesUsed] = useState(0);
  const [dailyMsgsUsed, setDailyMsgsUsed] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    try {
      // Load quiz count
      const q = parseInt(localStorage.getItem("agf_quizzes_used") || "0", 10);
      setQuizzesUsed(q);
      // Load daily message count (resets at midnight)
      const msgData = JSON.parse(localStorage.getItem("agf_daily_msgs") || "{}");
      const today = new Date().toDateString();
      if (msgData.date === today) { setDailyMsgsUsed(msgData.count || 0); }
      else { localStorage.setItem("agf_daily_msgs", JSON.stringify({ date: today, count: 0 })); }
      // Check subscription
      const subbed = localStorage.getItem("agf_subscribed") === "true";
      const subEmail = localStorage.getItem("agf_sub_email") || "";
      if (subbed && subEmail) {
        fetch("/api/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: subEmail }) })
          .then(r => r.json()).then(d => { if (d.subscribed) { setIsSubscribed(true); } else { localStorage.removeItem("agf_subscribed"); localStorage.removeItem("agf_sub_email"); } })
          .catch(() => {});
      }
      // Check URL for successful return from Stripe
      const params = new URLSearchParams(window.location.search);
      if (params.get("subscribed") === "true") {
        setIsSubscribed(true);
        localStorage.setItem("agf_subscribed", "true");
        setShowPaywall(false);
        window.history.replaceState(null, "", window.location.pathname);
      }
      if (params.get("cancelled")) {
        window.history.replaceState(null, "", window.location.pathname);
      }
    } catch (e) {}
  }, []);

  const incrementQuizCount = () => {
    if (isSubscribed) return;
    const next = quizzesUsed + 1;
    setQuizzesUsed(next);
    try { localStorage.setItem("agf_quizzes_used", String(next)); } catch(e) {}
  };

  const incrementMsgCount = () => {
    if (isSubscribed) return;
    const next = dailyMsgsUsed + 1;
    setDailyMsgsUsed(next);
    try {
      localStorage.setItem("agf_daily_msgs", JSON.stringify({ date: new Date().toDateString(), count: next }));
    } catch(e) {}
  };

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    try {
      const email = prompt("Enter your email to subscribe:");
      if (!email || !email.includes("@")) { setCheckoutLoading(false); return; }
      localStorage.setItem("agf_sub_email", email);
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.error === "already_subscribed") {
        setIsSubscribed(true);
        setShowPaywall(false);
        localStorage.setItem("agf_subscribed", "true");
        localStorage.setItem("agf_sub_email", email);
        alert("You already have an active subscription! Logging you in.");
        return;
      }
      if (data.url) window.location.href = data.url;
      else alert(data.error || "Checkout failed. Please try again.");
    } catch (e) { alert("Error: " + e.message); }
    finally { setCheckoutLoading(false); }
  };

`;
    src = src.replace(modeMarker, stateBlock);
    count++;
    console.log("  \u2713 Added subscription state + handlers");
  }
}

// ═══════════════════════════════════════════════════════════════
// 2. Gate quiz start — add paywall check to showQuizOptions
// ═══════════════════════════════════════════════════════════════
if (!src.includes("FREE_QUIZ_LIMIT") && !src.includes("quizzesUsed>=FREE_QUIZ_LIMIT")) {
  console.log("  SKIP: Quiz gate (no FREE_QUIZ_LIMIT found — state patch may have failed)");
} else {
  const sqoMarker = find("showQuizOptions",
    "const showQuizOptions=()=>{if(loading||!currentUnit)return;setShowQuizPicker(true);setMode(\"quiz\");};",
    "const\nshowQuizOptions=()=>{if(loading||!currentUnit)return;setShowQuizPicker(true);setMode(\"quiz\");};",
    "const showQuizOptions = () => { if (loading || !currentUnit) return; setShowQuizPicker(true); setMode(\"quiz\"); };"
  );
  if (sqoMarker && !src.includes("quizzesUsed>=FREE_QUIZ_LIMIT")) {
    const gatedSqo = sqoMarker.replace(
      /setShowQuizPicker\(true\)/,
      "if(!isSubscribed&&quizzesUsed>=FREE_QUIZ_LIMIT){setShowPaywall(true);setMode(\"quiz\");return;}setShowQuizPicker(true)"
    );
    src = src.replace(sqoMarker, gatedSqo);
    count++;
    console.log("  \u2713 Added paywall gate to showQuizOptions");
  } else if (src.includes("quizzesUsed>=FREE_QUIZ_LIMIT")) {
    console.log("  SKIP: Quiz gate (already present)");
  }
}

// ═══════════════════════════════════════════════════════════════
// 3. Increment quiz counter on quiz completion
// ═══════════════════════════════════════════════════════════════
if (src.includes("incrementQuizCount") && !src.includes("setQuizDone(true);incrementQuizCount()")) {
  const doneMarker = find("setQuizDone",
    "{setQuizDone(true);return;}",
    "setQuizDone(true);return;",
    "setQuizDone(true); return;"
  );
  if (doneMarker && !src.includes("incrementQuizCount()")) {
    src = src.replace(doneMarker, doneMarker.replace("setQuizDone(true)", "setQuizDone(true);incrementQuizCount()"));
    count++;
    console.log("  \u2713 Added quiz counter increment on completion");
  }
} else {
  console.log("  SKIP: Quiz counter increment (already present or no incrementQuizCount)");
}

// ═══════════════════════════════════════════════════════════════
// 4. Gate Ask messages — add limit check to send function
// ═══════════════════════════════════════════════════════════════
if (!src.includes("dailyMsgsUsed") || src.includes("FREE_MSG_LIMIT&&dailyMsgsUsed")) {
  console.log("  SKIP: Ask message gate (already present or no dailyMsgsUsed)");
} else {
  const sendMarker = find("send function",
    "const send=useCallback(async()=>{const t=input.trim();if(!t||loading||!currentUnit)return;",
    "const send=useCallback(async ()=>{const t=input.trim();if(!t||loading||!currentUnit)return;",
    "const\nsend=useCallback(async()=>{const t=input.trim();if(!t||loading||!currentUnit)return;",
    "const send = useCallback(async () => {\n    const t = input.trim();\n    if (!t || loading || !currentUnit) return;"
  );
  if (sendMarker && !src.includes("FREE_MSG_LIMIT")) {
    // Add message limit check after the initial guard
    const guardEnd = sendMarker.includes("!currentUnit)return;") 
      ? "!currentUnit)return;"
      : "!currentSubject) return;";
    const insertPoint = sendMarker.indexOf(guardEnd) >= 0 ? guardEnd : null;
    if (insertPoint && src.includes(insertPoint)) {
      // Only replace the FIRST occurrence within send
      const sendStart = src.indexOf(sendMarker);
      const guardPos = src.indexOf(insertPoint, sendStart);
      if (guardPos > 0) {
        const before = src.substring(0, guardPos + insertPoint.length);
        const after = src.substring(guardPos + insertPoint.length);
        src = before + "\n    if(!isSubscribed&&dailyMsgsUsed>=FREE_MSG_LIMIT){setShowPaywall(true);return;}" + after;
        count++;
        console.log("  \u2713 Added Ask message limit gate to send function");
      }
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// 5. Increment message count after successful send
// ═══════════════════════════════════════════════════════════════
if (src.includes("incrementMsgCount") && !src.includes("incrementMsgCount()")) {
  // Find where the reply is added to messages — after setMsgs with the assistant reply
  // Look for the pattern where loading is set false after a successful chat response
  const loadingFalse = find("setLoading(false) in send",
    "}finally{setLoading(false);}",
    "} finally { setLoading(false); }"
  );
  if (loadingFalse) {
    // We want to call incrementMsgCount before setLoading(false) — find the first occurrence after the send function
    const sendPos = src.indexOf("const send=useCallback") > -1 ? src.indexOf("const send=useCallback") : src.indexOf("const\nsend=useCallback") > -1 ? src.indexOf("const\nsend=useCallback") : src.indexOf("const send = useCallback");
    if (sendPos > 0) {
      const firstFinally = src.indexOf("}finally{setLoading(false);}", sendPos);
      const firstFinallyAlt = src.indexOf("} finally { setLoading(false); }", sendPos);
      const pos = firstFinally > 0 ? firstFinally : firstFinallyAlt;
      if (pos > 0 && pos < sendPos + 3000) { // Within reasonable distance of send function
        const marker = src.substring(pos, pos + (firstFinally > 0 ? "}finally{setLoading(false);}".length : "} finally { setLoading(false); }".length));
        src = src.replace(marker, marker.replace("setLoading(false)", "incrementMsgCount();setLoading(false)"));
        count++;
        console.log("  \u2713 Added message counter increment in send");
      }
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// 6. Add paywall screen render (before quiz results screen)
// ═══════════════════════════════════════════════════════════════
if (src.includes("showPaywall") && !src.includes("PAYWALL SCREEN")) {
  const resultsMarker = find("quiz results",
    'if(mode==="quiz"&&quizDone&&currentUnit)',
    'if (mode === "quiz" && quizDone && currentUnit)'
  );
  if (resultsMarker) {
    const paywallRender = `
  /* ─── PAYWALL SCREEN ─── */
  if(showPaywall){
    const quizRemaining=Math.max(0,FREE_QUIZ_LIMIT-quizzesUsed);
    const msgRemaining=Math.max(0,FREE_MSG_LIMIT-dailyMsgsUsed);
    return(<div style={{width:"100%",height:"100vh",display:"flex",flexDirection:"column",background:C.bg,fontFamily:"'Outfit',sans-serif",color:C.text}}>
      <div style={{padding:"14px 20px",borderBottom:\`1px solid \${C.border}\`,display:"flex",alignItems:"center",gap:12}}>
        <div style={{flex:1}}><div style={{fontFamily:"'DM Serif Display',serif",fontSize:17,letterSpacing:"-0.02em"}}>AGF<span style={{color:C.green}}>tutoring</span></div></div>
        <button onClick={()=>{setShowPaywall(false);setMode("ask");}} style={{padding:"8px 16px",borderRadius:6,fontSize:12,fontWeight:500,border:\`1px solid \${C.border}\`,background:"transparent",color:C.textMuted,cursor:"pointer"}}>Back to studying</button>
      </div>
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
        <div style={{maxWidth:440,textAlign:"center"}}>
          <div style={{fontSize:48,marginBottom:20}}>{"\uD83C\uDF93"}</div>
          <div style={{fontFamily:"'DM Serif Display',serif",fontSize:26,marginBottom:12,lineHeight:1.3}}>
            {quizRemaining<=0?"You\\u2019ve used your free quizzes":"You\\u2019ve reached today\\u2019s free message limit"}
          </div>
          <div style={{fontSize:14,color:C.textMuted,lineHeight:1.7,marginBottom:28}}>
            Subscribe to unlock unlimited quizzes and messages across every subject and exam board.
          </div>
          <div style={{background:C.bgCard,border:\`1px solid \${C.border}\`,borderRadius:12,padding:"24px 28px",marginBottom:20,textAlign:"left"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:16}}>
              <div style={{fontFamily:"'DM Serif Display',serif",fontSize:18}}>AGF Study Companion</div>
              <div style={{fontSize:20,fontWeight:700,color:C.green,fontFamily:"'JetBrains Mono',monospace"}}>{"\u00A3"}29<span style={{fontSize:13,fontWeight:400,color:C.textMuted}}>/month</span></div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {["Unlimited AI-powered quizzes","Unlimited Ask messages","All exam boards — IAL, A-Level, IB, AP, GCSE","Detailed explanations & worked solutions","Revision notes with PDF download","Built on 30 years of tutoring expertise"].map((f,i)=>(
                <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",fontSize:13,color:C.text}}>
                  <span style={{color:C.green,flexShrink:0,marginTop:1}}>{"\u2713"}</span><span>{f}</span>
                </div>
              ))}
            </div>
          </div>
          <button onClick={handleCheckout} disabled={checkoutLoading} style={{width:"100%",padding:"14px 24px",borderRadius:8,border:"none",background:C.green,color:C.bg,fontSize:15,fontWeight:600,cursor:checkoutLoading?"wait":"pointer",transition:"all 0.2s",letterSpacing:"0.03em",marginBottom:12}}
            onMouseEnter={e=>{if(!checkoutLoading)e.currentTarget.style.background=C.greenLight||"#5ba86d";}}
            onMouseLeave={e=>{e.currentTarget.style.background=C.green;}}>
            {checkoutLoading?"Redirecting to checkout\u2026":"Subscribe \u2014 \u00A329/month"}
          </button>
          <div style={{fontSize:11,color:C.textDim,lineHeight:1.5}}>Secure payment via Stripe. Cancel anytime.</div>
          <div style={{marginTop:16,fontSize:12,color:C.textMuted}}>
            Already subscribed?{" "}
            <button onClick={()=>{const e=prompt("Enter your subscription email:");if(e&&e.includes("@")){fetch("/api/verify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e})}).then(r=>r.json()).then(d=>{if(d.subscribed){setIsSubscribed(true);setShowPaywall(false);localStorage.setItem("agf_subscribed","true");localStorage.setItem("agf_sub_email",e);}else{alert("No active subscription found for that email.");}}).catch(()=>alert("Could not verify. Try again."));}}} style={{background:"none",border:"none",color:C.green,cursor:"pointer",fontSize:12,fontFamily:"'Outfit',sans-serif",textDecoration:"underline"}}>Log in</button>
          </div>
          <div style={{marginTop:20,paddingTop:16,borderTop:\`1px solid \${C.border}\`,fontSize:12,color:C.textMuted}}>
            Chat mode: {isSubscribed?"unlimited":msgRemaining+" free messages remaining today"} · Quizzes: {isSubscribed?"unlimited":quizRemaining+" of "+FREE_QUIZ_LIMIT+" remaining"}
          </div>
        </div>
      </div>
    </div>);
  }

  `;
    src = src.replace(resultsMarker, paywallRender + resultsMarker);
    count++;
    console.log("  \u2713 Added paywall screen render");
  }
}

// ═══════════════════════════════════════════════════════════════
// 7. Add "X free quizzes remaining" to quiz picker
// ═══════════════════════════════════════════════════════════════
if (src.includes("Start Quiz</button>") && !src.includes("free quizzes remaining")) {
  src = src.replace(
    "Start Quiz</button>",
    "Start Quiz</button>{!isSubscribed&&<div style={{fontSize:12,color:quizzesUsed>=FREE_QUIZ_LIMIT-1?C.amber||C.textMuted:C.textDim,marginTop:8}}>{FREE_QUIZ_LIMIT-quizzesUsed>0?(FREE_QUIZ_LIMIT-quizzesUsed)+\" free quiz\"+(FREE_QUIZ_LIMIT-quizzesUsed===1?\"\":\"zes\")+\" remaining\":\"Subscribe to continue\"}</div>}"
  );
  count++;
  console.log("  \u2713 Added free quizzes remaining counter");
}

// ═══════════════════════════════════════════════════════════════
// 8. Add message counter indicator to chat input area
// ═══════════════════════════════════════════════════════════════
if (src.includes("Grounded in curated notes") && !src.includes("messages remaining")) {
  src = src.replace(
    "Grounded in curated notes",
    "Grounded in curated notes{!isSubscribed&&\" · \"+(FREE_MSG_LIMIT-dailyMsgsUsed)+\" messages remaining today\"}"
  );
  count++;
  console.log("  \u2713 Added message counter to footer");
}

// ═══════════════════════════════════════════════════════════════
// SAVE
// ═══════════════════════════════════════════════════════════════
if (src !== original) {
  fs.writeFileSync(FILE, src, "utf8");
  console.log("\n\u2705 Done: " + count + " patches applied.");
  console.log("\nTest:");
  console.log("  npm run dev");
  console.log("  1. Pick a subject, send 20+ messages — paywall should appear");
  console.log("  2. Start 3 quizzes — paywall should appear on 4th");
  console.log("  3. Click Subscribe — should ask for email then redirect to Stripe");
  console.log("\nDeploy:");
  console.log("  git add .");
  console.log('  git commit -m "Add Stripe subscription: 3 free quizzes + 20 msgs/day"');
  console.log("  git push");
  console.log("  del patch-stripe-complete.js");
} else {
  console.log("\nNo changes made.");
}
