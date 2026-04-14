/**
 * patch-stripe-paywall.js
 * 
 * Adds/ensures Stripe subscription paywall in page.js:
 * 1. Quiz counter state + localStorage persistence
 * 2. Subscriber email state + localStorage persistence
 * 3. Paywall screen with email input + Stripe Checkout redirect
 * 4. Login screen for returning subscribers
 * 5. Quiz counter increment on quiz completion
 * 6. "X free quizzes remaining" indicator on quiz picker
 * 
 * Run: node patch-stripe-paywall.js
 * From: C:\Users\alast\Downloads\agf-companion
 */

const fs = require("fs");
const FILE = "app/page.js";

if (!fs.existsSync(FILE)) {
  console.error("ERROR: " + FILE + " not found. Are you in the project root?");
  console.error("Run: cd C:\\Users\\alast\\Downloads\\agf-companion");
  process.exit(1);
}

let src = fs.readFileSync(FILE, "utf8");
const original = src;
let count = 0;

function patch(label, marker, replacement) {
  if (src.includes(marker)) {
    src = src.replace(marker, replacement);
    count++;
    console.log("  \u2713 " + label);
  } else {
    console.log("  SKIP: " + label + " (marker not found)");
  }
}

function patchIfMissing(label, marker, checkStr, insertion) {
  if (src.includes(checkStr)) {
    console.log("  SKIP: " + label + " (already present)");
    return;
  }
  if (!src.includes(marker)) {
    console.log("  SKIP: " + label + " (marker not found)");
    return;
  }
  src = src.replace(marker, marker + insertion);
  count++;
  console.log("  \u2713 " + label);
}

console.log("Patching Stripe paywall into page.js...\n");

// ═══════════════════════════════════════════════════════════════
// 1. Add FREE_QUIZ_LIMIT constant (near top of component)
// ═══════════════════════════════════════════════════════════════
if (!src.includes("FREE_QUIZ_LIMIT")) {
  // Find the color constants object — it's near the top
  const colorMarker = src.includes("const C = {") ? "const C = {" : "const C={";
  if (src.includes(colorMarker)) {
    src = src.replace(colorMarker, "const FREE_QUIZ_LIMIT = 3;\n\n" + colorMarker);
    count++;
    console.log("  \u2713 Added FREE_QUIZ_LIMIT constant");
  } else {
    console.log("  SKIP: FREE_QUIZ_LIMIT (color constant marker not found)");
  }
}

// ═══════════════════════════════════════════════════════════════
// 2. Add subscriber state variables
// ═══════════════════════════════════════════════════════════════

// Find existing state declarations to insert nearby
// We look for the mode state since it's always present
const modeStateMarker = 'const [mode, setMode] = useState("ask")';
const modeStateMarkerAlt = 'const[mode,setMode]=useState("ask")';
const actualModeMarker = src.includes(modeStateMarker) ? modeStateMarker : 
                          src.includes(modeStateMarkerAlt) ? modeStateMarkerAlt : null;

