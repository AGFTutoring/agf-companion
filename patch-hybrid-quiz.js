/**
 * AGF Companion — Hybrid Quiz Patch
 * Adds past paper question bank + hybrid quiz logic
 * 
 * Run: node patch-hybrid-quiz.js
 * Then: git add . && git commit -m "Add hybrid quiz: past paper + AI questions" && git push
 */

const fs = require('fs');
const path = require('path');

// Path to page.js — update if different on your machine
const PAGE_JS = path.join(__dirname, 'app', 'page.js');

let code = fs.readFileSync(PAGE_JS, 'utf8');

// ═══════════════════════════════════════
// STEP 1: Add the PAST_PAPER_QUESTIONS constant after SUBJECT_LIST
// ═══════════════════════════════════════

const PAST_PAPER_BANK = `

/* ═══════════════════════════════════════════════════
   PAST PAPER QUESTION BANK — WCH11 (Edexcel IAL)
   Real exam questions from June 2009 – June 2012
   ═══════════════════════════════════════════════════ */

const PAST_PAPER_QUESTIONS = {
  chem1: [
    {
      id: "J09-01", paper: "June 2009", question: "The nucleus of a \\u00b2\\u00b3\\u2081\\u2081Na atom contains",
      options: [
        {label: "A", text: "11 protons and 12 neutrons"},
        {label: "B", text: "11 protons and 12 electrons"},
        {label: "C", text: "23 protons and 11 neutrons"},
        {label: "D", text: "23 protons and 11 electrons"}
      ],
      correctLabel: "A", topic: "atomic structure", difficulty: 2,
      explanations: {
        A: "Correct. Atomic number 11 = 11 protons. Mass number 23 \\u2212 11 = 12 neutrons.",
        B: "Wrong \\u2014 electrons are not found in the nucleus.",
        C: "Wrong \\u2014 23 is the mass number (protons + neutrons), not just protons.",
        D: "Wrong \\u2014 23 is the mass number, and electrons are not in the nucleus."
      },
      hint: "The bottom number is the atomic number (protons). Neutrons = mass number \\u2212 protons."
    },
    {
      id: "J09-02", paper: "June 2009", question: "A mass spectrum shows peaks at m/z 63 and 65 with relative abundances 70 and 30. The relative atomic mass of the metal is",
      options: [
        {label: "A", text: "63.2"},
        {label: "B", text: "63.4"},
        {label: "C", text: "63.6"},
        {label: "D", text: "64.0"}
      ],
      correctLabel: "C", topic: "mass spectrometry", difficulty: 3,
      explanations: {
        A: "Incorrect \\u2014 check your weighted average calculation.",
        B: "Incorrect \\u2014 you may have used wrong abundances.",
        C: "Correct. RAM = (63 \\u00d7 70 + 65 \\u00d7 30) \\u00f7 100 = 6360 \\u00f7 100 = 63.6",
        D: "Wrong \\u2014 this is the simple average, not weighted by abundance."
      },
      hint: "Use the weighted average: RAM = \\u03a3(mass \\u00d7 abundance) \\u00f7 total abundance."
    },
    {
      id: "J09-03", paper: "June 2009", question: "Bond enthalpies: H\\u2014H = +436, I\\u2014I = +151, H\\u2014I = +299 kJ mol\\u207b\\u00b9. What is the enthalpy change for H\\u2082(g) + I\\u2082(g) \\u2192 2HI(g)?",
      options: [
        {label: "A", text: "+436 + 151 \\u2212 299 = +288"},
        {label: "B", text: "\\u2212436 \\u2212 151 + 299 = \\u2212288"},
        {label: "C", text: "+436 + 151 \\u2212 (2 \\u00d7 299) = \\u221211"},
        {label: "D", text: "\\u2212436 \\u2212 151 + (2 \\u00d7 299) = +11"}
      ],
      correctLabel: "C", topic: "energetics", difficulty: 4,
      explanations: {
        A: "Wrong \\u2014 only subtracted one H\\u2014I bond, but 2 mol HI are formed.",
        B: "Wrong \\u2014 signs reversed and only one H\\u2014I counted.",
        C: "Correct. \\u0394H = bonds broken \\u2212 bonds formed = (436 + 151) \\u2212 (2 \\u00d7 299) = \\u221211 kJ mol\\u207b\\u00b9",
        D: "Wrong \\u2014 signs are reversed."
      },
      hint: "\\u0394H = \\u03a3(bonds broken) \\u2212 \\u03a3(bonds formed). Count bonds carefully."
    },
    {
      id: "J09-04", paper: "June 2009", question: "A compound contains 1.45 g carbon, 0.482 g hydrogen, 1.69 g nitrogen. [C=12, H=1, N=14]. The empirical formula is",
      options: [
        {label: "A", text: "CH\\u2083N"},
        {label: "B", text: "CH\\u2084N"},
        {label: "C", text: "CH\\u2085N"},
        {label: "D", text: "C\\u2082H\\u2084N"}
      ],
      correctLabel: "B", topic: "formulae and moles", difficulty: 3,
      explanations: {
        A: "Wrong \\u2014 hydrogen moles give ratio 4, not 3.",
        B: "Correct. C = 1.45/12 = 0.121, H = 0.482/1 = 0.482, N = 1.69/14 = 0.121. Ratio 1:4:1 \\u2192 CH\\u2084N.",
        C: "Wrong \\u2014 the ratio doesn\\u2019t give 5 for hydrogen.",
        D: "Wrong \\u2014 check the ratio again."
      },
      hint: "Convert masses to moles, then divide each by the smallest value."
    },
    {
      id: "J09-05", paper: "June 2009", question: "17.1 g of Al\\u2082(SO\\u2084)\\u2083 was dissolved in water. Calculate the number of sulfate ions. [M = 342 g mol\\u207b\\u00b9, L = 6 \\u00d7 10\\u00b2\\u00b3]",
      options: [
        {label: "A", text: "3 \\u00d7 10\\u00b2\\u00b9"},
        {label: "B", text: "1 \\u00d7 10\\u00b2\\u00b2"},
        {label: "C", text: "3 \\u00d7 10\\u00b2\\u00b2"},
        {label: "D", text: "9 \\u00d7 10\\u00b2\\u00b2"}
      ],
      correctLabel: "D", topic: "formulae and moles", difficulty: 5,
      explanations: {
        A: "Wrong \\u2014 forgot to multiply by 3 for three sulfate ions per formula unit.",
        B: "Wrong \\u2014 check your calculation.",
        C: "Wrong \\u2014 this is moles \\u00d7 Avogadro but without the factor of 3.",
        D: "Correct. n = 17.1/342 = 0.05 mol. 3 sulfate per formula unit = 0.15 mol. Number = 0.15 \\u00d7 6\\u00d710\\u00b2\\u00b3 = 9\\u00d710\\u00b2\\u00b2."
      },
      hint: "Each formula unit of Al\\u2082(SO\\u2084)\\u2083 contains 3 sulfate ions."
    },
    {
      id: "J09-06", paper: "June 2009", question: "Calculate the mass of Ca(OH)\\u2082 in 100 cm\\u00b3 of 0.100 mol dm\\u207b\\u00b3 solution. [M = 74.0 g mol\\u207b\\u00b9]",
      options: [
        {label: "A", text: "0.570 g"},
        {label: "B", text: "0.740 g"},
        {label: "C", text: "1.85 g"},
        {label: "D", text: "3.70 g"}
      ],
      correctLabel: "B", topic: "formulae and moles", difficulty: 3,
      explanations: {
        A: "Wrong \\u2014 check your volume conversion.",
        B: "Correct. n = 0.100 \\u00d7 0.100 = 0.0100 mol. Mass = 0.0100 \\u00d7 74.0 = 0.740 g.",
        C: "Wrong \\u2014 may have used 250 cm\\u00b3 instead of 100 cm\\u00b3.",
        D: "Wrong \\u2014 forgot to convert cm\\u00b3 to dm\\u00b3."
      },
      hint: "Convert volume to dm\\u00b3 (\\u00f71000), then n = c \\u00d7 V, then mass = n \\u00d7 M."
    },
    {
      id: "J09-07", paper: "June 2009", question: "First five successive IEs of element X: 590, 1100, 4900, 6500, 8100 kJ mol\\u207b\\u00b9. Which ion does X most likely form with chlorine?",
      options: [
        {label: "A", text: "X\\u207a"},
        {label: "B", text: "X\\u00b2\\u207a"},
        {label: "C", text: "X\\u00b3\\u207a"},
        {label: "D", text: "X\\u2074\\u207a"}
      ],
      correctLabel: "B", topic: "atomic structure", difficulty: 4,
      explanations: {
        A: "Wrong \\u2014 no big jump after 1st IE, so more than one electron is lost.",
        B: "Correct. Big jump between 2nd (1100) and 3rd (4900) IE shows 2 outer electrons \\u2192 Group 2 \\u2192 X\\u00b2\\u207a.",
        C: "Wrong \\u2014 the 3rd IE is much larger, indicating the 3rd electron is in a lower shell.",
        D: "Wrong \\u2014 the big jump is between 2nd and 3rd."
      },
      hint: "Look for the largest jump between successive IEs \\u2014 this tells you the group number."
    },
    {
      id: "J09-08", paper: "June 2009", question: "Which alkene exhibits E-Z isomerism?",
      options: [
        {label: "A", text: "H\\u2083CCH=C(CH\\u2083)\\u2082"},
        {label: "B", text: "(CH\\u2083)\\u2082C=CH\\u2082"},
        {label: "C", text: "H\\u2082C=CHCH\\u2082CH\\u2083"},
        {label: "D", text: "H\\u2083CCH=CHCH\\u2083"}
      ],
      correctLabel: "D", topic: "alkenes", difficulty: 4,
      explanations: {
        A: "Wrong \\u2014 one C of the double bond has two identical CH\\u2083 groups.",
        B: "Wrong \\u2014 both ends have identical groups (2\\u00d7H or 2\\u00d7CH\\u2083).",
        C: "Wrong \\u2014 one carbon of C=C has two H atoms.",
        D: "Correct. Both carbons have two different groups (H and CH\\u2083), allowing E-Z isomerism."
      },
      hint: "Each carbon of the C=C must have two DIFFERENT groups for E-Z isomerism."
    },
    {
      id: "J09-09", paper: "June 2009", question: "Which covalent bond is the shortest?",
      options: [
        {label: "A", text: "H\\u2014F"},
        {label: "B", text: "H\\u2014Cl"},
        {label: "C", text: "H\\u2014Br"},
        {label: "D", text: "H\\u2014I"}
      ],
      correctLabel: "A", topic: "bonding", difficulty: 2,
      explanations: {
        A: "Correct. F has the smallest atomic radius, so H\\u2014F is the shortest bond.",
        B: "Wrong \\u2014 Cl is larger than F.",
        C: "Wrong \\u2014 Br is larger still.",
        D: "Wrong \\u2014 I is the largest halogen."
      },
      hint: "Bond length increases as the halogen atom gets larger."
    },
    {
      id: "J09-11", paper: "June 2009", question: "0.0100 mol NaHSO\\u2084 is neutralized with 0.200 mol dm\\u207b\\u00b3 NaOH. Calculate the volume of NaOH required. [1:1 ratio]",
      options: [
        {label: "A", text: "20.0 cm\\u00b3"},
        {label: "B", text: "50.0 cm\\u00b3"},
        {label: "C", text: "100 cm\\u00b3"},
        {label: "D", text: "500 cm\\u00b3"}
      ],
      correctLabel: "B", topic: "formulae and moles", difficulty: 3,
      explanations: {
        A: "Wrong \\u2014 check the mole ratio and volume calculation.",
        B: "Correct. 1:1 ratio so 0.0100 mol NaOH needed. V = n/c = 0.0100/0.200 = 0.050 dm\\u00b3 = 50.0 cm\\u00b3.",
        C: "Wrong \\u2014 may have used the wrong concentration.",
        D: "Wrong \\u2014 check your volume conversion."
      },
      hint: "V = n \\u00f7 c. Remember to convert dm\\u00b3 to cm\\u00b3 at the end."
    },
    {
      id: "J09-12", paper: "June 2009", question: "Which ion undergoes the greatest deflection in a mass spectrometer?",
      options: [
        {label: "A", text: "\\u00b3\\u2075Cl\\u00b2\\u207a"},
        {label: "B", text: "\\u00b3\\u2075Cl\\u207a"},
        {label: "C", text: "\\u00b3\\u2077Cl\\u207a"},
        {label: "D", text: "\\u00b3\\u2075Cl\\u00b3\\u2077Cl\\u207a"}
      ],
      correctLabel: "A", topic: "mass spectrometry", difficulty: 4,
      explanations: {
        A: "Correct. Lowest m/z = 35/2 = 17.5 \\u2192 greatest deflection.",
        B: "Wrong \\u2014 m/z = 35.",
        C: "Wrong \\u2014 m/z = 37.",
        D: "Wrong \\u2014 m/z = 72."
      },
      hint: "Deflection is greatest for ions with the lowest mass-to-charge ratio."
    },
    {
      id: "J09-16", paper: "June 2009", question: "Which element has the largest first ionization energy? A: 1s\\u00b9  B: 1s\\u00b2  C: 1s\\u00b2 2s\\u00b9  D: 1s\\u00b2 2s\\u00b2",
      options: [
        {label: "A", text: "1s\\u00b9 (hydrogen)"},
        {label: "B", text: "1s\\u00b2 (helium)"},
        {label: "C", text: "1s\\u00b2 2s\\u00b9 (lithium)"},
        {label: "D", text: "1s\\u00b2 2s\\u00b2 (beryllium)"}
      ],
      correctLabel: "B", topic: "atomic structure", difficulty: 4,
      explanations: {
        A: "Wrong \\u2014 H has only 1 proton, less nuclear charge than He.",
        B: "Correct. Helium has a full 1s shell and the highest nuclear charge in Period 1 \\u2192 highest IE.",
        C: "Wrong \\u2014 the 2s electron is further from the nucleus and shielded.",
        D: "Wrong \\u2014 higher IE than Li but lower than He."
      },
      hint: "Noble gases have very high IEs due to full shells and high effective nuclear charge."
    },
    {
      id: "J09-18", paper: "June 2009", question: "Which ion has the smallest ionic radius?",
      options: [
        {label: "A", text: "F\\u207b"},
        {label: "B", text: "Na\\u207a"},
        {label: "C", text: "Mg\\u00b2\\u207a"},
        {label: "D", text: "O\\u00b2\\u207b"}
      ],
      correctLabel: "C", topic: "bonding", difficulty: 3,
      explanations: {
        A: "Wrong \\u2014 F\\u207b has 9 protons pulling on 10 electrons.",
        B: "Wrong \\u2014 Na\\u207a is small but Mg\\u00b2\\u207a is even smaller.",
        C: "Correct. All have 10 electrons, but Mg\\u00b2\\u207a has 12 protons \\u2014 the strongest pull \\u2192 smallest radius.",
        D: "Wrong \\u2014 O\\u00b2\\u207b has only 8 protons for 10 electrons \\u2192 largest."
      },
      hint: "These are isoelectronic (10 e\\u207b). More protons = smaller radius."
    },
    {
      id: "J09-19", paper: "June 2009", question: "Which does NOT have exactly 10 electrons?",
      options: [
        {label: "A", text: "F\\u207b"},
        {label: "B", text: "CH\\u2084"},
        {label: "C", text: "N\\u2082"},
        {label: "D", text: "Na\\u207a"}
      ],
      correctLabel: "C", topic: "atomic structure", difficulty: 3,
      explanations: {
        A: "Wrong \\u2014 F\\u207b = 9+1 = 10 electrons.",
        B: "Wrong \\u2014 CH\\u2084 = 6+4 = 10 electrons.",
        C: "Correct. N\\u2082 = 2\\u00d77 = 14 electrons.",
        D: "Wrong \\u2014 Na\\u207a = 11\\u22121 = 10 electrons."
      },
      hint: "Count total electrons including ions gaining/losing electrons."
    },
    {
      id: "J09-20", paper: "June 2009", question: "Which correctly describes an environmental problem from burning hydrocarbons?",
      options: [
        {label: "A", text: "CO\\u2082 is toxic and kills plants"},
        {label: "B", text: "Smoke reflects sunlight causing global warming"},
        {label: "C", text: "Water produced causes damaging rainfall"},
        {label: "D", text: "CO\\u2082 absorbs heat radiated from Earth causing global warming"}
      ],
      correctLabel: "D", topic: "alkanes", difficulty: 2,
      explanations: {
        A: "Wrong \\u2014 plants use CO\\u2082 in photosynthesis.",
        B: "Wrong \\u2014 reflecting sunlight would cause cooling.",
        C: "Wrong \\u2014 water produced is negligible.",
        D: "Correct. CO\\u2082 is a greenhouse gas that absorbs infrared radiation."
      },
      hint: "Think about the greenhouse effect."
    },
    {
      id: "J10-02", paper: "Jan 2010", question: "Which equation represents the electron affinity of chlorine?",
      options: [
        {label: "A", text: "Cl\\u2082(g) + 2e\\u207b \\u2192 2Cl\\u207b(g)"},
        {label: "B", text: "Cl\\u2082(g) \\u2212 2e\\u207b \\u2192 2Cl\\u207b(g)"},
        {label: "C", text: "\\u00bdCl\\u2082(g) + e\\u207b \\u2192 Cl\\u207b(g)"},
        {label: "D", text: "Cl(g) + e\\u207b \\u2192 Cl\\u207b(g)"}
      ],
      correctLabel: "D", topic: "atomic structure", difficulty: 4,
      explanations: {
        A: "Wrong \\u2014 must start with gaseous atoms, not molecules.",
        B: "Wrong \\u2014 subtracting electrons is nonsensical.",
        C: "Wrong \\u2014 must start with Cl(g) atoms, not \\u00bdCl\\u2082.",
        D: "Correct. Electron affinity: X(g) + e\\u207b \\u2192 X\\u207b(g)."
      },
      hint: "Electron affinity starts with a gaseous ATOM gaining one electron."
    },
    {
      id: "J10-05", paper: "Jan 2010", question: "Which ion has the greatest ability to polarize an anion?",
      options: [
        {label: "A", text: "Ba\\u00b2\\u207a"},
        {label: "B", text: "Ca\\u00b2\\u207a"},
        {label: "C", text: "Cs\\u207a"},
        {label: "D", text: "K\\u207a"}
      ],
      correctLabel: "B", topic: "bonding", difficulty: 4,
      explanations: {
        A: "Wrong \\u2014 Ba\\u00b2\\u207a is too large despite 2+ charge.",
        B: "Correct. Ca\\u00b2\\u207a has high charge and small size \\u2192 highest charge density.",
        C: "Wrong \\u2014 only 1+ charge and very large.",
        D: "Wrong \\u2014 only 1+ charge."
      },
      hint: "Polarizing power = high charge + small radius = high charge density."
    },
    {
      id: "J10-08", paper: "Jan 2010", question: "4 g helium and 4 g neon mixed. What is the ratio of He atoms to Ne atoms? [He=4, Ne=20]",
      options: [
        {label: "A", text: "1 : 1"},
        {label: "B", text: "2.5 : 1"},
        {label: "C", text: "1 : 5"},
        {label: "D", text: "5 : 1"}
      ],
      correctLabel: "D", topic: "formulae and moles", difficulty: 3,
      explanations: {
        A: "Wrong \\u2014 same mass doesn\\u2019t mean same number of atoms.",
        B: "Wrong \\u2014 check molar masses.",
        C: "Wrong \\u2014 this is the inverse.",
        D: "Correct. He: 4/4 = 1.0 mol, Ne: 4/20 = 0.2 mol. Ratio = 5:1."
      },
      hint: "Convert each mass to moles. More moles = more atoms."
    },
    {
      id: "J10-12", paper: "Jan 2010", question: "Which statement about C=C double bonds is FALSE?",
      options: [
        {label: "A", text: "No rotation about the double bond axis"},
        {label: "B", text: "They are twice as strong as a C\\u2014C single bond"},
        {label: "C", text: "Higher electron density than a single bond"},
        {label: "D", text: "Consist of a sigma bond and a pi bond"}
      ],
      correctLabel: "B", topic: "alkenes", difficulty: 3,
      explanations: {
        A: "True \\u2014 restricted rotation around C=C.",
        B: "FALSE. C=C (~614 kJ/mol) is NOT twice C\\u2014C (~348 kJ/mol) because the \\u03c0 bond is weaker than the \\u03c3 bond.",
        C: "True \\u2014 4 electrons vs 2.",
        D: "True \\u2014 one \\u03c3 + one \\u03c0 bond."
      },
      hint: "Is the \\u03c0 bond as strong as the \\u03c3 bond?"
    },
    {
      id: "J11-06", paper: "June 2011", question: "How many moles of ions in 20 cm\\u00b3 of 0.050 mol dm\\u207b\\u00b3 CaCl\\u2082(aq)?",
      options: [
        {label: "A", text: "0.0050"},
        {label: "B", text: "0.0030"},
        {label: "C", text: "0.0020"},
        {label: "D", text: "0.0010"}
      ],
      correctLabel: "B", topic: "formulae and moles", difficulty: 5,
      explanations: {
        A: "Wrong \\u2014 multiplied by 5 instead of 3.",
        B: "Correct. n(CaCl\\u2082) = 0.020 \\u00d7 0.050 = 0.001 mol. Each gives 3 ions (Ca\\u00b2\\u207a + 2Cl\\u207b). Total = 0.003 mol.",
        C: "Wrong \\u2014 only counted 2 ions per formula unit.",
        D: "Wrong \\u2014 this is moles of CaCl\\u2082, not moles of ions."
      },
      hint: "CaCl\\u2082 \\u2192 Ca\\u00b2\\u207a + 2Cl\\u207b = 3 ions per formula unit."
    },
    {
      id: "J11-11", paper: "June 2011", question: "IEs of X: 631, 1235, 2389, 7089, 8844. What is the most likely formula of its oxide?",
      options: [
        {label: "A", text: "X\\u2082O"},
        {label: "B", text: "XO"},
        {label: "C", text: "X\\u2082O\\u2083"},
        {label: "D", text: "XO\\u2082"}
      ],
      correctLabel: "C", topic: "atomic structure", difficulty: 5,
      explanations: {
        A: "Wrong \\u2014 big jump is not after 1st IE.",
        B: "Wrong \\u2014 big jump is not after 2nd IE.",
        C: "Correct. Big jump between 3rd and 4th IE \\u2192 Group 3 \\u2192 X\\u2082O\\u2083.",
        D: "Wrong \\u2014 that would be Group 4."
      },
      hint: "The big jump tells you how many outer electrons \\u2192 group number \\u2192 oxide formula."
    },
    {
      id: "J12-05", paper: "Jan 2012", question: "Which contains a dative covalent bond?",
      options: [
        {label: "A", text: "N\\u2082"},
        {label: "B", text: "NH\\u2083"},
        {label: "C", text: "NH\\u2082\\u207b"},
        {label: "D", text: "NH\\u2084\\u207a"}
      ],
      correctLabel: "D", topic: "bonding", difficulty: 3,
      explanations: {
        A: "Wrong \\u2014 triple bond but no dative bond.",
        B: "Wrong \\u2014 3 ordinary covalent bonds + lone pair.",
        C: "Wrong \\u2014 2 covalent bonds + 2 lone pairs.",
        D: "Correct. NH\\u2083 donates its lone pair to H\\u207a to form the 4th N\\u2014H bond \\u2014 a dative covalent bond."
      },
      hint: "A dative bond forms when one atom donates BOTH bonding electrons."
    },
    {
      id: "J12-13", paper: "Jan 2012", question: "\\u0394Hc(graphite) = \\u2212393.5, \\u0394Hc(diamond) = \\u2212395.4 kJ mol\\u207b\\u00b9. What is \\u0394H for C(graphite) \\u2192 C(diamond)?",
      options: [
        {label: "A", text: "\\u22121.9 kJ mol\\u207b\\u00b9"},
        {label: "B", text: "+1.9 kJ mol\\u207b\\u00b9"},
        {label: "C", text: "\\u2212788.9 kJ mol\\u207b\\u00b9"},
        {label: "D", text: "+788.9 kJ mol\\u207b\\u00b9"}
      ],
      correctLabel: "B", topic: "energetics", difficulty: 5,
      explanations: {
        A: "Wrong \\u2014 signs are reversed.",
        B: "Correct. Hess\\u2019s Law: \\u0394H = \\u0394Hc(graphite) \\u2212 \\u0394Hc(diamond) = \\u2212393.5 \\u2212 (\\u2212395.4) = +1.9 kJ mol\\u207b\\u00b9.",
        C: "Wrong \\u2014 added instead of subtracted.",
        D: "Wrong \\u2014 added the magnitudes."
      },
      hint: "Both forms combust to CO\\u2082. Use Hess\\u2019s Law with combustion data."
    },
    {
      id: "Jun12-01", paper: "June 2012", question: "In which order do electrons fill the orbitals?",
      options: [
        {label: "A", text: "1s 2s 2p 3s 3p 4s 4p 3d"},
        {label: "B", text: "1s 2s 2p 3s 3d 3p 4s 4p"},
        {label: "C", text: "1s 2s 2p 3s 3p 3d 4s 4p"},
        {label: "D", text: "1s 2s 2p 3s 3p 4s 3d 4p"}
      ],
      correctLabel: "D", topic: "atomic structure", difficulty: 2,
      explanations: {
        A: "Wrong \\u2014 4s fills before 3d, but 3d before 4p, not after.",
        B: "Wrong \\u2014 3d does not fill before 3p.",
        C: "Wrong \\u2014 3d does not fill before 4s.",
        D: "Correct. Aufbau principle: 4s fills before 3d."
      },
      hint: "4s has lower energy than 3d, so fills first."
    },
    {
      id: "Jun12-11", paper: "June 2012", question: "Which compound has the greatest ionic character?",
      options: [
        {label: "A", text: "Caesium fluoride"},
        {label: "B", text: "Caesium iodide"},
        {label: "C", text: "Potassium fluoride"},
        {label: "D", text: "Potassium iodide"}
      ],
      correctLabel: "A", topic: "bonding", difficulty: 4,
      explanations: {
        A: "Correct. Cs is the least electronegative metal, F is the most electronegative non-metal \\u2192 largest difference.",
        B: "Wrong \\u2014 iodide is more polarizable, adding covalent character.",
        C: "Wrong \\u2014 K is more electronegative than Cs.",
        D: "Wrong \\u2014 smaller electronegativity difference on both sides."
      },
      hint: "Greatest ionic character = largest electronegativity difference between metal and non-metal."
    },
    {
      id: "Jun12-16", paper: "June 2012", question: "Which is a propagation step in the chlorination of methane?",
      options: [
        {label: "A", text: "Cl\\u2082 \\u2192 Cl\\u2022 + Cl\\u2022"},
        {label: "B", text: "CH\\u2083\\u2022 + Cl\\u2022 \\u2192 CH\\u2083Cl"},
        {label: "C", text: "CH\\u2083\\u2022 + Cl\\u2082 \\u2192 CH\\u2083Cl + Cl\\u2022"},
        {label: "D", text: "CH\\u2084 + Cl\\u2022 \\u2192 CH\\u2083Cl + H\\u2022"}
      ],
      correctLabel: "C", topic: "alkanes", difficulty: 3,
      explanations: {
        A: "Wrong \\u2014 this is initiation (homolytic fission).",
        B: "Wrong \\u2014 this is termination (two radicals combining).",
        C: "Correct. Radical + molecule \\u2192 product + new radical. The chain continues.",
        D: "Wrong \\u2014 the products should be CH\\u2083\\u2022 + HCl, not CH\\u2083Cl + H\\u2022."
      },
      hint: "Propagation: radical + molecule \\u2192 new radical + molecule. Chain continues."
    },
    {
      id: "Jun12-20", paper: "June 2012", question: "Which fuel, when burned, makes no significant contribution to climate change?",
      options: [
        {label: "A", text: "Hydrogen"},
        {label: "B", text: "Methane"},
        {label: "C", text: "Petrol"},
        {label: "D", text: "Coal"}
      ],
      correctLabel: "A", topic: "alkanes", difficulty: 2,
      explanations: {
        A: "Correct. 2H\\u2082 + O\\u2082 \\u2192 2H\\u2082O. Only water produced \\u2014 no CO\\u2082.",
        B: "Wrong \\u2014 produces CO\\u2082.",
        C: "Wrong \\u2014 produces CO\\u2082.",
        D: "Wrong \\u2014 produces CO\\u2082."
      },
      hint: "Which product is NOT a greenhouse gas?"
    }
  ]
};
`;

