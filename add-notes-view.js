// Run with: node add-notes-view.js
// From: C:\Users\alast\Downloads\agf-companion

const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, 'app', 'page.js');
let code = fs.readFileSync(pagePath, 'utf8');

// ═══ 1. ADD STATE VARIABLES ═══
// Find the quiz state section and add notes state after it
const stateMarker = 'const [hintLoading, setHintLoading] = useState(false);';
if (!code.includes('showNotes')) {
  code = code.replace(stateMarker, stateMarker + `

  // Notes view state
  const [showNotes, setShowNotes] = useState(false);
  const [notesData, setNotesData] = useState(null);
  const [notesLoading, setNotesLoading] = useState(false);`);
  console.log('✓ Notes state variables added');
} else {
  console.log('· Notes state already exists');
}

// ═══ 2. ADD generateNotes FUNCTION ═══
// Insert after FOLLOW_UP_ACTIONS
const actionsEnd = '];  // end FOLLOW_UP_ACTIONS';
// Find a better marker - the line after FOLLOW_UP_ACTIONS
const followUpIdx = code.indexOf('const FOLLOW_UP_ACTIONS');
const afterFollowUp = code.indexOf('];', followUpIdx);
const insertPoint = code.indexOf('\n', afterFollowUp) + 1;

const generateNotesFn = `
  // Generate structured notes for Notes View
  const generateNotes = useCallback(async () => {
    if (notesLoading || !currentSubject) return;
    setNotesLoading(true);
    setShowNotes(true);
    setNotesData(null);

    // Get the last topic discussed from chat
    const lastAssistantMsg = [...msgs].reverse().find(m => m.role === "assistant" && m.content !== currentSubject.welcome);
    const lastUserMsg = [...msgs].reverse().find(m => m.role === "user");
    const topicContext = lastUserMsg ? lastUserMsg.content : "the main topics in this subject";

    const notesPrompt = \`Generate comprehensive revision notes about: \${topicContext}

You MUST respond with ONLY a valid JSON object. No other text, no markdown fences, no explanation before or after.

JSON format:
{
  "title": "Topic Title",
  "subtitle": "Brief one-line description",
  "sections": [
    {
      "type": "definitions",
      "title": "Key Definitions",
      "items": [
        { "term": "Term name", "definition": "Clear, concise definition." }
      ]
    },
    {
      "type": "equations",
      "title": "Key Equations",
      "items": [
        { "label": "What this equation is for", "equation": "σ = F/A", "units": "Pa or N/m²" }
      ]
    },
    {
      "type": "content",
      "title": "Section Title",
      "paragraphs": ["Paragraph of explanation..."],
      "bullets": ["Bullet point 1", "Bullet point 2"]
    },
    {
      "type": "table",
      "title": "Table Title",
      "headers": ["Column 1", "Column 2", "Column 3"],
      "rows": [["cell1", "cell2", "cell3"]]
    },
    {
      "type": "tip",
      "text": "Exam tip text here — specific and actionable"
    },
    {
      "type": "warning",
      "text": "Common mistake or misconception to watch out for"
    },
    {
      "type": "worked_example",
      "question": "The exam question",
      "solution": "Full step-by-step solution with every line of working"
    }
  ]
}

Rules:
- Include at least 6-8 sections covering definitions, equations, theory, tables, worked examples, and exam tips
- Every key equation MUST be in the equations section
- Include at least 2 worked examples with full solutions
- Include at least 2 exam tips and 1 warning about common mistakes
- Use tables where data comparison is useful (e.g. properties, trends)
- Definitions must be concise — one or two sentences max
- Write like a tutor, not a textbook — warm, clear, direct
- Include the SPECIFIC topics and details relevant to this A-Level syllabus
- Respond with ONLY the JSON object\`;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: notesPrompt }],
          system: currentSubject.system,
          mode: "resources",
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      const text = data.content?.map(b => b.type === "text" ? b.text : "").filter(Boolean).join("\\n") || "";
      const clean = text.replace(/\`\`\`json\\s*/g, "").replace(/\`\`\`\\s*/g, "").trim();
      const parsed = JSON.parse(clean);
      if (parsed && parsed.title && parsed.sections) {
        setNotesData(parsed);
      } else {
        throw new Error("Invalid notes format");
      }
    } catch (e) {
      console.error("Notes generation error:", e);
      setNotesData({ title: "Error", subtitle: "Could not generate notes", sections: [{ type: "content", title: "Error", paragraphs: [e.message], bullets: [] }] });
    } finally {
      setNotesLoading(false);
    }
  }, [notesLoading, currentSubject, msgs]);

`;

