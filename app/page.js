"use client";
import { useState, useRef, useEffect, useCallback } from "react";

/* ═══════════════════════════════════════════
   AGF STUDY COMPANION
   Palette: dark charcoal + muted green (AGF brand)
   ═══════════════════════════════════════════ */

const C = {
  bg: "#262626",
  bgLight: "#2e2e2e",
  bgCard: "#333333",
  bgInput: "#303030",
  green: "#4d9460",
  greenLight: "#5ba86d",
  greenDim: "rgba(77,148,96,0.15)",
  greenBorder: "rgba(77,148,96,0.3)",
  text: "#e8e5de",
  textMuted: "#9a9690",
  textDim: "#706b65",
  border: "rgba(255,255,255,0.07)",
  borderLight: "rgba(255,255,255,0.04)",
  red: "#e06060",
  amber: "#d4a24c",
};

const SYSTEM_PROMPT = `You are the AGF Study Companion — an AI tutor created by Alastair Fisher of AGF Tutoring. You follow the AGF diagnostic method: Diagnose → Rebuild → Clarify → Test → Extend.

Personality: Patient, warm, rigorous. Guide to understanding, don't just give answers. Intuition before formalism. British English. Concise.

VISUAL DIAGRAMS — CRITICAL INSTRUCTIONS:
You MUST include diagram tags when explaining shapes, mechanisms, or key equations. Place each tag on its own line.

Available tags (use EXACTLY this syntax on a new line):

[SHAPE:tetrahedral:CH₄:109.5°]
[SHAPE:pyramidal:NH₃:107°]
[SHAPE:bent:H₂O:104.5°]
[SHAPE:trigonal_planar:BF₃:120°]
[SHAPE:linear:CO₂:180°]
[SHAPE:octahedral:SF₆:90°]

[MECHANISM:free_radical:CH₄ + Cl₂ → CH₃Cl + HCl]
[MECHANISM:electrophilic_addition:CH₂=CH₂ + HBr → CH₃CH₂Br]

[EQUATION:n = m / M]

[CONFIG:Fe:1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁶ 4s²]

Rules:
- When explaining ANY molecular shape, ALWAYS include the matching [SHAPE:...] tag
- When explaining ANY mechanism, ALWAYS include [MECHANISM:...] tag
- When stating a key formula, use [EQUATION:...] tag
- When showing electron configuration, use [CONFIG:...] tag
- You can change the formula/angle in shape tags

CHEMISTRY UNIT 1 NOTES (WCH11 — Edexcel IAL):

TOPIC 1 — FORMULAE & MOLES
n=m/M, c=n/V(dm³), pV=nRT(Pa,m³,K), molar vol=24.0dm³/mol at RTP
%yield=(actual/theoretical)×100, atom economy=(Mᵣ desired/ΣMᵣ all)×100
Empirical: %→moles→÷smallest→round. Molecular: Mᵣ÷EF mass

TOPIC 2 — ATOMIC STRUCTURE
Proton(+1,1,nucleus), Neutron(0,1,nucleus), Electron(−1,≈0,shells)
Config: 1s→2s→2p→3s→3p→4s→3d. s=2,p=6,d=10
Mass spec: vaporise→ionise→accelerate→deflect→detect. M⁺=molecular mass
IE anomalies: Be→B(2s→2p), N→O(paired 2p repulsion)

TOPIC 3 — BONDING & STRUCTURE
Ionic: transfer, giant lattice, high mp, conducts molten/dissolved
Covalent: sharing, VSEPR. Metallic: delocalised e⁻, lattice of + ions
VSEPR: LP-LP>LP-BP>BP-BP. Shapes: tetrahedral 109.5°, pyramidal 107°, bent 104.5°, trigonal planar 120°, linear 180°, octahedral 90°
IMFs: London(all,↑Mᵣ), dipole-dipole, H-bonding(H—F/O/N···lone pair)
Diamond: 4 bonds, hard, non-conductor. Graphite: 3 bonds, layers, conducts, slides

TOPIC 4 — ORGANIC & ALKANES
CₙH₂ₙ₊₂, saturated, bp↑chain length ↓branching
FRS: UV+halogen. Initiation→Propagation→Termination. Fish-hook arrows
Combustion: complete(CO₂+H₂O), incomplete(CO/C). Cracking: heat/catalyst

TOPIC 5 — ALKENES
CₙH₂ₙ, C=C(σ+π), restricted rotation→E/Z(CIP rules)
Electrophilic addition: HBr→bromoalkane, Br₂→dibromoalkane, steam+H₃PO₄→alcohol, H₂+Ni→alkane
Markovnikov: H to C with more H's. 3°>2°>1° carbocation stability
Tests: Br₂ water decolourises, KMnO₄ decolourises

Only answer WCH11 content. Use diagram tags liberally.`;