const ANCHOR_SUBJECT_LIST = 'const SUBJECT_LIST = Object.values(SUBJECTS);';

if (!code.includes(ANCHOR_SUBJECT_LIST)) {
  console.error('ERROR: Could not find SUBJECT_LIST anchor. Aborting.');
  process.exit(1);
}

code = code.replace(
  ANCHOR_SUBJECT_LIST,
  ANCHOR_SUBJECT_LIST + PAST_PAPER_BANK
);

console.log('✅ Step 1: Added PAST_PAPER_QUESTIONS bank');


// ═══════════════════════════════════════
// STEP 2: Replace fetchQuizQuestion with hybrid version
// ═══════════════════════════════════════

const OLD_FETCH = `  const fetchQuizQuestion = useCallback(async (questionNumber) => {
    if (!currentSubject) return;
    setLoading(true);
    setErr(null);
    setQuizQ(null);
    setQuizSelected(null);
    setQuizFeedback(false);
    setHintText(null);
    const difficulty = Math.min(10, Math.max(1, Math.ceil(questionNumber * 1.1)));
    const prevTopics = quizHistory.map(h => h.topic).filter(Boolean);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: \`Generate question \${questionNumber}/10. Difficulty: \${difficulty}/10. \${prevTopics.length ? "Already covered topics: " + prevTopics.join(", ") + ". Try a different topic." : ""} Respond with ONLY JSON.\` }],
          system: QUIZ_GEN_SYSTEM(currentSubject.system),
          mode: "quiz",
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      const text = data.content?.map(b => b.type === "text" ? b.text : "").filter(Boolean).join("\\n") || "";
      const parsed = parseJSON(text);
      if (parsed && parsed.question && parsed.options && parsed.correctLabel) {
        setQuizQ(parsed);
      } else {
        throw new Error("Failed to parse question. Please try again.");
      }
    } catch (e) { setErr(e.message); }
    finally { setLoading(false); }
  }, [currentSubject, quizHistory]);`;

