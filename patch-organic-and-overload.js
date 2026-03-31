/**
 * AGF Companion — Organic Chemistry Enrichment + Overload Fix
 * 
 * Fixes:
 *  1. Adds detailed IUPAC naming rules to chem1 system prompt
 *  2. Adds retry logic for API overload errors in quiz mode
 * 
 * Run from project root:
 *   node patch-organic-and-overload.js
 * 
 * Then:
 *   npm run dev
 *   git add .
 *   git commit -m "Enrich organic naming rules + add overload retry"
 *   git push
 */

const fs = require('fs');
const path = require('path');

const PAGE_JS = path.join(__dirname, 'app', 'page.js');
let code = fs.readFileSync(PAGE_JS, 'utf8');

// ═══════════════════════════════════════
// STEP 1: Replace sparse organic notes with enriched content
// ═══════════════════════════════════════

const OLD_ORGANIC = `TOPIC 4 — ORGANIC & ALKANES
CₙH₂ₙ₊₂, saturated, bp↑chain length ↓branching
FRS: UV+halogen. Initiation→Propagation→Termination. Fish-hook arrows
Combustion: complete(CO₂+H₂O), incomplete(CO/C). Cracking: heat/catalyst

TOPIC 5 — ALKENES
CₙH₂ₙ, C=C(σ+π), restricted rotation→E/Z(CIP rules)
Electrophilic addition: HBr→bromoalkane, Br₂→dibromoalkane, steam+H₃PO₄→alcohol, H₂+Ni→alkane
Markovnikov: H to C with more H's. 3°>2°>1° carbocation stability
Tests: Br₂ water decolourises, KMnO₄ decolourises`;

const NEW_ORGANIC = `TOPIC 4 — ORGANIC & ALKANES

IUPAC NAMING — CRITICAL RULES (follow these EXACTLY):
Step 1: Find the LONGEST continuous carbon chain — this gives the parent name.
  1C=meth, 2C=eth, 3C=prop, 4C=but, 5C=pent, 6C=hex, 7C=hept, 8C=oct, 9C=non, 10C=dec
Step 2: Number the chain from the end that gives the LOWEST locants to substituents/functional groups.
Step 3: Name each branch as a prefix: CH₃=methyl, C₂H₅=ethyl, C₃H₇=propyl, etc.
Step 4: Use di-, tri-, tetra- for multiple identical substituents.
Step 5: List substituents ALPHABETICALLY (ignore di-, tri- prefixes for alphabetical order).
Step 6: Separate numbers from numbers with commas, numbers from letters with hyphens.

NAMING EXAMPLES (use these as reference when explaining):
CH₃CH₂CH₂CH₃ = butane (4C chain, no branches)
CH₃CH(CH₃)CH₂CH₃ = 2-methylbutane (longest chain is 4C, CH₃ branch at C2)
CH₃C(CH₃)₂CH₃ = 2,2-dimethylpropane (longest chain is 3C propane, two CH₃ at C2)
CH₃CH₂CH(CH₃)CH(CH₃)CH₂CH₃ = 3,4-dimethylhexane (6C chain, CH₃ at C3 and C4)
CH₃CH(CH₃)CH(C₂H₅)CH₃ = 2-methyl-3-ethylbutane is WRONG → correct: 2,3-dimethylpentane
  (Find the LONGEST chain: it's 5C through the ethyl group, not 4C)

COMMON NAMING MISTAKES TO AVOID:
- NOT finding the longest chain (the longest chain may not be drawn horizontally)
- Numbering from the wrong end (always give lowest locants)
- Using "ethyl" when the longest chain runs through that group (making it part of the parent chain)
- Forgetting that the longest chain can bend/turn in structural formulae

STRUCTURAL, DISPLAYED, AND SKELETAL FORMULAE:
- Molecular formula: shows atoms only (e.g. C₄H₁₀)
- Structural formula: shows arrangement (e.g. CH₃CH₂CH₂CH₃ or CH₃CH(CH₃)₂)
- Displayed formula: shows ALL bonds explicitly
- Skeletal formula: zig-zag lines, each vertex/end = carbon, H atoms on C not shown

When a student asks about naming or structures, ALWAYS:
1. Draw out/describe the full structural formula
2. Identify the longest chain explicitly
3. Number the chain showing WHY that direction gives lowest locants
4. Name systematically step by step

STRUCTURAL ISOMERISM:
Same molecular formula, different structural arrangement.
C₄H₁₀ has 2 isomers: butane, 2-methylpropane
C₅H₁₂ has 3 isomers: pentane, 2-methylbutane, 2,2-dimethylpropane
Types: chain isomerism, position isomerism, functional group isomerism

ALKANES — PHYSICAL PROPERTIES:
General formula CₙH₂ₙ₊₂, saturated (single bonds only), tetrahedral around each C (109.5°)
Boiling point increases with chain length (more London forces) and decreases with branching (less surface contact)
Non-polar molecules → only London dispersion forces between molecules

FREE RADICAL SUBSTITUTION (FRS):
Conditions: UV light + halogen (Cl₂ or Br₂)
Initiation: Cl₂ → 2Cl• (homolytic fission, UV breaks Cl—Cl)
Propagation: Cl• + CH₄ → CH₃• + HCl then CH₃• + Cl₂ → CH₃Cl + Cl• (chain continues)
Termination: any two radicals combine: Cl• + Cl• → Cl₂, CH₃• + Cl• → CH₃Cl, CH₃• + CH₃• → C₂H₆
Fish-hook (half) arrows show single electron movement.
Limitation: gives mixture of products (CH₃Cl, CH₂Cl₂, CHCl₃, CCl₄) due to further substitution.

COMBUSTION:
Complete: CₙH₂ₙ₊₂ + excess O₂ → CO₂ + H₂O
Incomplete (limited O₂): produces CO (toxic) or C (soot)
CRACKING: thermal (high T, no catalyst) or catalytic (zeolite catalyst, lower T) to make shorter chains + alkenes

TOPIC 5 — ALKENES

General formula CₙH₂ₙ, unsaturated (contains C=C double bond)
C=C consists of one σ bond (head-on overlap) + one π bond (sideways p-orbital overlap)
Restricted rotation around C=C due to π bond → gives rise to E/Z isomerism

NAMING ALKENES:
Same IUPAC rules as alkanes, but:
- Use -ene suffix instead of -ane
- Number the chain to give the C=C the LOWEST possible locant
- The number before -ene indicates position of C=C
Examples: but-1-ene (C=C between C1-C2), but-2-ene (C=C between C2-C3)
pent-1-ene, 2-methylbut-1-ene, 2-methylbut-2-ene

E/Z (CIS/TRANS) ISOMERISM:
Requires: restricted rotation (C=C) AND two different groups on EACH carbon of the C=C
Z (zusammen) = same side, E (entgegen) = opposite sides
Priority determined by CIP rules: higher atomic number = higher priority
Examples showing E/Z: but-2-ene has E and Z forms. But-1-ene does NOT (H,H on C1).

REACTIONS OF ALKENES — Electrophilic Addition:
The C=C is electron-rich (high electron density) → attacked by electrophiles
1. + HBr → bromoalkane (Markovnikov: H adds to C with more H's → more stable carbocation)
2. + Br₂ → dibromoalkane (decolourises bromine water — TEST for unsaturation)
3. + steam (H₂O) + H₃PO₄ catalyst → alcohol
4. + H₂ + Ni catalyst → alkane (hydrogenation/reduction)
Test for alkene: shake with bromine water → orange/brown decolourises to colourless
Test for alkene: acidified KMnO₄ → purple decolourises to colourless

MARKOVNIKOV'S RULE:
When HX adds to an unsymmetrical alkene, H adds to the carbon with MORE hydrogen atoms.
This gives the MORE SUBSTITUTED (more stable) carbocation intermediate.
Carbocation stability: tertiary (3°) > secondary (2°) > primary (1°)
Example: propene + HBr → 2-bromopropane (major product, NOT 1-bromopropane)`;