if (actualModeMarker && !src.includes("subscriberEmail")) {
  const stateBlock = `
  // ═══ SUBSCRIPTION STATE ═══
  const [quizzesUsed, setQuizzesUsed] = useState(0);
  const [subscriberEmail, setSubscriberEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [paywallEmail, setPaywallEmail] = useState("");
  const [paywallLoading, setPaywallLoading] = useState(false);
  const [paywallError, setPaywallError] = useState("");

  // Load subscription state from localStorage on mount
  useEffect(() => {
    try {
      const used = parseInt(localStorage.getItem("agf_quizzes_used") || "0", 10);
      setQuizzesUsed(used);
      const email = localStorage.getItem("agf_subscriber_email") || "";
      if (email) {
        setSubscriberEmail(email);
        // Verify subscription is still active
        fetch("/api/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        })
          .then(r => r.json())
          .then(data => {
            setIsSubscribed(data.subscribed);
            if (!data.subscribed) {
              localStorage.removeItem("agf_subscriber_email");
              setSubscriberEmail("");
            }
          })
          .catch(() => {});
      }
      // Check URL params for successful subscription
      const params = new URLSearchParams(window.location.search);
      if (params.get("subscribed") === "true") {
        const sessionId = params.get("email");
        if (sessionId) {
          // Clear URL params
          window.history.replaceState({}, "", window.location.pathname);
          setIsSubscribed(true);
          setShowPaywall(false);
        }
      }
    } catch (e) {}
  }, []);

  const incrementQuizCount = () => {
    if (isSubscribed) return;
    const next = quizzesUsed + 1;
    setQuizzesUsed(next);
    try { localStorage.setItem("agf_quizzes_used", String(next)); } catch(e) {}
  };

  const handleSubscribe = async () => {
    if (!paywallEmail || !paywallEmail.includes("@")) {
      setPaywallError("Please enter a valid email address.");
      return;
    }
    setPaywallLoading(true);
    setPaywallError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: paywallEmail }),
      });
      const data = await res.json();
      if (data.error === "already_subscribed") {
        // They already have a sub — just log them in
        setSubscriberEmail(paywallEmail);
        setIsSubscribed(true);
        setShowPaywall(false);
        try { localStorage.setItem("agf_subscriber_email", paywallEmail); } catch(e) {}
        return;
      }
      if (data.error) throw new Error(data.error);
      if (data.url) {
        try { localStorage.setItem("agf_subscriber_email", paywallEmail); } catch(e) {}
        window.location.href = data.url;
      }
    } catch (err) {
      setPaywallError(err.message || "Something went wrong. Please try again.");
    } finally {
      setPaywallLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!paywallEmail || !paywallEmail.includes("@")) {
      setPaywallError("Please enter your email address.");
      return;
    }
    setPaywallLoading(true);
    setPaywallError("");
    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: paywallEmail }),
      });
      const data = await res.json();
      if (data.subscribed) {
        setSubscriberEmail(paywallEmail);
        setIsSubscribed(true);
        setShowPaywall(false);
        setShowLogin(false);
        try { localStorage.setItem("agf_subscriber_email", paywallEmail); } catch(e) {}
      } else {
        setPaywallError("No active subscription found for this email.");
      }
    } catch (err) {
      setPaywallError("Could not verify. Please try again.");
    } finally {
      setPaywallLoading(false);
    }
  };

`;
  src = src.replace(actualModeMarker, actualModeMarker + "\n" + stateBlock);
  count++;
  console.log("  \u2713 Added subscription state + handlers");
} else if (!actualModeMarker) {
  console.log("  SKIP: Subscription state (mode state marker not found)");
} else {
  console.log("  SKIP: Subscription state (already present)");
}

// ═══════════════════════════════════════════════════════════════
// 3. Increment quiz counter when quiz completes
// ═══════════════════════════════════════════════════════════════
// Find where quizDone is set to true
if (!src.includes("incrementQuizCount()")) {
  // The quiz completion is when setQuizDone(true) is called
  const doneMarker = "setQuizDone(true)";
  if (src.includes(doneMarker)) {
    src = src.replace(
      "setQuizDone(true)",
      "setQuizDone(true); incrementQuizCount()"
    );
    count++;
    console.log("  \u2713 Added quiz counter increment on completion");
  }
}

// ═══════════════════════════════════════════════════════════════
// 4. Gate quiz start behind paywall check  
// ═══════════════════════════════════════════════════════════════
// We need to intercept the quiz start to check if paywall should show
// Find the startQuiz function and add the gate
if (!src.includes("showPaywall") || !src.includes("FREE_QUIZ_LIMIT")) {
  // Find startQuiz and add paywall check at the beginning
  // Pattern: startQuiz = useCallback(async () => { or startQuiz = useCallback(async()=>{
  const startPatterns = [
    "const startQuiz = useCallback(async () => {",
    "const startQuiz=useCallback(async()=>{",
    "const startQuiz = useCallback(async()=>{",
    "const startQuiz=useCallback(async () => {"
  ];
  
  let startFound = false;
  for (const pat of startPatterns) {
    if (src.includes(pat) && !src.includes("quizzesUsed >= FREE_QUIZ_LIMIT")) {
      src = src.replace(
        pat,
        pat + "\n    if (!isSubscribed && quizzesUsed >= FREE_QUIZ_LIMIT) { setShowPaywall(true); return; }\n"
      );
      count++;
      startFound = true;
      console.log("  \u2713 Added paywall gate to startQuiz");
      break;
    }
  }
  if (!startFound) {
    console.log("  SKIP: Paywall gate (startQuiz pattern not found or already present)");
  }
}