const NEW_FETCH = `  // Track which past paper Qs have been used in this quiz session
  const [usedPastPaperIds, setUsedPastPaperIds] = useState([]);

  const getRandomPastPaperQ = useCallback(() => {
    const bank = PAST_PAPER_QUESTIONS[currentSubject?.id];
    if (!bank || bank.length === 0) return null;
    const available = bank.filter(q => !usedPastPaperIds.includes(q.id));
    if (available.length === 0) return null;
    const pick = available[Math.floor(Math.random() * available.length)];
    setUsedPastPaperIds(prev => [...prev, pick.id]);
    return { ...pick, isPastPaper: true };
  }, [currentSubject, usedPastPaperIds]);

  const fetchQuizQuestion = useCallback(async (questionNumber) => {
    if (!currentSubject) return;
    setLoading(true);
    setErr(null);
    setQuizQ(null);
    setQuizSelected(null);
    setQuizFeedback(false);
    setHintText(null);

    // Hybrid logic: odd questions from past papers, even from AI
    const usePastPaper = questionNumber % 2 === 1;
    const bank = PAST_PAPER_QUESTIONS[currentSubject?.id];

    if (usePastPaper && bank && bank.length > 0) {
      const pastQ = getRandomPastPaperQ();
      if (pastQ) {
        setQuizQ(pastQ);
        setLoading(false);
        return;
      }
      // If no past paper Qs left, fall through to AI
    }

    // AI-generated question
    const difficulty = Math.min(10, Math.max(1, Math.ceil(questionNumber * 1.1)));
    const prevTopics = quizHistory.map(h => h.topic).filter(Boolean);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: \`Generate question \${questionNumber}/10. Difficulty: \${difficulty}/10. \${prevTopics.length ? "Already covered topics: " + prevTopics.join(", ") + ". Try a different topic." : ""} Respond with ONLY JSON.\` }],
          system: QUIZ_GEN_SYSTEM(currentSubject.system),
          mode: "quiz",
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      const text = data.content?.map(b => b.type === "text" ? b.text : "").filter(Boolean).join("\\n") || "";
      const parsed = parseJSON(text);
      if (parsed && parsed.question && parsed.options && parsed.correctLabel) {
        setQuizQ({ ...parsed, isPastPaper: false });
      } else {
        throw new Error("Failed to parse question. Please try again.");
      }
    } catch (e) { setErr(e.message); }
    finally { setLoading(false); }
  }, [currentSubject, quizHistory, getRandomPastPaperQ]);`;