if (!code.includes(OLD_ORGANIC)) {
  console.error('ERROR: Could not find old organic chemistry notes. Check for prior patches.');
  console.error('Looking for:', OLD_ORGANIC.substring(0, 80));
  process.exit(1);
}

code = code.replace(OLD_ORGANIC, NEW_ORGANIC);
console.log('✅ Step 1: Enriched organic chemistry with IUPAC naming rules');


// ═══════════════════════════════════════
// STEP 2: Add retry logic for overloaded API in quiz
// ═══════════════════════════════════════

// Find the quiz error catch and add retry logic
const OLD_QUIZ_CATCH = `    } catch (e) { setErr(e.message); }
    finally { setLoading(false); }
  }, [currentSubject, quizHistory]);`;

// Check if this exact pattern exists (it may have been modified by hybrid patch)
if (code.includes(OLD_QUIZ_CATCH)) {
  const NEW_QUIZ_CATCH = `    } catch (e) {
      // Retry once on overload/529 errors
      if (e.message && (e.message.includes('overload') || e.message.includes('529') || e.message.includes('capacity')) && !retried) {
        setErr('API busy — retrying in 3 seconds...');
        await new Promise(r => setTimeout(r, 3000));
        setErr(null);
        retried = true;
        try {
          const res2 = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              messages: [{ role: "user", content: \`Generate question \${questionNumber}/10. Difficulty: \${difficulty}/10. Respond with ONLY JSON.\` }],
              system: QUIZ_GEN_SYSTEM(currentSubject.system),
              mode: "quiz",
            }),
          });
          const data2 = await res2.json();
          if (!data2.error) {
            const text2 = data2.content?.map(b => b.type === "text" ? b.text : "").filter(Boolean).join("\\n") || "";
            const parsed2 = parseJSON(text2);
            if (parsed2 && parsed2.question && parsed2.options && parsed2.correctLabel) {
              setQuizQ(parsed2);
              setErr(null);
              setLoading(false);
              return;
            }
          }
        } catch (e2) { /* fall through */ }
      }
      setErr(e.message + ' — Try clicking Next or start a New Quiz.');
    }
    finally { setLoading(false); }
  }, [currentSubject, quizHistory]);`;

  code = code.replace(OLD_QUIZ_CATCH, NEW_QUIZ_CATCH);
  console.log('✅ Step 2a: Added retry logic to original fetchQuizQuestion');
}