if (!code.includes('generateNotes')) {
  code = code.slice(0, insertPoint) + generateNotesFn + code.slice(insertPoint);
  console.log('✓ generateNotes function added');
} else {
  console.log('· generateNotes already exists');
}

// ═══ 3. UPDATE 📚 BUTTON TO TRIGGER NOTES VIEW ═══
// Change the 📚 action from sendDirect to generateNotes
code = code.replace(
  /\{ emoji: "📚",[^}]+\}/,
  '{ emoji: "📚", label: "Full revision notes", display: "📚 Generate full revision notes", isNotes: true }'
);

// Update the button click handler to check for isNotes
code = code.replace(
  'sendDirect(action.prompt, action.mode, action.display)}',
  'action.isNotes ? generateNotes() : sendDirect(action.prompt, action.mode, action.display)}'
);
console.log('✓ 📚 button updated to trigger Notes View');

// ═══ 4. ADD NotesView COMPONENT ═══
// Insert before the MAIN COMPONENT section
const mainComponentMarker = '/* ═══════════════════════════════════════════════════\n   MAIN COMPONENT';
const notesViewComponent = `/* ═══ NOTES VIEW COMPONENT ═══ */
function NotesView({ data, subject, onClose }) {
  if (!data) return null;
  const col = subject?.colour || C.green;

  return (
    <div style={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column", background: C.bg, fontFamily: "'Outfit',sans-serif", color: C.text }}>
      {/* Header */}
      <div style={{ padding: "14px 20px", borderBottom: \`1px solid \${C.border}\`, display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: 17, letterSpacing: "-0.02em" }}>
            AGF<span style={{ color: C.green }}>tutoring</span>
            <span style={{ fontSize: 13, color: C.textMuted, fontFamily: "'Outfit',sans-serif" }}> · Revision Notes</span>
          </div>
          <div style={{ fontSize: 10.5, color: C.textDim, letterSpacing: "0.06em", textTransform: "uppercase", marginTop: 1 }}>
            {subject?.icon} {subject?.code} · {subject?.name}
          </div>
        </div>
        <button onClick={onClose} style={{ padding: "8px 18px", borderRadius: 6, fontSize: 12, fontWeight: 600, border: \`1px solid \${C.green}\`, background: C.greenDim, color: C.green, cursor: "pointer" }}>
          ← Back to Chat
        </button>
      </div>

      {/* Notes Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 20px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          {/* Title */}
          <div style={{ marginBottom: 32, textAlign: "center" }}>
            <div style={{ fontSize: 10, color: C.green, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 8, fontWeight: 500 }}>
              {subject?.code} · Revision Notes
            </div>
            <h1 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 28, fontWeight: 400, color: C.text, margin: 0, letterSpacing: "-0.02em" }}>
              {data.title}
            </h1>
            {data.subtitle && (
              <div style={{ fontSize: 14, color: C.textMuted, marginTop: 6 }}>{data.subtitle}</div>
            )}
            <div style={{ width: 50, height: 2, background: C.green, margin: "16px auto 0", borderRadius: 1 }} />
          </div>

          {/* Sections */}
          {data.sections.map((section, idx) => (
            <NotesSection key={idx} section={section} index={idx} col={col} />
          ))}

          {/* Footer */}
          <div style={{ textAlign: "center", padding: "32px 0 16px", fontSize: 10, color: C.textDim }}>
            Powered by AGF Tutoring · Grounded in curated notes
          </div>
        </div>
      </div>
    </div>
  );
}

function NotesSection({ section, index, col }) {
  const s = section;

  // Section header (for titled sections)
  const SectionHeader = ({ title, num }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 32, marginBottom: 16 }}>
      {num !== undefined && (
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fontWeight: 600, color: C.green, opacity: 0.5 }}>
          {String(num).padStart(2, "0")}
        </span>
      )}
      <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 20, fontWeight: 400, color: C.text, margin: 0, letterSpacing: "-0.02em" }}>
        {title}
      </h2>
    </div>
  );

  if (s.type === "definitions") {
    return (
      <div>
        <SectionHeader title={s.title} num={index + 1} />
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {s.items?.map((item, i) => (
            <div key={i} style={{ borderLeft: \`3px solid \${C.green}\`, paddingLeft: 16, paddingTop: 4, paddingBottom: 4 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 3 }}>{item.term}</div>
              <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.6 }}>{item.definition}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (s.type === "equations") {
    return (
      <div>
        <SectionHeader title={s.title} num={index + 1} />
        <div style={{ background: C.bgCard, border: \`1px solid \${C.border}\`, borderRadius: 10, overflow: "hidden" }}>
          {s.items?.map((item, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "12px 18px",
              borderBottom: i < s.items.length - 1 ? \`1px solid \${C.borderLight}\` : "none",
            }}>
              <span style={{ fontSize: 13, color: C.textMuted, flex: 1 }}>{item.label}</span>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 15, fontWeight: 500, color: C.green, textAlign: "right" }}>
                {item.equation}
              </span>
              {item.units && (
                <span style={{ fontSize: 10, color: C.textDim, marginLeft: 10, minWidth: 60, textAlign: "right" }}>{item.units}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (s.type === "content") {
    return (
      <div>
        <SectionHeader title={s.title} num={index + 1} />
        {s.paragraphs?.map((p, i) => (
          <p key={i} style={{ fontSize: 13.5, color: "rgba(255,255,255,0.8)", lineHeight: 1.8, margin: "0 0 12px" }}>{p}</p>
        ))}
        {s.bullets && s.bullets.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
            {s.bullets.map((b, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", paddingLeft: 4 }}>
                <span style={{ color: C.green, fontSize: 6, marginTop: 7, flexShrink: 0 }}>●</span>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.7 }}>{b}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (s.type === "table") {
    return (
      <div>
        {s.title && <SectionHeader title={s.title} num={index + 1} />}
        <div style={{ overflowX: "auto", borderRadius: 10, border: \`1px solid \${C.border}\` }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: C.bgCard }}>
                {s.headers?.map((h, i) => (
                  <th key={i} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600, color: C.text, borderBottom: \`1px solid \${C.border}\`, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {s.rows?.map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : C.bgCard }}>
                  {row.map((cell, j) => (
                    <td key={j} style={{ padding: "10px 14px", color: j === 0 ? C.text : C.textMuted, fontWeight: j === 0 ? 500 : 400, borderBottom: i < s.rows.length - 1 ? \`1px solid \${C.borderLight}\` : "none" }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (s.type === "tip") {
    return (
      <div style={{
        margin: "20px 0", padding: "14px 18px", borderRadius: 10,
        background: "rgba(77,148,96,0.06)", border: \`1px solid rgba(77,148,96,0.15)\`,
        display: "flex", gap: 12, alignItems: "flex-start",
      }}>
        <span style={{ fontSize: 18, flexShrink: 0 }}>💡</span>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.green, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>Exam Tip</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", lineHeight: 1.7 }}>{s.text}</div>
        </div>
      </div>
    );
  }

  if (s.type === "warning") {
    return (
      <div style={{
        margin: "20px 0", padding: "14px 18px", borderRadius: 10,
        background: "rgba(212,162,76,0.06)", border: \`1px solid rgba(212,162,76,0.15)\`,
        display: "flex", gap: 12, alignItems: "flex-start",
      }}>
        <span style={{ fontSize: 18, flexShrink: 0 }}>⚠️</span>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.amber, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>Watch Out</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", lineHeight: 1.7 }}>{s.text}</div>
        </div>
      </div>
    );
  }

  if (s.type === "worked_example") {
    return (
      <div style={{
        margin: "20px 0", padding: "18px 20px", borderRadius: 10,
        background: C.bgCard, border: \`1px solid \${C.border}\`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <span style={{ fontSize: 18 }}>⭐</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: C.green, textTransform: "uppercase", letterSpacing: "0.08em" }}>Worked Example</span>
        </div>
        {s.question && (
          <div style={{ fontSize: 14, fontWeight: 500, color: C.text, marginBottom: 12, lineHeight: 1.6 }}>{s.question}</div>
        )}
        {s.solution && (
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.9, fontFamily: "'JetBrains Mono',monospace", whiteSpace: "pre-wrap", background: C.bgLight, padding: "12px 16px", borderRadius: 8, border: \`1px solid \${C.borderLight}\` }}>
            {s.solution}
          </div>
        )}
      </div>
    );
  }

  // Fallback
  return null;
}

`;