if (!code.includes('const fetchQuizQuestion = useCallback(async (questionNumber) => {')) {
  console.error('ERROR: Could not find fetchQuizQuestion function. Aborting.');
  process.exit(1);
}

code = code.replace(OLD_FETCH, NEW_FETCH);
console.log('✅ Step 2: Replaced fetchQuizQuestion with hybrid version');


// ═══════════════════════════════════════
// STEP 3: Reset usedPastPaperIds in resetQuiz
// ═══════════════════════════════════════

const OLD_RESET = `    setQuizQ(null); setQuizNum(0); setQuizSelected(null); setQuizFeedback(null);
    setQuizScore(0); setQuizMaxScore(0); setQuizHistory([]); setQuizDone(false);
    setHintText(null); setHintLoading(false);`;

const NEW_RESET = `    setQuizQ(null); setQuizNum(0); setQuizSelected(null); setQuizFeedback(null);
    setQuizScore(0); setQuizMaxScore(0); setQuizHistory([]); setQuizDone(false);
    setHintText(null); setHintLoading(false); setUsedPastPaperIds([]);`;

if (!code.includes(OLD_RESET)) {
  console.error('ERROR: Could not find resetQuiz internals. Aborting.');
  process.exit(1);
}

code = code.replace(OLD_RESET, NEW_RESET);
console.log('✅ Step 3: Added usedPastPaperIds reset');