// ═══════════════════════════════════════════════════════════════
// 5. Add paywall screen render
// ═══════════════════════════════════════════════════════════════
// Insert before the main return statement — we need to add a conditional render
// for when showPaywall is true
if (!src.includes("PAYWALL SCREEN")) {
  // Find the quiz results screen render — it starts with checking quizDone
  // We insert the paywall BEFORE the results check
  const resultsMarker = src.includes('if (mode === "quiz" && quizDone)') 
    ? 'if (mode === "quiz" && quizDone)' 
    : src.includes('mode==="quiz"&&quizDone')
    ? 'mode==="quiz"&&quizDone'
    : null;

  if (resultsMarker) {
    const paywallScreen = `
  /* ─── PAYWALL SCREEN ─── */
  if (showPaywall || showLogin) {
    return (
      <div style={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column", background: C.bg, fontFamily: "'Outfit',sans-serif", color: C.text }}>
        <div style={{ padding: "14px 20px", borderBottom: \`1px solid \${C.border}\`, display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: 17, letterSpacing: "-0.02em" }}>
            AGF<span style={{ color: C.gold }}>tutoring</span>
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ maxWidth: 420, width: "100%", textAlign: "center" }}>
            {showLogin ? (
              <>
                <div style={{ fontSize: 42, marginBottom: 16 }}>{"\\uD83D\\uDD13"}</div>
                <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: 24, marginBottom: 8, letterSpacing: "-0.02em" }}>
                  Welcome back
                </div>
                <div style={{ fontSize: 14, color: C.textMuted, marginBottom: 32, lineHeight: 1.6 }}>
                  Enter the email you subscribed with to continue.
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 42, marginBottom: 16 }}>{"\\uD83C\\uDF93"}</div>
                <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: 24, marginBottom: 8, letterSpacing: "-0.02em" }}>
                  You've used your 3 free quizzes
                </div>
                <div style={{ fontSize: 14, color: C.textMuted, marginBottom: 8, lineHeight: 1.6 }}>
                  Subscribe to unlock unlimited quizzes, revision notes, and AI tutoring across all subjects.
                </div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 36, fontWeight: 600, color: C.gold, margin: "20px 0 4px" }}>
                  \\u00A329<span style={{ fontSize: 16, fontWeight: 400, color: C.textMuted }}>/month</span>
                </div>
                <div style={{ fontSize: 12, color: C.textDim, marginBottom: 28 }}>Cancel anytime</div>
              </>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
              <input
                type="email"
                value={paywallEmail}
                onChange={e => { setPaywallEmail(e.target.value); setPaywallError(""); }}
                onKeyDown={e => { if (e.key === "Enter") { showLogin ? handleLogin() : handleSubscribe(); } }}
                placeholder="Your email address"
                style={{
                  padding: "12px 16px", borderRadius: 8, fontSize: 14,
                  border: \`1px solid \${paywallError ? C.red : C.border}\`,
                  background: C.bgLight, color: C.text,
                  fontFamily: "'Outfit',sans-serif", outline: "none",
                  transition: "border-color 0.2s",
                }}
              />
              {paywallError && (
                <div style={{ fontSize: 12, color: C.red, textAlign: "left" }}>{paywallError}</div>
              )}
              <button
                onClick={showLogin ? handleLogin : handleSubscribe}
                disabled={paywallLoading}
                style={{
                  padding: "12px 24px", borderRadius: 8, border: "none",
                  background: C.gold, color: C.bg,
                  fontSize: 15, fontWeight: 600, cursor: paywallLoading ? "default" : "pointer",
                  fontFamily: "'Outfit',sans-serif",
                  opacity: paywallLoading ? 0.6 : 1,
                  transition: "all 0.2s",
                }}
              >
                {paywallLoading ? "Please wait..." : showLogin ? "Log in" : "Subscribe now"}
              </button>
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: 16, fontSize: 13, color: C.textMuted }}>
              {showLogin ? (
                <>
                  <button onClick={() => { setShowLogin(false); setPaywallError(""); }} style={{ background: "none", border: "none", color: C.gold, cursor: "pointer", fontSize: 13, fontFamily: "'Outfit',sans-serif" }}>
                    Subscribe instead
                  </button>
                  <button onClick={() => { setShowPaywall(false); setShowLogin(false); setPaywallError(""); }} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 13, fontFamily: "'Outfit',sans-serif" }}>
                    Back to studying
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => { setShowLogin(true); setPaywallError(""); }} style={{ background: "none", border: "none", color: C.gold, cursor: "pointer", fontSize: 13, fontFamily: "'Outfit',sans-serif" }}>
                    Already subscribed? Log in
                  </button>
                  <button onClick={() => { setShowPaywall(false); setPaywallError(""); }} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 13, fontFamily: "'Outfit',sans-serif" }}>
                    Back to studying
                  </button>
                </>
              )}
            </div>

            {!showLogin && (
              <div style={{ marginTop: 28, padding: "16px 20px", background: C.bgLight, borderRadius: 10, border: \`1px solid \${C.border}\`, textAlign: "left" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>What you get</div>
                {["Unlimited quizzes across all subjects", "AI-powered revision notes & explanations", "Chemistry, Physics, Maths & more", "Exam-board specific content", "24/7 availability"].map((item, i) => (
                  <div key={i} style={{ fontSize: 13, color: C.text, padding: "5px 0", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: C.gold, fontSize: 14 }}>{"\\u2713"}</span> {item}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  `;
    src = src.replace(resultsMarker, paywallScreen + resultsMarker);
    count++;
    console.log("  \u2713 Added paywall screen render");
  } else {
    console.log("  SKIP: Paywall screen (results marker not found)");
  }
}