const WELCOME = {
  role: "assistant",
  content: `Hello! I'm your **AGF Study Companion**, powered by Alastair's diagnostic teaching method.

I'm loaded with **Chemistry Unit 1** (WCH11) — Structure, Bonding & Introduction to Organic Chemistry.

Here's the shape of water to get us started:

[SHAPE:bent:H₂O:104.5°]

• **Ask me anything** about the syllabus
• Say **"quiz me"** for practice questions
• Ask **"show me the mechanism for..."** to see reaction diagrams

What shall we work on?`,
};

// ═══ SHAPE SVG COMPONENTS ═══
function ShapeSVG({ shape, formula, angle }) {
  const f = formula || "?";
  const a = angle || "";
  const S = { fill: "none", stroke: C.green, strokeWidth: 2 };
  const T = { fill: C.text, fontSize: 12, fontWeight: 600, fontFamily: "'DM Sans',sans-serif", textAnchor: "middle" };
  const L = { fill: C.textMuted, fontSize: 10, fontFamily: "'DM Sans',sans-serif", textAnchor: "middle" };
  const LP = { fill: "none", stroke: C.amber, strokeWidth: 1.5, strokeDasharray: "3,2" };
  const Label = { fill: C.green, fontSize: 11, fontWeight: 500, fontFamily: "'DM Sans',sans-serif", textAnchor: "middle" };
  const wrap = (children, vb = "0 0 200 180") => (
    <div style={{ background: C.bgLight, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 10px 8px", margin: "10px 0", textAlign: "center" }}>
      <svg viewBox={vb} style={{ width: "100%", maxWidth: 230, display: "block", margin: "0 auto" }}>{children}</svg>
    </div>
  );

  if (shape === "tetrahedral") return wrap(<>
    <circle cx="100" cy="78" r="15" fill={C.bgCard} {...S}/><text x="100" y="83" {...T}>C</text>
    <line x1="100" y1="63" x2="100" y2="20" {...S}/><text x="100" y="14" {...L}>H</text>
    <line x1="115" y1="78" x2="172" y2="58" {...S}/><text x="180" y="62" {...L}>H</text>
    <line x1="88" y1="91" x2="42" y2="138" {...S}/><text x="30" y="148" {...L}>H</text>
    <line x1="112" y1="91" x2="158" y2="138" {...S}/><text x="170" y="148" {...L}>H</text>
    <path d="M132,125 A38,38 0 0,0 152,100" fill="none" stroke={C.textDim} strokeWidth="1" strokeDasharray="3,2"/>
    <text x="155" y="118" fill={C.textMuted} fontSize="9" fontFamily="'DM Sans',sans-serif">{a}</text>
    <text x="100" y="172" {...Label}>{f} — Tetrahedral</text>
  </>);
  if (shape === "pyramidal") return wrap(<>
    <circle cx="100" cy="82" r="15" fill={C.bgCard} {...S}/><text x="100" y="87" {...T}>N</text>
    <line x1="100" y1="67" x2="100" y2="28" {...S}/><text x="100" y="22" {...L}>H</text>
    <line x1="87" y1="94" x2="38" y2="142" {...S}/><text x="26" y="152" {...L}>H</text>
    <line x1="113" y1="94" x2="162" y2="142" {...S}/><text x="174" y="152" {...L}>H</text>
    <ellipse cx="100" cy="60" rx="7" ry="4" {...LP}/><ellipse cx="100" cy="55" rx="7" ry="4" {...LP}/>
    <text x="122" y="52" fill={C.amber} fontSize="8" fontFamily="'DM Sans',sans-serif">lone pair</text>
    <text x="100" y="172" {...Label}>{f} — Pyramidal ({a})</text>
  </>);
  if (shape === "bent") return wrap(<>
    <circle cx="100" cy="65" r="15" fill={C.bgCard} {...S}/><text x="100" y="70" {...T}>O</text>
    <line x1="87" y1="77" x2="38" y2="125" {...S}/><text x="26" y="135" {...L}>H</text>
    <line x1="113" y1="77" x2="162" y2="125" {...S}/><text x="174" y="135" {...L}>H</text>
    <ellipse cx="86" cy="50" rx="7" ry="4" {...LP}/><ellipse cx="86" cy="45" rx="7" ry="4" {...LP}/>
    <ellipse cx="114" cy="50" rx="7" ry="4" {...LP}/><ellipse cx="114" cy="45" rx="7" ry="4" {...LP}/>
    <text x="100" y="36" fill={C.amber} fontSize="8" fontFamily="'DM Sans',sans-serif">2 lone pairs</text>
    <path d="M56,112 A45,45 0 0,0 78,90" fill="none" stroke={C.textDim} strokeWidth="1" strokeDasharray="3,2"/>
    <text x="46" y="96" fill={C.textMuted} fontSize="9" fontFamily="'DM Sans',sans-serif">{a}</text>
    <text x="100" y="160" {...Label}>{f} — Bent ({a})</text>
  </>, "0 0 200 165");
  if (shape === "trigonal_planar") return wrap(<>
    <circle cx="100" cy="78" r="15" fill={C.bgCard} {...S}/><text x="100" y="83" {...T}>B</text>
    <line x1="100" y1="63" x2="100" y2="20" {...S}/><text x="100" y="14" {...L}>F</text>
    <line x1="87" y1="91" x2="38" y2="140" {...S}/><text x="26" y="150" {...L}>F</text>
    <line x1="113" y1="91" x2="162" y2="140" {...S}/><text x="174" y="150" {...L}>F</text>
    <text x="100" y="172" {...Label}>{f} — Trigonal planar ({a})</text>
  </>);
  if (shape === "linear") return wrap(<>
    <circle cx="110" cy="35" r="14" fill={C.bgCard} {...S}/><text x="110" y="40" {...T}>C</text>
    <line x1="96" y1="35" x2="30" y2="35" {...S}/><line x1="93" y1="31" x2="33" y2="31" {...S}/>
    <line x1="124" y1="35" x2="190" y2="35" {...S}/><line x1="127" y1="31" x2="187" y2="31" {...S}/>
    <text x="18" y="40" {...L}>O</text><text x="202" y="40" {...L}>O</text>
    <text x="110" y="68" {...Label}>{f} — Linear ({a})</text>
  </>, "0 0 220 75");
  if (shape === "octahedral") return wrap(<>
    <circle cx="100" cy="90" r="14" fill={C.bgCard} {...S}/><text x="100" y="95" {...T}>S</text>
    <line x1="100" y1="76" x2="100" y2="22" {...S}/><text x="100" y="16" {...L}>F</text>
    <line x1="100" y1="104" x2="100" y2="158" {...S}/><text x="100" y="170" {...L}>F</text>
    <line x1="86" y1="90" x2="22" y2="90" {...S}/><text x="12" y="94" {...L}>F</text>
    <line x1="114" y1="90" x2="178" y2="90" {...S}/><text x="188" y="94" {...L}>F</text>
    <line x1="110" y1="80" x2="150" y2="42" stroke={C.green} strokeWidth="1.5" strokeDasharray="4,3"/><text x="158" y="40" fill={C.textMuted} fontSize="9">F</text>
    <line x1="90" y1="100" x2="50" y2="138" stroke={C.green} strokeWidth="1.5" strokeDasharray="4,3"/><text x="42" y="148" fill={C.textMuted} fontSize="9">F</text>
    <text x="100" y="186" {...Label}>{f} — Octahedral ({a})</text>
  </>, "0 0 200 192");
  return <div style={{ color: C.textMuted, fontSize: 12, padding: 8, background: C.bgLight, borderRadius: 8, margin: "6px 0" }}>Shape: {shape} {f} {a}</div>;
}

// ═══ MECHANISM DIAGRAM ═══
function MechDiagram({ type, equation }) {
  const isFR = type === "free_radical";
  const step = (c) => ({ color: c, fontSize: 11, fontWeight: 600, fontFamily: "'DM Sans',sans-serif", marginTop: 8, marginBottom: 2 });
  const line = { color: C.text, fontSize: 13, fontFamily: "'JetBrains Mono',monospace", lineHeight: 1.9 };
  const dot = <span style={{ color: C.red, fontWeight: 700 }}>•</span>;
  const arr = (c) => <span style={{ color: c || C.green }}> → </span>;
  return (
    <div style={{ background: C.bgLight, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", margin: "10px 0" }}>
      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: C.green, marginBottom: 6, fontFamily: "'DM Sans',sans-serif", fontWeight: 600 }}>
        {isFR ? "Free Radical Substitution" : "Electrophilic Addition"}
      </div>
      <div style={line}>
        {isFR ? (<>
          <div style={step(C.amber)}>Initiation — homolytic fission (UV light)</div>
          <div>Cl—Cl {arr(C.amber)} 2Cl{dot}</div>
          <div style={step(C.green)}>Propagation — chain reaction</div>
          <div>Cl{dot} + CH₄ {arr()} CH₃{dot} + HCl</div>
          <div>CH₃{dot} + Cl₂ {arr()} CH₃Cl + Cl{dot}</div>
          <div style={step(C.textMuted)}>Termination — radicals combine</div>
          <div>2Cl{dot} {arr(C.textMuted)} Cl₂</div>
          <div>Cl{dot} + CH₃{dot} {arr(C.textMuted)} CH₃Cl</div>
          <div>2CH₃{dot} {arr(C.textMuted)} C₂H₆</div>
        </>) : (<>
          <div style={step(C.green)}>Step 1 — π bond attacks electrophile</div>
          <svg viewBox="0 0 280 55" style={{ width: "100%", maxWidth: 280, display: "block", margin: "4px 0" }}>
            <text x="5" y="30" fill={C.text} fontSize="13" fontFamily="'JetBrains Mono',monospace">C=C</text>
            <path d="M42,25 Q80,5 118,20" fill="none" stroke={C.amber} strokeWidth="2" markerEnd="url(#ca)"/>
            <defs><marker id="ca" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,2 L10,5 L0,8 z" fill={C.amber}/></marker></defs>
            <text x="55" y="12" fill={C.amber} fontSize="9" fontFamily="'DM Sans',sans-serif">curly arrow</text>
            <text x="122" y="30" fill={C.text} fontSize="13" fontFamily="'JetBrains Mono',monospace">H—Br</text>
            <text x="122" y="48" fill={C.textMuted} fontSize="9" fontFamily="'DM Sans',sans-serif">δ⁺    δ⁻</text>
          </svg>
          <div>C=C + H<sup>δ⁺</sup>—Br<sup>δ⁻</sup> {arr()} C—C⁺ + Br⁻</div>
          <div style={step(C.green)}>Step 2 — Nucleophilic attack</div>
          <div>Br⁻ {arr()} C⁺ (attacks carbocation)</div>
          <div style={{ marginTop: 8, color: C.green, fontSize: 12 }}>Overall: {equation}</div>
        </>)}
      </div>
    </div>
  );
}

function EqBox({ content }) {
  return (<div style={{ background: C.bgLight, border: `1px solid ${C.greenBorder}`, borderRadius: 8, padding: "8px 16px", margin: "6px 0", display: "inline-block", fontFamily: "'JetBrains Mono',monospace", fontSize: 15, fontWeight: 500, color: C.green }}>{content}</div>);
}

function ConfigBox({ element, config }) {
  return (<div style={{ background: C.bgLight, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 14px", margin: "6px 0", display: "inline-block" }}>
    <span style={{ color: C.amber, fontWeight: 600, fontSize: 14, fontFamily: "'DM Sans',sans-serif" }}>{element}: </span>
    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, color: C.green }}>{config}</span>
  </div>);
}

// ═══ PARSER ═══
function parseAndRender(text) {
  const lines = text.split("\n");
  const elements = [];
  const tagRe = /^\[(\w+):(.+)\]$/;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const m = line.match(tagRe);
    if (m) {
      const [, tag, params] = m;
      const p = params.split(":");
      if (tag === "SHAPE") elements.push(<ShapeSVG key={`s${i}`} shape={p[0]} formula={p[1]} angle={p[2]} />);
      else if (tag === "MECHANISM") elements.push(<MechDiagram key={`m${i}`} type={p[0]} equation={p.slice(1).join(":")} />);
      else if (tag === "EQUATION") elements.push(<EqBox key={`e${i}`} content={p.join(":")} />);
      else if (tag === "CONFIG") elements.push(<ConfigBox key={`c${i}`} element={p[0]} config={p.slice(1).join(":")} />);
    } else if (line) {
      elements.push(<span key={`t${i}`}><RichLine text={line} /><br /></span>);
    } else {
      elements.push(<br key={`br${i}`} />);
    }
  }
  return elements;
}

function RichLine({ text }) {
  return text.split(/(\*\*.*?\*\*|\*.*?\*|`[^`]+`)/g).map((s, i) => {
    if (!s) return null;
    if (s.startsWith("**") && s.endsWith("**")) return <strong key={i} style={{ fontWeight: 600, color: C.text }}>{s.slice(2, -2)}</strong>;
    if (s.startsWith("*") && s.endsWith("*")) return <em key={i} style={{ fontStyle: "italic", color: C.text }}>{s.slice(1, -1)}</em>;
    if (s.startsWith("`") && s.endsWith("`")) return <code key={i} style={{ background: C.greenDim, padding: "1px 5px", borderRadius: 3, fontFamily: "'JetBrains Mono',monospace", fontSize: "0.88em", color: C.green }}>{s.slice(1, -1)}</code>;
    return <span key={i}>{s}</span>;
  });
}

// ═══ MAIN ═══
export default function Home() {
  const [msgs, setMsgs] = useState([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [mode, setMode] = useState("ask");
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, loading]);
  useEffect(() => { inputRef.current?.focus(); }, []);

  const send = useCallback(async () => {
    const t = input.trim();
    if (!t || loading) return;
    const userMsg = { role: "user", content: t };
    const next = [...msgs, userMsg];
    setMsgs(next);
    setInput("");
    setLoading(true);
    setErr(null);
    const apiMsgs = next.filter(m => m !== WELCOME).map(m => ({ role: m.role, content: m.content }));
    if (!apiMsgs.length || apiMsgs[0].role !== "user") apiMsgs.unshift({ role: "user", content: t });
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMsgs, system: SYSTEM_PROMPT, mode }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      const reply = data.content?.map(b => b.type === "text" ? b.text : "").filter(Boolean).join("\n") || "Sorry, I couldn't generate a response.";
      setMsgs(p => [...p, { role: "assistant", content: reply }]);
    } catch (e) { setErr(e.message); }
    finally { setLoading(false); inputRef.current?.focus(); }
  }, [input, loading, msgs, mode]);

  const prompts = ["Explain the shape of water", "Show me free radical substitution", "Quiz me on bonding", "Why does diamond have a high melting point?"];

  return (
    <div style={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column", background: C.bg, fontFamily: "'DM Sans',sans-serif", color: C.text }}>
      {/* HEADER */}
      <div style={{ padding: "12px 18px", display: "flex", alignItems: "center", gap: 12, borderBottom: `1px solid ${C.border}`, background: C.bg, flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 2, alignItems: "flex-end", height: 28, flexShrink: 0 }}>
          {[14, 22, 18, 10].map((h, i) => <div key={i} style={{ width: 4, height: h, background: C.green, borderRadius: 1.5 }} />)}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 16, fontWeight: 500, color: C.text }}>AGF Study Companion</div>
          <div style={{ fontSize: 9.5, color: C.textDim, letterSpacing: "0.1em", textTransform: "uppercase" }}>WCH11 · Chemistry Unit 1</div>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {[["ask", "Ask"], ["quiz", "Quiz"]].map(([k, l]) => (
            <button key={k} onClick={() => setMode(k)} style={{
              padding: "5px 14px", borderRadius: 4, fontSize: 11, fontWeight: 500, cursor: "pointer",
              letterSpacing: "0.06em", textTransform: "uppercase", transition: "all 0.2s",
              border: mode === k ? `1px solid ${C.green}` : `1px solid ${C.border}`,
              background: mode === k ? C.greenDim : "transparent",
              color: mode === k ? C.green : C.textDim,
            }}>{l}</button>
          ))}
        </div>
      </div>

      {/* MESSAGES */}
      <div style={{ flex: 1, overflowY: "auto", padding: "18px 14px", display: "flex", flexDirection: "column", gap: 14 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", gap: 8, alignItems: "flex-start" }}>
            {m.role === "assistant" && (
              <div style={{ width: 24, height: 24, borderRadius: 4, flexShrink: 0, marginTop: 2, background: C.greenDim, border: `1px solid ${C.greenBorder}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ display: "flex", gap: 1, alignItems: "flex-end" }}>{[5, 8, 6].map((h, j) => <div key={j} style={{ width: 2, height: h, background: C.green, borderRadius: 1 }} />)}</div>
              </div>
            )}
            <div style={{
              maxWidth: m.role === "user" ? "72%" : "88%", padding: "10px 14px",
              borderRadius: m.role === "user" ? "10px 10px 2px 10px" : "10px 10px 10px 2px",
              background: m.role === "user" ? C.greenDim : "rgba(255,255,255,0.025)",
              border: m.role === "user" ? `1px solid ${C.greenBorder}` : `1px solid ${C.border}`,
              fontSize: 13.5, lineHeight: 1.7,
              color: m.role === "user" ? C.text : "rgba(232,229,222,0.82)",
            }}>{parseAndRender(m.content)}</div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <div style={{ width: 24, height: 24, borderRadius: 4, flexShrink: 0, marginTop: 2, background: C.greenDim, border: `1px solid ${C.greenBorder}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ display: "flex", gap: 1, alignItems: "flex-end" }}>{[5, 8, 6].map((h, j) => <div key={j} style={{ width: 2, height: h, background: C.green, borderRadius: 1 }} />)}</div>
            </div>
            <div style={{ padding: "10px 14px", borderRadius: "10px 10px 10px 2px", background: "rgba(255,255,255,0.025)", border: `1px solid ${C.border}`, display: "flex", gap: 5 }}>
              {[0, 1, 2].map(d => <div key={d} style={{ width: 6, height: 6, borderRadius: "50%", background: C.green, opacity: 0.3, animation: `p 1.2s ease-in-out ${d * 0.2}s infinite` }} />)}
            </div>
          </div>
        )}
        {err && <div style={{ padding: "8px 12px", borderRadius: 6, background: "rgba(224,96,96,0.08)", border: "1px solid rgba(224,96,96,0.15)", color: C.red, fontSize: 12 }}>{err}</div>}
        <div ref={endRef} />
      </div>

      {/* QUICK PROMPTS */}
      {msgs.length <= 1 && (
        <div style={{ padding: "0 14px 8px", display: "flex", gap: 6, flexWrap: "wrap" }}>
          {prompts.map((p, i) => (
            <button key={i} onClick={() => { setInput(p); setTimeout(() => inputRef.current?.focus(), 50); }}
              style={{ padding: "5px 12px", borderRadius: 4, border: `1px solid ${C.border}`, background: "transparent", color: C.textDim, fontSize: 11, cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => { e.target.style.borderColor = C.green; e.target.style.color = C.green; }}
              onMouseLeave={e => { e.target.style.borderColor = C.border; e.target.style.color = C.textDim; }}>{p}</button>
          ))}
        </div>
      )}

      {/* INPUT */}
      <div style={{ padding: "8px 14px 14px", borderTop: `1px solid ${C.border}`, background: C.bg, flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end", background: C.bgInput, border: `1px solid ${C.border}`, borderRadius: 8, padding: "3px 3px 3px 14px" }}>
          <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder={mode === "quiz" ? "Type your answer..." : "Ask about Chemistry Unit 1..."}
            rows={1} style={{ flex: 1, border: "none", outline: "none", resize: "none", background: "transparent", color: C.text, fontFamily: "'DM Sans',sans-serif", fontSize: 13.5, padding: "8px 0", lineHeight: 1.5, maxHeight: 100, overflow: "auto" }} />
          <button onClick={send} disabled={!input.trim() || loading} style={{
            width: 34, height: 34, borderRadius: 6, border: "none",
            cursor: input.trim() && !loading ? "pointer" : "default",
            background: input.trim() && !loading ? C.green : "rgba(255,255,255,0.04)",
            color: input.trim() && !loading ? "#fff" : C.textDim,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 15, fontWeight: 700, flexShrink: 0, transition: "all 0.2s",
          }}>↑</button>
        </div>
        <div style={{ textAlign: "center", marginTop: 6, fontSize: 9.5, color: C.textDim }}>
          Powered by AGF Tutoring · Grounded in curated notes
        </div>
      </div>

      <style>{`
        @keyframes p{0%,100%{opacity:.25;transform:scale(.85)}50%{opacity:.65;transform:scale(1.1)}}
        textarea::placeholder{color:${C.textDim}}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.06);border-radius:3px}
        *{box-sizing:border-box}
      `}</style>
    </div>
  );
}