// ═══════════════════════════════════════
// STEP 4: Add "Past paper" badge to question display
// ═══════════════════════════════════════

const OLD_QNUM_DISPLAY = `                <div style={{ fontSize: 15, lineHeight: 1.8, color: C.text }}>
                  <span style={{ fontWeight: 600 }}>{quizNum}.</span>  {quizQ.question}
                </div>`;

const NEW_QNUM_DISPLAY = `                <div style={{ fontSize: 15, lineHeight: 1.8, color: C.text }}>
                  <span style={{ fontWeight: 600 }}>{quizNum}.</span>  {quizQ.question}
                </div>
                {quizQ.isPastPaper && (
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 5, marginTop: 6, padding: "3px 10px", borderRadius: 4, background: "rgba(77,148,96,0.08)", border: "1px solid rgba(77,148,96,0.2)", fontSize: 10, color: C.green, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    ✦ Past paper{quizQ.paper ? " · " + quizQ.paper : ""}
                  </div>
                )}`;

if (!code.includes(OLD_QNUM_DISPLAY)) {
  console.error('ERROR: Could not find question number display. Aborting.');
  process.exit(1);
}

code = code.replace(OLD_QNUM_DISPLAY, NEW_QNUM_DISPLAY);
console.log('✅ Step 4: Added "Past paper" badge to question display');