// ═══════════════════════════════════════════════════════════════
// 6. Add "X free quizzes remaining" to quiz picker (if quiz picker exists)
// ═══════════════════════════════════════════════════════════════
if (!src.includes("free quizzes remaining") && !src.includes("free quiz remaining")) {
  // Look for the quiz picker's "Start Quiz" button area
  const startBtnMarkers = [
    "Start Quiz</button>",
    "Start Quiz</div>",
  ];
  
  let quizRemainingAdded = false;
  for (const marker of startBtnMarkers) {
    if (src.includes(marker)) {
      const counterUI = marker + `
              {!isSubscribed && (
                <div style={{ textAlign: "center", marginTop: 12, fontSize: 12, color: quizzesUsed >= FREE_QUIZ_LIMIT - 1 ? C.amber : C.textDim }}>
                  {quizzesUsed >= FREE_QUIZ_LIMIT 
                    ? "Subscribe to continue taking quizzes"
                    : (FREE_QUIZ_LIMIT - quizzesUsed) + " free quiz" + (FREE_QUIZ_LIMIT - quizzesUsed === 1 ? "" : "zes") + " remaining"
                  }
                </div>
              )}`;
      src = src.replace(marker, counterUI);
      count++;
      quizRemainingAdded = true;
      console.log("  \u2713 Added free quizzes remaining counter");
      break;
    }
  }
  if (!quizRemainingAdded) {
    console.log("  SKIP: Free quizzes counter (Start Quiz button not found)");
  }
}

// ═══════════════════════════════════════════════════════════════
// 7. Add subscriber indicator to header (small "PRO" badge or email)
// ═══════════════════════════════════════════════════════════════
if (!src.includes("PRO</span>") && !src.includes("subscriberBadge")) {
  // Find the header area — look for the quiz close button in the main chat header
  const headerCloseMarkers = [
    '}>Quiz</button>\n        </div>',
    '}>Quiz</button></div>',
  ];
  
  // Try to add after the Ask/Quiz tab buttons
  const tabEndMarker = "}>Quiz</button>";
  if (src.includes(tabEndMarker) && !src.includes("subscriberBadge")) {
    // Find the LAST occurrence in the chat header area (not quiz screen)
    // We'll add a small PRO badge next to the tabs
    // Actually, let's keep it simple — just skip this for now
    console.log("  SKIP: Subscriber badge (will add in future iteration)");
  }
}

// ═══════════════════════════════════════════════════════════════
// SAVE
// ═══════════════════════════════════════════════════════════════
if (src !== original) {
  fs.writeFileSync(FILE, src, "utf8");
  console.log("\n\u2705 Done: " + count + " patches applied to " + FILE);
  console.log("\nNext steps:");
  console.log("  1. npm run dev");
  console.log("  2. Test: complete 3 quizzes, verify paywall appears");
  console.log("  3. Test: enter email, click Subscribe, verify Stripe redirect");
  console.log("  4. git add . && git commit -m \"Add Stripe subscription paywall\" && git push");
  console.log("  5. del patch-stripe-paywall.js");
} else {
  console.log("\nNo changes made — all patches already applied or markers not found.");
}