// Also check for the hybrid version's catch pattern
const OLD_HYBRID_CATCH = `    } catch (e) { setErr(e.message); }
    finally { setLoading(false); }
  }, [currentSubject, quizHistory, getRandomPastPaperQ]);`;

if (code.includes(OLD_HYBRID_CATCH)) {
  const NEW_HYBRID_CATCH = `    } catch (e) {
      // Retry once on overload/529 errors
      if (e.message && (e.message.includes('overload') || e.message.includes('529') || e.message.includes('capacity'))) {
        setErr('API busy — retrying in 3 seconds...');
        await new Promise(r => setTimeout(r, 3000));
        setErr(null);
        try {
          const res2 = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              messages: [{ role: "user", content: \`Generate question \${questionNumber}/10. Difficulty: \${difficulty}/10. Respond with ONLY JSON.\` }],
              system: QUIZ_GEN_SYSTEM(currentSubject.system),
              mode: "quiz",
            }),
          });
          const data2 = await res2.json();
          if (!data2.error) {
            const text2 = data2.content?.map(b => b.type === "text" ? b.text : "").filter(Boolean).join("\\n") || "";
            const parsed2 = parseJSON(text2);
            if (parsed2 && parsed2.question && parsed2.options && parsed2.correctLabel) {
              setQuizQ({ ...parsed2, isPastPaper: false });
              setErr(null);
              setLoading(false);
              return;
            }
          }
        } catch (e2) { /* fall through */ }
      }
      setErr(e.message + ' — Try clicking Next or start a New Quiz.');
    }
    finally { setLoading(false); }
  }, [currentSubject, quizHistory, getRandomPastPaperQ]);`;

  code = code.replace(OLD_HYBRID_CATCH, NEW_HYBRID_CATCH);
  console.log('✅ Step 2b: Added retry logic to hybrid fetchQuizQuestion');
}


// ═══════════════════════════════════════
// STEP 3: Add `let retried = false;` at top of fetchQuizQuestion
// ═══════════════════════════════════════

// Add retried flag for the non-hybrid version
if (code.includes('const fetchQuizQuestion = useCallback(async (questionNumber) => {\n    if (!currentSubject) return;\n    setLoading(true);')) {
  code = code.replace(
    'const fetchQuizQuestion = useCallback(async (questionNumber) => {\n    if (!currentSubject) return;\n    setLoading(true);',
    'const fetchQuizQuestion = useCallback(async (questionNumber) => {\n    let retried = false;\n    if (!currentSubject) return;\n    setLoading(true);'
  );
  console.log('✅ Step 3: Added retried flag');
}


// ═══════════════════════════════════════
// STEP 4: Improve error display in quiz UI — add "Try again" button
// ═══════════════════════════════════════

const OLD_ERR_DISPLAY = `              {err && <div style={{ padding: "8px 12px", borderRadius: 6, background: "rgba(224,96,96,0.08)", border: "1px solid rgba(224,96,96,0.15)", color: C.red, fontSize: 12, marginBottom: 16 }}>{err}</div>}`;

if (code.includes(OLD_ERR_DISPLAY)) {
  const NEW_ERR_DISPLAY = `              {err && <div style={{ padding: "12px 16px", borderRadius: 8, background: "rgba(224,96,96,0.08)", border: "1px solid rgba(224,96,96,0.15)", color: C.red, fontSize: 13, marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <span>{err}</span>
                <button onClick={() => { setErr(null); fetchQuizQuestion(quizNum); }} style={{ padding: "6px 14px", borderRadius: 5, border: "1px solid rgba(224,96,96,0.3)", background: "rgba(224,96,96,0.1)", color: C.red, fontSize: 12, fontWeight: 500, cursor: "pointer", flexShrink: 0 }}>Retry</button>
              </div>}`;

  code = code.replace(OLD_ERR_DISPLAY, NEW_ERR_DISPLAY);
  console.log('✅ Step 4: Added Retry button to quiz error display');
}


// ═══════════════════════════════════════
// WRITE
// ═══════════════════════════════════════

fs.writeFileSync(PAGE_JS, code, 'utf8');
console.log(`\n✅ All patches applied successfully to ${PAGE_JS}`);
console.log('\nNext steps:');
console.log('  1. npm run dev  →  test locally');
console.log('  2. Try asking "Name this compound: CH₃CH(CH₃)CH₂CH₃"');
console.log('  3. Try a quiz and check it handles API errors gracefully');
console.log('  4. git add . && git commit -m "Enrich organic naming + overload retry" && git push');