// ═══════════════════════════════════════
// STEP 5: Add past paper indicator to quiz history
// ═══════════════════════════════════════

const OLD_HISTORY_PUSH = `    setQuizHistory(h => [...h, {
      q: quizQ.question, answer: quizSelected,
      correct: isCorrect, topic: quizQ.topic,
      correctLabel: quizQ.correctLabel,
    }]);`;

const NEW_HISTORY_PUSH = `    setQuizHistory(h => [...h, {
      q: quizQ.question, answer: quizSelected,
      correct: isCorrect, topic: quizQ.topic,
      correctLabel: quizQ.correctLabel,
      isPastPaper: quizQ.isPastPaper || false,
    }]);`;

if (!code.includes(OLD_HISTORY_PUSH)) {
  console.error('ERROR: Could not find quiz history push. Aborting.');
  process.exit(1);
}

code = code.replace(OLD_HISTORY_PUSH, NEW_HISTORY_PUSH);
console.log('✅ Step 5: Added isPastPaper to quiz history');


// ═══════════════════════════════════════
// WRITE
// ═══════════════════════════════════════

fs.writeFileSync(PAGE_JS, code, 'utf8');
console.log(`\n✅ All patches applied successfully to ${PAGE_JS}`);
console.log('\nNext steps:');
console.log('  1. npm run dev  →  test locally');
console.log('  2. git add .');
console.log('  3. git commit -m "Add hybrid quiz: past paper + AI-generated questions"');
console.log('  4. git push');