if (!code.includes('function NotesView')) {
  code = code.replace(mainComponentMarker, notesViewComponent + '\n' + mainComponentMarker);
  console.log('✓ NotesView component added');
} else {
  console.log('· NotesView already exists');
}

// ═══ 5. ADD NOTES VIEW RENDERING ═══
// In the main component, add a check for showNotes before the subject picker
// Find "if (!subject)" and add the notes view check before it
const subjectCheck = '  if (!subject) {';
const notesViewRender = `  /* ─── NOTES VIEW ─── */
  if (showNotes) {
    if (notesLoading) {
      return (
        <div style={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: C.bg, fontFamily: "'Outfit',sans-serif", color: C.text }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
            {[0, 1, 2].map(d => <div key={d} style={{ width: 10, height: 10, borderRadius: "50%", background: C.green, opacity: 0.3, animation: \`p 1.2s ease-in-out \${d * 0.2}s infinite\` }} />)}
          </div>
          <div style={{ fontSize: 15, color: C.textMuted }}>Generating revision notes...</div>
          <div style={{ fontSize: 12, color: C.textDim, marginTop: 6 }}>This takes a few seconds — building something thorough</div>
          <style>{\`@keyframes p{0%,100%{opacity:.25;transform:scale(.85)}50%{opacity:.65;transform:scale(1.1)}}\`}</style>
        </div>
      );
    }
    return (
      <>
        <NotesView data={notesData} subject={currentSubject} onClose={() => { setShowNotes(false); setNotesData(null); }} />
        <style>{\`
          @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
          @keyframes p{0%,100%{opacity:.25;transform:scale(.85)}50%{opacity:.65;transform:scale(1.1)}}
          ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.06);border-radius:3px}
          *{box-sizing:border-box}
        \`}</style>
      </>
    );
  }

`;

if (!code.includes('NOTES VIEW')) {
  code = code.replace(subjectCheck, notesViewRender + '  ' + subjectCheck);
  console.log('✓ Notes View rendering added');
} else {
  console.log('· Notes View rendering already exists');
}

// Write the file
fs.writeFileSync(pagePath, code);
console.log('\n✅ Notes View fully installed!');
console.log('Dev server should auto-reload. Test:');
console.log('1. Pick a subject, ask a question');
console.log('2. Click 📚 "Full revision notes"');
console.log('3. You should see a loading screen, then beautiful structured notes');
console.log('4. Click "← Back to Chat" to return');
