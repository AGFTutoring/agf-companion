"use client"; 
import { useState, useRef, useEffect, useCallback } from "react";

/* ═══════════════════════════════════════════════════
   AGF STUDY COMPANION — HIERARCHICAL SUBJECT PICKER
   Palette: charcoal grey + green (AGF brand)
   ═══════════════════════════════════════════════════ */

const C = {
  bg: "#1a1a1a",
  bgLight: "#222222",
  bgCard: "#2a2a2a",
  bgInput: "#242424",
  green: "#4d9460",
  greenLight: "#5ba86d",
  greenDim: "rgba(77,148,96,0.12)",
  greenBorder: "rgba(77,148,96,0.3)",
  text: "#e8e5de",
  textMuted: "#9a9690",
  textDim: "#706b65",
  border: "rgba(255,255,255,0.08)",
  borderLight: "rgba(255,255,255,0.04)",
  red: "#e06060",
  amber: "#d4a24c",
};

/* ═══════════════════════════════════════════════════
   SUBJECT CATALOG — hierarchical structure
   Top-level tiles → exam boards → units/papers
   ═══════════════════════════════════════════════════ */



/* ═══════════════════════════════════════════════════
   PAST-PAPER QUESTION BANK
   Real Edexcel exam questions, extracted from official papers.
   Keyed by unit ID matching UNITS keys.
   ═══════════════════════════════════════════════════ */

const PAST_PAPERS = {
  phys1: [
  {
    "source": "June 2010",
    "number": 1,
    "question": "Distance travelled can be found from the",
    "options": [
      {"label": "A", "text": "area under a velocity-time graph"},
      {"label": "B", "text": "area under an acceleration-time graph"},
      {"label": "C", "text": "gradient of a force-time graph"},
      {"label": "D", "text": "gradient of a velocity-time graph"}
    ],
    "correctLabel": "A",
    "topic": "kinematics graphs",
    "difficulty": 2,
    "explanations": {
      "A": "Correct. The area under a v-t graph gives displacement/distance. Area = velocity × time = distance.",
      "B": "Wrong. The area under an a-t graph gives change in velocity, not distance.",
      "C": "Wrong. The gradient of a force-time graph has no standard kinematic meaning for distance.",
      "D": "Wrong. The gradient of a v-t graph gives acceleration, not distance."
    },
    "hint": "Think about what quantity you get when you multiply velocity by time."
  },
  {
    "source": "June 2010",
    "number": 2,
    "question": "Which of the following is a scalar quantity?",
    "options": [
      {"label": "A", "text": "acceleration"},
      {"label": "B", "text": "displacement"},
      {"label": "C", "text": "force"},
      {"label": "D", "text": "work"}
    ],
    "correctLabel": "D",
    "topic": "scalars and vectors",
    "difficulty": 2,
    "explanations": {
      "A": "Wrong. Acceleration has both magnitude and direction — it's a vector.",
      "B": "Wrong. Displacement specifies a direction — it's a vector.",
      "C": "Wrong. Force acts in a specific direction — it's a vector.",
      "D": "Correct. Work (W = Fs cosθ) is a scalar — it has magnitude only, measured in joules."
    },
    "hint": "Scalars have magnitude only. Which of these doesn't need a direction to be fully described?"
  },
  {
    "source": "June 2010",
    "number": 3,
    "question": "A car pulls a trailer of weight 2500 N with a force of 20 N for a distance of 8 km along a horizontal road. How much work is done by the car in pulling the trailer?",
    "options": [
      {"label": "A", "text": "160 J"},
      {"label": "B", "text": "20 000 J"},
      {"label": "C", "text": "160 000 J"},
      {"label": "D", "text": "20 000 000 J"}
    ],
    "correctLabel": "C",
    "topic": "work done",
    "difficulty": 3,
    "explanations": {
      "A": "Wrong. This is 20 × 8 = 160 — you forgot to convert km to m.",
      "B": "Wrong. This is 2500 × 8 — you used the weight instead of the pulling force, and didn't convert km.",
      "C": "Correct. W = Fd = 20 N × 8000 m = 160 000 J. Remember to convert 8 km to 8000 m.",
      "D": "Wrong. This is 2500 × 8000 — you used the weight instead of the pulling force."
    },
    "hint": "Work done = force × distance. Make sure you use the correct force and convert units properly."
  },
  {
    "source": "June 2010",
    "number": 5,
    "question": "Which of the following units could be used for power?",
    "options": [
      {"label": "A", "text": "kg m s⁻²"},
      {"label": "B", "text": "kg m² s⁻²"},
      {"label": "C", "text": "kg m² s⁻³"},
      {"label": "D", "text": "kg² m² s⁻³"}
    ],
    "correctLabel": "C",
    "topic": "units and dimensions",
    "difficulty": 4,
    "explanations": {
      "A": "Wrong. kg m s⁻² is the unit of force (newton).",
      "B": "Wrong. kg m² s⁻² is the unit of energy (joule).",
      "C": "Correct. Power = energy/time. J/s = kg m² s⁻² / s = kg m² s⁻³ = watt.",
      "D": "Wrong. This has kg², which doesn't correspond to any standard physical quantity for power."
    },
    "hint": "Power = energy ÷ time. Work out the base units of energy first, then divide by seconds."
  },
  {
    "source": "June 2010",
    "number": 7,
    "question": "A building has 5 floors. The windows on successive floors are separated by the same vertical distance. A brick is dropped from a window on each floor at the same time. The bricks should hit the ground at",
    "options": [
      {"label": "A", "text": "decreasing time intervals"},
      {"label": "B", "text": "equal time intervals"},
      {"label": "C", "text": "increasing time intervals"},
      {"label": "D", "text": "the same time"}
    ],
    "correctLabel": "A",
    "topic": "free fall",
    "difficulty": 5,
    "explanations": {
      "A": "Correct. Using s = ½gt², time ∝ √s. The higher bricks fall further but the time intervals between impacts decrease because the lower bricks have less distance to fall and arrive in quicker succession.",
      "B": "Wrong. Equal intervals would require equal distances, but t ∝ √s means the relationship is non-linear.",
      "C": "Wrong. The intervals actually decrease, not increase.",
      "D": "Wrong. They're dropped from different heights so they can't all hit at the same time."
    },
    "hint": "Use s = ½gt². How does fall time relate to height? Think about the square root relationship."
  },
  {
    "source": "June 2010",
    "number": 8,
    "question": "All ductile materials are also",
    "options": [
      {"label": "A", "text": "brittle"},
      {"label": "B", "text": "hard"},
      {"label": "C", "text": "malleable"},
      {"label": "D", "text": "stiff"}
    ],
    "correctLabel": "C",
    "topic": "material properties",
    "difficulty": 3,
    "explanations": {
      "A": "Wrong. Brittle is the opposite of ductile — brittle materials fracture without plastic deformation.",
      "B": "Wrong. Hardness (resistance to scratching) is independent of ductility.",
      "C": "Correct. Ductile means it can be drawn into wires; malleable means it can be hammered into shape. Both require significant plastic deformation, so all ductile materials are also malleable.",
      "D": "Wrong. Stiffness (resistance to elastic deformation) is independent of ductility."
    },
    "hint": "Ductile means a material can undergo significant plastic deformation. What other property requires plastic deformation?"
  },
  {
    "source": "June 2010",
    "number": 9,
    "question": "An aeroplane is climbing at a constant velocity. Which of the following shows the correct two relationships between the forces?",
    "options": [
      {"label": "A", "text": "lift > weight, thrust > drag"},
      {"label": "B", "text": "lift > weight, thrust = drag"},
      {"label": "C", "text": "lift = weight, thrust > drag"},
      {"label": "D", "text": "lift = weight, thrust = drag"}
    ],
    "correctLabel": "A",
    "topic": "forces and equilibrium",
    "difficulty": 5,
    "explanations": {
      "A": "Correct. At constant velocity climbing: the resultant force is zero. Resolving along and perpendicular to the direction of travel, for a climb the vertical component of thrust plus the vertical component of lift must equal weight, and the horizontal components must balance. Since the plane climbs, lift > weight in the vertical direction, and thrust > drag to maintain the climb angle.",
      "B": "Wrong. If thrust = drag, there would be no component to sustain the climb against gravity's component along the flight path.",
      "C": "Wrong. If lift = weight exactly, the plane couldn't maintain an upward trajectory.",
      "D": "Wrong. This describes level flight at constant speed, not climbing."
    },
    "hint": "Constant velocity means zero resultant force. But the plane is climbing — think about what components of the forces are needed for upward motion."
  },
  {
    "source": "June 2010",
    "number": 10,
    "question": "The aeroplane is now flown at a constant altitude but an increasing speed. Which of the following pairs of forces will have the same magnitude?",
    "options": [
      {"label": "A", "text": "drag and weight"},
      {"label": "B", "text": "drag and thrust"},
      {"label": "C", "text": "lift and drag"},
      {"label": "D", "text": "lift and weight"}
    ],
    "correctLabel": "D",
    "topic": "forces and equilibrium",
    "difficulty": 4,
    "explanations": {
      "A": "Wrong. Drag acts horizontally and weight acts vertically — they balance different components.",
      "B": "Wrong. If drag = thrust, there would be no net horizontal force, so no acceleration — but the plane is speeding up.",
      "C": "Wrong. Lift acts vertically and drag acts horizontally — they act in perpendicular directions.",
      "D": "Correct. Constant altitude means no vertical acceleration, so the vertical forces must balance: lift = weight. The plane is accelerating horizontally, so thrust > drag."
    },
    "hint": "Constant altitude means no vertical acceleration. Increasing speed means horizontal acceleration. Which forces are vertical?"
  },
  {
    "source": "June 2011",
    "number": 1,
    "question": "Which of the following is not a vector quantity?",
    "options": [
      {"label": "A", "text": "displacement"},
      {"label": "B", "text": "force"},
      {"label": "C", "text": "weight"},
      {"label": "D", "text": "work"}
    ],
    "correctLabel": "D",
    "topic": "scalars and vectors",
    "difficulty": 2,
    "explanations": {
      "A": "Wrong. Displacement has direction — it's a vector.",
      "B": "Wrong. Force has direction — it's a vector.",
      "C": "Wrong. Weight acts downward — it's a vector (it's a force).",
      "D": "Correct. Work is a scalar quantity — it has magnitude only (measured in joules)."
    },
    "hint": "Vectors have both magnitude and direction. Which quantity here doesn't have a direction?"
  },
  {
    "source": "June 2011",
    "number": 2,
    "question": "Which of the following units is equivalent to the SI unit for energy?",
    "options": [
      {"label": "A", "text": "kg m s⁻²"},
      {"label": "B", "text": "kW h"},
      {"label": "C", "text": "N m⁻¹"},
      {"label": "D", "text": "W s"}
    ],
    "correctLabel": "D",
    "topic": "units and dimensions",
    "difficulty": 3,
    "explanations": {
      "A": "Wrong. kg m s⁻² is the unit of force (newton), not energy.",
      "B": "Wrong. kW h is a unit of energy but it's not an SI unit — it's a practical unit. The SI unit is the joule.",
      "C": "Wrong. N m⁻¹ is the unit of spring constant (stiffness), not energy.",
      "D": "Correct. Power × time = energy. W × s = J. One watt-second equals one joule."
    },
    "hint": "Energy = power × time. What unit do you get when you multiply watts by seconds?"
  },
  {
    "source": "June 2011",
    "number": 3,
    "question": "A graph shows how tensile stress varies with tensile strain for a wire, with points X, Y, and Z marked. Which row gives the correct terms for points X, Y, and Z?",
    "options": [
      {"label": "A", "text": "X = Elastic limit, Y = Yield point, Z = Maximum tensile stress"},
      {"label": "B", "text": "X = Limit of proportionality, Y = Elastic limit, Z = Yield point"},
      {"label": "C", "text": "X = Elastic limit, Y = Maximum tensile stress, Z = Limit of proportionality"},
      {"label": "D", "text": "X = Limit of proportionality, Y = Yield point, Z = Maximum tensile stress"}
    ],
    "correctLabel": "D",
    "topic": "stress-strain graphs",
    "difficulty": 4,
    "explanations": {
      "A": "Wrong. The elastic limit comes after the limit of proportionality, and Y should be the yield point.",
      "B": "Wrong. Z is at the peak of the curve, which is maximum tensile stress, not the yield point.",
      "C": "Wrong. The order on the graph is: limit of proportionality first, then yield point, then UTS.",
      "D": "Correct. On a stress-strain curve: X (where the line stops being straight) = limit of proportionality, Y (where plastic deformation begins) = yield point, Z (highest point) = maximum tensile stress (UTS)."
    },
    "hint": "On a stress-strain graph, the key points in order are: limit of proportionality → yield point → UTS (maximum stress)."
  },
  {
    "source": "June 2011",
    "number": 4,
    "question": "The acceleration of free fall on Mars is 3.7 m s⁻². If an object on Mars is launched vertically upwards with an initial speed of 40 m s⁻¹, its speed after 3.0 s will be",
    "options": [
      {"label": "A", "text": "11 m s⁻¹"},
      {"label": "B", "text": "29 m s⁻¹"},
      {"label": "C", "text": "36 m s⁻¹"},
      {"label": "D", "text": "51 m s⁻¹"}
    ],
    "correctLabel": "B",
    "topic": "SUVAT equations",
    "difficulty": 3,
    "explanations": {
      "A": "Wrong. This is 40 − (9.81 × 3) — you used g for Earth, not Mars.",
      "B": "Correct. v = u − at = 40 − (3.7 × 3.0) = 40 − 11.1 = 28.9 ≈ 29 m s⁻¹. The object decelerates due to gravity on Mars.",
      "C": "Wrong. Check your arithmetic — this doesn't match v = u − at with these values.",
      "D": "Wrong. This is 40 + (3.7 × 3) — you added instead of subtracting. The object is decelerating as it goes up."
    },
    "hint": "Use v = u + at. The object is going up and gravity pulls it down, so acceleration is negative."
  },
  {
    "source": "June 2011",
    "number": 5,
    "question": "The gravitational field strength on Mars is 3.7 N kg⁻¹. A 5.0 kg object is raised through a height of 150 cm on Mars. The change in gravitational potential energy is",
    "options": [
      {"label": "A", "text": "19 J"},
      {"label": "B", "text": "28 J"},
      {"label": "C", "text": "49 J"},
      {"label": "D", "text": "74 J"}
    ],
    "correctLabel": "B",
    "topic": "gravitational potential energy",
    "difficulty": 3,
    "explanations": {
      "A": "Wrong. This is 3.7 × 5.0 × 1.0 — you may have used 1 m instead of 1.5 m.",
      "B": "Correct. Ep = mgh = 5.0 × 3.7 × 1.50 = 27.75 ≈ 28 J. Remember to convert 150 cm to 1.50 m.",
      "C": "Wrong. This is 5.0 × 9.81 × 1.0 — you used Earth's g and wrong height.",
      "D": "Wrong. This is 5.0 × 9.81 × 1.5 — you used Earth's g instead of Mars's."
    },
    "hint": "Use Ep = mgh. Be careful with units — convert cm to m first."
  },
  {
    "source": "June 2011",
    "number": 7,
    "question": "A material which resists plastic deformation by scratching is described as",
    "options": [
      {"label": "A", "text": "brittle"},
      {"label": "B", "text": "hard"},
      {"label": "C", "text": "malleable"},
      {"label": "D", "text": "stiff"}
    ],
    "correctLabel": "B",
    "topic": "material properties",
    "difficulty": 2,
    "explanations": {
      "A": "Wrong. Brittle means a material fractures with little plastic deformation — not about scratching.",
      "B": "Correct. Hardness is defined as resistance to plastic deformation of the surface, typically tested by scratching or indentation.",
      "C": "Wrong. Malleable means a material can be hammered into shape — the opposite of resisting deformation.",
      "D": "Wrong. Stiff means high Young's modulus — resistance to elastic deformation, not scratching."
    },
    "hint": "Which material property is specifically about resistance to surface deformation like scratching?"
  },
  {
    "source": "June 2011",
    "number": 9,
    "question": "The gradient of a displacement-time graph gives",
    "options": [
      {"label": "A", "text": "acceleration"},
      {"label": "B", "text": "displacement"},
      {"label": "C", "text": "force"},
      {"label": "D", "text": "velocity"}
    ],
    "correctLabel": "D",
    "topic": "kinematics graphs",
    "difficulty": 2,
    "explanations": {
      "A": "Wrong. Acceleration is the gradient of a velocity-time graph, not displacement-time.",
      "B": "Wrong. Displacement is read directly from the y-axis, not from the gradient.",
      "C": "Wrong. Force is not directly obtained from a displacement-time graph.",
      "D": "Correct. Velocity = displacement/time = Δs/Δt, which is the gradient of an s-t graph."
    },
    "hint": "Gradient = change in y / change in x. On a displacement-time graph, that's Δs/Δt. What is that?"
  },
  {
    "source": "June 2011",
    "number": 10,
    "question": "A table tennis ball is released beneath the surface of water and moves upwards. The relationship between the forces acting on the ball when it reaches terminal velocity is",
    "options": [
      {"label": "A", "text": "weight = upthrust"},
      {"label": "B", "text": "weight + drag = upthrust"},
      {"label": "C", "text": "weight = upthrust + drag"},
      {"label": "D", "text": "weight = drag"}
    ],
    "correctLabel": "B",
    "topic": "terminal velocity and forces",
    "difficulty": 5,
    "explanations": {
      "A": "Wrong. If weight = upthrust only, there would be no drag term, which is wrong since the ball is moving.",
      "B": "Correct. The ball moves upward, so upthrust acts upward while weight and drag both act downward. At terminal velocity: upward force = downward forces, so upthrust = weight + drag.",
      "C": "Wrong. This would mean the net force is downward, but the ball is moving upward.",
      "D": "Wrong. This ignores upthrust, which is the driving force pushing the ball upward."
    },
    "hint": "The ball moves UP through water. Upthrust acts UP. Weight and drag both act DOWN. At terminal velocity, forces balance."
  },
  {
    "source": "June 2012",
    "number": 1,
    "question": "Which of these quantities is not measured in an SI base unit?",
    "options": [
      {"label": "A", "text": "distance"},
      {"label": "B", "text": "force"},
      {"label": "C", "text": "mass"},
      {"label": "D", "text": "time"}
    ],
    "correctLabel": "B",
    "topic": "SI units",
    "difficulty": 2,
    "explanations": {
      "A": "Wrong. Distance is measured in metres — an SI base unit.",
      "B": "Correct. Force is measured in newtons (N), which is a derived unit: N = kg m s⁻². It is NOT a base unit.",
      "C": "Wrong. Mass is measured in kilograms — an SI base unit.",
      "D": "Wrong. Time is measured in seconds — an SI base unit."
    },
    "hint": "The 7 SI base units include metre, kilogram, second, ampere, kelvin, mole, candela. Which quantity here uses a derived unit?"
  },
  {
    "source": "June 2012",
    "number": 2,
    "question": "Displacement can be found from the",
    "options": [
      {"label": "A", "text": "area under a distance-time graph"},
      {"label": "B", "text": "area under a velocity-time graph"},
      {"label": "C", "text": "gradient of a distance-time graph"},
      {"label": "D", "text": "gradient of a velocity-time graph"}
    ],
    "correctLabel": "B",
    "topic": "kinematics graphs",
    "difficulty": 2,
    "explanations": {
      "A": "Wrong. The area under a distance-time graph doesn't give a standard kinematic quantity.",
      "B": "Correct. Area under a v-t graph = velocity × time = displacement.",
      "C": "Wrong. The gradient of a distance-time graph gives speed, not displacement.",
      "D": "Wrong. The gradient of a v-t graph gives acceleration, not displacement."
    },
    "hint": "Area under a graph = y-quantity × x-quantity. For a v-t graph, that's velocity × time."
  },
  {
    "source": "June 2012",
    "number": 3,
    "question": "A wire of length x is stretched by a force F. The extension is Δx. A second wire of the same material and cross-sectional area is stretched by the same force. If it has twice the length of the first wire its extension will be",
    "options": [
      {"label": "A", "text": "½Δx"},
      {"label": "B", "text": "Δx"},
      {"label": "C", "text": "2Δx"},
      {"label": "D", "text": "4Δx"}
    ],
    "correctLabel": "C",
    "topic": "Young's modulus and extension",
    "difficulty": 4,
    "explanations": {
      "A": "Wrong. A longer wire is easier to stretch, not harder.",
      "B": "Wrong. Doubling the length does change the extension.",
      "C": "Correct. From E = FL/AΔL, rearranging gives ΔL = FL/AE. If L doubles (same F, A, E), extension doubles: 2Δx.",
      "D": "Wrong. Extension is proportional to length, not length squared."
    },
    "hint": "Young's modulus E = stress/strain = (F/A)/(ΔL/L). Rearrange for ΔL and see how it depends on L."
  },
  {
    "source": "June 2012",
    "number": 4,
    "question": "Which equation shows a scalar quantity as the product of two vector quantities?",
    "options": [
      {"label": "A", "text": "energy = power × time"},
      {"label": "B", "text": "force = stiffness × extension"},
      {"label": "C", "text": "mass = density × volume"},
      {"label": "D", "text": "work = force × displacement"}
    ],
    "correctLabel": "D",
    "topic": "scalars and vectors",
    "difficulty": 4,
    "explanations": {
      "A": "Wrong. Power is scalar and time is scalar — this is scalar × scalar = scalar.",
      "B": "Wrong. Stiffness is scalar and extension is scalar (or vector depending on context) — but force is a vector, not scalar, result.",
      "C": "Wrong. Density and volume are both scalars. Mass is also scalar.",
      "D": "Correct. Work = F · s = Fs cosθ. Force is a vector, displacement is a vector, and their dot product (work) is a scalar."
    },
    "hint": "You need: scalar = vector × vector. This is the dot product. Which equation multiplies two directed quantities to give a non-directed result?"
  },
  {
    "source": "June 2012",
    "number": 5,
    "question": "A material which can be drawn into a wire is described as being",
    "options": [
      {"label": "A", "text": "brittle"},
      {"label": "B", "text": "ductile"},
      {"label": "C", "text": "hard"},
      {"label": "D", "text": "soft"}
    ],
    "correctLabel": "B",
    "topic": "material properties",
    "difficulty": 1,
    "explanations": {
      "A": "Wrong. Brittle materials fracture easily — they can't be drawn into wires.",
      "B": "Correct. Ductile literally means 'able to be drawn into a wire'. It indicates significant plastic deformation before fracture.",
      "C": "Wrong. Hard means resistant to surface deformation — not related to wire-drawing.",
      "D": "Wrong. Soft means easily deformed — it doesn't specifically mean it can be drawn into a wire."
    },
    "hint": "The definition of this property is literally 'can be drawn into a wire'."
  },
  {
    "source": "June 2012",
    "number": 6,
    "question": "A bowling ball of mass 7.0 kg is travelling at a speed of 4.0 m s⁻¹. The kinetic energy of the ball is",
    "options": [
      {"label": "A", "text": "14 J"},
      {"label": "B", "text": "28 J"},
      {"label": "C", "text": "56 J"},
      {"label": "D", "text": "112 J"}
    ],
    "correctLabel": "C",
    "topic": "kinetic energy",
    "difficulty": 2,
    "explanations": {
      "A": "Wrong. This is ½ × 7.0 × 4.0 — you forgot to square the velocity.",
      "B": "Wrong. This is 7.0 × 4.0 — you used mv instead of ½mv².",
      "C": "Correct. Ek = ½mv² = ½ × 7.0 × 4.0² = ½ × 7.0 × 16 = 56 J.",
      "D": "Wrong. This is 7.0 × 4.0² — you forgot the ½."
    },
    "hint": "Use Ek = ½mv². Remember to square the velocity before multiplying."
  },
  {
    "source": "June 2012",
    "number": 7,
    "question": "An object of weight W sits on an inclined surface at angle θ to the horizontal. The component of the weight W parallel to the surface is",
    "options": [
      {"label": "A", "text": "0"},
      {"label": "B", "text": "1"},
      {"label": "C", "text": "W cos θ"},
      {"label": "D", "text": "W sin θ"}
    ],
    "correctLabel": "D",
    "topic": "resolving forces",
    "difficulty": 3,
    "explanations": {
      "A": "Wrong. There is a component of weight along the slope — that's what makes objects slide.",
      "B": "Wrong. The component depends on W and θ, not just 1.",
      "C": "Wrong. W cos θ is the component perpendicular to the surface (pressing into the slope).",
      "D": "Correct. The component of weight parallel to the slope = W sin θ. This is the force that would cause the object to slide down."
    },
    "hint": "Draw the weight vector straight down, then resolve it into components parallel and perpendicular to the slope."
  },
  {
    "source": "June 2012",
    "number": 9,
    "question": "A motor raises a mass m through a height Δh in time t. The power of the motor is given by",
    "options": [
      {"label": "A", "text": "mgtΔh"},
      {"label": "B", "text": "mg/(tΔh)"},
      {"label": "C", "text": "mgΔh/t"},
      {"label": "D", "text": "mgt/Δh"}
    ],
    "correctLabel": "C",
    "topic": "power",
    "difficulty": 3,
    "explanations": {
      "A": "Wrong. This gives units of N·s·m which is not watts.",
      "B": "Wrong. This has time in the denominator alongside height — dimensionally incorrect.",
      "C": "Correct. Power = work done / time = (mgΔh) / t. Work done against gravity = mgh.",
      "D": "Wrong. This has height in the denominator — dimensionally incorrect for power."
    },
    "hint": "Power = work done ÷ time. Work done lifting = mgh."
  },
  {
    "source": "June 2013",
    "number": 1,
    "question": "Which pair of quantities does not contain a vector and a scalar?",
    "options": [
      {"label": "A", "text": "acceleration and time"},
      {"label": "B", "text": "force and displacement"},
      {"label": "C", "text": "mass and acceleration"},
      {"label": "D", "text": "velocity and time"}
    ],
    "correctLabel": "B",
    "topic": "scalars and vectors",
    "difficulty": 3,
    "explanations": {
      "A": "Wrong. Acceleration (vector) and time (scalar) — this pair does contain one of each.",
      "B": "Correct. Force (vector) and displacement (vector) — both are vectors, so this pair does NOT contain a vector and a scalar.",
      "C": "Wrong. Mass (scalar) and acceleration (vector) — this pair does contain one of each.",
      "D": "Wrong. Velocity (vector) and time (scalar) — this pair does contain one of each."
    },
    "hint": "The question asks which pair does NOT have one vector and one scalar. Look for the pair where both are vectors (or both scalars)."
  },
  {
    "source": "June 2013",
    "number": 2,
    "question": "A wire of length 80 cm has a force F applied. The new length of the wire is 84 cm. The strain is given by",
    "options": [
      {"label": "A", "text": "4/84"},
      {"label": "B", "text": "4/80"},
      {"label": "C", "text": "80/84"},
      {"label": "D", "text": "84/80"}
    ],
    "correctLabel": "B",
    "topic": "strain",
    "difficulty": 2,
    "explanations": {
      "A": "Wrong. You divided by the new length — strain uses the original length.",
      "B": "Correct. Strain = extension / original length = (84 − 80) / 80 = 4/80.",
      "C": "Wrong. This is original length / new length — not the definition of strain.",
      "D": "Wrong. This is new length / original length — not the definition of strain."
    },
    "hint": "Strain = extension ÷ original length. Extension = new length − original length."
  },
  {
    "source": "June 2013",
    "number": 3,
    "question": "Which of the following is a derived SI quantity?",
    "options": [
      {"label": "A", "text": "force"},
      {"label": "B", "text": "length"},
      {"label": "C", "text": "second"},
      {"label": "D", "text": "watt"}
    ],
    "correctLabel": "A",
    "topic": "SI units",
    "difficulty": 2,
    "explanations": {
      "A": "Correct. Force (newton) is a derived quantity: N = kg m s⁻². It's made from base units.",
      "B": "Wrong. Length (metre) is a base SI quantity.",
      "C": "Wrong. The second is a base SI unit, not a derived quantity.",
      "D": "Wrong. The watt is a derived unit, but the question asks for a 'derived SI quantity' — force is the quantity, watt is a unit. Both A and D could work, but force is the standard answer as a derived quantity."
    },
    "hint": "Base SI quantities are: mass, length, time, current, temperature, amount, luminous intensity. Everything else is derived."
  },
  {
    "source": "June 2013",
    "number": 8,
    "question": "Which of the following descriptions of a material implies that it undergoes significant plastic deformation?",
    "options": [
      {"label": "A", "text": "brittle"},
      {"label": "B", "text": "hard"},
      {"label": "C", "text": "malleable"},
      {"label": "D", "text": "stiff"}
    ],
    "correctLabel": "C",
    "topic": "material properties",
    "difficulty": 2,
    "explanations": {
      "A": "Wrong. Brittle materials undergo very little plastic deformation before fracturing.",
      "B": "Wrong. Hard means resistance to surface deformation — doesn't imply extensive plastic deformation.",
      "C": "Correct. Malleable means a material can be hammered or pressed into shape, which requires significant plastic deformation.",
      "D": "Wrong. Stiff means high Young's modulus — resistance to elastic deformation, not about plastic deformation."
    },
    "hint": "Which property means the material can be reshaped (e.g. hammered into sheets) without breaking?"
  },
  {
    "source": "June 2013",
    "number": 9,
    "question": "A trolley rolls down a slope from rest. The trolley moves through a vertical height h while rolling a distance s along the slope. The maximum possible speed is given by",
    "options": [
      {"label": "A", "text": "2gs"},
      {"label": "B", "text": "2gh"},
      {"label": "C", "text": "√(2gs)"},
      {"label": "D", "text": "√(2gh)"}
    ],
    "correctLabel": "D",
    "topic": "energy conservation",
    "difficulty": 4,
    "explanations": {
      "A": "Wrong. You should use vertical height h, not slope distance s. Also, this gives v², not v.",
      "B": "Wrong. 2gh gives v², not v. You need to take the square root.",
      "C": "Wrong. The energy depends on vertical height h, not the distance along the slope s.",
      "D": "Correct. By conservation of energy: mgh = ½mv². Solving for v gives v = √(2gh). The vertical height determines the PE lost, not the slope distance."
    },
    "hint": "Use conservation of energy: potential energy lost = kinetic energy gained. PE depends on vertical height, not slope distance."
  },
  {
    "source": "June 2014 IAL",
    "number": 1,
    "question": "A rocket of mass m lifts off with an acceleration a due to the engines providing a thrust T. Which row correctly identifies m, T and a as scalar or vector?",
    "options": [
      {"label": "A", "text": "m = vector, T = scalar, a = vector"},
      {"label": "B", "text": "m = vector, T = scalar, a = scalar"},
      {"label": "C", "text": "m = scalar, T = vector, a = vector"},
      {"label": "D", "text": "m = scalar, T = vector, a = scalar"}
    ],
    "correctLabel": "C",
    "topic": "scalars and vectors",
    "difficulty": 2,
    "explanations": {
      "A": "Wrong. Mass is a scalar, not a vector.",
      "B": "Wrong. Mass is scalar (correct) but thrust is a vector (it acts in a direction), and acceleration is also a vector.",
      "C": "Correct. Mass is scalar (magnitude only). Thrust is a vector (force has direction). Acceleration is a vector (has direction).",
      "D": "Wrong. Acceleration has both magnitude and direction — it's a vector, not a scalar."
    },
    "hint": "Mass has no direction. Both force (thrust) and acceleration have direction."
  },
  {
    "source": "June 2014 IAL",
    "number": 7,
    "question": "An increasing force is applied to a spring and the corresponding extension is measured. The spring constant k of the spring is",
    "options": [
      {"label": "A", "text": "the applied force per unit extension"},
      {"label": "B", "text": "the applied force per unit length"},
      {"label": "C", "text": "the gradient of the extension (y-axis) against force (x-axis) graph"},
      {"label": "D", "text": "the area under the extension (y-axis) against force (x-axis) graph"}
    ],
    "correctLabel": "A",
    "topic": "Hooke's Law",
    "difficulty": 3,
    "explanations": {
      "A": "Correct. From F = kx, rearranging gives k = F/x, which is force per unit extension.",
      "B": "Wrong. Force per unit length would involve the total length, not the extension.",
      "C": "Wrong. The gradient of extension vs force gives 1/k (the reciprocal of the spring constant).",
      "D": "Wrong. The area under the extension-force graph gives the elastic strain energy stored."
    },
    "hint": "Hooke's Law: F = kx. Rearrange for k."
  },
  {
    "source": "June 2014",
    "number": 1,
    "question": "Select the answer in which both quantities are vectors.",
    "options": [
      {"label": "A", "text": "acceleration, speed"},
      {"label": "B", "text": "displacement, velocity"},
      {"label": "C", "text": "mass, time"},
      {"label": "D", "text": "power, weight"}
    ],
    "correctLabel": "B",
    "topic": "scalars and vectors",
    "difficulty": 2,
    "explanations": {
      "A": "Wrong. Acceleration is a vector but speed is a scalar.",
      "B": "Correct. Displacement (has direction) and velocity (has direction) are both vectors.",
      "C": "Wrong. Mass and time are both scalars.",
      "D": "Wrong. Power is a scalar; weight is a vector."
    },
    "hint": "Look for the pair where BOTH quantities have a direction associated with them."
  },
  {
    "source": "June 2014",
    "number": 2,
    "question": "A tennis ball hits a wall perpendicularly at a speed of 4 m s⁻¹ and rebounds at the same speed. Taking the initial velocity as positive, the change in velocity is",
    "options": [
      {"label": "A", "text": "−4 m s⁻¹"},
      {"label": "B", "text": "−8 m s⁻¹"},
      {"label": "C", "text": "0 m s⁻¹"},
      {"label": "D", "text": "8 m s⁻¹"}
    ],
    "correctLabel": "B",
    "topic": "change in velocity",
    "difficulty": 4,
    "explanations": {
      "A": "Wrong. This only accounts for losing the initial velocity, not gaining velocity in the opposite direction.",
      "B": "Correct. Change in velocity = final − initial = (−4) − (+4) = −8 m s⁻¹. The ball reverses direction, so the change is twice the speed in the negative direction.",
      "C": "Wrong. The speed is the same but velocity has changed direction — the change is not zero.",
      "D": "Wrong. The magnitude is correct (8) but the sign should be negative since the ball reverses direction."
    },
    "hint": "Δv = v_final − v_initial. If initial velocity is +4, the rebound velocity is −4. What's the difference?"
  },
  {
    "source": "June 2015 IAL",
    "number": 2,
    "question": "Physical quantities are either vectors or scalars. Select the row which correctly identifies mass, velocity, and displacement as vector or scalar.",
    "options": [
      {"label": "A", "text": "mass = scalar, velocity = vector, displacement = scalar"},
      {"label": "B", "text": "mass = vector, velocity = scalar, displacement = vector"},
      {"label": "C", "text": "mass = vector, velocity = scalar, displacement = scalar"},
      {"label": "D", "text": "mass = scalar, velocity = vector, displacement = vector"}
    ],
    "correctLabel": "D",
    "topic": "scalars and vectors",
    "difficulty": 2,
    "explanations": {
      "A": "Wrong. Displacement has a direction — it's a vector, not a scalar.",
      "B": "Wrong. Mass has no direction (scalar), and velocity has direction (vector) — both are wrong here.",
      "C": "Wrong. Mass is scalar (correct), but velocity is a vector (wrong here).",
      "D": "Correct. Mass = scalar (magnitude only), velocity = vector (magnitude + direction), displacement = vector (magnitude + direction)."
    },
    "hint": "Mass has no direction. Velocity and displacement both specify a direction."
  },
  {
    "source": "June 2015 IAL",
    "number": 5,
    "question": "A force is applied to a length of wire. Which of the following statements is not correct for small deformations of the wire?",
    "options": [
      {"label": "A", "text": "As the force applied increases, the extension increases"},
      {"label": "B", "text": "The force applied is directly proportional to the extension"},
      {"label": "C", "text": "The force applied is directly proportional to the original length"},
      {"label": "D", "text": "The stress is directly proportional to the strain"}
    ],
    "correctLabel": "C",
    "topic": "Hooke's Law",
    "difficulty": 4,
    "explanations": {
      "A": "This IS correct for small deformations — Hooke's law applies.",
      "B": "This IS correct — F = kx shows direct proportionality within the elastic limit.",
      "C": "This is NOT correct. The force is not proportional to the original length — the extension depends on original length (longer wire stretches more for same force), but force isn't proportional to length.",
      "D": "This IS correct — within the limit of proportionality, stress ∝ strain (Young's modulus is constant)."
    },
    "hint": "Think about each statement carefully. Which one doesn't follow from Hooke's Law or the definition of Young's modulus?"
  },
  {
    "source": "June 2015 IAL",
    "number": 6,
    "question": "Aluminium can be used to produce thin sheets of food wrapping because it is",
    "options": [
      {"label": "A", "text": "brittle"},
      {"label": "B", "text": "ductile"},
      {"label": "C", "text": "hard"},
      {"label": "D", "text": "malleable"}
    ],
    "correctLabel": "D",
    "topic": "material properties",
    "difficulty": 2,
    "explanations": {
      "A": "Wrong. Brittle materials shatter — they can't be rolled into thin sheets.",
      "B": "Wrong. Ductile means it can be drawn into wires, not rolled into sheets.",
      "C": "Wrong. Hardness is about resistance to scratching — not about forming thin sheets.",
      "D": "Correct. Malleable means a material can be hammered or rolled into thin sheets without cracking. This is exactly what's done to make aluminium foil."
    },
    "hint": "Which property describes the ability to be pressed or rolled into thin sheets?"
  },
  {
    "source": "June 2015 IAL",
    "number": 8,
    "question": "A stone dropped into a well takes 1.5 seconds to reach the water. Ignoring the effects of air resistance, what distance did the stone fall through?",
    "options": [
      {"label": "A", "text": "7 m"},
      {"label": "B", "text": "11 m"},
      {"label": "C", "text": "14 m"},
      {"label": "D", "text": "22 m"}
    ],
    "correctLabel": "B",
    "topic": "free fall SUVAT",
    "difficulty": 3,
    "explanations": {
      "A": "Wrong. This is approximately ½ × 9.81 × 1.0² — you may have used the wrong time.",
      "B": "Correct. s = ½gt² = ½ × 9.81 × 1.5² = ½ × 9.81 × 2.25 = 11.0 m ≈ 11 m.",
      "C": "Wrong. This is approximately 9.81 × 1.5 — you used s = gt instead of s = ½gt².",
      "D": "Wrong. This is approximately 9.81 × 1.5² — you forgot the ½."
    },
    "hint": "Dropped from rest: u = 0. Use s = ½gt². Don't forget the ½!"
  },
  {
    "source": "June 2016 IAL",
    "number": 1,
    "question": "Which of the following is equivalent to the joule in terms of SI base units?",
    "options": [
      {"label": "A", "text": "kg m² s⁻³"},
      {"label": "B", "text": "kg m² s⁻²"},
      {"label": "C", "text": "kg m s⁻²"},
      {"label": "D", "text": "kg m s⁻¹"}
    ],
    "correctLabel": "B",
    "topic": "SI units",
    "difficulty": 3,
    "explanations": {
      "A": "Wrong. kg m² s⁻³ is the unit of power (watt), not energy.",
      "B": "Correct. Energy (J) = force × distance = (kg m s⁻²) × m = kg m² s⁻².",
      "C": "Wrong. kg m s⁻² is the unit of force (newton), not energy.",
      "D": "Wrong. kg m s⁻¹ is the unit of momentum, not energy."
    },
    "hint": "J = N × m. Write the newton in base units first, then multiply by metres."
  },
  {
    "source": "June 2016 IAL",
    "number": 2,
    "question": "A wind turbine generates 550 W of electrical power for an average of 7 hours each day. What is the total energy, in MJ, generated each day?",
    "options": [
      {"label": "A", "text": "0.23"},
      {"label": "B", "text": "14"},
      {"label": "C", "text": "230"},
      {"label": "D", "text": "14000"}
    ],
    "correctLabel": "B",
    "topic": "power and energy",
    "difficulty": 3,
    "explanations": {
      "A": "Wrong. Check your unit conversion — this is too small.",
      "B": "Correct. E = Pt = 550 × 7 × 3600 = 13 860 000 J = 13.86 MJ ≈ 14 MJ.",
      "C": "Wrong. You may have forgotten to convert hours to seconds correctly.",
      "D": "Wrong. You may have calculated in kJ or used the wrong conversion factor."
    },
    "hint": "E = Pt. Convert 7 hours to seconds (× 3600), then convert joules to MJ (÷ 10⁶)."
  },
  {
    "source": "June 2016 IAL",
    "number": 7,
    "question": "A ball of mass m falls through a height h to the ground. What is the kinetic energy of the ball halfway to the ground?",
    "options": [
      {"label": "A", "text": "mgh"},
      {"label": "B", "text": "mgh/2"},
      {"label": "C", "text": "√(mgh)"},
      {"label": "D", "text": "√(mgh/2)"}
    ],
    "correctLabel": "B",
    "topic": "energy conservation",
    "difficulty": 3,
    "explanations": {
      "A": "Wrong. mgh is the total KE at the bottom, not halfway.",
      "B": "Correct. At half the height, the ball has lost half its PE. KE gained = mgh/2.",
      "C": "Wrong. This has wrong units/dimensions — kinetic energy should be in joules, not √(joules).",
      "D": "Wrong. Same dimensional error — you can't take the square root of energy to get energy."
    },
    "hint": "By conservation of energy, KE gained = PE lost. Halfway down, how much PE has been lost?"
  },
  {
    "source": "June 2016 IAL",
    "number": 8,
    "question": "A car travels at a speed of 20 m s⁻¹ due east and then turns around and travels at a speed of 40 m s⁻¹ due west. Taking the direction of due east as positive, select the correct row for change in speed and change in velocity.",
    "options": [
      {"label": "A", "text": "Change in speed = 20, Change in velocity = −60"},
      {"label": "B", "text": "Change in speed = 20, Change in velocity = 60"},
      {"label": "C", "text": "Change in speed = 60, Change in velocity = −60"},
      {"label": "D", "text": "Change in speed = 60, Change in velocity = 60"}
    ],
    "correctLabel": "A",
    "topic": "speed vs velocity",
    "difficulty": 5,
    "explanations": {
      "A": "Correct. Change in speed = 40 − 20 = 20 m s⁻¹ (speed is scalar, always positive). Change in velocity = (−40) − (+20) = −60 m s⁻¹ (velocity is vector, direction matters).",
      "B": "Wrong. The change in velocity should be negative (from positive to negative direction).",
      "C": "Wrong. Change in speed = |40| − |20| = 20, not 60. Speed doesn't include direction.",
      "D": "Wrong. Both values are incorrect for the reasons above."
    },
    "hint": "Speed is scalar (no direction): change = 40 − 20. Velocity is vector: east = +20, west = −40. Change = final − initial."
  },
  {
    "source": "June 2015",
    "number": 2,
    "question": "The correct definition of the term centre of gravity is the point at which",
    "options": [
      {"label": "A", "text": "all of the force acts on a body"},
      {"label": "B", "text": "gravity acts on a body"},
      {"label": "C", "text": "the weight of a body may be considered to act"},
      {"label": "D", "text": "the weight is concentrated"}
    ],
    "correctLabel": "C",
    "topic": "centre of gravity",
    "difficulty": 3,
    "explanations": {
      "A": "Wrong. Forces can act at many points — this is too vague.",
      "B": "Wrong. Gravity acts throughout the entire body, not at a single point.",
      "C": "Correct. The centre of gravity is the point where the entire weight of the body may be considered to act for the purpose of calculating moments and equilibrium.",
      "D": "Wrong. Weight isn't literally concentrated at one point — it's distributed throughout the body."
    },
    "hint": "It's the point where we can treat the entire weight as acting — for modelling purposes."
  },
  {
    "source": "June 2015",
    "number": 6,
    "question": "In the manufacture of cars, mild steel sheets are formed into panels of an appropriate shape. Mild steel can be shaped in this way because it is",
    "options": [
      {"label": "A", "text": "brittle"},
      {"label": "B", "text": "hard"},
      {"label": "C", "text": "malleable"},
      {"label": "D", "text": "strong"}
    ],
    "correctLabel": "C",
    "topic": "material properties",
    "difficulty": 2,
    "explanations": {
      "A": "Wrong. Brittle materials crack when you try to reshape them.",
      "B": "Wrong. Hard means resistant to scratching — not about reshaping.",
      "C": "Correct. Malleable means a material can be pressed, rolled, or hammered into different shapes. This is exactly what happens when forming car body panels.",
      "D": "Wrong. Strong means resistant to breaking under large forces — not about reshaping."
    },
    "hint": "Forming metal sheets into shapes requires the material to deform plastically without cracking."
  }
],
};

const CATALOG = [
  {
    id: "chemistry", name: "Chemistry", icon: "⚗", colour: "#4d9460",
    subtitle: "Structure, bonding, organic, energetics, redox, groups",
    systems: [
      { system: "International A-Level", boards: [
        { board: "Pearson Edexcel IAL", expanded: true, papers: [
          { unitKey: "chem1", name: "Unit 1 (WCH11)", subtitle: "Unit 1 (WCH11) — Structure, Bonding & Organic" },
          { unitKey: "chem2", name: "Unit 2 (WCH12)", subtitle: "Energetics, Group Chemistry & Organic" },
          { unitKey: "wch14", name: "Unit 4 (WCH14)", subtitle: "Organic chemistry, spectroscopy, transition metals" },
          { unitKey: "wch15", name: "Unit 5 (WCH15)", subtitle: "Equilibria, acids/bases, electrochemistry" },
          { unitKey: "wch16", name: "Unit 6 (WCH16)", subtitle: "Synoptic paper — full spec review" },
          { unitKey: "chem1", name: "Unit 3 (WCH13)", subtitle: "Practical Skills" },
          { unitKey: "chem2", name: "Unit 4 (WCH14)", subtitle: "Rates, Equilibria & Further Organic" },
          { unitKey: "chem2", name: "Unit 5 (WCH15)", subtitle: "Transition Metals & Organic Nitrogen" },
          { unitKey: "chem2", name: "Unit 6 (WCH16)", subtitle: "Practical Skills II" },
        ]},
        { board: "OxfordAQA", unitKey: "chem1", boardId: "oxfordaqa-chem" },
        { board: "Cambridge International", unitKey: "chem1", boardId: "cambridge-chem" },
      ]},
      { system: "UK A-Level", boards: [
        { board: "Pearson Edexcel", unitKey: "chem1", boardId: "edexcel-uk-chem" },
        { board: "AQA", unitKey: "chem1", boardId: "aqa-chem" },
        { board: "OCR", unitKey: "chem1", boardId: "ocr-chem" },
        { board: "WJEC / Eduqas", unitKey: "chem1", boardId: "wjec-chem" },
        { board: "CCEA", unitKey: "chem1", boardId: "ccea-chem" },
      ]},
      { system: "GCSE / IGCSE", boards: [
        { board: "Foundation", unitKey: "chem1", boardId: "gcse-chem-f" },
        { board: "Higher", unitKey: "chem1", boardId: "gcse-chem-h" },
      ]},
      { system: "IB Diploma", boards: [
        { board: "Chemistry SL", unitKey: "chem1", boardId: "ib-chem-sl" },
        { board: "Chemistry HL", unitKey: "chem2", boardId: "ib-chem-hl" },
      ]},
      { system: "AP", boards: [
        { board: "AP Chemistry", unitKey: "chem2", boardId: "ap-chem" },
      ]},
    ],
  },
  {
    id: "physics", name: "Physics", icon: "⚡", colour: "#5b7bbf",
    subtitle: "Mechanics, waves, electricity, fields, nuclear",
    systems: [
      { system: "International A-Level", boards: [
        { board: "Pearson Edexcel IAL", expanded: true, papers: [
          { unitKey: "phys1", name: "Unit 1 (WPH11)", subtitle: "Unit 1 (WPH11) — Mechanics & Materials" },
          { unitKey: "phys2", name: "Unit 2 (WPH12)", subtitle: "Unit 2 (WPH12) — Waves & Electricity" },
          { unitKey: "wph14", name: "Unit 4 (WPH14)", subtitle: "Further mechanics, fields & particles" },
          { unitKey: "wph15", name: "Unit 5 (WPH15)", subtitle: "Thermodynamics, radiation, oscillations & cosmology" },
          { unitKey: "wph16", name: "Unit 6 (WPH16)", subtitle: "Synoptic paper — full spec review" },
          { unitKey: "phys1", name: "Unit 3 (WPH13)", subtitle: "Practical Skills" },
          { unitKey: "phys2", name: "Unit 4 (WPH14)", subtitle: "Further Mechanics, Fields & Particles" },
          { unitKey: "phys2", name: "Unit 5 (WPH15)", subtitle: "Thermodynamics, Radiation, Oscillations" },
          { unitKey: "phys2", name: "Unit 6 (WPH16)", subtitle: "Practical Skills II" },
        ]},
        { board: "OxfordAQA", unitKey: "phys1", boardId: "oxfordaqa-phys" },
        { board: "Cambridge International", unitKey: "phys1", boardId: "cambridge-phys" },
      ]},
      { system: "UK A-Level", boards: [
        { board: "Pearson Edexcel", unitKey: "phys1", boardId: "edexcel-uk-phys" },
        { board: "AQA", unitKey: "phys1", boardId: "aqa-phys" },
        { board: "OCR", unitKey: "phys1", boardId: "ocr-phys" },
        { board: "WJEC / Eduqas", unitKey: "phys1", boardId: "wjec-phys" },
        { board: "CCEA", unitKey: "phys1", boardId: "ccea-phys" },
      ]},
      { system: "GCSE / IGCSE", boards: [
        { board: "Foundation", unitKey: "phys1", boardId: "gcse-phys-f" },
        { board: "Higher", unitKey: "phys1", boardId: "gcse-phys-h" },
      ]},
      { system: "IB Diploma", boards: [
        { board: "Physics SL", unitKey: "phys1", boardId: "ib-phys-sl" },
        { board: "Physics HL", unitKey: "phys2", boardId: "ib-phys-hl" },
      ]},
      { system: "AP", boards: [
        { board: "AP Physics 1", unitKey: "phys1", boardId: "ap-phys1" },
        { board: "AP Physics 2", unitKey: "phys2", boardId: "ap-phys2" },
        { board: "AP Physics C: Mechanics", unitKey: "phys1", boardId: "ap-physc-mech" },
        { board: "AP Physics C: E&M", unitKey: "phys2", boardId: "ap-physc-em" },
      ]},
    ],
  },
  {
    id: "maths", name: "Mathematics", icon: "📐", colour: "#bf8f3d",
    subtitle: "Pure, applied, statistics, mechanics, calculus",
    systems: [
      { system: "International A-Level", boards: [
        { board: "Pearson Edexcel IAL", expanded: true, papers: [
          { unitKey: "maths", name: "Pure 1 (WMA11)", subtitle: "Algebra, coordinate geometry, calculus" },
          { unitKey: "maths", name: "Pure 2 (WMA12)", subtitle: "Trig, exponentials, sequences" },
          { unitKey: "maths", name: "Pure 3 (WMA13)", subtitle: "Further algebra, calculus, vectors" },
          { unitKey: "maths", name: "Pure 4 (WMA14)", subtitle: "Further calculus, differential equations" },
          { unitKey: "maths", name: "Statistics 1 (WST01)", subtitle: "Probability, distributions" },
          { unitKey: "maths", name: "Mechanics 1 (WME01)", subtitle: "Kinematics, forces, moments" },
          { unitKey: "s2", name: "Statistics 2 (WST02)", subtitle: "Poisson, continuous distributions, estimation" },
          { unitKey: "m2", name: "Mechanics 2 (WME02)", subtitle: "Projectiles, circular motion, centres of mass" },
        ]},
        { board: "Pearson Edexcel IAL Further Pure", expanded: true, papers: [
          { unitKey: "fp1", name: "Further Pure 1 (WFM01)", subtitle: "Complex numbers, matrices, series, proof" },
          { unitKey: "fp2", name: "Further Pure 2 (WFM02)", subtitle: "Further complex numbers, calculus, polar" },
          { unitKey: "fp3", name: "Further Pure 3 (WFM03)", subtitle: "Vectors, eigenvalues, further DE, integration" },
        ]},
        { board: "OxfordAQA", unitKey: "maths", boardId: "oxfordaqa-maths" },
        { board: "Cambridge International", unitKey: "maths", boardId: "cambridge-maths" },
      ]},
      { system: "UK A-Level", boards: [
        { board: "Pearson Edexcel", unitKey: "maths", boardId: "edexcel-uk-maths" },
        { board: "AQA", unitKey: "maths", boardId: "aqa-maths" },
        { board: "OCR", unitKey: "maths", boardId: "ocr-maths" },
        { board: "WJEC / Eduqas", unitKey: "maths", boardId: "wjec-maths" },
        { board: "CCEA", unitKey: "maths", boardId: "ccea-maths" },
      ]},
      { system: "GCSE / IGCSE", boards: [
        { board: "Foundation", unitKey: "maths", boardId: "gcse-maths-f" },
        { board: "Higher", unitKey: "maths", boardId: "gcse-maths-h" },
      ]},
      { system: "IB Diploma", boards: [
        { board: "Analysis & Approaches", unitKey: "maths", boardId: "ib-maths-aa" },
        { board: "Applications & Interpretation", unitKey: "maths", boardId: "ib-maths-ai" },
      ]},
      { system: "AP", boards: [
        { board: "AP Calculus AB", unitKey: "maths", boardId: "ap-calc-ab" },
        { board: "AP Calculus BC", unitKey: "maths", boardId: "ap-calc-bc" },
      ]},
    ],
  },
  { id: "sat", name: "SAT", icon: "📝", colour: "#7b5bbf", subtitle: "Scholastic Assessment Test",
    systems: [
      { system: "SAT", boards: [
        { board: "SAT Math", unitKey: "sat-math", boardId: "sat-math-only", desc: "Algebra, advanced math, problem solving & data analysis. Covers linear equations, quadratics, functions, statistics, and geometry.", meta: "22 questions · 70 min" },
        { board: "SAT Reading & Writing", unitKey: "sat-math", boardId: "sat-verbal", desc: "Information & ideas, craft & structure, expression of ideas, and standard English conventions across paired short passages.", meta: "54 questions · 64 min" },
      ]},
    ] },
  { id: "act", name: "ACT", icon: "✏️", colour: "#7b5bbf", subtitle: "American College Testing",
    systems: [
      { system: "ACT", boards: [
        { board: "ACT Math", unitKey: "sat-math", boardId: "act-math-only", desc: "Pre-algebra, elementary algebra, intermediate algebra, coordinate geometry, plane geometry, and trigonometry.", meta: "60 questions · 60 min" },
        { board: "ACT English & Reading", unitKey: "sat-math", boardId: "act-verbal", desc: "English: grammar, punctuation, rhetoric across 5 passages. Reading: literary narrative, social science, humanities, natural science.", meta: "115 questions · 80 min" },
      ]},
    ] },
  { id: "gmat", name: "GMAT", icon: "🎯", colour: "#7b5bbf", subtitle: "Graduate Management Admission Test", unitKey: "sat-math", boardId: "gmat" },
  { id: "gre", name: "GRE", icon: "📊", colour: "#7b5bbf", subtitle: "Graduate Record Examination", unitKey: "sat-math", boardId: "gre" },
  { id: "lnat", name: "LNAT", icon: "⚖️", colour: "#7b5bbf", subtitle: "Law National Aptitude Test", unitKey: "sat-math", boardId: "lnat" },
  { id: "ucat", name: "UCAT", icon: "🩺", colour: "#7b5bbf", subtitle: "University Clinical Aptitude Test", unitKey: "sat-math", boardId: "ucat" },
  { id: "ielts", name: "IELTS", icon: "🌐", colour: "#3d8b7a", subtitle: "International English Language Testing System", unitKey: "sat-math", boardId: "ielts" },
  { id: "toefl", name: "TOEFL", icon: "🗣️", colour: "#3d8b7a", subtitle: "Test of English as a Foreign Language", unitKey: "sat-math", boardId: "toefl" },
];

/* ═══════════════════════════════════════════════════
   UNIT DATA — system prompts, welcome messages, notes
   Keys match unitKey in CATALOG papers
   ═══════════════════════════════════════════════════ */

const UNITS = {
  chem1: { id:"chem1", name:"Edexcel IAL Chemistry — Unit 1", code:"WCH11", subtitle:"Structure, Bonding & Intro to Organic", colour:"#4d9460", icon:"⚗", placeholder:"Ask about WCH11 Chemistry...",
    prompts:["Explain the shape of water","Show me free radical substitution","Quiz me on bonding","Why does diamond have a high melting point?"],
    welcome:`Hello! I'm your **AGF Study Companion**, powered by Alastair's diagnostic teaching method.\n\nI'm loaded with **Edexcel IAL Chemistry — Unit 1 (WCH11)**: Structure, Bonding & Introduction to Organic Chemistry.\n\nHere's the shape of water to get us started:\n\n[SHAPE:bent:H₂O:104.5°]\n\n• **Ask me anything** about the syllabus\n• Say **"quiz me"** for practice questions\n• Ask **"show me the mechanism for..."** to see reaction diagrams\n\nWhat shall we work on?`,
    system:`You are the AGF Study Companion — an AI tutor created by Alastair Fisher of AGF Tutoring. You follow the AGF diagnostic method: Diagnose → Rebuild → Clarify → Test → Extend.\n\nPersonality: Patient, warm, rigorous. Guide to understanding, don't just give answers. Intuition before formalism. British English. Concise.\n\nVISUAL DIAGRAMS — CRITICAL INSTRUCTIONS:\nYou MUST include diagram tags when explaining shapes, mechanisms, or key equations. Place each tag on its own line.\n\nAvailable tags (use EXACTLY this syntax on a new line):\n\n[SHAPE:tetrahedral:CH₄:109.5°]\n[SHAPE:pyramidal:NH₃:107°]\n[SHAPE:bent:H₂O:104.5°]\n[SHAPE:trigonal_planar:BF₃:120°]\n[SHAPE:linear:CO₂:180°]\n[SHAPE:octahedral:SF₆:90°]\n[SHAPE:trigonal_bipyramidal:PCl₅:90°,120°]\n[SHAPE:square_planar:XeF₄:90°]\n\n[MECHANISM:free_radical:CH₄ + Cl₂ → CH₃Cl + HCl]\n[MECHANISM:electrophilic_addition:CH₂=CH₂ + HBr → CH₃CH₂Br]\n\n[EQUATION:n = m / M]\n\n[DISPLAYED:chainLength:doubleBondPos:substituents:direction:label — draws a beautiful zig-zag skeletal formula with numbered carbons]\nExamples:\n[DISPLAYED:6:3:Cl@2,F@1:rtl:2-chloro-1-fluorohex-3-ene]\n[DISPLAYED:4:2::ltr:but-2-ene]\n[DISPLAYED:5:0:CH3@2,CH3@3:ltr:2,3-dimethylpentane]\n[DISPLAYED:3:0::ltr:propane]\n\n[ORGANIC:displayed structural formula with numbering — use monospace pre-formatted text]\n\n[CONFIG:Fe:1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁶ 4s²]\n\nRules:\n- When the student ASKS about molecular shapes or VSEPR, include the matching [SHAPE:...] tag. Do NOT include shape diagrams when discussing naming, isomerism, mechanisms, or other non-shape topics\n- When the student asks about organic reaction mechanisms (e.g. free radical substitution, electrophilic addition), include the [MECHANISM:...] tag. Do NOT include mechanism diagrams when discussing energetics, redox, equilibria, groups, or other non-mechanism topics\n- When stating a key formula, use [EQUATION:...] tag\n- When showing electron configuration, use [CONFIG:...] tag\n- You can change the formula/angle in shape tags\n- When naming organic compounds or discussing IUPAC naming, you MUST include a [DISPLAYED:...] tag showing the numbered structure. Use the format [DISPLAYED:chainLength:doubleBondPos:substituents:direction:name]. For example, for 2-chloro-1-fluorohex-3-ene use [DISPLAYED:6:3:Cl@2,F@1:rtl:2-chloro-1-fluorohex-3-ene]. Always include this BEFORE your written explanation. chainLength=number of C in parent chain, doubleBondPos=C=C position or 0, substituents=comma-separated Group@CarbonNumber, direction=ltr or rtl\n\nCHEMISTRY UNIT 1 NOTES (WCH11 — Edexcel IAL):\n\nTOPIC 1 — FORMULAE & MOLES\nn=m/M, c=n/V(dm³), pV=nRT(Pa,m³,K), molar vol=24.0dm³/mol at RTP\n%yield=(actual/theoretical)×100, atom economy=(Mᵣ desired/ΣMᵣ all)×100\nEmpirical: %→moles→÷smallest→round. Molecular: Mᵣ÷EF mass\n\nTOPIC 2 — ATOMIC STRUCTURE\nProton(+1,1,nucleus), Neutron(0,1,nucleus), Electron(−1,≈0,shells)\nConfig: 1s→2s→2p→3s→3p→4s→3d. s=2,p=6,d=10\nMass spec: vaporise→ionise→accelerate→deflect→detect. Mᵣ=molecular mass\nIE anomalies: Be→B(2s→2p), N→O(paired 2p repulsion)\n\nTOPIC 3 — BONDING & STRUCTURE\nIonic: transfer, giant lattice, high mp, conducts molten/dissolved\nCovalent: sharing, VSEPR. Metallic: delocalised e⁻, lattice of + ions\nVSEPR: LP-LP>LP-BP>BP-BP. Shapes: tetrahedral 109.5°, pyramidal 107°, bent 104.5°, trigonal planar 120°, linear 180°, octahedral 90°\nIMFs: London(all,↑Mᵣ), dipole-dipole, H-bonding(H—F/O/N··lone pair)\nDiamond: 4 bonds, hard, non-conductor. Graphite: 3 bonds, layers, conducts, slides\n\nTOPIC 4 — ORGANIC CHEMISTRY & ALKANES\n\n=== IUPAC NOMENCLATURE — DETAILED RULES ===\nThe IUPAC system gives every unique compound its own exclusive name.\n\nSTEP-BY-STEP METHOD:\n1. FIND THE LONGEST CONTINUOUS CARBON CHAIN (parent chain)\n   - This determines the parent name. The longest chain may NOT be drawn horizontally — trace all paths!\n   - If two chains of equal length, choose the one with MORE substituents\n   - Parent names: 1C=methane, 2C=ethane, 3C=propane, 4C=butane, 5C=pentane, 6C=hexane, 7C=heptane, 8C=octane, 9C=nonane, 10C=decane\n2. IDENTIFY SUBSTITUENT GROUPS (branches)\n   - Alkyl groups: remove -ane, add -yl. CH₃-=methyl, C₂H₅-=ethyl, C₃H₇-=propyl\n   - Halogens: F=fluoro, Cl=chloro, Br=bromo, I=iodo\n3. NUMBER THE PARENT CHAIN\n   - Start from the end NEAREST a substituent\n   - If equidistant, give LOWER number at first point of difference\n4. ASSEMBLE THE NAME\n   - Substituents in ALPHABETICAL order (ignore di-/tri-/tetra-)\n   - Use di-, tri-, tetra- for multiple identical substituents\n   - Commas between numbers (2,3-), hyphens between numbers and letters (2-methyl)\n   - Write as ONE WORD\n\nNUMBERING TIE-BREAKER (CRITICAL — apply when C=C has same locant from both ends):\n1. Try BOTH numbering directions explicitly\n2. List all substituent positions for each direction\n3. Compare the first point of difference — choose the direction giving the LOWER number\n4. If still tied, give the lower number to the substituent that comes first ALPHABETICALLY\n5. ALWAYS show both numbering attempts before stating the answer\n\nWORKED TIE-BREAKER EXAMPLE:\nCH3CH2CH=CHCH(Cl)CH2F (6C chain, C=C)\nLeft-to-right: C=C at 3, Cl at 5, F at 6 -> 5-chloro-6-fluorohex-3-ene\nRight-to-left: C=C at 3, Cl at 2, F at 1 -> 2-chloro-1-fluorohex-3-ene\nC=C same (3) both ways -> tie-breaker: first alphabetically is chloro -> Cl at 2 < Cl at 5 -> RIGHT-TO-LEFT wins\nCorrect: 2-chloro-1-fluorohex-3-ene (chloro before fluoro ALPHABETICALLY in the name)\n\nSELF-CHECK: Before giving ANY IUPAC name, ALWAYS try numbering from BOTH ends, compare, verify carbon count. Never give a name without checking both directions.\nFINAL NAME ASSEMBLY: substituents MUST appear in ALPHABETICAL order. bromo before chloro, chloro before fluoro, ethyl before methyl. Example: 2-chloro-1-fluorohex-3-ene (chloro before fluoro). NEVER write 1-fluoro-2-chloro — that violates alphabetical order.\n\nVERIFICATION: Count total carbons. E.g. 3-ethyl-4-methylheptane = 7+2+1 = 10C.\n\nWORKED EXAMPLES WITH FULL REASONING:\n• CH₃CH₂CH₂CH₂CH₃ → 5C chain, no branches → pentane\n• CH₃CH(CH₃)CH₂CH₃ → 4C chain (butane), CH₃ at C2 → 2-methylbutane\n• CH₃C(CH₃)₂CH₃ → 3C chain (propane), two CH₃ at C2 → 2,2-dimethylpropane. Check: 3+1+1=5C ✓\n• CH₃CH₂CH(CH₃)CH(CH₃)CH₂CH₃ → 6C chain (hexane), CH₃ at C3 and C4 → 3,4-dimethylhexane. Check: 6+1+1=8C ✓\n• COMMON MISTAKE: CH₃CH(CH₃)CH(C₂H₅)CH₃\n  WRONG: 4C chain → "2-methyl-3-ethylbutane"\n  CORRECT: longest chain is 5C through the ethyl group → pentane with CH₃ at C2 and C3 → 2,3-dimethylpentane. Check: 5+1+1=7C ✓\n\nC₅H₁₂ ISOMERS (3 exist): pentane, 2-methylbutane, 2,2-dimethylpropane\nC₆H₁₄ ISOMERS (5 exist): hexane, 2-methylpentane, 3-methylpentane, 2,2-dimethylbutane, 2,3-dimethylbutane\n\nCOMMON NAMING MISTAKES:\n1. Not finding the longest chain (it can bend/turn)\n2. Numbering from the wrong end\n3. Using "ethyl" when the chain runs through it (should be part of parent)\n4. Forgetting alphabetical order of substituents\n\nTYPES OF FORMULA (always state which type you are showing):\n• Molecular: just atoms (C₄H₁₀)\n• Structural: atom groupings (CH₃CH(CH₃)₂)\n• Displayed: ALL bonds drawn explicitly\n• Skeletal: zig-zag lines, each vertex/end = carbon, H on C not shown\n\n=== STRUCTURAL ISOMERISM ===\nSame molecular formula, different structural arrangement (different connectivity).\nThree types:\n1. Chain isomerism: different carbon skeleton (butane vs 2-methylpropane)\n2. Position isomerism: same skeleton, different position of functional group (but-1-ene vs but-2-ene)\n3. Functional group isomerism: different functional group (ethanol vs methoxymethane, both C₂H₆O)\n\n=== ALKANE PROPERTIES ===\nGeneral formula CₙH₂ₙ₊₂, saturated (single bonds only), tetrahedral 109.5° at each C\nIntermolecular forces: London dispersion forces ONLY (non-polar molecules)\n• bp increases with chain length (more electrons → stronger London forces)\n• bp decreases with branching (less surface contact → weaker London forces)\n• All alkanes: insoluble in water, soluble in non-polar solvents, less dense than water\nHomologous series: same general formula, same functional group, each member differs by CH₂\n\n=== FREE RADICAL SUBSTITUTION (FRS) — DETAILED ===\nConditions: UV light + halogen (Cl₂ or Br₂)\nOverall: CH₄ + Cl₂ → CH₃Cl + HCl\n\nINITIATION (creating radicals):\nCl₂ → 2Cl• (homolytic fission — UV provides energy to break Cl-Cl bond)\nEach Cl gets one electron. Fish-hook/half arrows show single electron movement.\n\nPROPAGATION (chain reaction, self-sustaining):\nStep 1: Cl• + CH₄ → CH₃• + HCl (Cl• abstracts H from methane)\nStep 2: CH₃• + Cl₂ → CH₃Cl + Cl• (methyl radical abstracts Cl from Cl₂)\nThe regenerated Cl• feeds back into Step 1 — the chain repeats hundreds of times.\n\nTERMINATION (radicals destroyed by combining):\nCl• + Cl• → Cl₂\nCH₃• + Cl• → CH₃Cl\nCH₃• + CH₃• → C₂H₆\nC₂H₆ (ethane) as a product is KEY EVIDENCE for a radical mechanism — it cannot form by ionic pathways.\n\nLIMITATIONS:\n• Further substitution: CH₃Cl → CH₂Cl₂ → CHCl₃ → CCl₄ → gives MIXTURE\n• To maximise monosubstitution: use EXCESS alkane (high CH₄:Cl₂ ratio)\n\nCombustion: complete(CO₂+H₂O), incomplete(limited O₂ → CO or C soot)\nCracking: thermal (high T, no catalyst) or catalytic (zeolite, lower T) → shorter alkanes + alkenes\n\nTOPIC 5 — ALKENES\n\n=== NAMING ALKENES ===\nGeneral formula CₙH₂ₙ, unsaturated (contains C=C)\nC=C = one σ bond (head-on overlap) + one π bond (sideways p-orbital overlap)\nRestricted rotation around C=C due to π bond\n\nRules (modifications from alkane naming):\n1. Find longest chain CONTAINING BOTH carbons of C=C → parent chain\n2. Change -ane to -ene\n3. Number to give C=C the LOWEST locant\n4. Position number before -ene: but-2-ene (not 2-butene)\n\nEXAMPLES:\n• CH₂=CH₂ → ethene\n• CH₃CH=CH₂ → propene\n• CH₂=CHCH₂CH₃ → but-1-ene\n• CH₃CH=CHCH₃ → but-2-ene\n• CH₂=CHCH₂CH(CH₃)CH₃ → 4-methylpent-1-ene (5C, C=C at C1, CH₃ at C4)\n• CH₃CH=C(CH₃)CH₃ → 2-methylbut-2-ene\n\n=== E/Z (GEOMETRIC) ISOMERISM ===\nType of stereoisomerism (same connectivity, different spatial arrangement).\n\nRequirements:\n1. Restricted rotation (C=C double bond)\n2. Each carbon of C=C must have TWO DIFFERENT groups\nIf either C has two identical groups → NO E/Z isomerism.\n\nCIP priority rules: higher atomic number = higher priority.\nIf directly attached atoms are same, move outward until difference found.\nZ (zusammen=together): higher priority groups SAME side\nE (entgegen=opposite): higher priority groups OPPOSITE sides\n\nExamples:\n• but-2-ene: each C has H and CH₃ (different) → E/Z EXISTS\n• but-1-ene: C1 has H and H (identical) → NO E/Z\n• 2-methylbut-2-ene: C2 has CH₃ and CH₃ (identical) → NO E/Z\n\n=== ELECTROPHILIC ADDITION — DETAILED ===\nC=C has HIGH ELECTRON DENSITY. π electrons are exposed above/below the plane → attract electrophiles.\nAn electrophile is an electron pair acceptor attracted to electron-rich regions.\n\nMechanism (HBr + ethene):\nStep 1: π electrons of C=C attack Hδ+ of H-Br → C-H bond forms, H-Br breaks heterolytically → carbocation + Br⁻\nStep 2: Br⁻ (nucleophile) attacks carbocation → C-Br bond forms → product: bromoethane\n\nMARKOVNIKOV'S RULE (unsymmetrical alkenes):\nH adds to C with MORE H's already. X adds to C with FEWER H's.\nWhy? Gives the MORE SUBSTITUTED (more stable) carbocation.\nCarbocation stability: 3° > 2° > 1° > CH₃⁺ (alkyl groups stabilise by induction)\n\nExample: propene + HBr\nC1 has 2H, C2 has 1H → H adds to C1 → 2° carbocation at C2 (stable)\nBr⁻ attacks C2 → MAJOR product: 2-bromopropane (NOT 1-bromopropane)\n\nOther addition reactions:\n1. + Br₂ → dibromoalkane (TEST: decolourises bromine water orange→colourless)\n2. + H₂O (steam) + H₃PO₄ catalyst, 300°C → alcohol (industrial hydration)\n3. + H₂ + Ni catalyst, 150°C → alkane (hydrogenation)\n4. + conc. H₂SO₄ then water → alcohol (lab hydration)\n\nTESTS FOR UNSATURATION:\n• Bromine water: orange→colourless = C=C present. Alkanes: no change.\n• Acidified KMnO₄: purple→colourless = C=C present. Alkanes: no change.\n\nTests: Br₂ water decolourises, KMnO₄ decolourises\n\nEMBEDDED KNOWLEDGE SOURCES (used to generate notes — do NOT routinely link these):\n• Formulae, Moles & Stoichiometry → OpenStax Chemistry 2e, Ch 3: https://openstax.org/books/chemistry-2e/pages/3-introduction\n• Atomic Structure → OpenStax Chemistry 2e, Ch 2 & 6: https://openstax.org/books/chemistry-2e/pages/6-introduction\n• Bonding & Molecular Geometry → OpenStax Chemistry 2e, Ch 7 & 8: https://openstax.org/books/chemistry-2e/pages/7-introduction\n• IMFs & States → OpenStax Chemistry 2e, Ch 10: https://openstax.org/books/chemistry-2e/pages/10-introduction\nAll also on LibreTexts: https://chem.libretexts.org/Bookshelves/General_Chemistry/Chemistry_2e_(OpenStax)\n• IUPAC Naming & Organic → LibreTexts Organic Chemistry I (Liu): https://chem.libretexts.org/Bookshelves/Organic_Chemistry/Organic_Chemistry_I_(Liu)/02%3A_Fundamental_of_Organic_Structures/2.02%3A_Nomenclature_of_Alkanes\n• Alkenes & E/Z Isomerism → LibreTexts: https://chem.libretexts.org/Bookshelves/Organic_Chemistry/Organic_Chemistry_(Morsch_et_al.)/07:_Alkenes-_Structure_and_Reactivity/7.04:_Naming_Alkenes\n• Free Radical Substitution → LibreTexts: https://chem.libretexts.org/Bookshelves/Organic_Chemistry/Organic_Chemistry_I_(Liu)/09:_Free_Radical_Substitution_Reaction_of_Alkanes\nOnly provide external URLs if the student explicitly asks "where can I read more about this?"\n\n

FOLLOW-UP ACTIONS — CRITICAL INSTRUCTION:
Do NOT include any action buttons, emoji lines, or "📖 Deeper notes / 🌍 Real-world / 📚 Quiz me" text at the end of your responses. The UI adds interactive buttons automatically. Just end your response with your teaching content.


These keep the student learning within the companion. Do NOT add external links or "Further reading" lines.

When the student clicks one of these:
- 📖 Deeper notes → Generate detailed revision notes on the topic just discussed, using the embedded notes above. Include definitions, key formulae, worked examples, exam tips, and common mistakes. Cite "Based on LibreTexts / OpenStax open-access materials" at the end.
- 🌍 Real-world example → Give a real-world application or everyday example of the concept. Make it vivid and memorable.
- 📚 Quiz me → Generate a targeted quiz question on the specific topic just discussed.

REFERENCE SOURCES (use when generating deeper notes):
• IUPAC Naming → LibreTexts Organic Chemistry I (Liu), Ch 2.02-2.04
• Free Radical Substitution → LibreTexts Organic Chemistry I (Liu), Ch 9
• Alkenes & E/Z → LibreTexts Organic Chemistry (Morsch et al.), Ch 7.04
• Electrophilic Addition → LibreTexts Supplemental Modules: Alkenes
• Formulae & Moles → OpenStax Chemistry 2e, Ch 3
• Atomic Structure → OpenStax Chemistry 2e, Ch 2 & 6
• Bonding & Shapes → OpenStax Chemistry 2e, Ch 7
• IMFs → OpenStax Chemistry 2e, Ch 10
Only mention these sources if the student explicitly asks "where can I read more?" — then provide the URL. Otherwise keep them in the companion.

FREE RESOURCES — when students want to read further, direct them to these:
- OpenStax Chemistry 2e (free textbook): openstax.org/books/chemistry-2e — Ch 2 (atoms), Ch 3 (moles), Ch 6 (electron config), Ch 7 (bonding & VSEPR), Ch 10.1 (intermolecular forces), Ch 20 (organic intro)
- LibreTexts Chemistry: chem.libretexts.org — searchable, detailed notes on every topic
- PhET Simulations (interactive): phet.colorado.edu — try "Molecule Shapes", "Build a Molecule", "States of Matter"
- Khan Academy: khanacademy.org/science/chemistry — video explanations
- Chemguide (UK A-Level focused): chemguide.co.uk — excellent for bonding, organic mechanisms
Say: "For more detail, see [resource] — it's free at [URL]." Do not reproduce content from these sources.

FREE RESOURCES — when students want to read further, direct them to these:
- OpenStax Chemistry 2e (free textbook): openstax.org/books/chemistry-2e — Ch 2 (atoms), Ch 3 (moles), Ch 6 (electron config), Ch 7 (bonding & VSEPR), Ch 10.1 (intermolecular forces), Ch 20 (organic intro)
- LibreTexts Chemistry: chem.libretexts.org — searchable, detailed notes on every topic
- PhET Simulations (interactive): phet.colorado.edu — try "Molecule Shapes", "Build a Molecule", "States of Matter"
- Khan Academy: khanacademy.org/science/chemistry — video explanations
- Chemguide (UK A-Level focused): chemguide.co.uk — excellent for bonding, organic mechanisms
Say: "For more detail, see [resource] — it's free at [URL]." Do not reproduce content from these sources.

Only answer WCH11 content. Use diagram tags liberally.`,
  },
  chem2: { id:"chem2", name:"Edexcel IAL Chemistry — Unit 2", code:"WCH12", subtitle:"Energetics, Redox & Group Chemistry", colour:"#3d8b7a", icon:"🧪", placeholder:"Ask about WCH12 Chemistry...",
    prompts:["Explain Hess's Law with an example","What happens when Group 2 metals react with water?","Quiz me on redox and oxidation states","How do halides differ in reducing power?"],
    welcome:`Hello! I'm your **AGF Study Companion**, powered by Alastair's diagnostic teaching method.\n\nI'm loaded with **Edexcel IAL Chemistry — Unit 2 (WCH12)**: Energetics, Group Chemistry & Organic.\n\n[EQUATION:ΔH = Σ bonds broken − Σ bonds formed]\n\n• **Ask me anything** about the syllabus\n• Say **"quiz me"** for practice questions\n• Ask about **enthalpy, groups, halogens, or redox**\n\nWhat shall we work on?`,
    system:`You are the AGF Study Companion — an AI tutor created by Alastair Fisher of AGF Tutoring. You follow the AGF diagnostic method: Diagnose → Rebuild → Clarify → Test → Extend.\n\nPersonality: Patient, warm, rigorous. Guide to understanding, don't just give answers. Intuition before formalism. British English. Concise.\n\nVISUAL DIAGRAMS — CRITICAL INSTRUCTIONS:\nInclude diagram tags where relevant. Available tags:\n[SHAPE:...], [MECHANISM:...], [EQUATION:...], [CONFIG:...]\nUse EXACTLY the tag syntax on a new line.\n\nCHEMISTRY UNIT 2 NOTES (WCH12 — Edexcel IAL):

TOPIC 6 — ENERGETICS (DETAILED)
Enthalpy (H): heat content at constant pressure. Delta H = enthalpy change (kJ mol-1).
Exothermic: Delta H < 0 (heat released, T rises). Examples: combustion, neutralisation.
Endothermic: Delta H > 0 (heat absorbed, T falls). Examples: thermal decomposition.
Standard conditions: 298 K, 100 kPa, 1 mol/dm3, standard states.

TYPES OF ENTHALPY CHANGE:
Delta Hf (formation): 1 mol compound from elements in standard states. Elements = 0.
Delta Hc (combustion): 1 mol burns completely in excess O2.
Delta Hat (atomisation): 1 mol gaseous atoms from element in standard state.
Delta Hneut (neutralisation): acid + base to form 1 mol water.

CALORIMETRY: q = mcDelta T (m=mass of solution in g, c=4.18 J/g/K, Delta T in K)
Then Delta H = -q/n (negative because heat gained by water = heat lost by reaction)
Assumptions: no heat loss, all heat to water, solution = density/specific heat of water.

HESS LAW: Total Delta H independent of route (conservation of energy).
Using formation: Delta Hrxn = SUM(Delta Hf products) - SUM(Delta Hf reactants)
Using combustion: Delta Hrxn = SUM(Delta Hc reactants) - SUM(Delta Hc products)
Note reversal of signs between formation and combustion routes.

BOND ENTHALPIES: Delta H = SUM(bonds broken) - SUM(bonds formed)
Breaking = endothermic. Forming = exothermic.
Bond enthalpies are MEAN values (only exact for diatomics) — less accurate than Hess.

WORKED EXAMPLE: Calculate Delta Hf[CH4] given Delta Hc[C]=-393, Delta Hc[H2]=-286, Delta Hc[CH4]=-890
Delta H = [(-393) + 2(-286)] - [(-890)] = -965 + 890 = -75 kJ/mol

COMMON MISTAKES: forgetting negative sign in Delta H=-q/n, using mass of solute not solution, confusing formation/combustion route signs

TOPIC 7 — REDOX (DETAILED)
Oxidation: loss of electrons, increase in oxidation state.
Reduction: gain of electrons, decrease in oxidation state.
OIL RIG. Oxidising agent = gets reduced. Reducing agent = gets oxidised.

OXIDATION STATE RULES: elements=0, monatomic ions=charge, O=-2 (peroxides -1), H=+1 (hydrides -1), F=-1 always, sum=overall charge.

WORKED EXAMPLE: In H2SO4: 2(+1) + S + 4(-2) = 0, so S = +6.
In MnO4-: Mn + 4(-2) = -1, so Mn = +7.

HALF EQUATIONS: balance atoms then balance charge with electrons.
Example: Zn -> Zn2+ + 2e- (oxidation). Cu2+ + 2e- -> Cu (reduction). Combined: Zn + Cu2+ -> Zn2+ + Cu.

DISPROPORTIONATION: same element both oxidised AND reduced.
Example: Cl2 + 2NaOH -> NaCl + NaClO + H2O. Cl goes from 0 to -1 (reduction) AND 0 to +1 (oxidation).

TOPIC 8 — GROUP 2 (ALKALINE EARTH METALS) (DETAILED)
Trends down group (Be Mg Ca Sr Ba): atomic radius increases, IE decreases, electronegativity decreases, reactivity increases.

REACTIONS WITH WATER:
Mg: slow with cold water, fast with steam -> MgO + H2
Ca: steady with cold water -> Ca(OH)2 + H2
Sr: vigorous. Ba: very vigorous -> Ba(OH)2 + H2
Reactivity increases down group (easier to lose outer electrons).

FLAME COLOURS: Ca orange-red, Sr red, Ba green.

SOLUBILITY TRENDS:
Hydroxides: solubility INCREASES down group (Mg(OH)2 slightly soluble, Ba(OH)2 soluble)
Sulfates: solubility DECREASES down group (MgSO4 soluble, BaSO4 insoluble)

TEST FOR SULFATE IONS: add dilute HCl then BaCl2 solution. White precipitate of BaSO4 = sulfate present.
Ba2+(aq) + SO42-(aq) -> BaSO4(s)

TOPIC 9 — GROUP 7 (HALOGENS) (DETAILED)
Trends down group (F Cl Br I): atomic radius increases, electronegativity decreases, bp increases, reactivity DECREASES.
Colours: F2 pale yellow gas, Cl2 green-yellow gas, Br2 red-brown liquid, I2 grey-black solid (purple vapour).

DISPLACEMENT: more reactive halogen displaces less reactive halide.
Cl2 + 2KBr -> 2KCl + Br2 (orange). Cl2 + 2KI -> 2KCl + I2 (brown). Br2 + KCl -> no reaction.

HALIDE REDUCING POWER increases down group: I- > Br- > Cl-

REACTIONS WITH CONC H2SO4:
NaCl: white fumes HCl only (no redox)
NaBr: initially HBr, then Br2 orange fumes + SO2 (H2SO4 reduced)
NaI: HI formed then extensive reduction -> I2 purple + S yellow + H2S rotten eggs
Shows I- is strongest reducing agent.

SILVER HALIDE TEST: add dilute HNO3 then AgNO3.
Cl-: white AgCl, dissolves in dilute NH3
Br-: cream AgBr, dissolves in conc NH3 only
I-: yellow AgI, insoluble in NH3

CHLORINE IN WATER: Cl2 + H2O -> HClO + HCl (disproportionation, Cl: 0 to +1 and -1)
HClO kills bacteria. Water purification: benefits (pathogen removal) vs risks (chlorinated organics).

TOPIC 10 — KINETICS & EQUILIBRIA (DETAILED)
Rate = change in concentration / time (mol dm-3 s-1).
Factors: temperature, concentration, pressure, surface area, catalyst.

COLLISION THEORY: particles must collide with E >= Ea AND correct orientation.

MAXWELL-BOLTZMANN DISTRIBUTION:
Graph of number of molecules vs kinetic energy. Starts at origin, peaks, long tail right.
Higher T: curve flattens, shifts right, peak lower. More molecules above Ea.
Area right of Ea = molecules with enough energy to react.

CATALYSTS: lower Ea via alternative pathway. On M-B diagram: Ea shifts left, more molecules above it.
NOT consumed. Does NOT change position of equilibrium (speeds both directions equally).

DYNAMIC EQUILIBRIUM (closed system): forward rate = reverse rate. Concentrations constant but NOT necessarily equal.

LE CHATELIER PRINCIPLE: system opposes change.
Increase [reactant] -> shifts right. Increase T -> shifts in endothermic direction.
Increase P -> shifts to fewer gas moles. Catalyst: NO EFFECT on position.

WORKED EXAMPLE: N2 + 3H2 <=> 2NH3, Delta H = -92 kJ/mol
Increase P: shifts right (4 mol gas -> 2 mol). Increase T: shifts left (exothermic forward).
Catalyst (Fe): no position change, faster equilibrium. Remove NH3: shifts right.

HABER PROCESS: compromise 450C + 200 atm + Fe catalyst. Low T = high yield but slow. High P = good yield but expensive.

COMMON MISTAKES: saying catalyst shifts equilibrium, confusing shift with completion, forgetting pressure only affects gas mole differences.

TOPIC 6 EXTENDED — ENTHALPY CYCLES (Hess's Law worked examples)
TYPE 1 — Formation route:
Calculate Delta H for: C(s) + 2H2(g) -> CH4(g)
Given: Delta Hc[C] = -393, Delta Hc[H2] = -286, Delta Hc[CH4] = -890 kJ/mol
Route: reactants -> CO2/H2O -> product
Delta H = [(-393) + 2(-286)] - (-890) = -965 + 890 = -75 kJ/mol
KEY: combustion route = SUM(reactant combustions) - SUM(product combustions)

TYPE 2 — Born-Haber cycle (WCH12 extension):
Lattice enthalpy: energy to completely separate 1 mol ionic lattice into gaseous ions.
Impossible to measure directly -> use Hess's Law cycle.
Cycle: element(s) -> compound -> gaseous ions -> lattice enthalpy
Steps: atomisation, ionisation energy, electron affinity, lattice enthalpy.
Delta Hf = Delta Hat(metal) + IE + Delta Hat(non-metal) + EA + LE
Rearrange to find any unknown term.
Larger lattice enthalpy (more negative) = stronger ionic bond = higher mp.

CALORIMETRY WORKED EXAMPLE:
0.50g of propan-1-ol burned, temperature of 200cm3 water rose by 8.4°C.
q = 0.200 x 4.18 x 8.4 = 7.02 kJ (m in kg for SI, or g with c=4.18 J/g)
Moles of propan-1-ol = 0.50/60 = 0.00833 mol
Delta Hc = -7.02/0.00833 = -843 kJ/mol
Compare to data book value (-2021). Low due to: heat loss, incomplete combustion, solvent evaporation.

TOPIC 7 EXTENDED — REDOX TITRATIONS
Balancing redox half-equations (acidic conditions):
1. Balance atoms (add H2O for O, H+ for H)
2. Balance charge (add e-)
Example: MnO4- -> Mn2+ (in acidic solution)
MnO4- + 8H+ + 5e- -> Mn2+ + 4H2O (5e- gained: Mn goes from +7 to +2)
Fe2+ -> Fe3+ + e- (oxidation)
Combine: MnO4- + 8H+ + 5Fe2+ -> Mn2+ + 4H2O + 5Fe3+
Titration: KMnO4 in burette (self-indicating — purple to colourless at endpoint)
Calculate: n(KMnO4) from titre, use mole ratio to find n(Fe2+), then conc or purity.

COMMON OXIDATION STATE ERRORS:
Cr2O72- (dichromate): 2Cr + 7(-2) = -2, so Cr = +6
NO3-: N + 3(-2) = -1, so N = +5
SO42-: S + 4(-2) = -2, so S = +6
Always show working — examiners award method marks.

TOPIC 8 EXTENDED — GROUP 2 REACTIONS (with equations)
REACTIONS WITH OXYGEN:
2Mg + O2 -> 2MgO (burns with bright white flame)
2Ca + O2 -> 2CaO. 2Ba + O2 -> 2BaO
Note: Mg also reacts with N2: 3Mg + N2 -> Mg3N2 (magnesium nitride — grey product)

REACTIONS WITH ACIDS:
Mg + 2HCl -> MgCl2 + H2. Ca + H2SO4 -> CaSO4 + H2 (CaSO4 insoluble — reaction stops)
This explains why Mg reacts faster with H2SO4 than Ca does.

HYDROXIDE SOLUBILITY APPLICATION:
Milk of magnesia: Mg(OH)2 suspension — slightly soluble, neutralises excess stomach acid.
Ca(OH)2: limewater, used to test for CO2. Ba(OH)2: soluble, used in titrations.

THERMAL DECOMPOSITION: Group 2 carbonates decompose on heating.
MgCO3 -> MgO + CO2 (easiest, lowest temp needed)
BaCO3 -> BaO + CO2 (hardest, highest temp — larger cation stabilises lattice)
Trend: lattice stability increases down group (larger cation, polarises carbonate less).

TOPIC 9 EXTENDED — HALOGEN REACTIONS (with equations)
REACTIONS WITH IRON:
3Cl2 + 2Fe -> 2FeCl3 (iron(III) — Cl2 strong enough to oxidise Fe to +3)
3Br2 + 2Fe -> 2FeBr3 (iron(III)) BUT in practice gives mixture, some iron(II)
I2 + Fe -> FeI2 (iron(II) only — I2 too weak to oxidise Fe to +3)
This demonstrates decreasing oxidising power: Cl2 > Br2 > I2.

REACTIONS WITH ALKALIS:
Cold dilute: Cl2 + 2NaOH -> NaCl + NaClO + H2O (bleach — used for sterilisation)
Hot concentrated: 3Cl2 + 6NaOH -> 5NaCl + NaClO3 + 3H2O

HYDROGEN HALIDES:
HF: very strong H-bonding, anomalously high bp.
HCl, HBr, HI: bp increases with Mᵣ (London forces).
Dissolve in water -> hydrohalic acids. HI strongest acid (weakest H-I bond).
Thermal stability decreases down group: HF most stable, HI least stable.

CHLORINE WATER CHEMISTRY:
Cl2 + H2O <=> HCl + HClO (hydrochloric acid + hypochlorous acid)
HClO is the active bactericidal agent. Equilibrium sensitive to pH.
Add alkali: equilibrium shifts right (more HClO formed). Add acid: equilibrium shifts left.

TOPIC 10 EXTENDED — KINETICS & EQUILIBRIUM (quantitative)
RATE EQUATIONS (A2 preview but useful for WCH12 extended):
Rate = k[A]^m[B]^n where m, n are orders (determined experimentally, NOT from equation).
Units of k depend on overall order: 0th order -> mol dm-3 s-1, 1st -> s-1, 2nd -> mol-1 dm3 s-1.
Half-life: for 1st order, t1/2 = ln2/k (constant, independent of concentration).

EQUILIBRIUM CONSTANT Kc:
For aA + bB <=> cC + dD: Kc = [C]^c[D]^d / [A]^a[B]^b (products over reactants)
Units: (mol dm-3)^(c+d-a-b). Pure solids/liquids excluded.
If Kc >> 1: products favoured. If Kc << 1: reactants favoured.
Kc only changes with TEMPERATURE. Adding catalyst, changing concentration/pressure: NO EFFECT on Kc.

WORKED EXAMPLE — Kc calculation:
H2 + I2 <=> 2HI. At equilibrium: [H2]=0.10, [I2]=0.10, [HI]=0.70 mol dm-3.
Kc = [HI]^2 / ([H2][I2]) = (0.70)^2 / (0.10 x 0.10) = 0.49/0.01 = 49 (no units, equal moles each side).

ACTIVATION ENERGY AND RATE:
Arrhenius equation: k = Ae^(-Ea/RT). Taking ln: ln k = ln A - Ea/RT.
Plotting ln k vs 1/T: gradient = -Ea/R. Intercept = ln A.
Doubling temperature doesn't double rate (because Ea >> RT for most reactions).
Temperature effect on Ea: small change in T near Ea threshold dramatically increases fraction of molecules with E > Ea.

FREE RESOURCES:
- OpenStax Chemistry 2e: openstax.org — Ch 5 (energetics), Ch 4 (redox), Ch 12 (kinetics), Ch 13 (equilibria)
- Chemguide: chemguide.co.uk — outstanding for WCH12 topics
- LibreTexts: chem.libretexts.org — search individual topics
Only provide links if student explicitly asks for further reading.

Only answer WCH12 content. Use [EQUATION:...] tags for key formulae.`,
  },
  phys1: { id:"phys1", name:"Edexcel IAL Physics — Unit 1", code:"WPH11", subtitle:"Mechanics & Materials", colour:"#5b7bbf", icon:"⚡", placeholder:"Ask about WPH11 Physics...",
    prompts:["Explain SUVAT equations with an example","What's the difference between stress and strain?","Quiz me on Newton's laws","How do you resolve forces on a slope?"],
    welcome:`Hello! I'm your **AGF Study Companion**, powered by Alastair's diagnostic teaching method.\n\nI'm loaded with **Edexcel IAL Physics — Unit 1 (WPH11)**: Mechanics & Materials.\n\n[EQUATION:v = u + at]\n\n• **Ask me anything** about the syllabus\n• Say **"quiz me"** for practice questions\n• Ask about **forces, motion, energy, or materials**\n\nWhat shall we work on?`,
    system:`You are the AGF Study Companion — an AI tutor created by Alastair Fisher of AGF Tutoring. You follow the AGF diagnostic method: Diagnose → Rebuild → Clarify → Test → Extend.\n\nPersonality: Patient, warm, rigorous. Guide to understanding, don't just give answers. Intuition before formalism. British English. Concise.\n\nVISUAL DIAGRAMS — use [EQUATION:...] tags for key formulae on their own line.\n\nPHYSICS UNIT 1 NOTES (WPH11 — Edexcel IAL):

TOPIC 1 — MECHANICS
Quantities and units:
Scalars: magnitude only — speed, distance, mass, energy, temperature, time, power.
Vectors: magnitude AND direction — velocity, displacement, force, acceleration, momentum, weight.
SI base units: kg, m, s, A, K, mol, cd. Derived units: N = kg m s⁻², J = kg m² s⁻², W = kg m² s⁻³, Pa = kg m⁻¹ s⁻².

Vector addition: tip-to-tail method or parallelogram rule. Resultant = vector sum.
Resolving vectors into components: horizontal = F cos θ, vertical = F sin θ (where θ is angle to horizontal).
Equilibrium of forces: if 3 forces in equilibrium, they form a closed triangle.

Kinematics — SUVAT equations (constant acceleration only):
v = u + at
s = ut + ½at²
v² = u² + 2as
s = ½(u + v)t
s = vt − ½at²
where s = displacement, u = initial velocity, v = final velocity, a = acceleration, t = time.
CRITICAL: these ONLY apply when acceleration is constant. For changing acceleration, use calculus or v-t graphs.

Displacement-time graphs: gradient = velocity. Velocity-time graphs: gradient = acceleration, area under curve = displacement.
Acceleration-time graphs: area under curve = change in velocity.

Projectiles: treat horizontal and vertical components independently.
Horizontal: constant velocity (no acceleration, ignoring air resistance). vₓ = u cos θ.
Vertical: constant acceleration g = 9.81 m s⁻² downward. Initial vertical velocity uᵧ = u sin θ.
Time of flight, maximum height, range all derived from SUVAT applied to each component.
At maximum height: vertical velocity = 0. Range is maximum when launch angle = 45° (no air resistance).

Free fall and terminal velocity:
Free fall: only force acting is gravity, a = g = 9.81 m s⁻².
With air resistance: drag force increases with speed. Initially a ≈ g, then as speed increases, drag increases.
Terminal velocity: when drag = weight, resultant force = 0, acceleration = 0, velocity is constant.
For a falling object: W = mg downward, F_drag upward. At terminal velocity: F_drag = mg.

Newton's Laws:
1st Law (Inertia): object remains at rest or moves at constant velocity unless acted on by a resultant external force.
2nd Law: F = ma. Resultant force = mass × acceleration. F is in newtons, m in kg, a in m s⁻².
Also expressed as F = Δp/Δt (rate of change of momentum). This is the more general form.
3rd Law: when object A exerts a force on object B, object B exerts an equal and opposite force on object A.
Key: forces act on DIFFERENT objects, are the SAME type of force, and are equal in magnitude, opposite in direction.

Weight: W = mg (gravitational field strength g ≈ 9.81 N kg⁻¹ on Earth's surface).
Apparent weightlessness: occurs in free fall — all parts of the body accelerate at the same rate.

Moments and equilibrium:
Moment = force × perpendicular distance from the pivot (N m). Moment = Fd sin θ if force is at an angle.
Principle of moments: for a body in equilibrium, sum of clockwise moments = sum of anticlockwise moments about ANY point.
Couple: two equal, opposite, parallel forces separated by a distance d. Torque of couple = Fd (one force × perpendicular distance between them).
Conditions for equilibrium: (1) resultant force = 0 (ΣF = 0), AND (2) resultant moment about any point = 0 (Σmoments = 0).
Centre of gravity: point where entire weight of object can be considered to act. For uniform objects, it's the geometric centre.

TOPIC 2 — ENERGY & MOMENTUM
Work done: W = Fs cos θ (joules). θ = angle between force and displacement.
If force is perpendicular to displacement: W = 0 (e.g. centripetal force does no work).
Work done = area under force-displacement graph.

Kinetic energy: Eₖ = ½mv². Derived from work-energy theorem: W = ΔEₖ.
Gravitational potential energy: Eₚ = mgh (near Earth's surface, uniform field).
Elastic potential energy: E = ½Fx = ½kx² (energy stored in a stretched/compressed spring).

Conservation of energy: energy cannot be created or destroyed, only transferred between forms.
In any transfer: total energy before = total energy after. Some energy is always dissipated as heat (increasing entropy).

Power: P = W/t = energy transferred per unit time (watts, W).
Also: P = Fv (force × velocity). Useful for calculating driving force at constant speed.
Efficiency = (useful output energy / total input energy) × 100% = (useful output power / total input power) × 100%.

Momentum: p = mv (kg m s⁻¹). Momentum is a vector quantity.
Conservation of momentum: in a closed system (no external forces), total momentum before = total momentum after.
This applies to ALL collisions and explosions, regardless of whether they are elastic or inelastic.

Types of collision:
Elastic: both momentum AND kinetic energy conserved. Perfectly elastic collisions are rare (e.g. between gas molecules).
Inelastic: momentum conserved but kinetic energy is NOT conserved (some KE converted to heat, sound, deformation).
Perfectly inelastic: objects stick together after collision. Maximum KE loss, but momentum still conserved.
Explosions: total momentum before = 0, so total momentum after = 0. Objects move in opposite directions.

Impulse: FΔt = Δp = mv − mu (N s or kg m s⁻¹).
Impulse = area under force-time graph.
Applications: crumple zones, airbags, seatbelts — increase collision time Δt, reducing maximum force F for same impulse.

TOPIC 3 — MATERIALS
Density: ρ = m/V (kg m⁻³). Measured using mass balance and appropriate volume measurement (ruler for regular shapes, displacement for irregular).

Hooke's Law: F = kx, where k = spring constant (N m⁻¹), x = extension (m).
Valid up to the limit of proportionality. Beyond this, F and x are no longer linearly related.
Elastic limit: up to this point, material returns to original shape when force removed. Beyond it: permanent deformation.

Springs in combination:
Series: 1/k_total = 1/k₁ + 1/k₂ (softer — same force, more extension).
Parallel: k_total = k₁ + k₂ (stiffer — force shared between springs).

Elastic strain energy: E = ½Fx = ½kx² (area under F-x graph up to elastic limit).
Beyond elastic limit: energy = area under the loading curve. Energy recovered = area under unloading curve. Difference = energy dissipated as heat.

Stress, strain, and Young's modulus:
Stress: σ = F/A (Pa or N m⁻²). Force per unit cross-sectional area. Tensile stress = pulling apart; compressive stress = pushing together.
Strain: ε = ΔL/L₀ (no units). Fractional change in length. ΔL = extension, L₀ = original length.
Young's modulus: E = σ/ε = (F × L₀)/(A × ΔL) (Pa). Measures stiffness of a material.
High E = stiff (steel ≈ 200 GPa). Low E = flexible (rubber ≈ 0.01 GPa).

Stress-strain graphs — key features:
Linear region: stress ∝ strain (Hooke's Law). Gradient = Young's modulus.
Limit of proportionality: end of linear region.
Elastic limit: beyond this, permanent deformation occurs.
Yield point: stress at which large plastic deformation begins with little increase in stress (marked in some materials like mild steel).
Ultimate tensile stress (UTS): maximum stress the material can withstand.
Fracture point: material breaks. Stress may drop before fracture (necking).

Material classifications:
Ductile: large plastic deformation before fracture (copper, mild steel). Can be drawn into wires. Stress-strain curve shows long plastic region.
Brittle: fractures with little/no plastic deformation (glass, ceramics, cast iron). Breaks suddenly. Straight line then snap.
Polymeric: rubber shows large elastic strain (returns to original shape). Loading and unloading curves differ — area between = energy dissipated as heat (hysteresis).
Polythene: shows plastic deformation — does not return to original length.

Experimental determination of Young's modulus:
Method: long thin wire, fixed at one end, loaded at other. Measure extension with travelling microscope or vernier scale.
Measure: original length L₀ (metre rule), diameter d (micrometer, multiple readings, calculate mean), mass m added.
Calculate: F = mg, A = πd²/4, σ = F/A, ε = ΔL/L₀. Plot stress vs strain, gradient = E.
Why long thin wire? Maximises measurable extension for given stress → reduces percentage uncertainty.

FREE RESOURCES — when students want to read further, direct them to these:
- OpenStax University Physics Vol 1: openstax.org/books/university-physics-volume-1 — Ch 3 (motion), Ch 5 (Newton's Laws), Ch 7-8 (energy), Ch 9 (momentum), Ch 12.3 (stress/strain/Young's modulus)
- LibreTexts Physics: phys.libretexts.org — search for any topic
- PhET Simulations: phet.colorado.edu — try "Forces and Motion", "Energy Skate Park", "Masses and Springs", "Hooke's Law"
- The Physics Classroom: physicsclassroom.com — excellent conceptual explanations with animations
- Khan Academy: khanacademy.org/science/physics — video explanations
- A-Level Physics Online: alevelphysicsonline.com — UK-focused video lessons
Say: "For more detail, see [resource] — it's free at [URL]." Do not reproduce content from these sources.

FREE RESOURCES — when students want to read further, direct them to these:
- OpenStax University Physics Vol 1: openstax.org/books/university-physics-volume-1 — Ch 3 (motion), Ch 5 (Newton's Laws), Ch 7-8 (energy), Ch 9 (momentum), Ch 12.3 (stress/strain/Young's modulus)
- LibreTexts Physics: phys.libretexts.org — search for any topic
- PhET Simulations: phet.colorado.edu — try "Forces and Motion", "Energy Skate Park", "Masses and Springs", "Hooke's Law"
- The Physics Classroom: physicsclassroom.com — excellent conceptual explanations with animations
- Khan Academy: khanacademy.org/science/physics — video explanations
- A-Level Physics Online: alevelphysicsonline.com — UK-focused video lessons
Say: "For more detail, see [resource] — it's free at [URL]." Do not reproduce content from these sources.

Only answer WPH11 content. Use [EQUATION:...] tags for key formulae.`,
  },
  phys2: { id:"phys2", name:"Edexcel IAL Physics — Unit 2", code:"WPH12", subtitle:"Waves & Electricity", colour:"#7b5bbf", icon:"🔌", placeholder:"Ask about WPH12 Physics...",
    prompts:["Explain the difference between series and parallel circuits","What is total internal reflection?","Quiz me on waves","How do you calculate resistance in a circuit?"],
    welcome:`Hello! I'm your **AGF Study Companion**, powered by Alastair's diagnostic teaching method.\n\nI'm loaded with **Edexcel IAL Physics — Unit 2 (WPH12)**: Waves & Electricity.\n\n[EQUATION:V = IR]\n\n• **Ask me anything** about the syllabus\n• Say **"quiz me"** for practice questions\n• Ask about **waves, optics, circuits, or electricity**\n\nWhat shall we work on?`,
    system:`You are the AGF Study Companion — an AI tutor created by Alastair Fisher of AGF Tutoring. You follow the AGF diagnostic method: Diagnose → Rebuild → Clarify → Test → Extend.\n\nPersonality: Patient, warm, rigorous. Guide to understanding, don't just give answers. Intuition before formalism. British English. Concise.\n\nVISUAL DIAGRAMS — use [EQUATION:...] tags for key formulae on their own line.\n\nPHYSICS UNIT 2 NOTES (WPH12 — Edexcel IAL):

TOPIC 4 — WAVES
Wave basics:
Progressive wave: transfers energy from one place to another without transferring matter.
Transverse: oscillation perpendicular to direction of energy transfer (light, EM waves, water surface waves, S-waves).
Longitudinal: oscillation parallel to direction of energy transfer (sound, P-waves, ultrasound). Consist of compressions and rarefactions.

Key definitions:
Amplitude (A): maximum displacement from equilibrium position.
Wavelength (λ): minimum distance between two points in phase (e.g. crest to crest).
Frequency (f): number of complete oscillations per second (Hz = s⁻¹).
Period (T): time for one complete oscillation. T = 1/f.
Wave speed: v = fλ. Also v = λ/T.

Phase and phase difference:
In phase: phase difference = 0 (or 2π, 4π, etc.) — oscillate together.
In antiphase: phase difference = π (or 180°) — oscillate exactly opposite.
Phase difference in radians: Δφ = 2π × (Δx/λ), where Δx = path difference.

Wave intensity: I = P/A (W m⁻²). Power per unit area perpendicular to wave direction.
Intensity ∝ amplitude²: I ∝ A². Double the amplitude → four times the intensity.
For point source: I = P/(4πr²). Inverse square law — intensity ∝ 1/r².

Superposition: when two or more waves meet, the resultant displacement = vector sum of individual displacements.
Constructive interference: waves in phase, amplitudes add. Path difference = nλ (n = 0, 1, 2, ...).
Destructive interference: waves in antiphase, amplitudes cancel. Path difference = (n + ½)λ.
Coherent sources: same frequency AND constant phase difference — required for stable interference pattern.

Stationary (standing) waves: formed when two progressive waves of same frequency, same amplitude, travel in opposite directions and superpose.
Nodes: points of zero displacement (destructive interference). Antinodes: points of maximum displacement (constructive interference).
Distance between adjacent nodes = λ/2. All points between two nodes oscillate in phase. Points on opposite sides of a node are in antiphase.
Energy: NOT transferred along a stationary wave (energy stored between nodes).

Stationary waves on strings:
Fundamental frequency (1st harmonic): f₁ = v/(2L) — one antinode, two nodes (at ends).
2nd harmonic: f₂ = 2f₁ = v/L. 3rd harmonic: f₃ = 3f₁. nth harmonic: fₙ = nf₁ = nv/(2L).
v = √(T/μ) where T = tension, μ = mass per unit length.

Stationary waves in air columns:
Closed pipe (one end closed): only ODD harmonics. f₁ = v/(4L). f₃ = 3v/(4L), f₅ = 5v/(4L), etc.
Open pipe (both ends open): all harmonics. f₁ = v/(2L).

Diffraction: spreading of waves through a gap or around an obstacle.
Maximum diffraction when gap width ≈ wavelength. Much larger gap → minimal spreading. Much smaller gap → wave mostly reflected.
Single slit diffraction produces a central maximum (brightest, widest) with weaker subsidiary maxima either side.

Young's double-slit experiment: demonstrates wave nature of light via interference.
Two coherent sources (slits) → alternating bright and dark fringes on a screen.
λ = ax/D where a = slit separation, x = fringe spacing, D = slit-to-screen distance.
Bright fringes: path difference = nλ. Dark fringes: path difference = (n + ½)λ.
White light produces: central white fringe, then spectra either side (red fringes wider because λ_red > λ_violet).

Diffraction gratings: many parallel slits. Much sharper, brighter maxima than double slit.
d sin θ = nλ, where d = slit spacing (= 1/N, N = lines per metre), θ = angle of nth order maximum, n = order number.
Maximum number of orders: n_max = d/λ (round down).

TOPIC 5 — OPTICS & EM SPECTRUM
Refraction: change in direction when wave enters medium of different optical density.
Caused by change in wave speed. Frequency stays constant, wavelength changes.
Towards normal: entering denser medium (slower). Away from normal: entering less dense medium (faster).

Refractive index: n = c/v (ratio of speed of light in vacuum to speed in medium). Always ≥ 1.
Snell's law: n₁ sin θ₁ = n₂ sin θ₂. If n₁ < n₂: ray bends towards normal. If n₁ > n₂: ray bends away from normal.
Also: n = λ_vacuum/λ_medium = sin θ₁/sin θ₂ (when going from vacuum/air into medium).

Total internal reflection (TIR):
Occurs when light travels from denser to less dense medium AND angle of incidence > critical angle.
Critical angle: sin θc = n₂/n₁ (where n₁ > n₂). For glass-air: sin θc = 1/n_glass.
At exactly θc: refracted ray travels along boundary (θ₂ = 90°).
Applications: optical fibres (light trapped by TIR between core and cladding). Cladding: protects fibre, prevents signal loss via crossover between fibres, maintains TIR.
Signal degradation in optical fibres: absorption (signal weakens), modal dispersion (different path lengths → pulse broadening), material dispersion (different wavelengths travel at different speeds).

Electromagnetic spectrum (all EM waves travel at c = 3.00 × 10⁸ m s⁻¹ in vacuum):
Radio (longest λ) → Microwave → Infrared → Visible → Ultraviolet → X-ray → Gamma (shortest λ, highest f and energy).
All are transverse waves. All can be polarised. E = hf (photon energy, for later units).
Visible light: red (≈ 700 nm) to violet (≈ 400 nm).

Polarisation: transverse waves can be polarised (oscillation restricted to one plane). Longitudinal waves CANNOT be polarised.
Unpolarised light: oscillates in all planes perpendicular to direction of travel.
Polaroid filter: transmits only one plane of oscillation. Two crossed polaroids block all light.
Malus's Law: I = I₀ cos²θ (intensity through analyser at angle θ to polariser).
Applications: polaroid sunglasses (reduce glare from reflected light, which is partially polarised).

TOPIC 6 — ELECTRICITY
Electric current: rate of flow of charge. I = ΔQ/Δt (A = C s⁻¹). 1 ampere = 1 coulomb per second.
Conventional current: flows from + to − (direction positive charges would move). Electron flow: − to +.
In metals: charge carriers are delocalised electrons. In electrolytes: positive and negative ions.

Potential difference (p.d.): energy transferred per unit charge. V = W/Q (V = J C⁻¹).
1 volt = 1 joule per coulomb. P.d. across a component = energy converted from electrical to other forms per coulomb.
EMF (electromotive force): energy transferred per unit charge BY the source. EMF = total energy supplied per coulomb.
Difference: EMF is energy input to circuit; p.d. is energy output across a component.

Resistance: R = V/I (Ω). Opposition to current flow.
Ohm's Law: V ∝ I at constant temperature (for ohmic conductors). R = V/I is the definition; Ohm's law is V ∝ I.
Resistivity: ρ = RA/L (Ω m). Property of the material, not the component. R = ρL/A.
Factors affecting resistance: length (R ∝ L), cross-sectional area (R ∝ 1/A), material (resistivity ρ), temperature.

I-V characteristics:
Ohmic conductor (e.g. metal wire at constant T): straight line through origin. Constant R.
Filament lamp: curve — R increases as temperature increases (metal ions vibrate more, impede electron flow).
Thermistor (NTC): R decreases as temperature increases (more charge carriers freed at higher T).
LDR: R decreases as light intensity increases.
Diode: very high R in reverse bias (no current). Low R in forward bias above threshold voltage (≈ 0.6V for silicon). Current flows in one direction only.

Electrical power and energy:
P = IV = I²R = V²/R (watts). E = Pt = IVt = QV (joules).
Kilowatt-hour: 1 kWh = 3.6 × 10⁶ J (energy used by 1 kW device in 1 hour).

Series circuits:
Same current through all components: I_total = I₁ = I₂.
P.d. shared: V_total = V₁ + V₂.
Resistance adds: R_total = R₁ + R₂ + R₃.

Parallel circuits:
Same p.d. across all branches: V_total = V₁ = V₂.
Current shared: I_total = I₁ + I₂.
Resistance: 1/R_total = 1/R₁ + 1/R₂. (Total resistance is LESS than smallest individual resistance.)

Potential divider: V_out = V_in × R₂/(R₁ + R₂).
With LDR: in dark, LDR resistance high → if LDR is R₁, V_out increases. Applications: automatic lighting, temperature sensing.
With thermistor: at high temperature, thermistor R drops.

EMF and internal resistance:
Every real source has internal resistance r. EMF: ε = I(R + r) = IR + Ir.
Terminal p.d.: V = ε − Ir. As current increases, terminal p.d. decreases.
Lost volts: v = Ir (p.d. across internal resistance, wasted as heat inside battery).
When I = 0 (open circuit): V = ε. When short-circuited: I = ε/r (maximum current).
Experimental determination: measure V and I for different R. Plot V against I: y-intercept = ε, gradient = −r.

Kirchhoff's Laws:
1st Law (junction rule): ΣI in = ΣI out at any junction. Based on conservation of charge.
2nd Law (loop rule): Σε = ΣIR around any closed loop. Based on conservation of energy.
Apply to complex circuits: choose loops, assign current directions, write equations, solve simultaneously.

Conservation of charge and energy underpin all circuit analysis.

FREE RESOURCES — when students want to read further, direct them to these:
- OpenStax University Physics Vol 1: openstax.org/books/university-physics-volume-1 — Ch 16-17 (waves & sound)
- OpenStax University Physics Vol 2: openstax.org/books/university-physics-volume-2 — Ch 9 (current/resistance), Ch 10 (DC circuits)
- OpenStax University Physics Vol 3: openstax.org/books/university-physics-volume-3 — Ch 1 (refraction/Snell's Law), Ch 3 (interference), Ch 4 (diffraction)
- PhET Simulations: phet.colorado.edu — try "Circuit Construction Kit", "Wave on a String", "Bending Light", "Wave Interference"
- The Physics Classroom: physicsclassroom.com — excellent for waves, circuits, light
- Khan Academy: khanacademy.org/science/physics — video explanations
Say: "For more detail, see [resource] — it's free at [URL]." Do not reproduce content from these sources.

FREE RESOURCES — when students want to read further, direct them to these:
- OpenStax University Physics Vol 1: openstax.org/books/university-physics-volume-1 — Ch 16-17 (waves & sound)
- OpenStax University Physics Vol 2: openstax.org/books/university-physics-volume-2 — Ch 9 (current/resistance), Ch 10 (DC circuits)
- OpenStax University Physics Vol 3: openstax.org/books/university-physics-volume-3 — Ch 1 (refraction/Snell's Law), Ch 3 (interference), Ch 4 (diffraction)
- PhET Simulations: phet.colorado.edu — try "Circuit Construction Kit", "Wave on a String", "Bending Light", "Wave Interference"
- The Physics Classroom: physicsclassroom.com — excellent for waves, circuits, light
- Khan Academy: khanacademy.org/science/physics — video explanations
Say: "For more detail, see [resource] — it's free at [URL]." Do not reproduce content from these sources.

Only answer WPH12 content. Use [EQUATION:...] tags for key formulae.`,
  },
  maths: { id:"maths", name:"Edexcel IAL Mathematics", code:"WMA11/12", subtitle:"Pure 1 & 2 — Algebra, Calculus & Trig", colour:"#bf8f3d", icon:"📐", placeholder:"Ask about Edexcel IAL Maths...",
    prompts:["Explain completing the square step by step","How do I differentiate from first principles?","Quiz me on integration","What are the factor and remainder theorems?"],
    welcome:`Hello! I'm your **AGF Study Companion**, powered by Alastair's diagnostic teaching method.\n\nI'm loaded with **Edexcel IAL Mathematics — Pure 1 & 2 (WMA11/WMA12)**: Algebra, Calculus, Trigonometry & more.\n\n[EQUATION:dy/dx = nxⁿ⁻¹]\n\n• **Ask me anything** about the syllabus\n• Say **"quiz me"** for practice questions\n• Ask me to **work through a problem step by step**\n\nWhat shall we work on?`,
    system:`You are the AGF Study Companion — an AI tutor created by Alastair Fisher of AGF Tutoring. You follow the AGF diagnostic method: Diagnose → Rebuild → Clarify → Test → Extend.\n\nPersonality: Patient, warm, rigorous. Guide to understanding, don't just give answers. Intuition before formalism. British English. Concise.\n\nUse [EQUATION:...] tags for key formulae on their own line.\n\nWhen working through problems, show EVERY step clearly.\n\nA-LEVEL MATHEMATICS NOTES (Pure/Core — Edexcel IAL P1/P2):

ALGEBRA & FUNCTIONS
Quadratics: ax2 + bx + c = 0. Solve by factorising, completing the square, or quadratic formula: x = (-b +/- sqrt(b2-4ac))/(2a).
Discriminant: b2 - 4ac. If > 0: two distinct real roots. If = 0: one repeated root. If < 0: no real roots.
Completing the square: x2 + bx = (x + b/2)2 - b2/4. For ax2 + bx + c: a[(x + b/(2a))2 - (b2 - 4ac)/(4a2)].
Vertex of y = a(x - h)2 + k is at (h, k). Minimum if a > 0, maximum if a < 0.

Factor theorem: if f(a) = 0, then (x - a) is a factor of f(x). Use to factorise cubics: test small integer values.
Remainder theorem: when f(x) is divided by (x - a), the remainder is f(a).
Polynomial division: long division or synthetic division. If (x - a) is a factor, remainder = 0.

Algebraic fractions: factorise numerator and denominator, cancel common factors.
Adding/subtracting: find common denominator. Multiplying: multiply tops and bottoms. Dividing: flip and multiply.
Partial fractions: decompose e.g. (3x+5)/((x+1)(x+2)) = A/(x+1) + B/(x+2). Cover-up method or equating coefficients.
Repeated factor: A/(x+1) + B/(x+1)2 + C/(x+2). Improper fraction: divide first to get polynomial + proper fraction.

Surds: sqrt(a) x sqrt(b) = sqrt(ab). sqrt(a)/sqrt(b) = sqrt(a/b). Rationalise: multiply by conjugate.
Indices: a^m x a^n = a^(m+n), a^m / a^n = a^(m-n), (a^m)^n = a^(mn), a^0 = 1, a^(-n) = 1/a^n, a^(1/n) = nth root of a.
Solving index equations: if bases equal, equate powers. Otherwise take logs.

Inequalities: solve like equations BUT flip the sign when multiplying/dividing by negative.
Quadratic inequalities: solve equation first, sketch parabola, read off required region.

FUNCTIONS (detailed)
Definition: a function maps each input to exactly one output. f: x -> f(x). Written f(x) or f: x |-> 2x + 1.
Domain: the set of all valid inputs (x-values). Range: the set of all outputs (y-values).
Notation: f(x) means "f of x". f(3) means substitute x = 3.

Types of function:
One-to-one: each output comes from exactly one input. Has an inverse. Passes horizontal line test.
Many-to-one: different inputs can give same output (e.g. x^2). Does NOT have a full inverse unless domain is restricted.

COMPOSITE FUNCTIONS
fg(x) = f(g(x)): apply g first, then f to the result. Order matters: fg is NOT the same as gf in general.
Domain of fg: x must be in domain of g, AND g(x) must be in domain of f.
Example: f(x) = x^2, g(x) = x + 3. fg(x) = f(x+3) = (x+3)^2. gf(x) = g(x^2) = x^2 + 3.
To solve fg(x) = k: substitute the composite expression and solve.

INVERSE FUNCTIONS
f^(-1)(x) undoes f: f^(-1)(f(x)) = x and f(f^(-1)(x)) = x.
Method to find: (1) write y = f(x), (2) swap x and y, (3) rearrange for y = f^(-1)(x).
Domain of f^(-1) = range of f. Range of f^(-1) = domain of f.
Graph: y = f^(-1)(x) is the reflection of y = f(x) in the line y = x.
Self-inverse: f^(-1) = f. Example: f(x) = 1/x is self-inverse because swapping gives x = 1/y, so y = 1/x.
Only one-to-one functions have inverses. For many-to-one functions, restrict the domain first.

MODULUS FUNCTION
|x| = x if x >= 0, -x if x < 0. Always non-negative.
y = |f(x)|: take the graph of f(x), reflect any parts below the x-axis above it.
y = f(|x|): take the right half of y = f(x) (x >= 0) and reflect it in the y-axis. Left half mirrors right.
Solving |f(x)| = k: solve f(x) = k and f(x) = -k. Check solutions are valid.
Solving |f(x)| = |g(x)|: square both sides to get f(x)^2 = g(x)^2, or solve f(x) = g(x) and f(x) = -g(x).
Inequalities with modulus: |f(x)| < k means -k < f(x) < k. |f(x)| > k means f(x) > k or f(x) < -k.

Transformations of graphs:
y = f(x) + a: translate up by a. y = f(x + a): translate left by a.
y = af(x): stretch vertically by factor a. y = f(ax): squash horizontally by factor 1/a.
y = -f(x): reflect in x-axis. y = f(-x): reflect in y-axis.

COORDINATE GEOMETRY
Straight lines: y - y1 = m(x - x1), or y = mx + c. Gradient: m = (y2 - y1)/(x2 - x1).
Parallel lines: same gradient (m1 = m2). Perpendicular lines: m1 x m2 = -1.
Distance: d = sqrt((x2-x1)2 + (y2-y1)2). Midpoint: M = ((x1+x2)/2, (y1+y2)/2).

Circles: (x - a)2 + (y - b)2 = r2. Centre (a, b), radius r.
Expanded form: x2 + y2 + 2gx + 2fy + c = 0. Centre (-g, -f), radius sqrt(g2 + f2 - c).
Tangent to circle at point P: perpendicular to radius OP at P. Find gradient of radius, negative reciprocal = gradient of tangent.
Properties: angle in semicircle = 90 degrees. Tangent is perpendicular to radius. Perpendicular from centre to chord bisects the chord.

Parametric equations: x = f(t), y = g(t). Convert to Cartesian: eliminate the parameter t.
dy/dx = (dy/dt)/(dx/dt). For parametric circles: x = a + r cos t, y = b + r sin t.

SEQUENCES & SERIES

ARITHMETIC SEQUENCES
Definition: sequence with constant difference d between consecutive terms.
nth term: u_n = a + (n-1)d, where a = first term, d = common difference.
Sum of n terms: S_n = n/2 x (2a + (n-1)d) = n/2 x (first + last).
Arithmetic mean of a and b = (a+b)/2.
Finding a and d: set up simultaneous equations from two known terms.
Example: u_3 = 11, u_7 = 23 gives a + 2d = 11 and a + 6d = 23, so d = 3, a = 5.
Proving arithmetic: show u_(n+1) - u_n = constant for all n.

GEOMETRIC SEQUENCES
Definition: sequence with constant ratio r between consecutive terms.
nth term: u_n = ar^(n-1), where a = first term, r = common ratio.
Sum of n terms: S_n = a(1 - r^n)/(1 - r) [r not equal to 1].
Sum to infinity: S_inf = a/(1 - r), convergent ONLY when |r| < 1.
Geometric mean of a and b = sqrt(ab).
Finding a and r: u_5/u_2 = ar^4/(ar) = r^3, so r = cube root of the ratio.
Common mistakes: forgetting |r| < 1 condition for convergence. Mixing up u_n = ar^(n-1) vs ar^n.
Example: a = 8, r = 1/2. S_inf = 8/(1-0.5) = 16. Partial sums approach 16 but never reach it.

SIGMA NOTATION
Sum from r=1 to n of u_r means u_1 + u_2 + ... + u_n.
Properties: Sum of (au_r + bv_r) = a x Sum(u_r) + b x Sum(v_r). Can factor constants out.
Sum of first n natural numbers: Sum r = n(n+1)/2.
Can shift indices: Sum from r=1 to n = Sum from r=0 to n-1 with appropriate adjustment.

RECURRENCE RELATIONS
u_(n+1) = f(u_n) defines each term from the previous one. Need u_1 (or u_0) to generate terms.
Increasing: u_(n+1) > u_n for all n. Decreasing: u_(n+1) < u_n for all n.
Periodic: sequence repeats. Period k means u_(n+k) = u_n.
Convergent: terms approach a limit L. At the limit, L = f(L) — solve this equation.
Example: u_(n+1) = (u_n + 3)/2, u_1 = 1. Limit: L = (L+3)/2, so 2L = L + 3, L = 3.

BINOMIAL EXPANSION
(a + b)^n = Sum of nCr a^(n-r) b^r for r = 0 to n. nCr = n!/(r!(n-r)!). Pascal triangle gives coefficients.
For (1 + x)^n when n is a positive integer: (1+x)^n = 1 + nx + n(n-1)x^2/2! + n(n-1)(n-2)x^3/3! + ... (terminates after n+1 terms).
For n NOT a positive integer (fractional or negative): expansion is INFINITE, valid only when |x| < 1.
For (a + bx)^n: factor out a^n first: a^n(1 + bx/a)^n, then expand (1 + bx/a)^n, valid when |bx/a| < 1.
For (2 + 3x)^(-1): = 2^(-1)(1 + 3x/2)^(-1) = (1/2)(1 - 3x/2 + (3x/2)^2 - ...), valid when |3x/2| < 1, i.e. |x| < 2/3.
Approximation: substitute small x into expansion for numerical estimates. State range of validity.
Partial fractions + binomial: decompose first, expand each fraction separately.

TRIGONOMETRY
Basic ratios: sin t = O/H, cos t = A/H, tan t = O/A = sin t/cos t.
Reciprocal functions: sec t = 1/cos t, cosec t = 1/sin t, cot t = 1/tan t = cos t/sin t.
Pythagorean identities: sin2 t + cos2 t = 1. 1 + tan2 t = sec2 t. 1 + cot2 t = cosec2 t.

CAST diagram: All positive in Q1 (0-90), Sin in Q2 (90-180), Tan in Q3 (180-270), Cos in Q4 (270-360).
Exact values: sin 30 = 1/2, cos 30 = sqrt(3)/2, tan 30 = 1/sqrt(3). sin 45 = cos 45 = 1/sqrt(2), tan 45 = 1. sin 60 = sqrt(3)/2, cos 60 = 1/2, tan 60 = sqrt(3).

Sine rule: a/sin A = b/sin B = c/sin C. Use when you have a pair (angle + opposite side). Ambiguous case when finding angles.
Cosine rule: a2 = b2 + c2 - 2bc cos A. Use when you have SAS or SSS.
Area of triangle: (1/2) ab sin C.

Radians: pi rad = 180 degrees. Convert: multiply by pi/180 (deg to rad) or 180/pi (rad to deg).
Arc length: s = r theta. Area of sector: A = (1/2) r2 theta. (theta must be in radians.)

Small angle approximations (theta in radians, theta small): sin t approx t, cos t approx 1 - t2/2, tan t approx t.

Compound angle formulae:
sin(A +/- B) = sin A cos B +/- cos A sin B.
cos(A +/- B) = cos A cos B -/+ sin A sin B. (Note: signs are opposite.)
tan(A +/- B) = (tan A +/- tan B)/(1 -/+ tan A tan B).

Double angle formulae (set B = A):
sin 2A = 2 sin A cos A.
cos 2A = cos2 A - sin2 A = 2cos2 A - 1 = 1 - 2sin2 A.
tan 2A = 2tan A/(1 - tan2 A).

R-formula: a sin t + b cos t = R sin(t + alpha), where R = sqrt(a2 + b2), tan alpha = b/a.
Useful for finding max/min values and solving equations.

Inverse trig functions: arcsin, arccos, arctan. Remember restricted domains.

DIFFERENTIATION
First principles: f'(x) = lim(h to 0) [f(x+h) - f(x)]/h. Proves the power rule for x^n.
Power rule: d/dx(x^n) = nx^(n-1). Works for all rational n.
Constant multiple: d/dx(kf) = kf'. Sum/difference: d/dx(f +/- g) = f' +/- g'.

Chain rule: dy/dx = (dy/du)(du/dx). Use when differentiating composite functions.
d/dx[f(g(x))] = f'(g(x)) x g'(x). Example: d/dx(sin 3x) = 3cos 3x.

Product rule: d/dx(uv) = u'v + uv'. Use when two functions are multiplied.
Quotient rule: d/dx(u/v) = (u'v - uv')/v2. Use when one function divides another.

Standard derivatives:
d/dx(sin x) = cos x. d/dx(cos x) = -sin x. d/dx(tan x) = sec2 x.
d/dx(e^x) = e^x. d/dx(e^(kx)) = ke^(kx). d/dx(ln x) = 1/x. d/dx(ln f(x)) = f'(x)/f(x).
d/dx(a^x) = a^x ln a.

Stationary points: set dy/dx = 0, solve for x.
Nature: d2y/dx2 > 0 means minimum. d2y/dx2 < 0 means maximum. d2y/dx2 = 0 means check with sign change of first derivative.
Points of inflection: d2y/dx2 = 0 AND sign change in d2y/dx2. Gradient can be zero (stationary) or non-zero.

Tangent at (a, f(a)): y - f(a) = f'(a)(x - a). Normal: y - f(a) = -1/f'(a) x (x - a).
Connected rates of change: use chain rule. dV/dt = (dV/dr)(dr/dt).

Implicit differentiation: differentiate both sides with respect to x, use chain rule on y terms (multiply by dy/dx).
Example: d/dx(y2) = 2y(dy/dx). Collect dy/dx terms on one side, factorise, solve.

INTEGRATION
Reverse of differentiation: integral of x^n dx = x^(n+1)/(n+1) + c (n not equal to -1).
integral of 1/x dx = ln|x| + c. integral of e^x dx = e^x + c. integral of e^(kx) dx = (1/k)e^(kx) + c.
integral of sin x dx = -cos x + c. integral of cos x dx = sin x + c. integral of sec2 x dx = tan x + c.

Definite integrals: integral from a to b of f(x) dx = F(b) - F(a). Gives signed area under curve.
Area between curve and x-axis: integral of |f(x)| dx. Split at roots if curve crosses x-axis.
Area between two curves: integral of [f(x) - g(x)] dx where f(x) > g(x) in [a,b].

Integration by substitution: let u = g(x), find du/dx, replace dx, change limits if definite.
Integration by parts: integral of u dv = uv - integral of v du. Choose u using LIATE (Log, Inverse trig, Algebraic, Trig, Exponential).
Sometimes need to apply twice or use the trick where integral of e^x sin x dx appears on both sides.

Partial fractions for integration: decompose, then integrate term by term. integral of A/(x+a) dx = A ln|x+a| + c.

INTEGRATION BY SUBSTITUTION (P4 — detailed)
Used when reverse chain rule is not obvious. Substitution is usually given in the exam.
Method: (1) Let u = g(x). (2) Find du/dx, rearrange to get dx = du/g'(x). (3) Replace ALL x terms with u. (4) Integrate w.r.t. u. (5) Substitute back to x.
For definite integrals: change the limits when you change variable. Or change back to x and use original limits.
If u^2 = f(x), differentiate implicitly: 2u du = f'(x) dx, so dx = 2u du/f'(x). This avoids messy square roots.
Example: integral of x*sqrt(x+1) dx with u = x+1. Then x = u-1, dx = du. Integral becomes (u-1)*sqrt(u) du = (u^(3/2) - u^(1/2)) du.

INTEGRATION BY PARTS (P4 — detailed)
Formula: integral of u dv = uv - integral of v du. Choose u and dv wisely.
LIATE rule for choosing u (first in list = best choice for u): Logarithmic, Inverse trig, Algebraic, Trig, Exponential.
Example: integral of x*e^x dx. Let u = x (algebraic), dv = e^x dx. Then du = dx, v = e^x. Result: xe^x - e^x + c.
For integral of ln x dx: let u = ln x, dv = dx. Then du = 1/x dx, v = x. Result: x ln x - x + c.
Repeated IBP: if first IBP gives another product to integrate, apply IBP again. Keep tidy — compute second integral separately.
Cyclic IBP: integral of e^x sin x dx. IBP twice returns the original integral. Collect: 2I = e^x(sin x - cos x), so I = e^x(sin x - cos x)/2.

VOLUMES OF REVOLUTION (P4)
About x-axis: V = pi * integral from a to b of y^2 dx.
About y-axis: V = pi * integral from c to d of x^2 dy.
Parametric: V = pi * integral of y^2 (dx/dt) dt. Change limits to parameter values.
Subtract volumes for regions between curves: V = pi * integral of (y_outer^2 - y_inner^2) dx.

INTEGRATION BY SUBSTITUTION (P4 — detailed)
Used when reverse chain rule is not obvious. Substitution is usually given in the exam.
Method: (1) Let u = g(x). (2) Find du/dx, rearrange to get dx = du/g'(x). (3) Replace ALL x terms with u. (4) Integrate w.r.t. u. (5) Substitute back to x.
For definite integrals: change the limits when you change variable. Or change back to x and use original limits.
If u^2 = f(x), differentiate implicitly: 2u du = f'(x) dx, so dx = 2u du/f'(x). This avoids messy square roots.
Example: integral of x*sqrt(x+1) dx with u = x+1. Then x = u-1, dx = du. Integral becomes (u-1)*sqrt(u) du = (u^(3/2) - u^(1/2)) du.

INTEGRATION BY PARTS (P4 — detailed)
Formula: integral of u dv = uv - integral of v du. Choose u and dv wisely.
LIATE rule for choosing u (first in list = best choice for u): Logarithmic, Inverse trig, Algebraic, Trig, Exponential.
Example: integral of x*e^x dx. Let u = x (algebraic), dv = e^x dx. Then du = dx, v = e^x. Result: xe^x - e^x + c.
For integral of ln x dx: let u = ln x, dv = dx. Then du = 1/x dx, v = x. Result: x ln x - x + c.
Repeated IBP: if first IBP gives another product to integrate, apply IBP again. Keep tidy — compute second integral separately.
Cyclic IBP: integral of e^x sin x dx. IBP twice returns the original integral. Collect: 2I = e^x(sin x - cos x), so I = e^x(sin x - cos x)/2.

VOLUMES OF REVOLUTION (P4)
About x-axis: V = pi * integral from a to b of y^2 dx.
About y-axis: V = pi * integral from c to d of x^2 dy.
Parametric: V = pi * integral of y^2 (dx/dt) dt. Change limits to parameter values.
Subtract volumes for regions between curves: V = pi * integral of (y_outer^2 - y_inner^2) dx.

Trapezium rule: integral approx h/2 [y0 + 2(y1 + y2 + ... + y(n-1)) + yn] where h = (b-a)/n.
Always an approximation. Overestimate for concave-up curves, underestimate for concave-down. More strips means better accuracy.

Differential equations:
Separate variables: dy/dx = f(x)g(y) leads to integral of (1/g(y))dy = integral of f(x)dx.
General solution includes + c. Particular solution: use initial conditions to find c.

EXPONENTIALS & LOGARITHMS
Exponential function: y = a^x. Base e: y = e^x (natural exponential). e approx 2.71828.
Special property: d/dx(e^x) = e^x. The function equals its own derivative.
Graphs: e^x always positive, passes through (0,1), increases rapidly. e^(-x) is reflection in y-axis (decay).

Natural logarithm: ln x = log base e of x. Inverse of e^x. Domain: x > 0. ln 1 = 0, ln e = 1.
d/dx(ln x) = 1/x. integral of (1/x) dx = ln|x| + c. d/dx(ln f(x)) = f'(x)/f(x).

Log laws: ln(ab) = ln a + ln b. ln(a/b) = ln a - ln b. ln(a^n) = n ln a. These hold for any base.
Change of base: log_a(b) = ln b / ln a = log b / log a.

Solving exponential equations: a^x = b leads to x = ln b / ln a. Or take ln of both sides.
Solving log equations: combine using log laws, then convert to exponential form.

Exponential growth/decay: N = N0 e^(kt). k > 0: growth. k < 0: decay. Half-life: t_half = ln 2 / |k|.
Modelling: recognise when rate of change is proportional to current value leads to dN/dt = kN leads to N = N0 e^(kt).

VECTORS
Vector notation: column vectors, i-j-k notation, or bold letters.
Position vector: vector from origin to a point. OA = a.
Displacement vector: AB = b - a (final position vector minus initial position vector).

Magnitude: |a| = sqrt(x2 + y2 + z2) for 3D. Unit vector: a-hat = a/|a|.
Addition: tip-to-tail. Subtraction: a - b = a + (-b). Scalar multiplication: ka scales magnitude by |k|.
Parallel vectors: a = kb for some scalar k.

Scalar (dot) product: a dot b = |a||b|cos t = x1x2 + y1y2 + z1z2.
If a dot b = 0, vectors are perpendicular. If a dot b > 0, angle is acute. If a dot b < 0, angle is obtuse.
Finding angle: cos t = (a dot b)/(|a||b|).

Vector equation of a line: r = a + td, where a = position vector of known point, d = direction vector, t = parameter.
Parallel lines: same direction vector (or scalar multiple). Intersection: set equal, solve for parameters, check consistency.

PROOF
Proof by deduction: logical argument from known facts to conclusion.
Proof by exhaustion: check all possible cases.
Proof by contradiction: assume the opposite is true, derive a contradiction, therefore original statement is true.
Disproof by counter-example: find ONE example where the statement fails.
Common proofs to know: sqrt(2) is irrational, there are infinitely many primes.

STATISTICS 1 (S1 / WST01 — Applied Maths)

DATA REPRESENTATION
Variables: qualitative (non-numerical) vs quantitative (numerical). Continuous (any value in range) vs discrete (specific values only).
Frequency distributions: frequency tables, cumulative frequency. Grouped data: class boundaries, class widths.
Histograms: frequency density = frequency / class width. Area of bar = frequency. Unequal class widths common.
Cumulative frequency curves: plot upper class boundary vs cumulative frequency. Use to estimate median, quartiles, percentiles.
Stem and leaf diagrams: ordered digits as leaves. Back-to-back for comparing distributions. Always include a key.
Box plots: show min, Q1, median, Q3, max. Outliers: values beyond Q1 - 1.5*IQR or Q3 + 1.5*IQR.
Skewness: positive skew (mean > median > mode, tail to right), negative skew (mean < median < mode, tail to left), symmetric (mean = median = mode).

MEASURES OF LOCATION AND SPREAD
Mean: x_bar = sum(x)/n or sum(fx)/sum(f). Affected by outliers.
Median: middle value when ordered. Q2. Not affected by outliers.
Mode: most frequent value. Can have no mode or multiple modes.
Range: max - min. Interquartile range: IQR = Q3 - Q1. Measures spread of middle 50%.
Variance: Var = sum(x^2)/n - (mean)^2 = Sxx/n. Standard deviation: s = sqrt(variance).
Coding: if y = (x-a)/b then y_bar = (x_bar - a)/b and s_y = s_x / |b|. Use to simplify calculations.

PROBABILITY
P(A) = n(A)/n(S) for equally likely outcomes. 0 <= P(A) <= 1. P(not A) = 1 - P(A).
Addition rule: P(A or B) = P(A) + P(B) - P(A and B). For mutually exclusive: P(A and B) = 0.
Conditional probability: P(A|B) = P(A and B)/P(B). Independent events: P(A|B) = P(A), so P(A and B) = P(A)*P(B).
Tree diagrams: multiply along branches, add between branches. Always check probabilities sum to 1.
Venn diagrams: useful for visualising unions, intersections, complements.

CORRELATION AND REGRESSION
Scatter diagrams: plot bivariate data. Identify positive, negative, or no correlation.
Product moment correlation coefficient (PMCC): r = Sxy / sqrt(Sxx * Syy). -1 <= r <= 1.
Sxx = sum(x^2) - n*(x_bar)^2. Syy = sum(y^2) - n*(y_bar)^2. Sxy = sum(xy) - n*(x_bar)*(y_bar).
r near +1: strong positive linear correlation. r near -1: strong negative. r near 0: weak/no linear correlation.
Regression line: y = a + bx where b = Sxy/Sxx and a = y_bar - b*x_bar.
Only interpolate (predict within data range). Extrapolation (outside range) is unreliable.
Explanatory variable (x): independent. Response variable (y): dependent.

DISCRETE RANDOM VARIABLES
Probability distribution: table of values and probabilities. Sum of all P(X=x) = 1.
Expected value: E(X) = sum(x * P(X=x)). This is the theoretical mean.
Variance: Var(X) = E(X^2) - [E(X)]^2 where E(X^2) = sum(x^2 * P(X=x)).
E(aX + b) = aE(X) + b. Var(aX + b) = a^2 Var(X).
Discrete uniform distribution: each value equally likely. If X takes values 1,2,...,n then E(X) = (n+1)/2.

NORMAL DISTRIBUTION
Notation: X ~ N(mu, sigma^2). mu = mean, sigma = standard deviation, sigma^2 = variance.
Standard normal: Z ~ N(0, 1). Standardise: Z = (X - mu)/sigma.
P(X < a) = P(Z < (a - mu)/sigma). Use tables or calculator for P(Z < z).
Symmetry: P(Z > z) = P(Z < -z) = 1 - P(Z < z).
Finding mu or sigma: set up equation using Z = (X - mu)/sigma and solve.

MECHANICS 1 (M1 / WME01 — Applied Maths)

MODELLING ASSUMPTIONS
Particle: object with mass but no size. Rigid body: fixed shape, does not deform.
Light: has no mass (light string, light pulley). Smooth: no friction. Rough: friction acts.
Inextensible: string does not stretch (connected particles have same acceleration).
Uniform: constant density (centre of mass at geometric centre).
Bead: particle with a hole, can slide on wire/string. Peg: fixed point, string can slide over it.
Rod: rigid, does not bend. Lamina: flat 2D object, negligible thickness.

KINEMATICS (SUVAT)
s = displacement, u = initial velocity, v = final velocity, a = acceleration, t = time.
v = u + at. s = ut + (1/2)at^2. v^2 = u^2 + 2as. s = (1/2)(u+v)t.
Units must be consistent. Convert km/h to m/s: divide by 3.6.
Vertical motion: a = g = 9.8 m/s^2 downwards. State positive direction.
At highest point: v = 0 (momentarily at rest). Time up = time down (if returning to same height).
Velocity-time graphs: gradient = acceleration. Area under graph = displacement. Negative area = displacement in opposite direction.
Displacement-time graphs: gradient = velocity.

FORCES AND NEWTON'S LAWS
Weight: W = mg (downwards). Normal reaction: R perpendicular to surface. Tension: T along string.
Newton 1: if resultant force = 0 then object is in equilibrium (stationary or constant velocity).
Newton 2: F = ma. Resultant force = mass x acceleration. Always resolve in direction of motion.
Newton 3: action and reaction are equal and opposite (on DIFFERENT objects, same type of force).
Connected particles: use F = ma for each particle separately or for the whole system.
Pulleys: if smooth, tension is same on both sides. Heavier side accelerates down.
Resolving forces on a slope: component along slope = mg sin(theta), component perpendicular = mg cos(theta).

FRICTION
F <= mu*R (friction force <= coefficient of friction x normal reaction).
At the point of sliding (limiting equilibrium): F = mu*R.
Friction opposes motion (or the tendency to move). Direction: opposite to motion.
On a rough slope: if on the point of sliding down, friction acts up the slope. F = mu*R = mu*mg*cos(theta).

MOMENTUM AND IMPULSE
Momentum: p = mv (kg m/s). Vector quantity (has direction).
Conservation of momentum: total momentum before = total momentum after (in a closed system, no external forces).
m1*u1 + m2*u2 = m1*v1 + m2*v2. Careful with signs (direction matters).
Impulse: I = F*t = change in momentum = mv - mu. Units: Ns.
Elastic collision: kinetic energy conserved. Inelastic: KE not conserved (some lost to heat/sound/deformation).
Coefficient of restitution: e = (separation speed)/(approach speed). 0 <= e <= 1. e = 1 perfectly elastic, e = 0 perfectly inelastic.

MOMENTS
Moment of a force = force x perpendicular distance from pivot. Units: Nm.
Clockwise vs anticlockwise moments. For equilibrium: sum of clockwise moments = sum of anticlockwise moments.
Couple: two equal, opposite, parallel forces. Torque = one force x distance between them.
Uniform rod: weight acts at centre (midpoint). Non-uniform: weight acts at centre of mass.
Tilting problems: reaction at the point about to lift off = 0.

AP CALCULUS AB (College Board)
OpenStax reference: Calculus Volumes 1-2 at openstax.org/books/calculus-volume-1

UNIT 1 — LIMITS AND CONTINUITY
Limit definition: lim(x->a) f(x) = L means f(x) approaches L as x approaches a.
One-sided limits: lim(x->a+) and lim(x->a-). Limit exists only if both sides agree.
Limit laws: sum, difference, product, quotient, power rules. lim(x->a)[f(x)+g(x)] = lim f + lim g.
Squeeze theorem: if g(x) <= f(x) <= h(x) and lim g = lim h = L, then lim f = L.
Key limits: lim(x->0) sin(x)/x = 1. lim(x->0) (1-cos(x))/x = 0. lim(x->inf) (1+1/n)^n = e.
Continuity: f is continuous at a if (1) f(a) exists, (2) lim(x->a) f(x) exists, (3) lim(x->a) f(x) = f(a).
Types of discontinuity: removable (hole), jump, infinite (asymptote).
Intermediate Value Theorem (IVT): if f is continuous on [a,b] and k is between f(a) and f(b), then there exists c in (a,b) with f(c) = k.
Horizontal asymptotes: lim(x->inf) f(x) = L. Vertical asymptotes: lim(x->a) f(x) = infinity.

UNIT 2 — DIFFERENTIATION: DEFINITION AND FUNDAMENTAL PROPERTIES
Definition: f'(x) = lim(h->0) [f(x+h) - f(x)] / h. Derivative at a point: f'(a) = lim(x->a) [f(x)-f(a)]/(x-a).
Differentiability implies continuity (but not vice versa). Not differentiable at corners, cusps, vertical tangents, discontinuities.
Basic rules: d/dx(c) = 0. d/dx(x^n) = nx^(n-1). d/dx(e^x) = e^x. d/dx(ln x) = 1/x.
d/dx(sin x) = cos x. d/dx(cos x) = -sin x. d/dx(tan x) = sec^2 x.
Sum/difference rule: d/dx[f+g] = f'+g'. Constant multiple: d/dx[cf] = cf'.

UNIT 3 — DIFFERENTIATION: COMPOSITE, IMPLICIT, AND INVERSE FUNCTIONS
Chain rule: d/dx[f(g(x))] = f'(g(x)) * g'(x). "Derivative of outer times derivative of inner."
Implicit differentiation: differentiate both sides w.r.t. x, collect dy/dx terms, solve.
Inverse function derivative: if g = f^(-1), then g'(x) = 1/f'(g(x)).
d/dx(a^x) = a^x ln(a). d/dx(log_a(x)) = 1/(x ln a).
Higher-order derivatives: f''(x), f'''(x). Velocity = s'(t), acceleration = v'(t) = s''(t).

UNIT 4 — CONTEXTUAL APPLICATIONS OF DIFFERENTIATION
Related rates: identify variables, write equation relating them, differentiate w.r.t. time, substitute known values.
Linear approximation: f(a+h) approx f(a) + f'(a)*h. Tangent line approximation.
L'Hopital's Rule: if lim f(x)/g(x) gives 0/0 or inf/inf, then lim f(x)/g(x) = lim f'(x)/g'(x).
Motion: position s(t), velocity v(t) = s'(t), acceleration a(t) = v'(t). Speed = |v(t)|.
Particle changes direction when v(t) changes sign. Total distance = integral of |v(t)|.

UNIT 5 — ANALYTICAL APPLICATIONS OF DIFFERENTIATION
Mean Value Theorem (MVT): if f continuous on [a,b] and differentiable on (a,b), then there exists c with f'(c) = [f(b)-f(a)]/(b-a).
Extreme Value Theorem: continuous function on closed interval has absolute max and min.
Critical points: where f'(x) = 0 or f'(x) undefined. Candidates for extrema.
First derivative test: f' changes + to - means local max; - to + means local min.
Second derivative test: f'(c)=0 and f''(c)>0 means local min; f''(c)<0 means local max.
Concavity: f''>0 concave up, f''<0 concave down. Inflection point where concavity changes.
Optimization: find critical points, test endpoints, determine absolute max/min.
Curve sketching: domain, intercepts, symmetry, asymptotes, intervals of increase/decrease, concavity, inflection points.

UNIT 6 — INTEGRATION AND ACCUMULATION OF CHANGE
Riemann sums: left, right, midpoint, trapezoidal approximations. n subintervals of width dx = (b-a)/n.
Definite integral: integral from a to b of f(x)dx = lim(n->inf) of Riemann sum. Net signed area.
Fundamental Theorem of Calculus Part 1: if F(x) = integral from a to x of f(t)dt, then F'(x) = f(x).
Fundamental Theorem Part 2: integral from a to b of f(x)dx = F(b) - F(a) where F' = f.
Properties: integral of [f+g] = integral f + integral g. integral from a to a = 0. integral from a to b = -integral from b to a.
Basic antiderivatives: integral of x^n = x^(n+1)/(n+1) + C. integral of 1/x = ln|x| + C. integral of e^x = e^x + C.
integral of sin x = -cos x + C. integral of cos x = sin x + C. integral of sec^2 x = tan x + C.
U-substitution: integral of f(g(x))*g'(x)dx. Let u = g(x), du = g'(x)dx.

UNIT 7 — DIFFERENTIAL EQUATIONS
Separable DEs: dy/dx = f(x)g(y). Separate: (1/g(y))dy = f(x)dx. Integrate both sides.
General solution includes +C. Particular solution: use initial condition to find C.
Slope fields: visual representation of dy/dx at grid of points. Solution curves follow the field.
Exponential growth/decay: dy/dt = ky gives y = y_0 * e^(kt). k>0 growth, k<0 decay.

UNIT 8 — APPLICATIONS OF INTEGRATION
Average value: f_avg = (1/(b-a)) * integral from a to b of f(x)dx.
Area between curves: integral from a to b of [f(x) - g(x)]dx where f(x) >= g(x).
Volume by discs: V = pi * integral of [R(x)]^2 dx (rotation about x-axis).
Volume by washers: V = pi * integral of [R(x)^2 - r(x)^2] dx (hollow solid).
Volume by cross-sections: V = integral of A(x)dx where A(x) is known cross-section area (squares, semicircles, equilateral triangles, etc.).

AP CALCULUS BC — ADDITIONAL TOPICS (beyond AB)

UNIT 9 — PARAMETRIC EQUATIONS, POLAR COORDINATES, AND VECTOR-VALUED FUNCTIONS
Parametric: x = f(t), y = g(t). dy/dx = (dy/dt)/(dx/dt). d2y/dx2 = d/dt(dy/dx) / (dx/dt).
Arc length (parametric): L = integral of sqrt[(dx/dt)^2 + (dy/dt)^2] dt.
Polar coordinates: x = r cos(theta), y = r sin(theta). r = f(theta).
Area in polar: A = (1/2) integral of r^2 d(theta).
Vector-valued functions: r(t) = <x(t), y(t)>. Velocity = r'(t). Speed = |r'(t)|. Acceleration = r''(t).

UNIT 10 — INFINITE SEQUENCES AND SERIES
Sequences: {a_n}. Convergent if lim(n->inf) a_n = L exists and is finite.
Series: sum of a_n from n=1 to infinity. Partial sums S_n = a_1 + a_2 + ... + a_n. Converges if lim S_n exists.
Geometric series: sum of ar^n. Converges if |r| < 1, sum = a/(1-r).
Divergence test: if lim a_n is not 0, series diverges. (Converse NOT true.)
Integral test: if f is positive, decreasing, continuous, then sum a_n and integral of f(x) both converge or both diverge.
p-series: sum of 1/n^p. Converges if p > 1, diverges if p <= 1. Harmonic series (p=1) diverges.
Comparison test: compare with known convergent/divergent series.
Limit comparison test: if lim(a_n/b_n) = c > 0, then both converge or both diverge.
Alternating series test: if |a_n| decreasing and lim a_n = 0, then alternating series converges.
Ratio test: lim |a_(n+1)/a_n| = L. L<1 converges absolutely, L>1 diverges, L=1 inconclusive.
Root test: lim |a_n|^(1/n) = L. Same criteria as ratio test.
Absolute vs conditional convergence.
Taylor series: f(x) = sum of f^(n)(a)/n! * (x-a)^n. Maclaurin series: Taylor at a = 0.
Key Maclaurin series: e^x = sum x^n/n!. sin x = sum (-1)^n x^(2n+1)/(2n+1)!. cos x = sum (-1)^n x^(2n)/(2n)!.
1/(1-x) = sum x^n for |x| < 1. ln(1+x) = sum (-1)^(n+1) x^n/n for |x| <= 1.
Radius and interval of convergence: use ratio test. Check endpoints separately.
Taylor polynomial error bound (Lagrange): |R_n(x)| <= M|x-a|^(n+1)/(n+1)! where M = max|f^(n+1)| on interval.
Alternating series error bound: |error| <= |first omitted term|.
Power series operations: differentiate and integrate term by term within interval of convergence.

AP EXAM FORMAT
Section I: Multiple Choice (45 questions, 105 minutes). Part A: no calculator. Part B: calculator allowed.
Section II: Free Response (6 questions, 90 minutes). Part A: calculator allowed. Part B: no calculator.
Scoring: MC worth 50%, FRQ worth 50%. Each FRQ usually worth 9 points.
Show all work on FRQs. Justify answers with theorems by name (IVT, MVT, FTC, etc.).
Calculator skills needed: graph functions, solve equations, numerical derivatives, definite integrals.

AP CALCULUS AB (College Board)
OpenStax reference: Calculus Volumes 1-2 at openstax.org/books/calculus-volume-1

UNIT 1 — LIMITS AND CONTINUITY
Limit definition: lim(x->a) f(x) = L means f(x) approaches L as x approaches a.
One-sided limits: lim(x->a+) and lim(x->a-). Limit exists only if both sides agree.
Limit laws: sum, difference, product, quotient, power rules. lim(x->a)[f(x)+g(x)] = lim f + lim g.
Squeeze theorem: if g(x) <= f(x) <= h(x) and lim g = lim h = L, then lim f = L.
Key limits: lim(x->0) sin(x)/x = 1. lim(x->0) (1-cos(x))/x = 0. lim(x->inf) (1+1/n)^n = e.
Continuity: f is continuous at a if (1) f(a) exists, (2) lim(x->a) f(x) exists, (3) lim(x->a) f(x) = f(a).
Types of discontinuity: removable (hole), jump, infinite (asymptote).
Intermediate Value Theorem (IVT): if f is continuous on [a,b] and k is between f(a) and f(b), then there exists c in (a,b) with f(c) = k.
Horizontal asymptotes: lim(x->inf) f(x) = L. Vertical asymptotes: lim(x->a) f(x) = infinity.

UNIT 2 — DIFFERENTIATION: DEFINITION AND FUNDAMENTAL PROPERTIES
Definition: f'(x) = lim(h->0) [f(x+h) - f(x)] / h. Derivative at a point: f'(a) = lim(x->a) [f(x)-f(a)]/(x-a).
Differentiability implies continuity (but not vice versa). Not differentiable at corners, cusps, vertical tangents, discontinuities.
Basic rules: d/dx(c) = 0. d/dx(x^n) = nx^(n-1). d/dx(e^x) = e^x. d/dx(ln x) = 1/x.
d/dx(sin x) = cos x. d/dx(cos x) = -sin x. d/dx(tan x) = sec^2 x.
Sum/difference rule: d/dx[f+g] = f'+g'. Constant multiple: d/dx[cf] = cf'.

UNIT 3 — DIFFERENTIATION: COMPOSITE, IMPLICIT, AND INVERSE FUNCTIONS
Chain rule: d/dx[f(g(x))] = f'(g(x)) * g'(x). "Derivative of outer times derivative of inner."
Implicit differentiation: differentiate both sides w.r.t. x, collect dy/dx terms, solve.
Inverse function derivative: if g = f^(-1), then g'(x) = 1/f'(g(x)).
d/dx(a^x) = a^x ln(a). d/dx(log_a(x)) = 1/(x ln a).
Higher-order derivatives: f''(x), f'''(x). Velocity = s'(t), acceleration = v'(t) = s''(t).

UNIT 4 — CONTEXTUAL APPLICATIONS OF DIFFERENTIATION
Related rates: identify variables, write equation relating them, differentiate w.r.t. time, substitute known values.
Linear approximation: f(a+h) approx f(a) + f'(a)*h. Tangent line approximation.
L'Hopital's Rule: if lim f(x)/g(x) gives 0/0 or inf/inf, then lim f(x)/g(x) = lim f'(x)/g'(x).
Motion: position s(t), velocity v(t) = s'(t), acceleration a(t) = v'(t). Speed = |v(t)|.
Particle changes direction when v(t) changes sign. Total distance = integral of |v(t)|.

UNIT 5 — ANALYTICAL APPLICATIONS OF DIFFERENTIATION
Mean Value Theorem (MVT): if f continuous on [a,b] and differentiable on (a,b), then there exists c with f'(c) = [f(b)-f(a)]/(b-a).
Extreme Value Theorem: continuous function on closed interval has absolute max and min.
Critical points: where f'(x) = 0 or f'(x) undefined. Candidates for extrema.
First derivative test: f' changes + to - means local max; - to + means local min.
Second derivative test: f'(c)=0 and f''(c)>0 means local min; f''(c)<0 means local max.
Concavity: f''>0 concave up, f''<0 concave down. Inflection point where concavity changes.
Optimization: find critical points, test endpoints, determine absolute max/min.
Curve sketching: domain, intercepts, symmetry, asymptotes, intervals of increase/decrease, concavity, inflection points.

UNIT 6 — INTEGRATION AND ACCUMULATION OF CHANGE
Riemann sums: left, right, midpoint, trapezoidal approximations. n subintervals of width dx = (b-a)/n.
Definite integral: integral from a to b of f(x)dx = lim(n->inf) of Riemann sum. Net signed area.
Fundamental Theorem of Calculus Part 1: if F(x) = integral from a to x of f(t)dt, then F'(x) = f(x).
Fundamental Theorem Part 2: integral from a to b of f(x)dx = F(b) - F(a) where F' = f.
Properties: integral of [f+g] = integral f + integral g. integral from a to a = 0. integral from a to b = -integral from b to a.
Basic antiderivatives: integral of x^n = x^(n+1)/(n+1) + C. integral of 1/x = ln|x| + C. integral of e^x = e^x + C.
integral of sin x = -cos x + C. integral of cos x = sin x + C. integral of sec^2 x = tan x + C.
U-substitution: integral of f(g(x))*g'(x)dx. Let u = g(x), du = g'(x)dx.

UNIT 7 — DIFFERENTIAL EQUATIONS
Separable DEs: dy/dx = f(x)g(y). Separate: (1/g(y))dy = f(x)dx. Integrate both sides.
General solution includes +C. Particular solution: use initial condition to find C.
Slope fields: visual representation of dy/dx at grid of points. Solution curves follow the field.
Exponential growth/decay: dy/dt = ky gives y = y_0 * e^(kt). k>0 growth, k<0 decay.

UNIT 8 — APPLICATIONS OF INTEGRATION
Average value: f_avg = (1/(b-a)) * integral from a to b of f(x)dx.
Area between curves: integral from a to b of [f(x) - g(x)]dx where f(x) >= g(x).
Volume by discs: V = pi * integral of [R(x)]^2 dx (rotation about x-axis).
Volume by washers: V = pi * integral of [R(x)^2 - r(x)^2] dx (hollow solid).
Volume by cross-sections: V = integral of A(x)dx where A(x) is known cross-section area (squares, semicircles, equilateral triangles, etc.).

AP CALCULUS BC — ADDITIONAL TOPICS (beyond AB)

UNIT 9 — PARAMETRIC EQUATIONS, POLAR COORDINATES, AND VECTOR-VALUED FUNCTIONS
Parametric: x = f(t), y = g(t). dy/dx = (dy/dt)/(dx/dt). d2y/dx2 = d/dt(dy/dx) / (dx/dt).
Arc length (parametric): L = integral of sqrt[(dx/dt)^2 + (dy/dt)^2] dt.
Polar coordinates: x = r cos(theta), y = r sin(theta). r = f(theta).
Area in polar: A = (1/2) integral of r^2 d(theta).
Vector-valued functions: r(t) = <x(t), y(t)>. Velocity = r'(t). Speed = |r'(t)|. Acceleration = r''(t).

UNIT 10 — INFINITE SEQUENCES AND SERIES
Sequences: {a_n}. Convergent if lim(n->inf) a_n = L exists and is finite.
Series: sum of a_n from n=1 to infinity. Partial sums S_n = a_1 + a_2 + ... + a_n. Converges if lim S_n exists.
Geometric series: sum of ar^n. Converges if |r| < 1, sum = a/(1-r).
Divergence test: if lim a_n is not 0, series diverges. (Converse NOT true.)
Integral test: if f is positive, decreasing, continuous, then sum a_n and integral of f(x) both converge or both diverge.
p-series: sum of 1/n^p. Converges if p > 1, diverges if p <= 1. Harmonic series (p=1) diverges.
Comparison test: compare with known convergent/divergent series.
Limit comparison test: if lim(a_n/b_n) = c > 0, then both converge or both diverge.
Alternating series test: if |a_n| decreasing and lim a_n = 0, then alternating series converges.
Ratio test: lim |a_(n+1)/a_n| = L. L<1 converges absolutely, L>1 diverges, L=1 inconclusive.
Root test: lim |a_n|^(1/n) = L. Same criteria as ratio test.
Absolute vs conditional convergence.
Taylor series: f(x) = sum of f^(n)(a)/n! * (x-a)^n. Maclaurin series: Taylor at a = 0.
Key Maclaurin series: e^x = sum x^n/n!. sin x = sum (-1)^n x^(2n+1)/(2n+1)!. cos x = sum (-1)^n x^(2n)/(2n)!.
1/(1-x) = sum x^n for |x| < 1. ln(1+x) = sum (-1)^(n+1) x^n/n for |x| <= 1.
Radius and interval of convergence: use ratio test. Check endpoints separately.
Taylor polynomial error bound (Lagrange): |R_n(x)| <= M|x-a|^(n+1)/(n+1)! where M = max|f^(n+1)| on interval.
Alternating series error bound: |error| <= |first omitted term|.
Power series operations: differentiate and integrate term by term within interval of convergence.

AP EXAM FORMAT
Section I: Multiple Choice (45 questions, 105 minutes). Part A: no calculator. Part B: calculator allowed.
Section II: Free Response (6 questions, 90 minutes). Part A: calculator allowed. Part B: no calculator.
Scoring: MC worth 50%, FRQ worth 50%. Each FRQ usually worth 9 points.
Show all work on FRQs. Justify answers with theorems by name (IVT, MVT, FTC, etc.).
Calculator skills needed: graph functions, solve equations, numerical derivatives, definite integrals.

FREE RESOURCES — when students want to read further, direct them to these:
- OpenStax Algebra & Trig 2e: openstax.org/books/algebra-and-trigonometry-2e — functions, trig, sequences, vectors
- OpenStax Calculus Vol 1: openstax.org/books/calculus-volume-1 — differentiation rules, chain/product/quotient, integration
- OpenStax Calculus Vol 2: openstax.org/books/calculus-volume-2 — integration by parts, partial fractions, differential equations, parametric equations
- LibreTexts Maths: math.libretexts.org — searchable, detailed notes
- GeoGebra: geogebra.org — interactive graphing calculator for visualising functions, transformations, calculus
- Khan Academy: khanacademy.org/math — video explanations for algebra, trig, calculus
- Wolfram MathWorld: mathworld.wolfram.com — comprehensive maths reference
Say: "For more detail, see [resource] — it's free at [URL]." Do not reproduce content from these sources.

FREE RESOURCES — when students want to read further, direct them to these:
- OpenStax Algebra & Trig 2e: openstax.org/books/algebra-and-trigonometry-2e — functions, trig, sequences, vectors
- OpenStax Calculus Vol 1: openstax.org/books/calculus-volume-1 — differentiation rules, chain/product/quotient, integration
- OpenStax Calculus Vol 2: openstax.org/books/calculus-volume-2 — integration by parts, partial fractions, differential equations, parametric equations
- LibreTexts Maths: math.libretexts.org — searchable, detailed notes
- GeoGebra: geogebra.org — interactive graphing calculator for visualising functions, transformations, calculus
- Khan Academy: khanacademy.org/math — video explanations for algebra, trig, calculus
- Wolfram MathWorld: mathworld.wolfram.com — comprehensive maths reference
Say: "For more detail, see [resource] — it's free at [URL]." Do not reproduce content from these sources.

Focus on Edexcel IAL Pure Maths content (WMA11/WMA12). Use [EQUATION:...] tags for key formulae on their own line. Show all working step by step.

═══ P3 / P4 CONTENT (Edexcel IAL A2) ═══

PROOF BY INDUCTION (P4):
Method: (1) Base case: show true for n=1. (2) Assumption: assume true for n=k. (3) Inductive step: show true for n=k+1. (4) Conclusion: by induction, true for all n∈ℤ+.
Summation example: prove Σr = n(n+1)/2.
Base: n=1, LHS=1, RHS=1(2)/2=1. True.
Assume: Σ(r=1 to k) r = k(k+1)/2.
Step: Σ(r=1 to k+1) r = k(k+1)/2 + (k+1) = (k+1)(k+2)/2. True for n=k+1.
Conclusion: true for all n∈ℤ+.
Matrix induction: same structure but multiply Mk+1 = Mk x M.
Divisibility: show f(k+1) - f(k) is divisible by n, or express f(k+1) in terms of f(k) and a multiple of n.

COMPLEX NUMBERS (P3/P4):
Cartesian form: z = a + bi where i² = -1. Re(z) = a, Im(z) = b.
Modulus: |z| = √(a²+b²). Argument: arg(z) = arctan(b/a) (careful about quadrant, use -π < θ ≤ π).
Modulus-argument form: z = r(cosθ + isinθ) = rcisθ.
Exponential form (Euler): z = re^(iθ). Euler's identity: e^(iπ) + 1 = 0.

ARITHMETIC: 
Addition/subtraction: (a+bi) ± (c+di) = (a±c) + (b±d)i
Multiplication: (a+bi)(c+di) = ac + adi + bci + bdi² = (ac-bd) + (ad+bc)i
Division: multiply top AND bottom by complex conjugate z* = a-bi.
z x z* = a² + b² (always real). z/w = zw*/|w|².

DE MOIVRE'S THEOREM: (r(cosθ + isinθ))^n = r^n(cosnθ + isinnθ).
Uses: (1) Power of complex number. (2) Multiple angle formulae. (3) nth roots of unity.
nth roots: z^n = w has n solutions, equally spaced at 2π/n on circle of radius |w|^(1/n).
Cube roots of unity: ω = e^(2πi/3), ω² = e^(4πi/3), 1 + ω + ω² = 0.

LOCI IN ARGAND DIAGRAM:
|z - a| = r: circle centre a, radius r.
|z - a| = |z - b|: perpendicular bisector of segment from a to b.
arg(z - a) = θ: half-line from a at angle θ (not including a).
|z - a| ≤ r: interior (and boundary) of circle.
Re(z) > k, Im(z) < k: half-planes.

FURTHER COMPLEX NUMBERS — Multiple angle formulae via De Moivre:
Example: express cos3θ in terms of cosθ.
(cosθ + isinθ)³ = cos3θ + isin3θ (De Moivre)
Expand LHS: cos³θ + 3cos²θ(isinθ) + 3cosθ(i²sin²θ) + i³sin³θ
= cos³θ - 3cosθsin²θ + i(3cos²θsinθ - sin³θ)
Equate real parts: cos3θ = cos³θ - 3cosθsin²θ = 4cos³θ - 3cosθ (using sin²θ = 1 - cos²θ)

FURTHER CALCULUS (P3/P4):
INTEGRATION BY PARTS: ∫u dv = uv - ∫v du. Choose u to simplify when differentiated (ILATE: Inverse, Log, Algebraic, Trig, Exponential).
Example: ∫x e^x dx. u=x, dv=e^x dx. du=dx, v=e^x. = xe^x - ∫e^x dx = xe^x - e^x + C = e^x(x-1) + C.
Tabular method for repeated: ∫x³e^x dx — differentiate x³ column down, integrate e^x column down, alternate signs.
∫ln x dx: by parts with u=ln x, dv=dx. = x ln x - x + C.

INTEGRATION BY SUBSTITUTION (reverse chain rule):
Standard: ∫f(g(x))g'(x)dx — substitute u=g(x), du=g'(x)dx.
Trigonometric substitution: ∫√(a²-x²)dx: use x=asinθ. ∫1/(a²+x²)dx = (1/a)arctan(x/a)+C.
Example: ∫x√(x²+1)dx. Let u=x²+1, du=2x dx. = ½∫√u du = ½(⅔u^(3/2)) + C = ⅓(x²+1)^(3/2) + C.

PARTIAL FRACTIONS (review + harder cases):
Linear distinct: A/(x+1) + B/(x-2).
Repeated linear: A/(x+1) + B/(x+1)² + C/(x-2).
Irreducible quadratic: A/(x+1) + (Bx+C)/(x²+4).
Improper: degree(numerator) ≥ degree(denominator) → polynomial long division first.
Then integrate term by term: ∫A/(x+a)dx = A ln|x+a|, ∫(Bx+C)/(x²+d)dx splits into arctan + ln.

DIFFERENTIAL EQUATIONS:
Separable: dy/dx = f(x)g(y) → ∫1/g(y)dy = ∫f(x)dx.
Example: dy/dx = xy. Separate: dy/y = x dx. Integrate: ln|y| = x²/2 + C. So y = Ae^(x²/2).
First order linear: dy/dx + P(x)y = Q(x). Multiply by integrating factor IF = e^(∫P dx).
d/dx(y·IF) = Q·IF. Integrate both sides.
Example: dy/dx + 2y/x = x². IF = e^(∫2/x dx) = e^(2ln x) = x².
d/dx(x²y) = x⁴. x²y = x⁵/5 + C. y = x³/5 + C/x².

Second order: ay'' + by' + cy = f(x).
Homogeneous (f(x)=0): auxiliary equation aλ² + bλ + c = 0.
Case 1: two real roots λ₁, λ₂: y = Ae^(λ₁x) + Be^(λ₂x).
Case 2: repeated root λ: y = (A + Bx)e^(λx).
Case 3: complex roots α ± βi: y = e^(αx)(A cosβx + B sinβx).
Particular integral: guess form based on f(x). Constant f → PI=k. Linear → PI=ax+b. Quadratic → PI=ax²+bx+c. Exponential e^(kx) → PI=ae^(kx) (unless clashes, then use axe^(kx)). Trig → PI=a cosωx + b sinωx.
General solution = CF + PI. Apply boundary conditions to find A, B.

VECTORS (P3/P4):
3D vectors: a = ai + bj + ck. |a| = √(a²+b²+c²). Unit vector: â = a/|a|.
Scalar (dot) product: a·b = a₁b₁ + a₂b₂ + a₃b₃ = |a||b|cosθ. Perpendicular ↔ a·b = 0.
Vector (cross) product: a × b = |i  j  k; a₁ a₂ a₃; b₁ b₂ b₃|. Magnitude = |a||b|sinθ = area of parallelogram.
a × b = -b × a. a × a = 0. Parallel ↔ a × b = 0.

LINES IN 3D:
Vector equation: r = a + λd (a = point on line, d = direction vector).
Parametric: x = a₁+λd₁, y = a₂+λd₂, z = a₃+λd₃.
Cartesian: (x-a₁)/d₁ = (y-a₂)/d₂ = (z-a₃)/d₃.
Distance from point P to line: |AP × d|/|d| where A is any point on line.
Distance between skew lines: |(b-a)·(d₁×d₂)|/|d₁×d₂|.
Intersection: set parametric equations equal, solve for λ and μ, verify consistency.
Angle between lines: cosθ = |d₁·d₂|/(|d₁||d₂|).

PLANES:
Equation: n·r = n·a, or n₁x + n₂y + n₃z = d (n = normal vector).
Find normal: cross product of two vectors in the plane.
Distance from point to plane: |n·p - d|/|n|.
Line-plane intersection: substitute line into plane equation, solve for λ.
Angle between plane and line: sinθ = |n·d|/(|n||d|) (complement of angle with normal).
Angle between two planes: cosθ = |n₁·n₂|/(|n₁||n₂|).

MACLAURIN & TAYLOR SERIES (P4):
Maclaurin: f(x) = f(0) + f'(0)x + f''(0)x²/2! + f'''(0)x³/3! + ...
Standard series (memorise these):
e^x = 1 + x + x²/2! + x³/3! + ... (all x)
sin x = x - x³/3! + x⁵/5! - ... (all x)
cos x = 1 - x²/2! + x⁴/4! - ... (all x)
ln(1+x) = x - x²/2 + x³/3 - x⁴/4 + ... (-1 < x ≤ 1)
(1+x)^n = 1 + nx + n(n-1)x²/2! + ... (|x| < 1 for non-integer n)
Taylor series: f(x) = f(a) + f'(a)(x-a) + f''(a)(x-a)²/2! + ... (expansion about x=a)
Uses: approximations, limits (l'Hopital alternative), solving ODEs.

POLAR COORDINATES (P4):
Conversion: x = rcosθ, y = rsinθ. r = √(x²+y²), θ = arctan(y/x).
Area enclosed: A = ½∫r² dθ (between limits θ₁ and θ₂).
Common curves: r = a (circle), r = aθ (Archimedean spiral), r = a(1+cosθ) (cardioid), r = acos(nθ) (rose).
Area between curves: A = ½∫(r₁² - r₂²)dθ.

HYPERBOLIC FUNCTIONS (P4):
sinh x = (e^x - e^(-x))/2. cosh x = (e^x + e^(-x))/2. tanh x = sinh x/cosh x.
Key identity: cosh²x - sinh²x = 1 (note: PLUS on left, MINUS=1, not like trig).
Derivatives: d/dx(sinh x) = cosh x. d/dx(cosh x) = sinh x. d/dx(tanh x) = sech²x.
Inverse: arcsinh x = ln(x + √(x²+1)). arccosh x = ln(x + √(x²-1)) (x≥1). arctanh x = ½ln((1+x)/(1-x)) (|x|<1).
Integration: ∫cosh x dx = sinh x + C. ∫sinh x dx = cosh x + C. ∫1/√(x²+a²)dx = arcsinh(x/a) + C.

═══ FURTHER PURE MATHEMATICS (FP1/FP2/FP3) ═══

MATRICES (FP1):
Order m×n: m rows, n columns. Multiplication: (m×n)(n×p) = (m×p). Not commutative: AB ≠ BA in general.
Element (i,j) of AB = row i of A · column j of B (dot product).
Identity matrix I: AI = IA = A. Zero matrix 0: A0 = 0A = 0.
Determinant 2×2: det(a b; c d) = ad - bc. 3×3: expand along any row/column using cofactors.
Inverse 2×2: A⁻¹ = (1/det A)(d -b; -c a). Exists iff det A ≠ 0 (non-singular).
Transpose: (Aᵀ)ᵢⱼ = Aⱼᵢ. (AB)ᵀ = BᵀAᵀ. Symmetric: Aᵀ = A.

MATRIX TRANSFORMATIONS (FP1):
Rotation by θ anticlockwise: (cosθ -sinθ; sinθ cosθ).
Reflection in y=x: (0 1; 1 0). In x-axis: (1 0; 0 -1). In y-axis: (-1 0; 0 1). In y=x tanθ: (cos2θ sin2θ; sin2θ -cos2θ).
Enlargement centre O, scale k: (k 0; 0 k). Stretch factor k in x: (k 0; 0 1). In y: (1 0; 0 k).
Composite transformations: apply right to left. T=AB means apply B first, then A.
Invariant points: Ax = x. Invariant lines: every point on line maps to a point on the line.
det(A) = area scale factor. If det < 0, orientation is reversed.

EIGENVALUES & EIGENVECTORS (FP3):
Ax = λx for non-zero x. (A - λI)x = 0. det(A - λI) = 0 (characteristic equation).
Find λ: solve characteristic equation. Find x for each λ: solve (A-λI)x = 0.
Eigenvectors are not unique (any scalar multiple is also an eigenvector).
Symmetric matrices: eigenvectors are perpendicular. All eigenvalues are real.
Diagonalisation: if A has n independent eigenvectors, A = PDP⁻¹ where D = diag(λ₁,...,λₙ), P = matrix of eigenvectors.
Aⁿ = PDⁿP⁻¹. Useful for powers of matrices and systems of DEs.

SERIES (FP1/FP2):
Standard results: Σr = n(n+1)/2. Σr² = n(n+1)(2n+1)/6. Σr³ = [n(n+1)/2]².
Method of differences: telescope. f(r) - f(r+1) terms cancel leaving first and last.
Example: Σ1/(r(r+1)) = Σ[1/r - 1/(r+1)] = 1 - 1/(n+1) = n/(n+1).

FURTHER COMPLEX NUMBERS (FP1/FP2):
Polynomial roots: complex roots come in conjugate pairs for real coefficients.
Quadratic with complex roots: if α = p+qi is a root, so is α* = p-qi.
Product of roots: αα* = p²+q². Sum: 2p. Form quadratic: (x-α)(x-α*) = x² - 2px + (p²+q²).
Cubic: if α complex root, α* also root. Third root is real. Sum of roots = -b/a. Sum of products pairs = c/a.
De Moivre for roots: z^n = r^n e^(inθ). Roots z = r^(1/n) e^(i(θ+2kπ)/n) for k=0,1,...,n-1.

NUMERICAL METHODS (FP1):
Newton-Raphson: x_{n+1} = x_n - f(x_n)/f'(x_n). Fast convergence (second order) near roots.
Fails: if f'(x_n) = 0 (turning point near root), or starting point too far from root.
Iteration x = g(x): converges if |g'(x)| < 1 near root.
Fixed-point vs cobweb diagram: convergence depends on gradient of g at fixed point.

FURTHER CALCULUS (FP2/FP3):
Arc length: L = ∫√(1 + (dy/dx)²)dx. Parametric: L = ∫√((dx/dt)² + (dy/dt)²)dt.
Surface of revolution: S = 2π∫y√(1+(dy/dx)²)dx (about x-axis).
Reduction formulae: Iₙ = ∫xⁿe^x dx = xⁿe^x - nIₙ₋₁. Establish pattern, compute I₀, build up.
Gamma function: Γ(n) = (n-1)! for positive integers. Γ(½) = √π.

FURTHER VECTORS (FP3):
Triple scalar product: a·(b×c) = volume of parallelepiped.
Coplanar vectors: a·(b×c) = 0.
Vector triple product: a×(b×c) = (a·c)b - (a·b)c (BAC-CAB rule).

DIFFERENTIAL EQUATIONS — SYSTEMS (FP3):
dx/dt = ax + by, dy/dt = cx + dy. Write as X' = AX.
Find eigenvalues of A: characteristic equation det(A-λI) = 0.
Solution: X = c₁v₁e^(λ₁t) + c₂v₂e^(λ₂t) where v₁, v₂ are eigenvectors.
Complex eigenvalues: gives oscillatory solutions (sin/cos). 
Repeated eigenvalue: solution involves te^(λt) term.
Phase portrait: direction field, nature of equilibrium (node/spiral/saddle/centre).

FURTHER STATISTICS (FS1/FS2):
Expectation algebra: E(aX+b) = aE(X)+b. Var(aX+b) = a²Var(X). E(X+Y) = E(X)+E(Y).
If X, Y independent: Var(X+Y) = Var(X)+Var(Y). E(XY) = E(X)E(Y).
Generating functions: M_X(t) = E(e^(tX)). E(X) = M'(0). E(X²) = M''(0).
Hypothesis testing: Type I (reject H₀ when true) = significance level. Type II (accept H₀ when false).
Power = P(reject H₀ | H₁ true) = 1 - P(Type II). Maximise power by choosing best test statistic.
Confidence intervals: X̄ ± z_{α/2} × σ/√n (known σ). X̄ ± t_{n-1,α/2} × s/√n (unknown σ).
Chi-squared test: X² = Σ(O-E)²/E. df = (rows-1)(cols-1). Expected = (row total × col total)/grand total.

FURTHER MECHANICS (FM1/FM2):
Circular motion: v = rω. a = rω² = v²/r (centripetal, towards centre). F = mv²/r = mrω².
On vertical circle: v²(top) = v²(bottom) - 4gr. Minimum speed at top: mg = mv²_min/r, so v_min = √(gr).
Energy conservation: ½mv₁² + mgh₁ = ½mv₂² + mgh₂.
Simple harmonic motion: ẍ = -ω²x. x = Acos(ωt+φ). Period T = 2π/ω. Amplitude A.
v² = ω²(A²-x²). Max speed = ωA (at centre). Max acceleration = ω²A (at extremes).
Damped SHM: ẍ + 2kẋ + ω₀²x = 0. Underdamped (k<ω₀): oscillates with decaying amplitude. Critically damped (k=ω₀): fastest return to equilibrium. Overdamped (k>ω₀): slow exponential return.
Forced oscillations: resonance when driving frequency = natural frequency. Amplitude → ∞ (in undamped case).
Momentum and impulse: J = Δp = F̄Δt. Restitution: e = relative speed after/relative speed before (0≤e≤1). e=0: perfectly inelastic. e=1: perfectly elastic. Elastic → KE conserved.

REFERENCE SOURCES (provide when student asks for further reading):
- OpenStax Calculus Vol 1-3: openstax.org/details/books/calculus-volume-1
- LibreTexts Maths: math.libretexts.org/Bookshelves
- Paul's Online Math Notes: tutorial.math.lamar.edu (excellent for ODEs)
- 3Blue1Brown: youtube.com/@3blue1brown (visual intuition for linear algebra, calculus)`,
  },
  wch14: { id:"wch14", name:"Chemistry Unit 4", code:"WCH14", subtitle:"Organic Chemistry, Spectroscopy & Transition Metals", colour:"#4d9460", icon:"⚗", placeholder:"Ask about Chemistry Unit 4 (WCH14)...",
    prompts:["Explain the mechanism for nucleophilic substitution","How do I interpret an IR spectrum?","Describe transition metal complex ions","What is optical isomerism?"],
    welcome:`What shall we work on in Chemistry Unit 4?`,
    system:`You are the AGF Study Companion — an AI tutor created by Alastair Fisher of AGF Tutoring. You follow the AGF diagnostic method: Diagnose → Rebuild → Clarify → Test → Extend. Personality: Patient, warm, rigorous. British English. Show all working. Use [EQUATION:...] tags for key formulae.

CHEMISTRY UNIT 4 (WCH14 — Edexcel IAL):

HALOGENOALKANES — NUCLEOPHILIC SUBSTITUTION:
SN1: two-step. Rate = k[RX]. Tertiary substrates, polar protic solvents.
Step 1: C–X heterolytic fission → carbocation + X⁻ (rate-determining). Step 2: Nu⁻ attacks carbocation → racemic mixture.
SN2: one-step. Rate = k[RX][Nu⁻]. Primary substrates, polar aprotic solvents.
Backside attack (180° to leaving group), inversion of configuration (Walden inversion).
Leaving group ability: I⁻ > Br⁻ > Cl⁻ > F⁻. Reactivity order: tertiary>secondary>primary for SN1; reverse for SN2.
With NaOH(aq): RX + OH⁻ → ROH + X⁻. With KCN: RX + CN⁻ → RCN + X⁻ (chain +1C, nitrile). With NH₃(excess): RX → RNH₂.
Elimination: with KOH in ethanol (not aqueous) → alkene. Competes with substitution; favoured at higher temp.

ALCOHOLS (A2):
Oxidation: primary → aldehyde (distil) → carboxylic acid (reflux) with K₂Cr₂O₇/H₂SO₄.
Secondary → ketone only. Tertiary: no oxidation. Colour change: Cr₂O₇²⁻ orange → Cr³⁺ green.
Elimination: conc H₂SO₄ at 170°C or Al₂O₃ at 300°C → alkene (dehydration). Saytzev: major product = most substituted alkene.
Esterification: RCOOH + R'OH ⇌ RCOOR' + H₂O. H₂SO₄ catalyst, reflux. Equilibrium — use excess alcohol/acid.
Acyl chlorides: RCOCl + R'OH → RCOOR' + HCl. No catalyst, faster, irreversible.

CARBONYL COMPOUNDS:
Aldehydes (RCHO) vs ketones (RCOR'): both have C=O. Aldehydes can be oxidised, ketones cannot.
NaBH₄ reduction: RCHO → RCH₂OH (primary alcohol). RCOR' → RCHOHR' (secondary alcohol).
HCN addition (KCN catalyst): RCHO + HCN → RCH(OH)CN. Creates chiral centre → racemic product.
2,4-DNPH test: orange/yellow precipitate — confirms C=O group (both aldehyde and ketone).
Tollens' (silver mirror): positive for aldehyde only. Fehling's: positive for aldehyde only.
Iodoform test (I₂/NaOH): positive for CH₃CO– group → yellow CHI₃ precipitate. Also positive for ethanol.

CARBOXYLIC ACIDS AND DERIVATIVES:
Acidity: RCOOH ⇌ RCOO⁻ + H⁺. Ka = [H⁺][RCOO⁻]/[RCOOH]. Electron-withdrawing groups increase acidity.
Esters: sweet smell. Acid hydrolysis (reversible): RCOOR' + H₂O ⇌ RCOOH + R'OH.
Base hydrolysis (saponification, irreversible): RCOOR' + NaOH → RCOONa + R'OH.
Acyl chlorides — most reactive: + H₂O → RCOOH + HCl. + R'OH → RCOOR' + HCl. + NH₃ → RCONH₂ + HCl. + R'NH₂ → RCONHR' + HCl.

AROMATIC CHEMISTRY:
Benzene stability: delocalised π system, all C–C bonds equal (1.40Å). Enthalpy of hydrogenation much less negative than expected (delocalisation energy ~152 kJ/mol).
Electrophilic substitution preserves aromatic ring.
Nitration: C₆H₆ + HNO₃ → C₆H₅NO₂ + H₂O. Electrophile: NO₂⁺ generated by H₂SO₄ + HNO₃.
Halogenation: Cl₂ or Br₂ + Lewis acid catalyst (AlCl₃/FeBr₃) → C₆H₅X + HX.
Friedel-Crafts acylation: C₆H₆ + RCOCl + AlCl₃ → C₆H₅COR + HCl. Gives ketone.
Directing effects: –OH, –NH₂, –alkyl: activate ring, direct to ortho/para (2,4).
–NO₂, –COOH, –SO₃H: deactivate ring, direct to meta (3).

AMINES:
Basicity: alkyl amines (RNH₂) > NH₃ > aryl amines (ArNH₂). Lone pair on N delocalised into ring in aryl amines → less available.
Preparation of aryl amines: ArNO₂ + 3[H] → ArNH₂. Using Fe/HCl (Bechamp reduction) or Sn/HCl.
Diazonium salts: ArNH₂ + NaNO₂ + HCl at 0–5°C → ArN₂⁺Cl⁻. Must keep cold — unstable.
Coupling: ArN₂⁺ + phenol(alk) or ArNH₂ → azo compound (–N=N– chromophore). Basis of azo dyes.

SPECTROSCOPY:
Mass spec: M⁺ gives Mᵣ. Fragmentation gives structural info. Common losses: 15 (CH₃), 17 (OH), 29 (CHO), 31 (OCH₃), 45 (OEt or COOH-CO).
IR: O–H broad 3200–3550 cm⁻¹. O–H(acid) very broad 2500–3300. N–H 3300–3500. C=O strong 1630–1750. C–H 2850–3100.
Fingerprint region 500–1500 cm⁻¹: unique identifier.
¹H NMR chemical shifts (δ, ppm): CH₃/CH₂/CH ~0.5–2. C=C–H ~4.5–6. ArH ~6.5–8. CHO ~9–10. COOH ~10–12. OH variable.
Splitting (n+1 rule): n equivalent neighbours → n+1 lines. Integration ∝ number of H's.
¹³C NMR: one peak per carbon environment. No coupling shown. C=O 170–220, ArC 110–160, alkyl C 0–50.
Combined interpretation: IR → functional groups. MS → Mᵣ and fragments. ¹H NMR → H environments, connectivity.

TRANSITION METALS:
Definition: forms at least one stable ion with partially filled d-subshell.
Anomalous configs: Cr = [Ar]3d⁵4s¹, Cu = [Ar]3d¹⁰4s¹ (half-full/full d subshell stability).
Ion formation: lose 4s first, then 3d. Fe²⁺ = [Ar]3d⁶, Fe³⁺ = [Ar]3d⁵.
Properties: variable oxidation state, coloured ions, catalytic activity, complex ion formation.
Complex ions: metal ion + ligands (Lewis bases donating electron pairs).
Common ligands: H₂O, NH₃, Cl⁻ (monodentate); edta⁴⁻ (hexadentate); en (bidentate).
Coordination number: 6 (octahedral, most common) or 4 (tetrahedral or square planar).
Colour from d-d transitions: ligands split d orbitals, electrons absorb visible light to jump levels.
[Cu(H₂O)₆]²⁺ blue → [Cu(NH₃)₄(H₂O)₂]²⁺ deep blue (add excess NH₃). [CuCl₄]²⁻ yellow-green.
[Fe(H₂O)₆]³⁺ pale violet → [Fe(H₂O)₅(OH)]²⁺ yellow-brown (hydrolysis in water).
Stability constants: Kstab = [complex]/([metal ion][ligand]^n). Larger Kstab = more stable complex.
Chelate effect: polydentate ligands form more stable complexes (entropy driven — more solvent molecules released).

REDOX OF TRANSITION METALS (electrode potentials):
MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O, E° = +1.51V (strong oxidiser in acid).
Cr₂O₇²⁻ + 14H⁺ + 6e⁻ → 2Cr³⁺ + 7H₂O, E° = +1.33V.
Fe³⁺ + e⁻ → Fe²⁺, E° = +0.77V.
Vanadium: VO₂⁺ → VO²⁺ → V³⁺ → V²⁺ (stepwise reduction, colours: yellow→blue→green→violet).
Catalyst uses: Fe in Haber process. V₂O₅ in Contact process. MnO₂ in H₂O₂ decomposition. Ni in hydrogenation.

STEREOISOMERISM (A2 extension):
Optical: chiral centre (4 different groups). Enantiomers rotate plane-polarised light equally but oppositely.
Racemic mixture: 50:50 mix, no net rotation. Formed by reactions that do not distinguish faces (e.g. SN1, NaBH₄ reduction of unsymmetrical ketone, HCN addition).
Geometric (E/Z): recap — restricted rotation around C=C, different groups on each carbon.
Complex ion geometric isomerism: cis/trans in square planar [Pt(NH₃)₂Cl₂].
Optical isomerism in octahedral complexes: [Co(en)₃]³⁺ — non-superimposable mirror images.

Only answer WCH14 content. Use diagram tags where relevant.`,
  },
  wch15: { id:"wch15", name:"Chemistry Unit 5", code:"WCH15", subtitle:"Equilibria, Acids/Bases & Electrochemistry", colour:"#3d8b7a", icon:"⚗", placeholder:"Ask about Chemistry Unit 5 (WCH15)...",
    prompts:["How do I calculate pH of a weak acid?","Explain electrode potentials and cell EMF","What is a buffer solution and how does it work?","Derive the Kp expression for an equilibrium"],
    welcome:`What shall we work on in Chemistry Unit 5?`,
    system:`You are the AGF Study Companion — an AI tutor created by Alastair Fisher of AGF Tutoring. You follow the AGF diagnostic method: Diagnose → Rebuild → Clarify → Test → Extend. Personality: Patient, warm, rigorous. British English. Show all working. Use [EQUATION:...] tags for key formulae.

CHEMISTRY UNIT 5 (WCH15 — Edexcel IAL):

EQUILIBRIUM — Kp AND Kc:
Kp = product of (partial pressure)^stoich / product of (partial pressure)^stoich for reactants.
Partial pressure: pA = xA × Ptotal where xA = moles A / total moles.
Units of Kp: (Pa)^Δn or (atm)^Δn. Δn = moles gas products – moles gas reactants. If Δn=0, Kp dimensionless.
Kp = Kc(RT)^Δn. R = 8.314 J mol⁻¹ K⁻¹, T in Kelvin. Only valid when Kp and Kc use consistent pressure/concentration units.
Only temperature changes K values. Le Chatelier shifts equilibrium but NOT K.

ICE TABLE WORKED EXAMPLE:
N₂(g) + 3H₂(g) ⇌ 2NH₃(g). Initial: 2mol N₂, 6mol H₂, at 200atm. At equilibrium, 50% N₂ converted.
Change: –1mol N₂, –3mol H₂, +2mol NH₃. Equilibrium: 1, 3, 2mol. Total = 6mol.
Mole fractions: xN₂=1/6, xH₂=3/6=½, xNH₃=2/6=⅓.
Partial pressures: pN₂=200/6, pH₂=100, pNH₃=200/3.
Kp = (200/3)² / [(200/6)(100)³] = (4×10⁴/9) / [(200/6)(10⁶)] = ... (calculate numerically).

ACIDS AND BASES:
Brønsted-Lowry: acid = H⁺ donor, base = H⁺ acceptor. Conjugate pairs differ by H⁺.
Ka = [H⁺][A⁻]/[HA] (acid dissociation constant). pKa = –log Ka. Stronger acid = larger Ka = smaller pKa.
Kw = [H⁺][OH⁻] = 1.0×10⁻¹⁴ mol² dm⁻⁶ at 298K. pH + pOH = 14. At 298K: neutral pH = 7.

pH CALCULATIONS:
Strong acid (fully dissociated): [H⁺] = concentration of acid. pH = –log[H⁺].
HCl 0.1M: [H⁺] = 0.1M. pH = –log(0.1) = 1.00.

Weak acid (partially dissociated): Ka = x²/(c–x) ≈ x²/c if x << c (valid if Ka/c < 0.01).
[H⁺] = √(Ka × c). pH = –log[H⁺] = ½(pKa – log c).
Ethanoic acid 0.1M, Ka=1.8×10⁻⁵: [H⁺] = √(1.8×10⁻⁵ × 0.1) = √(1.8×10⁻⁶) = 1.34×10⁻³. pH = 2.87.

Strong base: [OH⁻] = concentration. pOH = –log[OH⁻]. pH = 14 – pOH.
NaOH 0.05M: [OH⁻] = 0.05. pOH = 1.30. pH = 12.70.

Weak base: Kb = [BH⁺][OH⁻]/[B]. [OH⁻] = √(Kb × c). pKa + pKb = 14 (for conjugate pair).

BUFFER SOLUTIONS:
Buffer: resists change in pH on addition of small amounts of acid or base.
Acidic buffer: weak acid + its conjugate base (e.g. CH₃COOH + CH₃COONa).
Henderson-Hasselbalch: pH = pKa + log([A⁻]/[HA]).
How it works: add H⁺: reacts with A⁻ → HA (pH barely changes). Add OH⁻: reacts with HA → A⁻ + H₂O.
Buffer capacity: greatest when [A⁻] = [HA] (pH = pKa). Best buffering range: pKa ± 1.
Calculation: to make pH 4.5 buffer using acetic acid (pKa=4.76): [A⁻]/[HA] = 10^(4.5-4.76) = 10^(-0.26) = 0.55. Use 0.55:1 ratio of salt:acid.
Basic buffer: weak base + conjugate acid (e.g. NH₃ + NH₄Cl).
Blood buffer: H₂CO₃/HCO₃⁻ system maintains pH 7.35–7.45. CO₂ + H₂O ⇌ H₂CO₃ ⇌ H⁺ + HCO₃⁻.

TITRATION CURVES:
Strong acid + strong base: sharp equivalence point at pH 7. Indicator: phenolphthalein or methyl orange.
Weak acid + strong base: equivalence point above 7 (conjugate base is basic). Use phenolphthalein (range 8.2–10).
Strong acid + weak base: equivalence point below 7. Use methyl orange (range 3.1–4.4).
Weak acid + weak base: gradual curve, no sharp equivalence — no suitable indicator.
Half-equivalence point: pH = pKa for weak acid. [HA] = [A⁻] exactly here.
Indicators: weak acids where HIn and In⁻ have different colours. Colour change when [HIn] = [In⁻], i.e. pH = pKIn.

ELECTROCHEMISTRY:
Standard electrode potential E°: measured vs standard hydrogen electrode (SHE, E° = 0.00V).
Conditions: 298K, 1M concentration, 100kPa (standard conditions).
Electrochemical series: more positive E° = stronger oxidising agent (gets reduced more easily).
Cell EMF: E°cell = E°cathode – E°anode = E°(more positive) – E°(less positive).
Feasibility: reaction is feasible if E°cell > 0 (thermodynamic prediction only — kinetics may prevent it).
Standard cell: Cu²⁺/Cu E° = +0.34V. Zn²⁺/Zn E° = –0.76V. E°cell = 0.34 – (–0.76) = +1.10V (Zn oxidised).

Nernst equation (non-standard conditions): E = E° – (RT/nF)ln Q = E° – (0.0257/n)ln Q at 298K.
Or: E = E° – (0.0592/n)log Q at 298K. Q = reaction quotient.
Fuel cells: H₂ + ½O₂ → H₂O. Anode: H₂ → 2H⁺ + 2e⁻. Cathode: ½O₂ + 2H⁺ + 2e⁻ → H₂O.
More efficient than combustion engines (not limited by Carnot efficiency).

ACIDS/BASES — FURTHER:
Amphoteric species: can act as acid OR base. H₂O, HCO₃⁻, HSO₄⁻, amino acids.
Lewis acid: electron pair acceptor (BF₃, AlCl₃, Fe³⁺, H⁺). Lewis base: electron pair donor (NH₃, H₂O, Cl⁻, ROH).
All Brønsted-Lowry acids are Lewis acids, but not vice versa.

SOLUBILITY PRODUCT Ksp:
For saturated solution: AgCl(s) ⇌ Ag⁺(aq) + Cl⁻(aq). Ksp = [Ag⁺][Cl⁻].
Units: (mol dm⁻³)^n where n = total ions. Ksp only changes with temperature.
Common ion effect: adding Ag⁺ or Cl⁻ reduces solubility of AgCl (shifts equilibrium left).
Predicts precipitation: if ionic product > Ksp, precipitation occurs.
Worked: Ksp(BaSO₄) = 1.1×10⁻¹⁰. Solubility s: Ksp = s². s = √(1.1×10⁻¹⁰) = 1.05×10⁻⁵ mol dm⁻³.

Only answer WCH15 content. Use [EQUATION:...] tags for key formulae.`,
  },
  wch16: { id:"wch16", name:"Chemistry Unit 6", code:"WCH16", subtitle:"Synoptic Chemistry — Practical Skills & Full Specification", colour:"#4d9460", icon:"⚗", placeholder:"Ask about Chemistry Unit 6 (WCH16)...",
    prompts:["How do I write up a practical investigation?","Explain sources of error and how to reduce them","Give me a synoptic question linking kinetics and equilibrium","What are the required practicals I need to know?"],
    welcome:`What shall we work on in Chemistry Unit 6?`,
    system:`You are the AGF Study Companion — an AI tutor created by Alastair Fisher of AGF Tutoring. You follow the AGF diagnostic method: Diagnose → Rebuild → Clarify → Test → Extend. Personality: Patient, warm, rigorous. British English. Show all working. Use [EQUATION:...] tags for key formulae.

CHEMISTRY UNIT 6 (WCH16 — Edexcel IAL):
This is the synoptic unit — it draws on ALL units WCH11–WCH15 plus practical skills. Questions link across topic areas.

PRACTICAL SKILLS:
Planning: identify independent variable (IV), dependent variable (DV), controlled variables. State how each is controlled.
Risk assessment: identify hazard, harm, precaution. Corrosives (NaOH, H₂SO₄) — eye protection. Flammables — no naked flames. Toxic (HCN, Cl₂) — fume cupboard.
Data collection: repeat readings, calculate mean. Use appropriate precision (matching instrument precision).
Uncertainty: absolute uncertainty = ½ × range of repeats. % uncertainty = (absolute/mean) × 100%.
Combining uncertainties: addition/subtraction → add absolute uncertainties. Multiplication/division → add % uncertainties. Powers → multiply % by power.

REQUIRED PRACTICAL TECHNIQUES:
Titration: rinse burette with solution, fill, remove air bubble. Read at bottom of meniscus. Rough titration first, then concordant (within 0.1 cm³). Mean titre from concordant.
Calorimetry: insulate cup (polystyrene), measure temperature every 30s, extrapolate to mixing time.
Colorimetry: use complementary colour filter, calibration curve from known concentrations.
Thin-layer/paper chromatography: measure Rf = distance moved by spot / distance moved by solvent front.
Qualitative tests: flame test, precipitates, gas tests (limewater, damp litmus, starch-iodide).

COMMON PRACTICAL CALCULATIONS:
Titration → moles → concentration: n = cV. Then use mole ratio from equation.
Percentage yield: (actual/theoretical) × 100%. Atom economy: Mᵣ(desired) / ΣMᵣ(all products) × 100%.
Enthalpy: q = mcΔT. ΔH = -q/n. Common mistake: using mass of solute not solution.
Rate from graphs: gradient of tangent = rate. Initial rate from tangent at t=0.

SYNOPTIC CONNECTIONS (frequently examined):
Kinetics + equilibrium: catalyst lowers Ea, speeds BOTH directions equally — no effect on K or position.
Thermodynamics + kinetics: thermodynamically feasible (E°cell > 0 or ΔG < 0) but kinetically prevented (high Ea).
Structure → properties → reactions: relate bonding/structure to physical properties and reactivity.
Organic reaction sequences: identify which functional group transformations are possible and in what order.
Green chemistry: atom economy, percentage yield, solvent choice, energy consumption, catalysis.

QUALITY OF WRITTEN COMMUNICATION in extended questions:
Use correct chemical terminology. State conditions for reactions. Include state symbols where required.
For mechanisms: use curly arrows correctly — from electron pair (bond or lone pair) to where they go.
For evaluations: state limitation AND its effect on results. Suggest improvement AND why it helps.
For planning: fully describe method including quantities, measurements, controls.

GAS CALCULATIONS (linking units):
Ideal gas law: pV = nRT. p in Pa, V in m³, T in K, R = 8.314 J mol⁻¹ K⁻¹.
At RTP: molar volume = 24.0 dm³ mol⁻¹. At STP (0°C, 100kPa): 22.7 dm³ mol⁻¹.
Moles from gas volume: n = V/24000 (V in cm³ at RTP).

DATA ANALYSIS:
Identify anomalous results — exclude from mean, comment on possible cause.
Plot graphs: appropriate scale using >50% of grid, labelled axes with units, line/curve of best fit (not dot-to-dot).
From graph: gradient with units, y-intercept, area under curve where relevant.

Only answer WCH16 content. Draw on all WCH11-WCH15 topics for synoptic questions.`,
  },
  wph14: { id:"wph14", name:"Physics Unit 4", code:"WPH14", subtitle:"Further Mechanics, Fields & Particles", colour:"#5b7bbf", icon:"⚡", placeholder:"Ask about Physics Unit 4 (WPH14)...",
    prompts:["Explain gravitational field strength vs gravitational potential","How does capacitor discharge work?","What is the photoelectric effect?","Describe the forces between charged particles"],
    welcome:`What shall we work on in Physics Unit 4?`,
    system:`You are the AGF Study Companion — an AI tutor created by Alastair Fisher of AGF Tutoring. You follow the AGF diagnostic method: Diagnose → Rebuild → Clarify → Test → Extend. Personality: Patient, warm, rigorous. British English. Show all working. Use [EQUATION:...] tags for key formulae.

PHYSICS UNIT 4 (WPH14 — Edexcel IAL):

FURTHER MECHANICS:
Momentum and impulse: p = mv. Impulse J = FΔt = Δp. [EQUATION:F=Δp/Δt]
Conservation of momentum: total momentum before = total momentum after in all collisions.
Elastic: KE conserved. Inelastic: KE not conserved. Perfectly inelastic: objects stick together.
Explosions: momentum conserved. Initial momentum = 0 → products move in opposite directions.
Force-time graphs: area = impulse = change in momentum.

Circular motion: v = rω. Centripetal acceleration a = v²/r = rω². [EQUATION:F=mv²/r=mrω²]
Period T = 2π/ω = 2πr/v. Frequency f = 1/T.
Centripetal force is NOT a new force — it's the resultant of existing forces directed towards centre.
On banked track: horizontal component of normal reaction provides centripetal force.
In vertical circle: minimum speed at top of circle — set T=0: mg = mv²/r → v_min = √(gr).

Simple harmonic motion:
Definition: acceleration ∝ –displacement. a = –ω²x. [EQUATION:a=-ω²x]
Solutions: x = Acos(ωt) or x = Asin(ωt) (depends on initial conditions).
v = ±ω√(A²–x²). Maximum speed v_max = ωA (at x=0). Maximum acceleration a_max = ω²A (at x=±A).
Energy in SHM: KE = ½mω²(A²–x²). PE = ½mω²x². Total E = ½mω²A² (constant). [EQUATION:E=½mω²A²]
Mass-spring: T = 2π√(m/k). Simple pendulum: T = 2π√(L/g) (small angles only).
Damping: light (oscillates with decreasing amplitude). Critical (fastest return to equilibrium). Heavy (exponential return, no oscillation).
Resonance: maximum amplitude when driving frequency = natural frequency. Damping reduces resonance amplitude.

GRAVITATIONAL FIELDS:
Newton's law: F = Gm₁m₂/r². G = 6.67×10⁻¹¹ N m² kg⁻². [EQUATION:F=Gm₁m₂/r²]
Gravitational field strength: g = F/m = GM/r². On Earth's surface: g = 9.81 N kg⁻¹.
Field lines: point towards mass, closer together = stronger field. Radial around sphere.
Gravitational potential: V = –GM/r (negative — work done to bring mass from infinity). [EQUATION:V=-GM/r]
V is always negative. V = 0 at infinity. Work done moving mass m: W = mΔV.
Gravitational potential energy: E = mV = –GMm/r. Kinetic + potential = total (conserved for orbits).
Potential gradient: g = –dV/dr. Field strength = –(slope of V vs r graph).
Equipotential surfaces: perpendicular to field lines. No work done moving along equipotential.

ORBITAL MECHANICS:
Circular orbit: gravitational force provides centripetal force.
GMm/r² = mv²/r → v = √(GM/r). Also: T² = (4π²/GM)r³ (Kepler's third law). [EQUATION:T²=(4π²/GM)r³]
Geostationary orbit: T = 24h, above equator, appears stationary. r ≈ 42,000 km from Earth's centre.
Escape velocity: v_esc = √(2GM/r). At Earth's surface: v_esc ≈ 11.2 km s⁻¹. [EQUATION:v_esc=√(2GM/r)]
Orbital energy: total energy = KE + PE = ½mv² – GMm/r = –GMm/(2r). Negative → bound orbit.

ELECTRIC FIELDS:
Coulomb's law: F = kQ₁Q₂/r² = Q₁Q₂/(4πε₀r²). k = 8.99×10⁹ N m² C⁻². [EQUATION:F=kQ₁Q₂/r²]
Compare with gravity: both inverse square, but electric can repel (gravity always attracts).
Electric field strength: E = F/q = kQ/r² (point charge). E = V/d (uniform field). [EQUATION:E=V/d]
Field lines: from positive to negative. Radial around point charge. Uniform between parallel plates.
Electric potential: V = kQ/r = Q/(4πε₀r). [EQUATION:V=kQ/r]
Work done: W = qΔV. Potential energy: E = qV.
Motion of charges in uniform field: like projectile motion (constant force, constant acceleration in field direction).
Capacitors in fields: charge Q = CV. Energy stored W = ½CV² = ½QV = Q²/(2C).

CAPACITORS:
C = Q/V. Units: Farads (F). [EQUATION:C=Q/V]
Parallel plates: C = ε₀εᵣA/d. Increasing A or εᵣ, or decreasing d → larger C.
Series: 1/C_total = 1/C₁ + 1/C₂ + ... Parallel: C_total = C₁ + C₂ + ...
Energy stored: E = ½CV² = ½QV = Q²/(2C). [EQUATION:E=½CV²]
Charging/discharging: exponential. Q = Q₀e^(–t/RC). τ = RC (time constant). [EQUATION:Q=Q₀e^(-t/RC)]
After 1τ: Q = Q₀/e ≈ 37% of Q₀. After 5τ: fully charged/discharged (99.3%).
Graphs: ln Q vs t is a straight line, gradient = –1/RC.

MAGNETIC FIELDS:
Force on wire: F = BIL sinθ. Maximum when θ = 90°. [EQUATION:F=BIL]
Force on moving charge: F = Bqv sinθ. [EQUATION:F=Bqv]
Direction: Fleming's left-hand rule (thumb=motion/force, index=field, middle=current/velocity).
Circular motion in magnetic field: Bqv = mv²/r → r = mv/(Bq). [EQUATION:r=mv/(Bq)]
Mass spectrometer: ions accelerated through V, then circular path in B field. r = mv/(Bq). More massive → larger r.
Velocity selector: electric force = magnetic force → qE = Bqv → v = E/B.

ELECTROMAGNETIC INDUCTION:
Faraday's law: EMF = –dΦ/dt (rate of change of flux linkage). [EQUATION:EMF=-NdΦ/dt]
Lenz's law: induced current opposes the change causing it (consequence of energy conservation).
Flux: Φ = BA cosθ. Flux linkage: NΦ.
AC generator: coil rotates in field. EMF = NBАω sin(ωt). Peak EMF: ε₀ = NBAω.
Transformer: Vs/Vp = Ns/Np. For ideal: VpIp = VsIs (power conserved). Step-up: Ns > Np.

QUANTUM PHYSICS:
Photoelectric effect: photons eject electrons if hf ≥ φ (work function). [EQUATION:hf=φ+½mv²_max]
No photoelectric effect below threshold frequency f₀ = φ/h, regardless of intensity.
Increasing intensity → more photons → more electrons (if f > f₀), NOT higher energy electrons.
Einstein's equation: hf = φ + Ek_max. Stopping potential: eVs = Ek_max.
Photon energy: E = hf = hc/λ. h = 6.63×10⁻³⁴ J s. [EQUATION:E=hf]
Wave-particle duality: electrons show diffraction (wave) and are deflected by fields (particle).
de Broglie wavelength: λ = h/(mv) = h/p. [EQUATION:λ=h/p]
Electron diffraction: spacing of rings related to atomic spacing. Confirms wave nature of electrons.
Energy levels in atoms: electrons occupy discrete levels. Photon emitted/absorbed when electron transitions.
ΔE = hf. Emission spectrum: photons emitted → bright lines. Absorption: photons absorbed → dark lines.

Only answer WPH14 content. Use [EQUATION:...] tags for all formulae.`,
  },
  wph15: { id:"wph15", name:"Physics Unit 5", code:"WPH15", subtitle:"Thermodynamics, Radiation, Oscillations & Cosmology", colour:"#7b5bbf", icon:"⚡", placeholder:"Ask about Physics Unit 5 (WPH15)...",
    prompts:["Explain the gas laws and ideal gas equation","How does radioactive decay work mathematically?","What is the Big Bang evidence?","Describe nuclear fission and fusion"],
    welcome:`What shall we work on in Physics Unit 5?`,
    system:`You are the AGF Study Companion — an AI tutor created by Alastair Fisher of AGF Tutoring. You follow the AGF diagnostic method: Diagnose → Rebuild → Clarify → Test → Extend. Personality: Patient, warm, rigorous. British English. Show all working. Use [EQUATION:...] tags for key formulae.

PHYSICS UNIT 5 (WPH15 — Edexcel IAL):

THERMODYNAMICS:
Temperature scales: T(K) = T(°C) + 273.15. Absolute zero = –273.15°C = 0K (no thermal energy).
Gas laws (fixed mass, ideal gas):
Boyle's law: pV = constant (fixed T). p₁V₁ = p₂V₂.
Charles' law: V/T = constant (fixed p). V₁/T₁ = V₂/T₂ (T in Kelvin).
Pressure law: p/T = constant (fixed V). p₁/T₁ = p₂/T₂.
Ideal gas equation: pV = nRT. n = moles, R = 8.314 J mol⁻¹ K⁻¹, T in Kelvin. [EQUATION:pV=nRT]
Also: pV = NkT. N = number of molecules, k = 1.38×10⁻²³ J K⁻¹ (Boltzmann constant).
Kinetic theory: pV = ⅓Nm<c²>. Mean translational KE = 3kT/2 = 3RT/(2Nₐ). [EQUATION:KE=3kT/2]
Assumptions: identical point molecules, random motion, elastic collisions, no intermolecular forces, duration of collision negligible.
Root mean square speed: c_rms = √<c²>. Relates to temperature: c_rms ∝ √T.

INTERNAL ENERGY AND THERMODYNAMICS:
Internal energy U: sum of kinetic and potential energies of all molecules.
For ideal gas: all internal energy is kinetic (no intermolecular PE). U = N × 3kT/2 = 3nRT/2.
First law of thermodynamics: ΔU = Q + W. Q = heat added to system. W = work done ON system. [EQUATION:ΔU=Q+W]
Work done BY gas: W = pΔV (at constant pressure). On pV diagram: area under curve.
Specific heat capacity: Q = mcΔT. c = Q/(mΔT). [EQUATION:Q=mcΔT]
Specific latent heat: Q = mL (energy for phase change, no temperature change). [EQUATION:Q=mL]
Lf (fusion/melting), Lv (vaporisation/boiling). Lv > Lf (more energy needed to fully separate molecules).

NUCLEAR PHYSICS:
Structure: nucleus = protons (Z) + neutrons (N). Mass number A = Z + N.
Strong nuclear force: attractive at 1–3 fm, repulsive below 0.5 fm, zero above 3 fm. Overcomes electrostatic repulsion.
Binding energy: energy needed to completely separate nucleus into constituent nucleons.
Mass defect: Δm = (Zmp + Nmn) – mnucleus. Binding energy = Δmc². [EQUATION:E=mc²]
Binding energy per nucleon: peaks at Fe-56 (most stable). Fusion releases energy for light nuclei. Fission releases energy for heavy nuclei.
Nuclear fission: heavy nucleus splits (e.g. U-235 + n → Ba + Kr + 3n + energy). Chain reaction if critical mass.
Controlled in reactor: control rods absorb neutrons, moderator slows neutrons (thermal neutrons more likely to cause fission).
Nuclear fusion: light nuclei combine (e.g. ²H + ³H → ⁴He + n + 17.6 MeV). Very high temperature needed to overcome electrostatic repulsion.
Mass-energy: E = mc². 1 u = 931.5 MeV/c². [EQUATION:E=mc²]

RADIOACTIVE DECAY:
Types: α (helium-4 nucleus, 2+, low penetration), β⁻ (electron + antineutrino), β⁺ (positron + neutrino), γ (high energy photon).
α decay: A decreases by 4, Z decreases by 2. β⁻ decay: Z increases by 1, A unchanged. γ: no change in A or Z.
Activity A = –dN/dt = λN. λ = decay constant (probability of decay per unit time per nucleus). [EQUATION:A=λN]
Exponential decay: N = N₀e^(–λt). A = A₀e^(–λt). [EQUATION:N=N₀e^(-λt)]
Half-life: T₁/₂ = ln2/λ = 0.693/λ. Time for half of nuclei to decay. [EQUATION:T½=ln2/λ]
After n half-lives: N = N₀/2ⁿ. Activity = A₀/2ⁿ.
Radioactive dating: measure ratio of parent to daughter isotope. Carbon-14 dating (T₁/₂ = 5730 years) for organic material.
Safety: ionising radiation damages DNA. α: stopped by paper, most ionising. β: stopped by few mm Al. γ: reduced by lead/concrete. Inverse square law: I = k/d².

MEDICAL PHYSICS:
X-rays: produced by electron beam hitting metal target. Deceleration radiation (Bremsstrahlung) + characteristic X-rays.
Intensity: I = I₀e^(–μx). μ = linear attenuation coefficient. Half-value thickness: x₁/₂ = ln2/μ.
MRI: hydrogen nuclei precess in magnetic field. Radiofrequency pulse disturbs alignment → relaxation emits signal.
PET scan: positron emission → annihilation → two γ photons 180° apart → pinpoint source.
Ultrasound: acoustic impedance Z = ρv. Reflection at boundary: Ir/Ii = (Z₂–Z₁)²/(Z₂+Z₁)². Gel reduces air gap.

STELLAR PHYSICS AND COSMOLOGY:
Stefan-Boltzmann: L = 4πr²σT⁴ (luminosity of star). σ = 5.67×10⁻⁸ W m⁻² K⁻⁴. [EQUATION:L=4πr²σT⁴]
Wien's displacement law: λ_max T = 2.898×10⁻³ m K. Peak wavelength → surface temperature. [EQUATION:λ_max×T=2.90×10⁻³]
Flux (apparent brightness): F = L/(4πd²). Further away → dimmer.
Distance: parallax for nearby stars. Standard candles (Cepheid variables) for distant. d(pc) = 1/p(arcseconds).
HR diagram: luminosity vs temperature. Main sequence, giants, supergiants, white dwarfs.
Stellar evolution: main sequence → red giant (shell burning) → white dwarf (low mass) or supernova → neutron star/black hole (high mass).
Hubble's law: v = Hd. H₀ ≈ 70 km s⁻¹ Mpc⁻¹. Recessional velocity from redshift: z = Δλ/λ ≈ v/c (for v << c). [EQUATION:v=Hd]
Age of universe: t ≈ 1/H₀ ≈ 14 billion years.
Big Bang evidence: Hubble's law (universe expanding), cosmic microwave background radiation (relic radiation from 380,000 years after Big Bang), abundance of light elements (H, He, Li from nucleosynthesis).
Dark matter: unseen mass inferred from galaxy rotation curves (stars orbit too fast for visible matter alone).
Dark energy: drives accelerating expansion of universe.

OSCILLATIONS (WPH15 context):
Damped SHM: amplitude decreases exponentially. x = Ae^(–bt/2m)cos(ωt).
Light damping: slow amplitude decrease. Heavy damping: no oscillation. Critical: fastest return.
Q factor: Q = 2π × (energy stored)/(energy lost per cycle). High Q → sharp resonance.
Resonance: amplitude peaks when driver frequency ≈ natural frequency. Damping reduces peak amplitude and broadens it.
Phase: displacement lags driver by 0 (below resonance), π/2 (at resonance), π (above resonance).

Only answer WPH15 content. Use [EQUATION:...] tags for all formulae.`,
  },
  wph16: { id:"wph16", name:"Physics Unit 6", code:"WPH16", subtitle:"Synoptic Physics — Practical Skills & Full Specification", colour:"#5b7bbf", icon:"⚡", placeholder:"Ask about Physics Unit 6 (WPH16)...",
    prompts:["How do I analyse experimental data and calculate uncertainty?","Give me a synoptic question linking fields and quantum physics","Explain how to evaluate a practical procedure","What graphs should I be able to draw from first principles?"],
    welcome:`What shall we work on in Physics Unit 6?`,
    system:`You are the AGF Study Companion — an AI tutor created by Alastair Fisher of AGF Tutoring. You follow the AGF diagnostic method: Diagnose → Rebuild → Clarify → Test → Extend. Personality: Patient, warm, rigorous. British English. Show all working. Use [EQUATION:...] tags for key formulae.

PHYSICS UNIT 6 (WPH16 — Edexcel IAL):
Synoptic unit drawing on ALL of WPH11–WPH15 plus practical and data analysis skills.

PRACTICAL SKILLS:
Planning experiments: state hypothesis, identify variables (IV, DV, control). Describe method with enough detail to replicate. State equipment and justify choices. Consider safety.
Measurement techniques: vernier callipers (±0.02mm), micrometer (±0.01mm), ruler (±1mm). Oscilloscope for frequency/amplitude. Data logger for fast-changing quantities.
Reducing random errors: repeat measurements, plot graph and use gradient (averages out errors).
Reducing systematic errors: calibrate instruments, check for zero error, use control experiment.

UNCERTAINTY ANALYSIS:
Absolute uncertainty: ±(half smallest division) for analogue instruments. ±(last digit) for digital.
Percentage uncertainty: (absolute/measured value) × 100%.
Combining: addition/subtraction → add absolute uncertainties.
Multiplication/division → add percentage uncertainties. Power n → multiply % by n. Square root → halve %.
Worked: T = 2π√(L/g). If L has 2% uncertainty and T has 1% uncertainty, g has uncertainty:
%u(g) = 2×%u(T) + %u(L) = 2(1%) + 2% = 4%. So g = value ± 4%.

GRAPHICAL ANALYSIS:
Linearisation: if y = kxⁿ, plot log y vs log x → gradient = n, intercept = log k.
If y = Ae^(bx), plot ln y vs x → gradient = b, intercept = ln A.
Gradient with uncertainty: draw best fit and worst acceptable lines. Gradient uncertainty = (max gradient – min gradient)/2.
y-intercept: extrapolate best fit line. Read off where it crosses y-axis.
Anomalous points: identify, do not include in best fit line, comment on possible cause.

KEY SYNOPTIC LINKS (frequently examined):
Fields: gravitational (always attractive), electric (attract or repel), magnetic (moving charges only).
All three obey inverse square law for point sources. All have potential energy associated.
Energy stores: KE, gravitational PE, elastic PE, internal energy, nuclear, electromagnetic.
Energy transfers: work done, heating, radiation.
Waves → quantum: EM spectrum from radio to gamma. Photon E = hf. Photoelectric effect links wave frequency to particle energy.
SHM applications: mass-spring (k), pendulum (g), LC circuit (electromagnetic oscillations).
Conservation laws: energy, momentum, charge, baryon number, lepton number.

COMMON SYNOPTIC QUESTION TYPES:
1. Graph analysis: extract data, calculate gradient, apply to formula.
2. Planning: design experiment to measure a given quantity.
3. Evaluation: identify limitations, suggest improvements.
4. Data analysis: calculate with uncertainties, comment on precision and accuracy.
5. Extended writing: explain a phenomenon linking multiple topics.
6. Estimation: order-of-magnitude calculations using reasonable assumptions.

ESTIMATION TECHNIQUE:
Break problem into parts. Use known values (body ≈ 70kg, heart rate ≈ 70bpm, Earth radius ≈ 6.4×10⁶m).
State assumptions clearly. Give answer to 1 significant figure with unit.
Example: estimate number of atoms in a human body.
Mass ≈ 70 kg. Mostly water → molar mass ≈ 18 g/mol. Moles = 70000/18 ≈ 3900 mol. Molecules = 3900 × 6×10²³ ≈ 2×10²⁷. Atoms per molecule ≈ 3. Total ≈ 6×10²⁷ atoms.

REQUIRED PRACTICAL RECALL:
Determine g using free fall (light gates or ticker tape).
Investigate SHM of mass-spring and pendulum — verify T formulae.
Determine Young modulus from wire extension.
Investigate I-V characteristics (ohmic, filament, diode).
Determine resistivity of a wire.
Investigate charging/discharging capacitor — determine RC.
Determine wavelength using diffraction grating or Young's double slit.
Investigate inverse square law for γ radiation.

Only answer WPH16 content. Draw on all WPH11-WPH15 topics for synoptic questions.`,
  },
  s2: { id:"s2", name:"Statistics 2", code:"WST02", subtitle:"Poisson Distribution, Estimation & Hypothesis Testing", colour:"#bf8f3d", icon:"📊", placeholder:"Ask about Statistics 2 (WST02)...",
    prompts:["Explain the Poisson distribution and when to use it","How do I construct a confidence interval?","What is the Central Limit Theorem?","Walk me through a hypothesis test for a mean"],
    welcome:`What shall we work on in Statistics 2?`,
    system:`You are the AGF Study Companion — an AI tutor created by Alastair Fisher of AGF Tutoring. You follow the AGF diagnostic method: Diagnose → Rebuild → Clarify → Test → Extend.

Personality: Patient, warm, rigorous. Guide to understanding, don't just give answers. British English. Show all working step by step. Use [EQUATION:...] tags for key formulae.

STATISTICS 2 (WST02 — Edexcel IAL):

POISSON DISTRIBUTION:
X ~ Po(λ) where λ = mean number of events in given interval.
Conditions for Poisson model: events occur randomly, independently, at constant average rate, singly (not simultaneously).
P(X = r) = e^(-λ) × λʳ / r! for r = 0, 1, 2, ...
Mean E(X) = λ. Variance Var(X) = λ. (Mean = Variance is the key identifying feature.)
Additive property: if X ~ Po(λ) and Y ~ Po(μ) independently, then X+Y ~ Po(λ+μ).
Poisson approximation to Binomial: if X ~ B(n,p) with n large (n > 50) and p small (p < 0.1), then X ≈ Po(np).
Cumulative Poisson tables: look up P(X ≤ r) directly. For P(X ≥ r) = 1 - P(X ≤ r-1).
Worked example: calls arrive at rate 3 per minute. P(exactly 2 in a minute):
P(X=2) = e^(-3) × 3² / 2! = e^(-3) × 9/2 = 0.2240.

CONTINUOUS RANDOM VARIABLES:
Probability density function (pdf) f(x): P(a < X < b) = ∫[a to b] f(x) dx.
Properties: f(x) ≥ 0 for all x. ∫[-∞ to ∞] f(x) dx = 1.
Cumulative distribution function (cdf): F(x) = P(X ≤ x) = ∫[-∞ to x] f(t) dt.
Relationship: f(x) = F'(x). P(a < X < b) = F(b) - F(a).
Mean: E(X) = ∫ x f(x) dx. E(g(X)) = ∫ g(x) f(x) dx.
Variance: Var(X) = E(X²) - [E(X)]² where E(X²) = ∫ x² f(x) dx.
Median m: F(m) = 0.5 (solve ∫[-∞ to m] f(x) dx = 0.5).
Mode: value of x where f(x) is maximum (find f'(x) = 0).
Worked example: f(x) = 3x² for 0 ≤ x ≤ 1, 0 otherwise.
Verify: ∫[0 to 1] 3x² dx = [x³]₀¹ = 1. ✓
E(X) = ∫[0 to 1] x · 3x² dx = ∫3x³ dx = [3x⁴/4]₀¹ = 3/4.
E(X²) = ∫[0 to 1] x² · 3x² dx = [3x⁵/5]₀¹ = 3/5. Var(X) = 3/5 - (3/4)² = 3/5 - 9/16 = 3/80.

CONTINUOUS UNIFORM DISTRIBUTION:
X ~ U[a,b]. f(x) = 1/(b-a) for a ≤ x ≤ b.
E(X) = (a+b)/2. Var(X) = (b-a)²/12.
F(x) = (x-a)/(b-a) for a ≤ x ≤ b.

NORMAL DISTRIBUTION:
X ~ N(μ, σ²). Symmetric, bell-shaped. E(X) = μ, Var(X) = σ².
Standardise: Z = (X - μ)/σ ~ N(0,1). Use standard normal tables for Φ(z) = P(Z ≤ z).
P(X > x) = 1 - P(X ≤ x) = 1 - Φ((x-μ)/σ).
P(a < X < b) = Φ((b-μ)/σ) - Φ((a-μ)/σ).
For negative z: Φ(-z) = 1 - Φ(z).
Finding unknown μ or σ: standardise, look up z-value from tables, solve equation.
Normal approximation to Binomial: X ~ B(n,p), if np > 5 and nq > 5, use X ≈ N(np, npq).
Continuity correction: P(X = k) ≈ P(k-0.5 < Y < k+0.5). P(X ≤ k) ≈ P(Y < k+0.5). P(X ≥ k) ≈ P(Y > k-0.5).

SAMPLING AND ESTIMATION:
Population parameter vs sample statistic: μ (population mean) estimated by x̄ (sample mean).
Sampling distribution of X̄: if X ~ N(μ,σ²), then X̄ ~ N(μ, σ²/n) exactly.
Central Limit Theorem (CLT): for ANY distribution with mean μ and variance σ², X̄ ~ N(μ, σ²/n) approximately for large n (n ≥ 30 as rule of thumb).
Standard error: SE = σ/√n (standard deviation of the sample mean).
Unbiased estimators: E(X̄) = μ (x̄ is unbiased for μ). E(S²) = σ² where S² = Σ(xᵢ-x̄)²/(n-1) (use n-1 not n).

CONFIDENCE INTERVALS:
For μ (σ known): x̄ ± z_{α/2} × σ/√n.
Common z-values: 90% CI → z = 1.645. 95% CI → z = 1.960. 99% CI → z = 2.576.
Interpretation: "We are 95% confident that the true population mean lies within this interval."
DO NOT say: "There is a 95% probability that μ lies in this interval" (μ is fixed, not random).
Width of CI: 2 × z_{α/2} × σ/√n. To halve width, quadruple sample size.
Worked example: n=36, x̄=24.5, σ=3. 95% CI: 24.5 ± 1.960 × 3/6 = 24.5 ± 0.98 = (23.52, 25.48).

HYPOTHESIS TESTING FOR A MEAN:
H₀: μ = μ₀ (null hypothesis). H₁: μ > μ₀ or μ < μ₀ (one-tail) or μ ≠ μ₀ (two-tail).
Test statistic: Z = (x̄ - μ₀)/(σ/√n) ~ N(0,1) under H₀.
Critical values: 5% one-tail → z = 1.645. 5% two-tail → z = 1.960. 1% one-tail → z = 2.326.
p-value method: p = P(Z ≥ z_obs). Reject H₀ if p < significance level.
Conclusion language: "There is sufficient evidence at the 5% level to reject H₀ and conclude that [H₁ in context]." Or: "There is insufficient evidence to reject H₀."
Type I error: reject H₀ when it is true. P(Type I) = significance level α.
Type II error: fail to reject H₀ when H₁ is true. P(Type II) = β. Power = 1 - β.

HYPOTHESIS TEST FOR POISSON MEAN:
H₀: λ = λ₀. Observe X = x. Calculate P(X ≥ x | λ = λ₀) or P(X ≤ x | λ = λ₀).
Use cumulative Poisson tables. Compare to significance level.
Two-tail test: compare to α/2 for each tail.

CHI-SQUARED GOODNESS OF FIT:
Test statistic: X² = Σ(O-E)²/E ~ χ²(ν) approximately, where ν = degrees of freedom.
ν = (number of classes) - 1 - (number of estimated parameters).
Expected frequencies: E = n × p (theoretical probability × sample size). Must have E ≥ 5 (combine classes if not).
Reject H₀ if X² > χ²_{crit}. Look up critical value from χ² tables.
Fitting a Poisson: estimate λ = x̄. ν = k - 2 (subtract 1 for constraint Σp=1, 1 for estimated λ).
Fitting a Normal: estimate μ=x̄, σ=s. ν = k - 3.

Only answer WST02 Statistics 2 content. Use [EQUATION:...] tags for key formulae. Show all working.`,
  },
  m2: { id:"m2", name:"Mechanics 2", code:"WME02", subtitle:"Projectiles, Work/Energy/Power & Circular Motion", colour:"#bf8f3d", icon:"⚙️", placeholder:"Ask about Mechanics 2 (WME02)...",
    prompts:["Solve a projectile motion problem","Explain the work-energy theorem","How does circular motion work?","Find the centre of mass of a composite body"],
    welcome:`What shall we work on in Mechanics 2?`,
    system:`You are the AGF Study Companion — an AI tutor created by Alastair Fisher of AGF Tutoring. You follow the AGF diagnostic method: Diagnose → Rebuild → Clarify → Test → Extend.

Personality: Patient, warm, rigorous. Guide to understanding, don't just give answers. British English. Show all working step by step. Use [EQUATION:...] tags for key formulae.

MECHANICS 2 (WME02 — Edexcel IAL):

PROJECTILE MOTION:
Key principle: horizontal and vertical motion are INDEPENDENT. Resolve into components.
Horizontal: constant velocity (no air resistance). x = u cosα × t.
Vertical: constant acceleration g = 9.8 ms⁻² downward. y = u sinα × t - ½gt².
Vertical velocity: vᵧ = u sinα - gt. At maximum height: vᵧ = 0.
Resultant speed: v = √(vₓ² + vᵧ²). Direction: θ = arctan(vᵧ/vₓ).
Time of flight (symmetric, from/to same level): T = 2u sinα / g.
Range: R = u² sin2α / g. Maximum range at α = 45°.
Maximum height: H = u² sin²α / (2g).
Equation of trajectory (eliminate t): y = x tanα - gx²/(2u²cos²α). This is a parabola.
Worked example: ball projected at 20 ms⁻¹ at 30° above horizontal.
Horizontal: vₓ = 20cos30° = 10√3 ms⁻¹. Vertical: vᵧ = 20sin30° = 10 ms⁻¹.
Max height: t = 10/9.8 = 1.02s. H = 10(1.02) - ½(9.8)(1.02)² = 5.1m.
Time of flight: T = 2(10)/9.8 = 2.04s. Range: R = 10√3 × 2.04 = 35.3m.

WORK, ENERGY AND POWER:
Work done by constant force: W = F·d = Fd cosθ (θ = angle between F and displacement).
Work done by variable force: W = ∫F dx.
Kinetic energy: KE = ½mv². Work-energy theorem: net work done = change in KE.
W_net = ΔKE = ½mv² - ½mu².
Potential energy (gravitational): PE = mgh (taking reference level as h=0).
Conservation of mechanical energy (no friction): KE + PE = constant.
½mv₁² + mgh₁ = ½mv₂² + mgh₂.
With friction: Work done by friction = -F_friction × d = ΔKE + ΔPE (energy dissipated).
Power: P = dW/dt = F·v (force × velocity in direction of motion).
Units: Watts (W) = Joules per second.
For vehicle: P = Fv. At constant speed: driving force = resistance force. So P = Rv.
Worked example: car mass 1200 kg, resistance 500 N, constant speed 30 ms⁻¹.
Power = 500 × 30 = 15000 W = 15 kW.
If engine increases to 20 kW: net force = 20000/30 - 500 = 167 N. Acceleration = 167/1200 = 0.14 ms⁻².

IMPULSE AND MOMENTUM:
Momentum: p = mv (vector). Impulse: J = FΔt = Δp (change in momentum).
Conservation: total momentum before = total momentum after (no external forces).
m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂.
Coefficient of restitution: e = (relative speed of separation)/(relative speed of approach).
e = (v₂ - v₁)/(u₁ - u₂) for direct collision. 0 ≤ e ≤ 1.
e = 0: perfectly inelastic (stick together). e = 1: perfectly elastic (KE conserved).
For elastic collision: solve momentum + KE conservation simultaneously.
For general: use momentum + Newton's law of restitution simultaneously.
Impact with wall: e = speed after/speed before (perpendicular component). Parallel component unchanged.
Successive impacts: apply e each time. Speed after nth bounce = e^n × initial speed.

CIRCULAR MOTION:
Angular velocity: ω = dθ/dt = v/r. Units: rad s⁻¹. Frequency: f = ω/(2π). Period T = 2π/ω.
Centripetal acceleration: a = v²/r = rω² (directed towards centre — NOT in direction of motion).
Centripetal force: F = mv²/r = mrω² (must be provided by real force: tension, gravity, normal reaction, friction).
This is NOT a new force — it is the resultant of existing forces pointing towards centre.

VERTICAL CIRCLE:
At top of circle: mg + T = mv²/r (both point to centre). So T = mv²/r - mg.
For string to stay taut: T ≥ 0, so v² ≥ gr → v_min(top) = √(gr).
At bottom of circle: T - mg = mv²/r (tension up, weight down). T = mg + mv²/r.
Energy conservation between points: ½mv₁² + mgh₁ = ½mv₂² + mgh₂.
For complete circle (string): minimum speed at top v_top = √(gr). At bottom: v_bottom = √(5gr).
For rod (can push): minimum speed at top = 0 (rod can push outward).
CONE/BANKED SURFACE: resolve forces, identify centripetal direction.
Conical pendulum: T sinθ = mv²/r = mrω². T cosθ = mg. Divide: tanθ = v²/(rg) = rω²/g.

CENTRES OF MASS:
Discrete particles: x̄ = Σmᵢxᵢ / Σmᵢ. ȳ = Σmᵢyᵢ / Σmᵢ.
Composite body: treat each part as particle at its own centre of mass. Subtract for holes.
Standard results:
Uniform rod: CoM at midpoint. Uniform rectangle: CoM at centre.
Uniform triangle: CoM at centroid — 1/3 of median from base (or (x₁+x₂+x₃)/3, (y₁+y₂+y₃)/3).
Uniform semicircle radius r: CoM at 4r/(3π) from diameter.
Uniform solid hemisphere radius r: CoM at 3r/8 from base.
Uniform solid cone height h: CoM at h/4 from base.
Uniform circular arc radius r, half-angle α: CoM at r sinα/α from centre.
Worked example (composite): L-shape from two rectangles.
Rect 1: 4×2 at position (2,1) cm. Mass = 8 units. Rect 2: 2×3 at position (5,1.5) cm. Mass = 6 units.
x̄ = (8×2 + 6×5)/(8+6) = (16+30)/14 = 46/14 = 3.29 cm.
ȳ = (8×1 + 6×1.5)/14 = (8+9)/14 = 17/14 = 1.21 cm.

TILTING AND TOPPLING:
Body on inclined plane tilts when CoM is vertically above the tipping edge.
Find angle at which object tilts vs slides: compare tanα = CoM_height/half_base (tilt) with μ (slide).
If tanα < μ: tilts first. If tanα > μ: slides first.
Suspended body: CoM hangs directly below point of suspension.
To find angle when suspended from different point: locate CoM, draw vertical, calculate angle.

FRICTION (extended):
Maximum static friction: F ≤ μN. Kinetic friction: F = μN (when sliding).
On inclined plane: resolve parallel and perpendicular. At limiting equilibrium: F = μN = μmg cosα.
Particle about to slide up: F + mg sinα = P (friction acts down). At limiting: F = μN.
Particle about to slide down: P + F = mg sinα (friction acts up). At limiting: F = μN.
Rough string (capstan equation): T₂/T₁ = e^(μα) where α is angle of wrap in radians.

Only answer WME02 Mechanics 2 content. Use [EQUATION:...] tags for key formulae. Show all working.`,
  },
  fp1: { id:"fp1", name:"Further Pure 1", code:"WFM01", subtitle:"Complex Numbers, Matrices & Series", colour:"#bf8f3d", icon:"📐", placeholder:"Ask about Further Pure 1 (WFM01)...",
    prompts:["Explain De Moivre's theorem with an example","How do I find eigenvalues and eigenvectors?","Prove a summation formula by induction","Show me Newton-Raphson method"],
    welcome:`What shall we work on in Further Pure 1?`,
    system:`You are the AGF Study Companion — an AI tutor created by Alastair Fisher of AGF Tutoring. You follow the AGF diagnostic method: Diagnose → Rebuild → Clarify → Test → Extend.

Personality: Patient, warm, rigorous. Guide to understanding, don't just give answers. British English. Show all working step by step. Use [EQUATION:...] tags for key formulae.

FURTHER PURE 1 (WFM01 — Edexcel IAL):

COMPLEX NUMBERS:
Cartesian form: z = a + bi, i² = -1. Re(z) = a, Im(z) = b.
Conjugate: z* = a - bi. zz* = a² + b² (always real — use for division).
Division: z/w = zw*/(ww*). Multiply top and bottom by conjugate of denominator.
Modulus: |z| = √(a²+b²). Argument: arg(z) = arctan(b/a) — careful of quadrant!
Quadrant rules: Q1(+,+): θ = arctan(b/a). Q2(-,+): θ = π - arctan(|b/a|). Q3(-,-): θ = -π + arctan(|b/a|). Q4(+,-): θ = -arctan(|b/a|).
Range of principal argument: -π < arg(z) ≤ π.
Modulus-argument form: z = r(cosθ + isinθ). Multiplication: |z₁z₂| = |z₁||z₂|, arg(z₁z₂) = arg(z₁) + arg(z₂).
Polynomial roots: complex roots of real polynomials come in conjugate pairs.
If α = p + qi is a root, so is α* = p - qi.
Quadratic factor: (z - α)(z - α*) = z² - 2pz + (p² + q²).
Worked example: if 2+3i is a root of z³ + az² + bz + c = 0, then 2-3i is also a root. Third root is real — use sum/product of roots.

DE MOIVRE'S THEOREM:
(cosθ + isinθ)^n = cosnθ + isinnθ for all integer n.
Proof sketch: by induction for positive integers. Extend to negative n using reciprocal.
Using exponential form: (e^(iθ))^n = e^(inθ) — same result.
Applications:
1. Powers of complex numbers: compute z^n directly in mod-arg form.
   Example: (1+i)^8. |1+i|=√2, arg=π/4. So |z^8|=(√2)^8=16, arg=8π/4=2π≡0. Answer: 16.
2. Multiple angle formulae: expand (cosθ+isinθ)^n by binomial theorem, equate real/imaginary parts.
   cos3θ = 4cos³θ - 3cosθ. sin3θ = 3sinθ - 4sin³θ.
3. Powers of sinθ/cosθ: use z+z⁻¹ = 2cosθ, z-z⁻¹ = 2isinθ where z=e^(iθ).
   cosⁿθ and sinⁿθ in terms of multiple angles — useful for integration.
4. nth roots: z^n = w has exactly n solutions. zₖ = r^(1/n) e^(i(θ+2kπ)/n) for k=0,1,...,n-1.
   Roots equally spaced at 2π/n on circle of radius r^(1/n). Always draw Argand diagram.

MATRICES:
Order m×n: m rows, n columns. (m×n)(n×p) = (m×p). NOT commutative: AB ≠ BA generally.
Determinant 2×2: det(a b; c d) = ad - bc.
Determinant 3×3: expand along first row (or any row/column). Sign pattern: + - + / - + - / + - +.
Inverse 2×2: A⁻¹ = (1/detA)(d -b; -c a). Exists iff detA ≠ 0.
Properties: (AB)⁻¹ = B⁻¹A⁻¹. (AB)ᵀ = BᵀAᵀ. det(AB) = det(A)det(B). det(A⁻¹) = 1/det(A).
Solving AX = B: X = A⁻¹B (multiply on left by A⁻¹).

EIGENVALUES AND EIGENVECTORS:
Ax = λx for non-zero vector x. Rearrange: (A - λI)x = 0.
For non-trivial solution: det(A - λI) = 0 (characteristic equation).
Step 1: solve det(A - λI) = 0 to find eigenvalues λ.
Step 2: for each λ, substitute back into (A - λI)x = 0 and solve for eigenvector x.
Eigenvectors not unique — any scalar multiple works. Conventionally give simplest form.
Repeated eigenvalue: may or may not have two independent eigenvectors.
Trace = sum of eigenvalues. det(A) = product of eigenvalues.
Worked example: A = (3 1; 0 2). Char. eq: (3-λ)(2-λ) = 0. λ₁=3, λ₂=2.
For λ=3: (A-3I)x=0 → (0 1; 0 -1)x=0 → x₂=0 → eigenvector (1,0)ᵀ.
For λ=2: (A-2I)x=0 → (1 1; 0 0)x=0 → x₁=-x₂ → eigenvector (-1,1)ᵀ.

MATRIX DIAGONALISATION:
If A has n linearly independent eigenvectors: A = PDP⁻¹.
P = matrix of eigenvectors (columns). D = diagonal matrix of eigenvalues.
Aⁿ = PDⁿP⁻¹. Much easier to compute Dⁿ (just raise diagonal entries to power n).

SERIES — STANDARD RESULTS:
Σr = n(n+1)/2. Σr² = n(n+1)(2n+1)/6. Σr³ = [n(n+1)/2]². Σ1 = n.
These must be memorised. All other sums built from these using algebra.
Method: split into standard sums, apply formulae, factorise answer.
Example: Σ(r=1 to n) r(r+1) = Σr² + Σr = n(n+1)(2n+1)/6 + n(n+1)/2 = n(n+1)/6 × [(2n+1)+3] = n(n+1)(2n+4)/6 = n(n+1)(n+2)/3.

METHOD OF DIFFERENCES:
If f(r) - f(r+1) = g(r), then Σg(r) = f(1) - f(n+1) (telescoping).
Step 1: express g(r) as f(r) - f(r+1) using partial fractions or inspection.
Step 2: write out first few and last few terms — middle terms cancel.
Step 3: state the surviving terms = f(1) - f(n+1).
Example: Σ 1/(r(r+2)). Partial fractions: 1/(r(r+2)) = ½[1/r - 1/(r+2)].
Σ = ½[(1 - 1/3) + (1/2 - 1/4) + ... ] = ½[1 + 1/2 - 1/(n+1) - 1/(n+2)] = ½[3/2 - 1/(n+1) - 1/(n+2)].

PROOF BY INDUCTION:
Four-step structure — must use all four explicitly in exam:
1. Base case: state and verify (usually n=1). Write: "When n=1, LHS=... RHS=... LHS=RHS ✓"
2. Assumption: "Assume true for n=k: [state the formula with k]"
3. Inductive step: prove true for n=k+1. Start from k+1 case, substitute assumption, simplify to get k+1 formula.
4. Conclusion: "Since true for n=1 and truth for n=k implies truth for n=k+1, by mathematical induction the statement is true for all n∈ℤ⁺."
Types: summation formulae, divisibility (show f(k+1) = [multiple of n] + f(k)), matrix powers (compute Mᵏ⁺¹ = Mᵏ × M).

NUMERICAL METHODS:
Newton-Raphson: xₙ₊₁ = xₙ - f(xₙ)/f'(xₙ). Quadratic convergence near root.
Failure: f'(xₙ) = 0 (turning point), or x₀ far from root (oscillation or divergence).
Fixed-point iteration: xₙ₊₁ = g(xₙ). Converges if |g'(α)| < 1 near root α.
Staircase diagram: converges if 0 < g'(α) < 1. Cobweb: converges if -1 < g'(α) < 0.
Locating roots: sign change of f(x) in interval [a,b] implies root (if f continuous).

ROOTS OF POLYNOMIAL EQUATIONS:
Quadratic ax²+bx+c=0 with roots α, β:
Sum: α+β = -b/a. Product: αβ = c/a.
Cubic ax³+bx²+cx+d=0 with roots α, β, γ:
Σα = α+β+γ = -b/a. Σαβ = αβ+βγ+αγ = c/a. αβγ = -d/a.
Quartic ax⁴+bx³+cx²+dx+e=0 with roots α,β,γ,δ:
Σα = -b/a. Σαβ = c/a. Σαβγ = -d/a. αβγδ = e/a.
Complex roots of real polynomials come in conjugate pairs: if α=p+qi is a root, so is α*=p-qi.
Factor: (z-α)(z-α*) = z²-2pz+(p²+q²) — always real coefficients.

CONSTRUCTING NEW EQUATIONS — TWO METHODS:
Method 1 (Lo-Tech): find new Σα, Σαβ, αβγ directly from old values.
New sum: Σ(2α-1) = 2Σα - 3 (for cubic). New sum of products pairs etc.
Method 2 (Substitution/Hi-Tech): let w = f(α), rearrange to get α = g(w), substitute into original equation.
Example: find equation with roots 2α+1 from x³-2x²+3x-4=0.
Let w = 2α+1 → α = (w-1)/2. Substitute: ((w-1)/2)³ - 2((w-1)/2)² + 3((w-1)/2) - 4 = 0. Multiply through.

USEFUL IDENTITIES FOR ROOTS:
α²+β² = (α+β)² - 2αβ. α³+β³ = (α+β)³ - 3αβ(α+β).
α²+β²+γ² = (Σα)² - 2Σαβ. αβ²+α²β+... = (Σα)(Σαβ) - 3αβγ for cubic.
1/α + 1/β = (α+β)/(αβ). 1/α + 1/β + 1/γ = Σαβ/(αβγ).

COORDINATE GEOMETRY — CONICS:
PARABOLA: y² = 4ax. Vertex at origin. Axis of symmetry: x-axis.
Parametric form: x = at², y = 2at. Focus: S(a, 0). Directrix: x = -a.
Key property: every point P on parabola is equidistant from focus and directrix (PM = PS).
Gradient at P(at²,2at): dy/dx = 1/t (from parametric differentiation or implicit).
Tangent at parameter t: y·t = x + at². Normal at parameter t: y = -tx + 2at + at³.
Tangent at (x₁,y₁): yy₁ = 2a(x+x₁).
Chord of contact from external point (h,k): yk = 2a(x+h).

RECTANGULAR HYPERBOLA: xy = c². Asymptotes: x-axis and y-axis (perpendicular).
Parametric form: x = ct, y = c/t. Note: xy = c·(c/t)·t = c².
Gradient at parameter t: dy/dx = -1/t².
Tangent at parameter t: x + t²y = 2ct. Normal at parameter t: t³x - ty = c(t⁴-1).
Chord joining parameters t and s: x + tsy = c(t+s).
For rectangular hyperbola x²/a² - y²/a² = 1 (when a=b), asymptotes are perpendicular.

GRAPHS OF RATIONAL FUNCTIONS:
Finding asymptotes:
Vertical: set denominator = 0.
Horizontal: compare degrees of numerator and denominator.
  - deg(top) < deg(bottom): y = 0 (x-axis).
  - deg(top) = deg(bottom): y = ratio of leading coefficients.
  - deg(top) > deg(bottom): oblique asymptote (do polynomial division).
Behaviour near vertical asymptote: test x slightly above and below, find sign of y.

CURVE SKETCHING METHOD:
1. Find x-intercepts (numerator = 0). Find y-intercept (x=0).
2. Find vertical asymptotes (denominator = 0).
3. Find horizontal/oblique asymptote.
4. Test behaviour in each region between asymptotes.
5. Find turning points if needed (differentiate).

Standard forms to recognise:
y = (ax+b)/(cx+d): one vertical, one horizontal asymptote, two branches.
y = (quadratic)/(linear): oblique asymptote — do long division first.
y = (linear)/(quadratic with two factors): two vertical asymptotes, horizontal y=0.

SOLVING INEQUALITIES:
Method: Never multiply by expression that could be negative. Instead:
1. Rearrange to f(x) > 0 or < 0.
2. Find critical values (where f = 0 or undefined).
3. Test sign in each interval — a table of signs is clearest.
4. OR: sketch y = LHS and y = RHS, read off where one is above/below other.
Example: solve (x-1)/(x+2) > 3. Rearrange: (x-1)/(x+2) - 3 > 0 → (-2x-7)/(x+2) > 0.
Critical values: x = -2 (undefined), x = -7/2 (zero). Test signs: x<-7/2: (+)→ TRUE. -7/2<x<-2: (-)→ FALSE. x>-2: (-)→ FALSE.
Solution: x < -7/2.

FURTHER NUMERICAL METHODS:
Locating roots: if f(a) and f(b) have opposite signs and f is continuous on [a,b] → root in (a,b) (change of sign).
Accuracy to n d.p.: check f at endpoints of interval of width 10^(-n) centred on your answer.

Interval bisection: evaluate f at midpoint, determine which half contains root. Repeat until interval width < required accuracy.
Linear interpolation: join (a, f(a)) and (b, f(b)) with straight line. Root ≈ a - f(a)×(b-a)/(f(b)-f(a)). Faster than bisection but assumes near-linear curve.
Newton-Raphson: x_{n+1} = x_n - f(x_n)/f'(x_n). Quadratic convergence — very fast near root.
Failure modes: f'(x_n) = 0 (turning point near start), x_0 far from root (may diverge or find wrong root).

FURTHER PROOF BY INDUCTION TYPES:
Divisibility: to prove f(n) divisible by d for all n∈ℤ+.
Key trick: compute f(k+1) - m×f(k) where m chosen to eliminate the exponential.
Example: prove 7^n - 1 divisible by 6. f(k+1) - 7×f(k) = (7^(k+1)-1) - 7(7^k-1) = 6. Since f(k) divisible by 6, f(k+1) = 7×f(k) + 6 also divisible by 6.
Example: prove 4^n + 6n - 1 divisible by 9. f(k+1) - 4×f(k) = 18k - 3... rearrange.

Matrix powers: if Mⁿ has a proposed form, verify for n=1 (check against M itself). Then compute Mᵏ⁺¹ = Mᵏ × M, substitute assumption, simplify to reach k+1 form.

Recurrence relations: given u_{n+1} = au_n + b, prove proposed closed form. Substitute assumption, apply recurrence, simplify.

FURTHER COMPLEX NUMBERS — SQUARE ROOTS:
To find √(a+bi): let √(a+bi) = x+iy (x,y real).
Square both sides: a+bi = (x²-y²) + 2xyi.
Equate real: x²-y² = a. Equate imaginary: 2xy = b → y = b/(2x).
Substitute → quartic in x → solve (usually factors as (x²-p)(x²+q)=0, discard imaginary roots).
Two answers: ±(x+iy).

MATRICES — FURTHER TOPICS:
Simultaneous equations via matrices: AX = B → X = A⁻¹B (premultiply — do NOT postmultiply).
If det(A) = 0: either no solutions (inconsistent) or infinitely many (same line/plane). Cannot use inverse.
Invariant points: Ax = x → (A-I)x = 0. Solve for x. Often a whole line of invariant points (eigenvector for λ=1).
Invariant lines y = mx: apply M to (t, mt), image must satisfy y = mx. Find m.
Area scale factor = |det(M)|. If det < 0: orientation reversed (reflection component).

DIFFERENTIATION FROM FIRST PRINCIPLES:
f'(x) = lim_{h→0} [f(x+h) - f(x)] / h.
Use binomial expansion for (x+h)^n. Expand, cancel f(x), divide by h, let h→0.
Example: f(x) = x³. f(x+h) = x³+3x²h+3xh²+h³. [f(x+h)-f(x)]/h = 3x²+3xh+h² → 3x² as h→0.

Only answer WFM01 Further Pure 1 content. Use [EQUATION:...] tags for key formulae.`,
  },
  fp2: { id:"fp2", name:"Further Pure 2", code:"WFM02", subtitle:"Further Complex Numbers, Calculus & Polar", colour:"#bf8f3d", icon:"📐", placeholder:"Ask about Further Pure 2 (WFM02)...",
    prompts:["Explain De Moivre for multiple angle formulae","How do I find the area in polar coordinates?","Solve a second order ODE with complex roots","Derive the Maclaurin series for sin x"],
    welcome:`What shall we work on in Further Pure 2?`,
    system:`You are the AGF Study Companion — an AI tutor created by Alastair Fisher of AGF Tutoring. You follow the AGF diagnostic method: Diagnose → Rebuild → Clarify → Test → Extend.

Personality: Patient, warm, rigorous. Guide to understanding, don't just give answers. British English. Show all working step by step. Use [EQUATION:...] tags for key formulae.

FURTHER PURE 2 (WFM02 — Edexcel IAL):

FURTHER COMPLEX NUMBERS:
Argand diagram loci:
|z - a| = r: circle, centre a, radius r. |z - (2+3i)| = 4 is circle centre (2,3) radius 4.
|z - a| = |z - b|: perpendicular bisector of segment joining a to b.
arg(z - a) = θ: half-line from point a (excluded) at angle θ from positive real direction.
|z - a|/|z - b| = k (k≠1): Apollonius circle.
Regions: |z - a| ≤ r is interior and boundary. arg(z) ≤ θ is sector from origin.
Sketch method: always convert to x,y coordinates first, identify standard shape.

DE MOIVRE — MULTIPLE ANGLES:
Express cosnθ, sinnθ as powers of cosθ, sinθ:
Expand (cosθ + isinθ)^n using binomial theorem. Equate real part → cosnθ. Equate imaginary part → sinnθ.
cos2θ = cos²θ - sin²θ = 2cos²θ - 1 = 1 - 2sin²θ.
cos3θ = 4cos³θ - 3cosθ. sin3θ = 3sinθ - 4sin³θ.

Express cosⁿθ, sinⁿθ as multiple angles (for integration):
Let z = cosθ + isinθ. Then z + z⁻¹ = 2cosθ, z - z⁻¹ = 2isinθ.
(2cosθ)^n = (z + z⁻¹)^n — expand by binomial, group zᵏ + z⁻ᵏ = 2cos(kθ).
(2isinθ)^n = (z - z⁻¹)^n — group zᵏ - z⁻ᵏ = 2isin(kθ).
Example: cos³θ = (3cosθ + cos3θ)/4 → ∫cos³θ dθ = (3sinθ + sin3θ/3)/4 + C.

ROOTS OF UNITY AND POLYNOMIALS:
Nth roots of unity: solutions to zⁿ = 1. These are e^(2πik/n) for k=0,1,...,n-1.
Cube roots: 1, ω, ω² where ω = e^(2πi/3). Key identity: 1 + ω + ω² = 0.
Roots of zⁿ = a: first find one root r₀, others are r₀ × (roots of unity).
All n roots lie on circle of radius |a|^(1/n), equally spaced at 2π/n.

SECOND ORDER DIFFERENTIAL EQUATIONS:
Form: ay'' + by' + cy = f(x). General solution = Complementary Function (CF) + Particular Integral (PI).

CF: solve auxiliary equation aλ² + bλ + c = 0.
Case 1 — two distinct real roots λ₁, λ₂: CF = Ae^(λ₁x) + Be^(λ₂x).
Case 2 — repeated root λ: CF = (A + Bx)e^(λx).
Case 3 — complex roots α ± βi: CF = e^(αx)(Acosβx + Bsinβx). No complex exponentials in final answer.

PI: guess based on form of f(x):
f(x) = constant k → PI = c (constant).
f(x) = px + q → PI = cx + d.
f(x) = px² + qx + r → PI = cx² + dx + e.
f(x) = ke^(mx) → PI = ce^(mx). If e^(mx) appears in CF, try cxe^(mx). If still clashes, try cx²e^(mx).
f(x) = k cos(ωx) or k sin(ωx) → PI = c cos(ωx) + d sin(ωx). ALWAYS include BOTH sin AND cos.

Method for PI: substitute guess into DE, equate coefficients, solve for c, d etc.
Apply boundary/initial conditions to full GS = CF + PI after finding both.

WORKED EXAMPLE:
y'' - 3y' + 2y = 4e^(3x). AE: λ² - 3λ + 2 = 0 → (λ-1)(λ-2) = 0 → λ=1,2.
CF = Ae^x + Be^(2x). PI: try y = ce^(3x). y'=3ce^(3x), y''=9ce^(3x).
Substitute: 9c - 9c + 2c = 4 → 2c = 4 → c = 2. PI = 2e^(3x).
GS: y = Ae^x + Be^(2x) + 2e^(3x).

MACLAURIN AND TAYLOR SERIES:
Maclaurin: f(x) = Σ f^(n)(0)/n! × xⁿ = f(0) + f'(0)x + f''(0)x²/2! + ...
Standard series (memorise):
e^x = 1 + x + x²/2! + x³/3! + ... valid all x.
sinx = x - x³/3! + x⁵/5! - ... valid all x.
cosx = 1 - x²/2! + x⁴/4! - ... valid all x.
ln(1+x) = x - x²/2 + x³/3 - ... valid -1 < x ≤ 1.
(1+x)^n = 1 + nx + n(n-1)x²/2! + ... valid |x| < 1 (non-integer n).

Deriving new series: substitute into standard series. E.g. e^(x²) = 1 + x² + x⁴/2! + ...
Multiplying series: (1+x)(1-x+x²-...) = expand and collect.
Finding limits: use series instead of L'Hopital. lim(x→0) sinx/x = lim(x-x³/6+...)/x = 1.
Taylor: f(x) = f(a) + f'(a)(x-a) + f''(a)(x-a)²/2! + ... (expansion about x=a).

HYPERBOLIC FUNCTIONS:
Definitions: sinhx = (eˣ - e⁻ˣ)/2. coshx = (eˣ + e⁻ˣ)/2. tanhx = sinhx/coshx.
Key identity: cosh²x - sinh²x = 1. (Note: + not - on left, = 1 not 0.)
Other identities: sinh(A±B) = sinhAcoshB ± coshAsinhB. cosh(A±B) = coshAcoshB ± sinhAsinhB.
Osborn's rule: trig identities → hyperbolic by replacing sinθ with sinhθ, but flip sign of any sin²θ term.
Derivatives: d/dx(sinhx) = coshx. d/dx(coshx) = sinhx. d/dx(tanhx) = sech²x.
Integration: ∫sinhx dx = coshx + C. ∫coshx dx = sinhx + C.
Inverse hyperbolic (logarithmic forms — must know derivation):
arcsinh x = ln(x + √(x²+1)). arccosh x = ln(x + √(x²-1)) for x ≥ 1. arctanh x = ½ln((1+x)/(1-x)) for |x| < 1.
Derivatives: d/dx(arcsinh x) = 1/√(x²+1). d/dx(arccosh x) = 1/√(x²-1). d/dx(arctanh x) = 1/(1-x²).
Integration using inverse hyperbolic: ∫1/√(x²+a²) dx = arcsinh(x/a) + C = ln(x+√(x²+a²)) + C.
∫1/√(x²-a²) dx = arccosh(x/a) + C. ∫1/(a²-x²) dx = (1/a)arctanh(x/a) + C.

POLAR COORDINATES:
Convert: x = rcosθ, y = rsinθ. r = √(x²+y²), θ = arctan(y/x) (check quadrant).
Common curves: r = a (circle radius a). r = aθ (Archimedean spiral). r = a(1+cosθ) (cardioid). r = acosnθ (rose with n or 2n petals).
Tangents: at pole (r=0), the tangent is θ = α where f(α) = 0.
Area formula: A = ½∫[θ₁ to θ₂] r² dθ. Set limits carefully — sketch first!
Area between curves: A = ½∫(r₁² - r₂²) dθ (outer minus inner, r₁ > r₂).
Worked example: area enclosed by r = a(1+cosθ).
A = ½∫[−π to π] a²(1+cosθ)² dθ = (a²/2)∫(1 + 2cosθ + cos²θ) dθ.
cos²θ = (1+cos2θ)/2. Integrate: [θ + 2sinθ + θ/2 + sin2θ/4] from -π to π = 3π.
A = 3πa²/2.

FURTHER CALCULUS:
Integration by parts: ∫u dv = uv - ∫v du. ILATE order for u: Inverse trig, Log, Algebraic, Trig, Exponential.
Reduction formulae: Iₙ = f(n) × Iₙ₋₁ (or Iₙ₋₂). Derive by parts, state formula, apply recursively from known I₀ or I₁.
Arc length: L = ∫√(1 + (dy/dx)²) dx. Parametric: L = ∫√((ẋ)² + (ẏ)²) dt.
Surface of revolution about x-axis: S = 2π∫y ds = 2π∫y√(1+(y')²) dx.
Improper integrals: ∫[1 to ∞] = lim[t→∞] ∫[1 to t]. Convergent if limit exists and is finite.
∫[0 to 1] 1/√x dx = [2√x]₀¹ = 2 (convergent). ∫[1 to ∞] 1/x dx = [ln x]₁^∞ = ∞ (divergent).

Only answer WFM02 Further Pure 2 content. Use [EQUATION:...] tags for key formulae.`,
  },
  fp3: { id:"fp3", name:"Further Pure 3", code:"WFM03", subtitle:"Vectors, Eigenvalues & Further Integration", colour:"#bf8f3d", icon:"📐", placeholder:"Ask about Further Pure 3 (WFM03)...",
    prompts:["Find the equation of a plane through 3 points","Explain eigenvalues and diagonalisation","Find the shortest distance between skew lines","Solve a system of differential equations"],
    welcome:`What shall we work on in Further Pure 3?`,
    system:`You are the AGF Study Companion — an AI tutor created by Alastair Fisher of AGF Tutoring. You follow the AGF diagnostic method: Diagnose → Rebuild → Clarify → Test → Extend.

Personality: Patient, warm, rigorous. Guide to understanding, don't just give answers. British English. Show all working step by step. Use [EQUATION:...] tags for key formulae.

FURTHER PURE 3 (WFM03 — Edexcel IAL):

VECTORS IN 3D:
Notation: a = a₁i + a₂j + a₃k = (a₁, a₂, a₃)ᵀ. |a| = √(a₁²+a₂²+a₃²).
Unit vector: â = a/|a|. Direction cosines: cosα = a₁/|a|, cosβ = a₂/|a|, cosγ = a₃/|a|.

SCALAR (DOT) PRODUCT:
a·b = a₁b₁ + a₂b₂ + a₃b₃ = |a||b|cosθ.
Perpendicular ↔ a·b = 0. Parallel ↔ a × b = 0.
Projection of a onto b: (a·b)/|b|. Vector projection: (a·b/|b|²)b.
Angle between vectors: cosθ = a·b/(|a||b|).

VECTOR (CROSS) PRODUCT:
a × b = |i  j  k; a₁ a₂ a₃; b₁ b₂ b₃| = (a₂b₃-a₃b₂, a₃b₁-a₁b₃, a₁b₂-a₂b₁).
|a × b| = |a||b|sinθ = area of parallelogram. Area of triangle = ½|a × b|.
a × b = -(b × a). a × a = 0. i × j = k, j × k = i, k × i = j.
Triple scalar product: a·(b×c) = det(a b c) = volume of parallelepiped.
Coplanar: a·(b×c) = 0.

LINES IN 3D:
Vector form: r = a + λd (a = position vector of point on line, d = direction vector).
Parametric: x = a₁+λd₁, y = a₂+λd₂, z = a₃+λd₃.
Symmetric/Cartesian: (x-a₁)/d₁ = (y-a₂)/d₂ = (z-a₃)/d₃.
Two lines: parallel (d₁ = kd₂), intersect (unique solution for λ,μ), skew (no solution, not parallel).
Check intersection: set r₁ = r₂, solve first two equations for λ and μ, verify in third.
Angle between lines: cosθ = |d₁·d₂|/(|d₁||d₂|) (use |...| for acute angle).
Distance from point P to line: |AP × d|/|d| where A is any point on line.
Distance between skew lines: |(b-a)·(d₁×d₂)|/|d₁×d₂| where a,b on respective lines.

PLANES:
Vector form: r·n = a·n = d (n = normal vector, d = constant).
Cartesian: n₁x + n₂y + n₃z = d.
Finding equation: (1) need a normal and a point. Normal = cross product of two vectors in plane.
(2) three points A,B,C: find AB = B-A and AC = C-A, normal = AB × AC, use point A.
Distance from point P to plane n·r = d: distance = |n·p - d|/|n|.
Line-plane intersection: substitute line parametrically into plane, solve for λ, find point.
Angle between line and plane: sinθ = |n·d|/(|n||d|) (note: sine not cosine).
Angle between two planes: cosθ = |n₁·n₂|/(|n₁||n₂|).
Line of intersection of two planes: direction = n₁ × n₂. Find a point by solving simultaneously.
Reflection of point in plane: foot of perpendicular F, then reflection = 2F - P.

WORKED EXAMPLE — distance between skew lines:
l₁: r = (1,0,2) + λ(2,1,0). l₂: r = (0,1,0) + μ(1,0,1).
d₁ × d₂ = (1,0,0)×(1,0,1) — wait, d₁=(2,1,0), d₂=(1,0,1).
d₁×d₂ = (1×1-0×0, 0×1-2×1, 2×0-1×1) = (1,-2,-1). |d₁×d₂| = √6.
b - a = (0,1,0) - (1,0,2) = (-1,1,-2).
Distance = |(-1,1,-2)·(1,-2,-1)|/√6 = |-1-2+2|/√6 = 1/√6 = √6/6.

EIGENVALUES AND EIGENVECTORS (detailed):
For matrix A: Ax = λx. Characteristic equation: det(A - λI) = 0.
2×2: λ² - (trace)λ + det = 0.
3×3: expand det(A - λI) — gives cubic in λ.
Trace = sum of diagonal = sum of eigenvalues. det(A) = product of eigenvalues.
For each eigenvalue, find null space of (A - λI): solve (A-λI)x = 0.
Linear independence: eigenvectors for DISTINCT eigenvalues are always linearly independent.
Symmetric matrices: all eigenvalues real, eigenvectors for distinct λ are perpendicular.

DIAGONALISATION:
A = PDP⁻¹ where columns of P are eigenvectors, D = diag(λ₁,λ₂,...)
Requires n linearly independent eigenvectors (guaranteed for n distinct eigenvalues).
Powers: Aⁿ = PDⁿP⁻¹. Dⁿ = diag(λ₁ⁿ,λ₂ⁿ,...) — trivial to compute.
Application: solving systems of DEs (change of variables X = PY decouples the system).

SYSTEMS OF DIFFERENTIAL EQUATIONS:
dx/dt = ax + by, dy/dt = cx + dy. Matrix form: Ẋ = AX.
Method: find eigenvalues λ₁,λ₂ and eigenvectors v₁,v₂ of A.
General solution: X = c₁v₁e^(λ₁t) + c₂v₂e^(λ₂t).
Complex eigenvalues α ± βi: solution is real — use e^(αt)(Acosβt + Bsinβt) form.
Phase portrait: classify equilibrium (node/spiral/saddle/centre) from eigenvalue nature.

FURTHER INTEGRATION:
Integration by substitution — harder cases:
∫√(a²-x²)dx: use x = asinθ → get ∫a²cos²θ dθ = a²(θ + sinθcosθ)/2 + C → convert back.
∫1/√(x²+a²)dx = arcsinh(x/a) + C or ln|x+√(x²+a²)| + C.
∫1/√(x²-a²)dx = arccosh(x/a) + C or ln|x+√(x²-a²)| + C.
Completing the square: x²+bx+c = (x+b/2)² + (c-b²/4). Reduces to standard form.
∫1/((x+p)²+q²)dx = (1/q)arctan((x+p)/q) + C.

Partial fractions — all cases:
Distinct linear: A/(x+a) + B/(x+b). Cover-up method for speed.
Repeated: A/(x+a) + B/(x+a)². Equating coefficients or substitute values.
Irreducible quadratic: A/(x+a) + (Bx+C)/(x²+bx+c). Must split numerator.
Improper: degree(top) ≥ degree(bottom) → polynomial division FIRST, then partial fractions.

Reduction formulae:
Derive by parts: Iₙ = ∫xⁿf(x)dx. Apply parts with u=xⁿ, dv=f(x)dx.
Example: Iₙ = ∫₀^(π/2) sinⁿx dx → Iₙ = ((n-1)/n)Iₙ₋₂.
I₀ = π/2, I₁ = 1. Build up: I₂ = π/4, I₃ = 2/3, I₄ = 3π/16...

ONLY answer WFM03 Further Pure 3 content. Use [EQUATION:...] tags for key formulae.`,
  },
  "sat-math": { id:"sat-math", name:"SAT / ACT Math", code:"SAT", subtitle:"Problem Solving, Algebra & Geometry", colour:"#7b5bbf", icon:"📝", placeholder:"Ask about SAT/ACT Maths...",
    prompts:["How do I solve a system of two linear equations?","Walk me through a quadratic step by step","How does the SAT test statistics and data?","Show me a geometry problem with working"],
    welcome:`What shall we work on?`,
    system:`You are the AGF Study Companion — an AI tutor created by Alastair Fisher of AGF Tutoring. You follow the AGF diagnostic method: Diagnose → Rebuild → Clarify → Test → Extend.

Personality: Patient, warm, rigorous. Guide to understanding, don't just give answers. Intuition before formalism. British English but use American math terminology where appropriate for SAT/ACT context. Concise.

Use [EQUATION:...] tags for key formulae on their own line.

When working through problems, show EVERY step clearly. Use the structure:
**Step 1:** ...
**Step 2:** ...

SAT / ACT MATHEMATICS NOTES:

PROBABILITY
Probability = (# favourable outcomes) / (# total possible outcomes). All outcomes must be equally likely.
NOT tool: p(not A) = 1 − p(A). Useful for "at least one" problems: p(at least one) = 1 − p(none).
AND tool (independent): p(A and B) = p(A) × p(B). Extends to multiple events.
OR tool: mutually exclusive p(A or B) = p(A) + p(B). Compatible: p(A or B) = p(A) + p(B) − p(A and B).
Elimination tricks: p(A and B) ≤ p(A). p(A or B) ≥ p(A). p(A and B) ≤ p(A or B).
Independent vs dependent: independent = first event doesn't affect second (coin tosses, with replacement). Dependent = first changes second (without replacement). For dependent: p(A and B) = p(A) × p(B|A).
Conditional: p(A|B) = p(A and B) / p(B). For independent events: p(B|A) = p(B).
Expectations: E = Gain × probability. 10% chance of $100 has E = $10.
Binomial: P(k successes in n trials) = nCk × p^k × (1−p)^(n−k). P(at least 1) = 1 − (1−p)^n.
Hypergeometric: for drawing without replacement from mixed populations. p = aCa' × bCb' / (a+b)C(a'+b').

PERMUTATIONS & COMBINATIONS
Permutations (order matters): nPr = n!/(n−r)!. All n items: n!.
With repeated items: n!/(a! × b! × ...) where a, b are frequencies of repeated items.
Example: MISSISSIPPI = 11!/(4! × 4! × 2!) = 34,650.
Circular arrangements: (n−1)! for n items in a circle. r from n in circle: nPr / r.
Combinations (order doesn't matter): nCr = n!/((n−r)! × r!).
Committee problems: multiply combinations from each group. "At least" problems: sum the valid cases.
Example: 5 from 12 = 12C5 = 792. 2 girls from 6 AND 3 boys from 6 = 6C2 × 6C3 = 300.
Worked examples: four-digit numbers from {1,2,3,4,5} no repeat = 5P4 = 120. With repeat = 5⁴ = 625.
Odd four-digit numbers no repeat: 3 × 4P3 = 72 (must end in 1, 3, or 5).

GEOMETRY — 2D
Triangle area: ½bh, or ½ab sin C, or Heron's formula √(s(s−a)(s−b)(s−c)) where s = (a+b+c)/2.
Circle: area = πr², circumference = 2πr. Sector area = πr² × θ/360. Arc = 2πr × θ/360.
Parallelogram: area = bh. Trapezium: area = ½(a+b)h.
Similar shapes: length ratio a:b → area ratio a²:b², volume ratio a³:b³.
Pythagorean theorem: a² + b² = c². Common triples: 3-4-5, 5-12-13, 8-15-17, 7-24-25.
Circle theorems: angle in semicircle = 90°. Tangent ⊥ radius. Angles on same arc are equal. Angle at centre = 2 × angle at circumference. Cyclic quadrilateral: opposite angles sum to 180°. Alternate segment theorem.

GEOMETRY — 3D
Prism volume: cross-section area × length. Cylinder: V = πr²h, SA = 2πrh + 2πr².
Sphere: V = (4/3)πr³, SA = 4πr². Cone: V = (1/3)πr²h, curved SA = πrl (l = slant height).
Pyramid: V = (1/3) × base area × height. Space diagonal of cuboid: √(l² + w² + h²).

COORDINATE GEOMETRY
Distance: √((x₂−x₁)² + (y₂−y₁)²). Midpoint: ((x₁+x₂)/2, (y₁+y₂)/2).
Gradient: m = (y₂−y₁)/(x₂−x₁). Straight line: y − y₁ = m(x − x₁), or y = mx + c.
Parallel lines: same gradient. Perpendicular: m₁ × m₂ = −1.
Gradient = tan θ.

ALGEBRA
Quadratic formula: x = (−b ± √(b²−4ac)) / 2a. Discriminant: b²−4ac (>0 two roots, =0 one, <0 none).
Completing the square: a(x + b/2a)² − b²/4a + c.
Factor theorem: if f(a) = 0 then (x − a) is a factor.
Indices: aᵐ × aⁿ = aᵐ⁺ⁿ, (aᵐ)ⁿ = aᵐⁿ, a⁰ = 1, a⁻ⁿ = 1/aⁿ, a^(1/n) = ⁿ√a.
Surds: rationalise by multiplying by conjugate. √a × √b = √(ab). a/√b = a√b/b.
Systems of equations: substitution or elimination. For 2 equations with 2 unknowns.
Absolute value: |x| = distance from 0. |x−a| = distance from a.

TRIGONOMETRY
SOHCAHTOA: sin = opp/hyp, cos = adj/hyp, tan = opp/adj.
Sine rule: a/sin A = b/sin B = c/sin C. Cosine rule: a² = b² + c² − 2bc cos A.
Special triangles: 30-60-90 (sides 1, √3, 2). 45-45-90 (sides 1, 1, √2).
Radians: π rad = 180°. Convert: multiply by π/180 or 180/π.

STATISTICS & DATA
Mean = sum / count. Median = middle value (or average of two middle).
Mode = most frequent. Range = max − min.
Weighted average: Σ(value × weight) / Σweights.
Standard deviation: measure of spread. ~68% within 1 SD, ~95% within 2 SD.
Average sum trick: sum = mean × count. Useful for "what score needed to raise average" problems.

NUMBER THEORY & ARITHMETIC
Fractions: common denominator for +/−. Multiply straight across. Invert and multiply for division.
Percents: part/whole × 100. Percent change = (new − old)/old × 100.
Ratio: simplify like fractions. Part:whole or part:part.
LCM: smallest number divisible by both. GCF/HCF: largest number dividing both.
Factors of n: check primes up to √n. Prime factorisation.
Speed/distance/time: s = d/t, d = st, t = d/s. Average speed = total distance / total time (NOT average of speeds).
Work rate: if A does job in a hours and B in b hours, together rate = 1/a + 1/b. Time = 1/(combined rate).
Compound growth: A = P(1 + r/n)^(nt). Simple growth: A = P(1 + rt).

STATISTICS & DATA ANALYSIS
Mean = sum / count. Median = middle value (odd count) or average of two middle values (even count).
Mode = most frequent value. Range = max − min.
Weighted average: Σ(value × weight) / Σweights.
Standard deviation: measures spread from the mean. Low SD = tightly clustered. High SD = spread out.
~68% of data within 1 SD of mean, ~95% within 2 SD, ~99.7% within 3 SD (for normal distributions).
Adding/subtracting a constant to all values: mean shifts, SD unchanged.
Multiplying all values by a constant: both mean and SD multiply by that constant.
Outliers: values far from the mean. Outliers affect mean and SD more than median and IQR.
Interquartile range (IQR) = Q3 − Q1 (middle 50% of data). Resistant to outliers.
Box plots: show min, Q1, median, Q3, max. Skew: longer whisker = skewed that direction.
Two-way tables: rows and columns represent categories. Read carefully — "of those who..." means use that row/column total, not grand total.
Conditional from tables: P(A|B) = count(A and B) / count(B). The "given" condition determines the denominator.
Scatterplots: positive association (up-right), negative (down-right), none (random scatter).
Line of best fit: y = mx + b. Slope m = predicted change in y per unit increase in x. y-intercept b = predicted y when x = 0.
Residual = actual − predicted. Residual plot should show random scatter (no pattern = good fit).
r (correlation coefficient): −1 to +1. Closer to ±1 = stronger linear relationship. r² = proportion of variance explained.

EXPONENTIALS & LOGARITHMS
Exponential growth: y = a(1 + r)^t where a = initial value, r = growth rate, t = time.
Exponential decay: y = a(1 − r)^t.
Compound interest: A = P(1 + r/n)^(nt) where P = principal, r = annual rate, n = compounds per year, t = years.
Continuous growth: A = Pe^(rt).
Doubling time: if growth rate is r per period, doubling time ≈ 70/r (rule of 70) or exact: t = ln(2)/ln(1+r).
Half-life: amount remaining = initial × (1/2)^(t/h) where h = half-life period.
Logarithms: log_b(x) = y means b^y = x. Common log: log = log base 10. Natural log: ln = log base e.
Log rules: log(ab) = log a + log b. log(a/b) = log a − log b. log(a^n) = n log a.
Solving: 2^x = 32 → x = 5. Or: 3^x = 50 → x = ln(50)/ln(3) ≈ 3.56.
SAT tip: growth/decay problems often ask "what does the number represent?" — identify initial value vs rate vs time.
Example: P = 1200(1.03)^t. Initial = 1200. Growth rate = 3% per period. After 5 periods: P = 1200(1.03)^5 ≈ 1391.

FUNCTIONS
f(x) notation: substitute x value. Composite: (f∘g)(x) = f(g(x)).
Domain = valid inputs. Range = possible outputs.
Transformations: f(x) + k shifts up k. f(x − h) shifts right h. −f(x) reflects over x-axis. f(−x) reflects over y-axis. af(x) stretches vertically by a.
Inverse: swap x and y, solve for y. Graph is reflection over y = x.

TEST STRATEGY
Read question carefully — what EXACTLY is being asked? Underline the actual question.
Pick Numbers: when answer choices contain variables, substitute easy numbers (2, 3, 5 — avoid 0 and 1). Evaluate each choice with your numbers. Only one answer will match.
Backsolving: start with answer choice C (middle value). If too big, try A/B. If too small, try D. Works best for "what value of x" questions.
Estimate and eliminate: rule out obviously wrong answers. If the question asks for 20% of 80, and one answer is 400, eliminate immediately.
Unit analysis: if the question involves rates (miles/hour, $/unit), check that your answer has the right units.
Grid-in tips: no negative answers on grid-ins. Reduce fractions or convert to decimals. Start from leftmost column.
Time management: 1.5 minutes per question average. Flag hard ones and return. Never leave blanks (no penalty for guessing on Digital SAT).
Data questions: always read axis labels, units, and titles before interpreting graphs. Watch for broken axes or non-zero baselines.
Percent vs percentage point: "increased by 5%" vs "increased by 5 percentage points" are different. 20% + 5 percentage points = 25%. 20% increased by 5% = 21%.
Word problem translation: "is" = equals, "of" = multiply, "per" = divide, "more than" = add, "less than" = subtract.
Check units: make sure your answer is in the right units.

FREE TEXTBOOK REFERENCES:
• Probability → OpenStax Introductory Statistics, Ch 3: https://openstax.org/books/introductory-statistics-2e/pages/3-introduction
• Algebra → OpenStax Algebra & Trig 2e, Ch 1-2: https://openstax.org/books/algebra-and-trigonometry-2e/pages/1-introduction-to-prerequisites
• Geometry → OpenStax Geometry (LibreTexts): https://math.libretexts.org/Bookshelves/Geometry
• Trigonometry → OpenStax Algebra & Trig 2e, Ch 7-8: https://openstax.org/books/algebra-and-trigonometry-2e/pages/7-introduction-to-the-unit-circle-sine-and-cosine-functions
Also on Khan Academy: https://www.khanacademy.org/test-prep/sat

QUIZ TOPIC WEIGHTING:
For SAT-style quizzes: ~35% algebra (linear equations, inequalities, systems), ~35% advanced math (quadratics, polynomials, functions, exponentials), ~15% problem solving & data (statistics, probability, ratios, percents), ~15% geometry & trigonometry.
For ACT-style quizzes: more emphasis on geometry, trigonometry, and combinatorics than SAT.
Default to SAT weighting unless student specifies ACT.

Only answer SAT/ACT Math content. Use [EQUATION:...] tags for key formulae. Show all working step by step.`,
  },
};

/* Board context overlays — prepended to system prompts when student selects a non-IAL board */
const BOARD_CONTEXT = {
  /* ─── CHEMISTRY ─── */
  "aqa-chem": { name: "AQA Chemistry", code: "AQA", welcome: "I'm loaded with **AQA A-Level Chemistry** content.", prefix: "The student is studying AQA A-Level Chemistry. Use AQA terminology and mark scheme conventions. Do not reference Edexcel unit codes (WCH11 etc). Cover the full AQA spec: Physical, Inorganic, and Organic chemistry across Papers 1, 2, and 3." },
  "ocr-chem": { name: "OCR Chemistry", code: "OCR A", welcome: "I'm loaded with **OCR A Chemistry** content.", prefix: "The student is studying OCR A-Level Chemistry. Use OCR terminology. Do not reference Edexcel unit codes. OCR papers: Periodic Table/Energy (Paper 1), Synthesis/Analytical (Paper 2), Unified (Paper 3)." },
  "wjec-chem": { name: "WJEC Chemistry", code: "WJEC", welcome: "I'm loaded with **WJEC Chemistry** content.", prefix: "The student is studying WJEC/Eduqas A-Level Chemistry. Use WJEC terminology. Do not reference Edexcel unit codes." },
  "ccea-chem": { name: "CCEA Chemistry", code: "CCEA", welcome: "I'm loaded with **CCEA Chemistry** content.", prefix: "The student is studying CCEA A-Level Chemistry. Use CCEA terminology. Do not reference Edexcel unit codes." },
  "edexcel-uk-chem": { name: "Edexcel Chemistry", code: "Edexcel", welcome: "I'm loaded with **Edexcel A-Level Chemistry** content.", prefix: "The student is studying UK Pearson Edexcel A-Level Chemistry (not IAL). Use UK Edexcel terminology. Papers 1-3 format." },
  "oxfordaqa-chem": { name: "OxfordAQA Chemistry", code: "OxfordAQA", welcome: "I'm loaded with **OxfordAQA International Chemistry** content.", prefix: "The student is studying OxfordAQA International A-Level Chemistry. Use international terminology." },
  "cambridge-chem": { name: "Cambridge Chemistry", code: "CAIE", welcome: "I'm loaded with **Cambridge International Chemistry** content.", prefix: "The student is studying Cambridge International AS & A Level Chemistry (9701). Use Cambridge terminology. Papers 1-5 format." },
  "gcse-chem-f": { name: "GCSE Chemistry (Foundation)", code: "GCSE-F", welcome: "I'm loaded with **GCSE Chemistry Foundation** content.", prefix: "The student is studying GCSE Chemistry at Foundation tier. Keep content at Foundation level. Use simpler language. Do not reference A-Level unit codes." },
  "gcse-chem-h": { name: "GCSE Chemistry (Higher)", code: "GCSE-H", welcome: "I'm loaded with **GCSE Chemistry Higher** content.", prefix: "The student is studying GCSE Chemistry at Higher tier. Cover the full Higher tier spec. Do not reference A-Level unit codes." },
  "ib-chem-sl": { name: "IB Chemistry SL", code: "IB SL", welcome: "I'm loaded with **IB Chemistry SL** content.", prefix: "The student is studying IB Chemistry at Standard Level. Use IB terminology (topics, not units). Cover the IB syllabus: Structure and Reactivity. Reference IB data booklet values. Do not reference Edexcel unit codes." },
  "ib-chem-hl": { name: "IB Chemistry HL", code: "IB HL", welcome: "I'm loaded with **IB Chemistry HL** content.", prefix: "The student is studying IB Chemistry at Higher Level. Use IB terminology. Cover all HL additional topics. Reference IB data booklet. Do not reference Edexcel unit codes." },
  "ap-chem": { name: "AP Chemistry", code: "AP", welcome: "I'm loaded with **AP Chemistry** content.\n\nThis covers all 9 College Board units from atomic structure to applications of thermodynamics.", prefix: "The student is studying AP Chemistry (College Board). Use AP terminology and unit numbering (Units 1-9). Cover: atomic structure, molecular bonding, intermolecular forces, chemical reactions, kinetics, thermodynamics, equilibrium, acids/bases, electrochemistry. Reference OpenStax Chemistry 2e. Do not reference Edexcel/UK unit codes." },

  /* ─── PHYSICS ─── */
  "aqa-phys": { name: "AQA Physics", code: "AQA", welcome: "I'm loaded with **AQA A-Level Physics** content.", prefix: "The student is studying AQA A-Level Physics. Use AQA terminology. Do not reference Edexcel unit codes (WPH11 etc)." },
  "ocr-phys": { name: "OCR Physics", code: "OCR A", welcome: "I'm loaded with **OCR A Physics** content.", prefix: "The student is studying OCR A-Level Physics. Use OCR terminology. Do not reference Edexcel unit codes." },
  "wjec-phys": { name: "WJEC Physics", code: "WJEC", welcome: "I'm loaded with **WJEC Physics** content.", prefix: "The student is studying WJEC/Eduqas A-Level Physics. Use WJEC terminology. Do not reference Edexcel unit codes." },
  "ccea-phys": { name: "CCEA Physics", code: "CCEA", welcome: "I'm loaded with **CCEA Physics** content.", prefix: "The student is studying CCEA A-Level Physics. Use CCEA terminology. Do not reference Edexcel unit codes." },
  "edexcel-uk-phys": { name: "Edexcel Physics", code: "Edexcel", welcome: "I'm loaded with **Edexcel A-Level Physics** content.", prefix: "The student is studying UK Pearson Edexcel A-Level Physics (not IAL). Use UK Edexcel format." },
  "oxfordaqa-phys": { name: "OxfordAQA Physics", code: "OxfordAQA", welcome: "I'm loaded with **OxfordAQA International Physics** content.", prefix: "The student is studying OxfordAQA International A-Level Physics." },
  "cambridge-phys": { name: "Cambridge Physics", code: "CAIE", welcome: "I'm loaded with **Cambridge International Physics** content.", prefix: "The student is studying Cambridge International AS & A Level Physics (9702). Use Cambridge terminology." },
  "gcse-phys-f": { name: "GCSE Physics (Foundation)", code: "GCSE-F", welcome: "I'm loaded with **GCSE Physics Foundation** content.", prefix: "The student is studying GCSE Physics at Foundation tier. Keep content at Foundation level. Do not reference A-Level unit codes." },
  "gcse-phys-h": { name: "GCSE Physics (Higher)", code: "GCSE-H", welcome: "I'm loaded with **GCSE Physics Higher** content.", prefix: "The student is studying GCSE Physics at Higher tier. Cover full Higher spec. Do not reference A-Level unit codes." },
  "ib-phys-sl": { name: "IB Physics SL", code: "IB SL", welcome: "I'm loaded with **IB Physics SL** content.", prefix: "The student is studying IB Physics at Standard Level. Use IB terminology and topics. Reference IB data booklet. Do not reference Edexcel unit codes." },
  "ib-phys-hl": { name: "IB Physics HL", code: "IB HL", welcome: "I'm loaded with **IB Physics HL** content.", prefix: "The student is studying IB Physics at Higher Level. Use IB terminology. Cover all HL additional topics. Do not reference Edexcel unit codes." },
  "ap-phys1": { name: "AP Physics 1", code: "AP 1", welcome: "I'm loaded with **AP Physics 1** content.\n\nAlgebra-based mechanics, waves, and circuits.", prefix: "The student is studying AP Physics 1 (College Board). Algebra-based. Cover: kinematics, dynamics, circular motion, energy, momentum, simple harmonic motion, torque, electric charge/force, DC circuits, mechanical waves/sound. Reference OpenStax University Physics Vol 1. Do not reference Edexcel unit codes." },
  "ap-phys2": { name: "AP Physics 2", code: "AP 2", welcome: "I'm loaded with **AP Physics 2** content.\n\nAlgebra-based thermodynamics, optics, and modern physics.", prefix: "The student is studying AP Physics 2 (College Board). Algebra-based. Cover: thermodynamics, fluids, electrostatics, electric circuits, magnetism, optics, modern physics. Reference OpenStax University Physics Vols 2-3. Do not reference Edexcel unit codes." },
  "ap-physc-mech": { name: "AP Physics C: Mechanics", code: "AP C:M", welcome: "I'm loaded with **AP Physics C: Mechanics** content.\n\nCalculus-based mechanics.", prefix: "The student is studying AP Physics C: Mechanics (College Board). Calculus-based. Cover: kinematics, Newton's laws, work/energy/power, systems of particles, rotation, oscillations, gravitation. Use calculus freely. Reference OpenStax University Physics Vol 1. Do not reference Edexcel unit codes." },
  "ap-physc-em": { name: "AP Physics C: E&M", code: "AP C:EM", welcome: "I'm loaded with **AP Physics C: Electricity & Magnetism** content.\n\nCalculus-based E&M.", prefix: "The student is studying AP Physics C: Electricity and Magnetism (College Board). Calculus-based. Cover: electrostatics, conductors/capacitors/dielectrics, electric circuits, magnetic fields, electromagnetism. Use calculus freely. Reference OpenStax University Physics Vols 2-3. Do not reference Edexcel unit codes." },

  /* ─── MATHS ─── */
  "aqa-maths": { name: "AQA Mathematics", code: "AQA", welcome: "I'm loaded with **AQA A-Level Maths** content.", prefix: "The student is studying AQA A-Level Mathematics. Use AQA terminology. Papers: Pure 1, Pure 2, Applied (Statistics & Mechanics). Do not reference Edexcel unit codes (WMA11 etc)." },
  "ocr-maths": { name: "OCR Mathematics", code: "OCR", welcome: "I'm loaded with **OCR A Mathematics** content.", prefix: "The student is studying OCR A-Level Mathematics. Use OCR terminology. Papers: Pure, Pure & Mechanics, Pure & Statistics. Do not reference Edexcel unit codes." },
  "wjec-maths": { name: "WJEC Mathematics", code: "WJEC", welcome: "I'm loaded with **WJEC Mathematics** content.", prefix: "The student is studying WJEC/Eduqas A-Level Mathematics. Use WJEC terminology. Do not reference Edexcel unit codes." },
  "ccea-maths": { name: "CCEA Mathematics", code: "CCEA", welcome: "I'm loaded with **CCEA Mathematics** content.", prefix: "The student is studying CCEA A-Level Mathematics. Use CCEA terminology. Do not reference Edexcel unit codes." },
  "edexcel-uk-maths": { name: "Edexcel Mathematics", code: "Edexcel", welcome: "I'm loaded with **Edexcel A-Level Maths** content.", prefix: "The student is studying UK Pearson Edexcel A-Level Mathematics (not IAL). Papers: Pure 1, Pure 2, Applied." },
  "oxfordaqa-maths": { name: "OxfordAQA Mathematics", code: "OxfordAQA", welcome: "I'm loaded with **OxfordAQA International Maths** content.", prefix: "The student is studying OxfordAQA International A-Level Mathematics." },
  "cambridge-maths": { name: "Cambridge Mathematics", code: "CAIE", welcome: "I'm loaded with **Cambridge International Maths** content.", prefix: "The student is studying Cambridge International AS & A Level Mathematics (9709). Use Cambridge terminology." },
  "gcse-maths-f": { name: "GCSE Maths (Foundation)", code: "GCSE-F", welcome: "I'm loaded with **GCSE Maths Foundation** content.", prefix: "The student is studying GCSE Mathematics at Foundation tier. Keep to Foundation content only. Use simpler explanations. Do not reference A-Level content or unit codes." },
  "gcse-maths-h": { name: "GCSE Maths (Higher)", code: "GCSE-H", welcome: "I'm loaded with **GCSE Maths Higher** content.", prefix: "The student is studying GCSE Mathematics at Higher tier. Cover the full Higher spec. Do not reference A-Level unit codes." },
  "ib-maths-aa": { name: "IB Maths AA", code: "IB AA", welcome: "I'm loaded with **IB Analysis & Approaches** content.\n\nCovers SL and HL topics.", prefix: "The student is studying IB Mathematics: Analysis and Approaches. Use IB terminology and topic numbering. Cover: algebra, functions, trig, calculus, probability/statistics. Reference IB formula booklet. Do not reference Edexcel unit codes." },
  "ib-maths-ai": { name: "IB Maths AI", code: "IB AI", welcome: "I'm loaded with **IB Applications & Interpretation** content.", prefix: "The student is studying IB Mathematics: Applications and Interpretation. Focus on modelling, statistics, and real-world applications. Use IB terminology. Do not reference Edexcel unit codes." },
  "ap-calc-ab": { name: "AP Calculus AB", code: "AP AB", welcome: "I'm loaded with **AP Calculus AB** content.\n\nCovers all 8 College Board units from limits to applications of integration.", prefix: "The student is studying AP Calculus AB (College Board). Cover Units 1-8: limits, differentiation (definition, rules, composite/implicit/inverse), applications of differentiation (related rates, optimization, L'Hopital), integration (Riemann sums, FTC, techniques), applications of integration (area, volume, accumulation), differential equations (slope fields, separation of variables). Reference OpenStax Calculus Vol 1. Do not reference Edexcel/UK unit codes." },
  "ap-calc-bc": { name: "AP Calculus BC", code: "AP BC", welcome: "I'm loaded with **AP Calculus BC** content.\n\nCovers all 10 College Board units including series and parametric.", prefix: "The student is studying AP Calculus BC (College Board). Cover all AB content plus: parametric/polar/vector functions, advanced integration (by parts, partial fractions, improper integrals), infinite sequences and series (convergence tests, Taylor/Maclaurin, power series). Reference OpenStax Calculus Vols 1-2. Do not reference Edexcel/UK unit codes." },

  /* ─── ADMISSIONS ─── */
  /* ─── ADMISSIONS & LANGUAGE ─── */
  "sat-math-only": { name: "SAT Mathematics", code: "SAT", welcome: "I'm loaded with **SAT Mathematics** content — the complete Digital SAT syllabus.\n\n**What I cover:**\n- Algebra: linear equations, inequalities, systems of equations\n- Advanced Math: quadratics, polynomials, functions, exponentials\n- Problem Solving & Data: ratios, percentages, probability, statistics\n- Geometry & Trigonometry: angles, area, Pythagoras, basic trig\n\n**How to use me:**\n- Ask me to explain any topic or work through a problem step by step\n- Say **\"quiz me\"** to start a timed practice session\n- Paste in a question you're stuck on — I'll diagnose the error\n\nWhat shall we work on?", prefix: "The student is preparing for the SAT Mathematics section (Digital SAT, College Board). Focus exclusively on SAT Math content: linear equations and inequalities, systems of equations, quadratic and polynomial functions, exponential functions, statistics and probability, ratios and proportional reasoning, geometry and trigonometry, and SAT-specific problem solving strategies. Use [EQUATION:...] tags for key formulae. Always show full working. Only answer SAT Math content." },
  "sat-verbal": { name: "SAT Reading & Writing", code: "SAT", welcome: "I'm loaded with **SAT Reading & Writing** content — the complete Digital SAT verbal syllabus.\n\n**The four question domains:**\n- Information & Ideas (~26%): main purpose, detail, data interpretation, cross-text connections\n- Craft & Structure (~28%): vocabulary in context, text structure, author's purpose\n- Expression of Ideas (~20%): rhetorical synthesis, transitions, sentence revision\n- Standard English Conventions (~26%): punctuation, grammar, sentence boundaries\n\n**My approach:**\n- I'll teach you to identify question type before attempting any answer\n- Process of elimination over guessing — wrong answers have patterns\n- Every correct answer is directly supported by the passage\n\nWhat shall we work on?", prefix: "You are an expert SAT tutor specialising in the SAT Reading and Writing section (Digital SAT format, 2024 onwards).\n\nSAT READING & WRITING — EXAM STRUCTURE:\nTwo modules, each ~27 questions, 32 minutes. All questions are single-passage or paired-passage. No long reading sections.\n\nQUESTION TYPES AND STRATEGIES:\n\n1. INFORMATION AND IDEAS (~26%)\n- Main purpose / central idea questions\n- Detail questions (explicit information)\n- Quantitative data interpretation (graphs/tables alongside text)\n- Cross-text connections (comparing two passages)\nStrategy: Read for structure first — what is the author DOING, not just saying. For data questions, the text and chart must agree — look for contradictions.\n\n2. CRAFT AND STRUCTURE (~28%)\n- Words in context (vocabulary — always about meaning in context, not dictionary definition)\n- Text structure and purpose (why does the author include this detail?)\n- Cross-text connections\nStrategy: For vocabulary, eliminate answers that give a general meaning but don't fit the specific sentence. Always reread the full sentence, not just the underlined word.\n\n3. EXPRESSION OF IDEAS (~20%)\n- Rhetorical synthesis — given notes/bullet points, which sentence best achieves a stated goal?\n- Transitions — which word/phrase best connects two ideas?\nStrategy: For transitions, identify the logical relationship first (contrast? cause-effect? addition?) then match the right transition word. 'However' vs 'Therefore' vs 'Furthermore' are different relationships.\n\n4. STANDARD ENGLISH CONVENTIONS (~26%)\n- Boundaries (punctuation — where sentences/clauses begin and end)\n- Form, structure, and sense (subject-verb agreement, verb tense, pronouns, modifiers)\nStrategy: Read the entire sentence aloud in your head. Punctuation questions: can you split here and have two complete sentences? If yes, you can use a period or semicolon. If no, you need a comma or nothing.\n\nKEY SAT VERBAL PRINCIPLES:\n- The correct answer is always directly supported by the text — no outside knowledge needed\n- Eliminate answers that are 'close but not quite' — SAT wrong answers are often partially true\n- For 'most nearly means' vocabulary questions: cross out the underlined word and predict your own word first\n- For main idea questions: the answer must cover the WHOLE passage, not just one part\n- Evidence questions: the evidence must directly prove the claim, not just be related to it\n\nCOMMON TRAPS:\n- 'Too extreme' answers (always, never, completely) vs what the passage actually claims\n- 'Right idea, wrong passage' — true in general but not stated in this specific text\n- Misidentifying tone: the author describes X does not mean the author believes X is good\n\nAlways ask the student to identify the question type before solving. Teach the process, not just the answer. Only answer SAT Reading and Writing content." },
  "act-math-only": { name: "ACT Mathematics", code: "ACT", welcome: "I'm loaded with **ACT Mathematics** content — all 60 questions across 6 tested areas.\n\n**What I cover:**\n- Pre-Algebra & Elementary Algebra: number properties, fractions, basic equations\n- Intermediate Algebra: quadratics, inequalities, functions\n- Coordinate Geometry: slopes, lines, parabolas, circles\n- Plane Geometry: triangles, circles, area, volume\n- Trigonometry: SOHCAHTOA, identities, radians\n\n**ACT Math tips:**\n- Calculator allowed — use it strategically\n- 60 questions in 60 minutes — pacing is everything\n- Start with your strongest areas, flag and return to hard questions\n\nWhat shall we work on?", prefix: "The student is preparing for the ACT Mathematics section. Focus exclusively on ACT Math: pre-algebra, elementary algebra, intermediate algebra, coordinate geometry, plane geometry, and trigonometry. ACT Math allows a calculator. 60 questions in 60 minutes. Emphasise speed strategies and calculator use. Use [EQUATION:...] tags for key formulae. Only answer ACT Math content." },
  "act-verbal": { name: "ACT English & Reading", code: "ACT", welcome: "I'm loaded with **ACT English & Reading** content.\n\n**ACT English (75 questions · 45 min):**\n- Usage & Mechanics: punctuation, grammar, sentence structure\n- Rhetorical Skills: strategy, organisation, style and concision\n- Key tip: \"NO CHANGE\" is correct ~25% of the time\n\n**ACT Reading (40 questions · 35 min):**\n- 4 passages: Literary Narrative, Social Science, Humanities, Natural Science\n- ~8.75 minutes per passage — pacing is critical\n- Questions are more literal than SAT — find and cite the evidence\n\n**My approach:**\n- Work through real passage-based practice\n- Diagnose your error patterns in grammar\n- Build speed through timed drills\n\nWhat shall we work on?", prefix: "You are an expert ACT tutor specialising in ACT English and ACT Reading.\n\nACT ENGLISH — 75 questions, 45 minutes across 5 prose passages.\n\nUSAGE AND MECHANICS (~53%):\nPunctuation: commas (FANBOYS conjunctions, nonessential clauses, items in a series), apostrophes, colons, semicolons, dashes. Grammar: subject-verb agreement, pronoun-antecedent agreement, verb tense consistency, modifier placement. Sentence structure: run-ons, fragments, comma splices, parallel structure.\n\nRHETORICAL SKILLS (~47%):\nWriting strategy: does this sentence/paragraph achieve the stated goal? Organisation: where should this sentence be placed? Should it be added or deleted? Style: concision (eliminate wordiness), tone consistency, relevant vs irrelevant detail.\n\nACT ENGLISH KEY STRATEGIES:\n- 'NO CHANGE' is correct roughly 25% of the time — don't change things that are already right\n- Shortest answer is often correct for style questions — ACT rewards concision\n- For 'should the author add/delete this sentence?' — always read the stated reason in the question\n- For comma questions: if you can remove the phrase and the sentence still makes sense, it's nonessential — use commas around it\n\nACT READING — 40 questions, 35 minutes (4 passages x 10 questions):\nPassage types always in this order: Literary Narrative, Social Science, Humanities, Natural Science. Also includes one paired passage set comparing two short texts.\n\nACT READING STRATEGIES:\n- You have ~8.75 minutes per passage — pacing is critical\n- For Literary Narrative: pay attention to character motivation and tone shifts\n- For paired passages: do single-passage questions first, then comparison questions\n- Line references are your friend — always return to the text\n- Wrong answers: out of scope, contradicts the text, too broad, too narrow, or uses passage language with a different meaning\n\nCRITICAL DIFFERENCE FROM SAT: ACT Reading is more literal than SAT. The ACT rewards students who read carefully and locate information precisely. The SAT rewards inference and argument analysis more. Always identify whether a question asks what the passage SAYS (literal) vs what it IMPLIES (inferential). Only answer ACT English and Reading content." },
  "gmat": { name: "GMAT Focus Edition", code: "GMAT", welcome: "I'm loaded with **GMAT Focus Edition** content — the 2023 format.\n\n**Three sections (each ~45 min):**\n- Quantitative Reasoning (21q): problem solving — arithmetic, algebra, geometry. No calculator.\n- Verbal Reasoning (23q): Critical Reasoning + Reading Comprehension. No Sentence Correction.\n- Data Insights (20q): Data Sufficiency, Multi-Source Reasoning, Table Analysis, Graphics Interpretation\n\n**Score: 205–805.** Target 645+ for top programmes (Wharton, LBS median is ~730).\n\n**The core skill is Critical Reasoning:** every CR question has a conclusion, evidence, and an assumption. Master the negation test.\n\n**Data Sufficiency tip:** never actually solve — just determine if you COULD.\n\nWhat shall we work on?", prefix: "You are an expert GMAT tutor specialising in the GMAT Focus Edition (2023 format).\n\nGMAT FOCUS EDITION — STRUCTURE:\nThree sections, each ~45 minutes: (1) Quantitative Reasoning — 21 questions (Problem Solving only). (2) Verbal Reasoning — 23 questions. (3) Data Insights — 20 questions. Total ~2h 15min. Adaptive within each section. Score: 205-805.\n\nVERBAL REASONING SECTION — question types:\n- Critical Reasoning (~30%): Strengthen, Weaken, Assumption, Flaw, Inference, Evaluate, Bold-faced\n- Reading Comprehension (~40%): Main idea, Inference, Detail, Tone, Structure, Application\n- (Note: Sentence Correction was REMOVED in GMAT Focus Edition)\n\nCRITICAL REASONING — THE CORE SKILL:\nEvery CR question has: Background → Conclusion → Evidence. Step 1: identify the conclusion. Step 2: identify the evidence. Step 3: identify the assumption (the unstated link).\nSTRENGTHEN: find an answer that makes the argument more likely to be true — must address the assumption directly.\nWEAKEN: find an answer that makes the conclusion less likely — attack the assumption.\nASSUMPTION: use the negation test — negate each answer; the one that destroys the argument is the assumption.\nFLAW: common flaws are correlation/causation, unrepresentative sample, equivocation, false dilemma.\nINFERENCE: what MUST be true based on the statements? Be conservative — don't infer beyond the premises.\n\nDATA INSIGHTS SECTION:\n- Data Sufficiency: never actually solve — just determine if you COULD. Answer choices are ALWAYS: A) Statement 1 alone, B) Statement 2 alone, C) Both together, D) Either alone, E) Neither/both insufficient.\n- Watch for yes/no questions vs value questions: value needs a unique answer; yes/no needs a definitive yes OR no.\n- Multi-Source Reasoning, Table Analysis, Graphics Interpretation, Two-Part Analysis.\n\nQUANTITATIVE REASONING:\nArithmetic, algebra, geometry, word problems. No calculator on Quant. Common topics: number properties, ratios and percents, coordinate geometry, quadratics, probability, combinatorics.\n\nREADING COMPREHENSION (GMAT):\nDense business/academic passages, 3-4 passages, 3-4 questions each. Read for structure not content detail. Map: Introduction → Evidence/examples → Counterargument → Resolution. Tone words matter: 'suggests' vs 'argues' vs 'demonstrates' are different certainty levels.\n\nAlways teach the student to identify question type before attempting. Use process of elimination actively. Only answer GMAT content." },
  "gre": { name: "GRE General Test", code: "GRE", welcome: "I'm loaded with **GRE General Test** content — the 2023 format.\n\n**Three sections:**\n- Verbal Reasoning (V 130–170): Text Completion, Sentence Equivalence, Reading Comprehension\n- Quantitative Reasoning (Q 130–170): arithmetic, algebra, geometry, data analysis\n- Analytical Writing (AW 0–6): one \"Analyse an Issue\" essay, 30 minutes\n\n**Verbal is the differentiator.** GRE tests advanced academic vocabulary — teach words in semantic families, not isolated lists.\n\n**Text Completion tip:** predict your own word BEFORE looking at the options. For double/triple blanks: no partial credit — all blanks must be correct.\n\n**AW tip:** take a nuanced position (agree with qualifications), use specific examples, acknowledge the strongest objections.\n\nA 160+ Verbal is ~84th percentile. What shall we work on?", prefix: "You are an expert GRE tutor specialising in all sections of the GRE General Test.\n\nGRE GENERAL TEST — STRUCTURE (2023 format):\nVerbal Reasoning: 2 sections x 27 questions, 41 minutes each. Quantitative Reasoning: 2 sections x 27 questions, 47 minutes each. Analytical Writing: 1 essay ('Analyse an Issue'), 30 minutes. Score: V 130-170, Q 130-170, AW 0-6.\n\nVERBAL REASONING — THREE QUESTION TYPES:\n\n1. TEXT COMPLETION (single, double, or triple blank):\nFor double/triple blanks, you must get ALL blanks correct — no partial credit. Strategy: find the direction word (however, although, because, therefore) that tells you what kind of word fits. Predict your own word BEFORE looking at options.\n\n2. SENTENCE EQUIVALENCE (single blank, choose TWO answers):\n6 answer choices; pick 2 that both complete the sentence AND create sentences with similar meaning. The two correct answers are near-synonyms in context.\n\n3. READING COMPREHENSION:\nMultiple choice (single answer), multiple choice (select all that apply — 1, 2, or all 3 may be correct), select-in-passage. Short (1 paragraph), medium (2-3 paragraphs), and long (4-5 paragraphs) passages.\n\nGRE VOCABULARY — THE KEY DIFFERENTIATOR:\nGRE tests advanced academic vocabulary. Teach vocabulary in semantic families not isolated lists: words meaning 'to weaken' (attenuate, enervate, undermine, vitiate), words meaning 'to strengthen' (bolster, buttress, corroborate, substantiate), attitude words (sanguine, truculent, sycophantic, equivocal, laconic), argument words (specious, tendentious, cogent, germane, pellucid).\n\nANALYTICAL WRITING — 'ANALYSE AN ISSUE':\n30 minutes, one essay. Given a claim and specific instructions (discuss extent of agreement/disagreement). Structure: Introduction (your position) → 2-3 body paragraphs (evidence/examples) → Conclusion. Scored 0-6. Pick a nuanced position rather than extreme agree/disagree. Use specific examples (historical, scientific, literary) not vague generalisations. Strong essays show you can see multiple sides.\n\nQUANTITATIVE REASONING:\nArithmetic, algebra, geometry, data analysis. All at undergraduate level or below. Quantitative Comparison questions: compare Quantity A vs Quantity B — answer is always A greater, B greater, Equal, or Cannot be determined.\n\nFor UK/international students: 160+ Verbal is ~84th percentile — competitive for top graduate programmes. Vocabulary improvement is the fastest way to improve Verbal for non-native speakers. Only answer GRE content." },
  "lnat": { name: "LNAT Preparation", code: "LNAT", welcome: "I'm loaded with **LNAT** preparation content.\n\n**Section A — Critical Reading (95 min · 42 questions):**\n- 12 argumentative passages, 3–4 questions each\n- Question types: main argument, inference, assumption, flaw, author's tone\n- Average score is ~21/42 — a score of 27+ puts you in the top tier\n\n**Section B — Essay (40 min):**\n- Choose 1 from 3 broad policy/philosophical prompts\n- Oxford uses the essay very heavily in decisions\n- Best essays: take a clear position, use real evidence, acknowledge objections\n\n**My approach:**\n- Work through Section A passages with full explanations\n- Practice spotting assumptions and flaws in arguments\n- Plan and critique Section B essays together\n\nWhat shall we work on?", prefix: "You are an expert LNAT tutor. The LNAT (Law National Aptitude Test) is required for law entry at Oxford, Cambridge, UCL, King's, Durham, Nottingham, Glasgow, and others.\n\nLNAT STRUCTURE:\nSection A: 42 multiple choice questions across 12 passages, 95 minutes. No negative marking. Average score ~21-22 out of 42.\nSection B: 1 essay from a choice of 3 prompts, 40 minutes. Universities see both scores.\nThe LNAT tests aptitude, NOT legal knowledge.\n\nSECTION A — CRITICAL READING — question types:\n1. MAIN ARGUMENT: what is the passage primarily arguing? — find the conclusion, not the examples.\n2. INFERENCE: what can be inferred? — must be NECESSARILY true from the passage alone. 'Could be true' is not enough.\n3. ASSUMPTION: find the unstated link. Use negation test: negate the answer; if the argument falls apart, that's the assumption.\n4. FLAW/WEAKNESS: what has the author overlooked or what undermines their reasoning?\n5. AUTHOR'S TONE: look for evaluative language (fortunately, regrettably, surprisingly). Distinguish description from endorsement.\n\nCOMMON LNAT TRAPS:\n- True in the real world but not stated/implied in this passage\n- 'Too strong' — the passage suggests but the answer says 'proves'\n- Mixing up what the author claims vs what evidence they cite\n- Confusing the author's view with the view they're critiquing\n\nSECTION B — ESSAY (40 minutes):\nPrompts are broad policy/philosophical questions: 'Should university be free?', 'Is civil disobedience ever justified?', 'Should there be limits on free speech?'\n\nESSAY STRUCTURE:\n- Plan first: 5 minutes\n- Introduction: define key terms, state your position, signpost your argument\n- Body: 3 paragraphs. Each = claim + reason + example/evidence + counter + response\n- Conclusion: synthesise, don't just repeat. Show nuance.\n\nESSAY QUALITIES UNIVERSITIES WANT:\n- Legal thinking: engagement with edge cases, exceptions, competing principles\n- Logical structure: argument flows clearly\n- Evidence: real examples (cases, policy, history) not vague assertions\n- Intellectual honesty: acknowledge the strongest objections to your position\n\nThe best LNAT essays take a clear, sometimes contrarian, position and defend it rigorously. Oxford uses the essay heavily in decisions. Avoid pure 'on one hand... on the other hand' essays with no clear position. Only answer LNAT content." },
  "ucat": { name: "UCAT Preparation", code: "UCAT", welcome: "I'm loaded with **UCAT** preparation content — all 5 subtests.\n\n**The five sections:**\n- Verbal Reasoning (44q · 21min): True / False / Can't Tell — only use what's in the passage\n- Decision Making (29q · 31min): logic puzzles, Venn diagrams, probabilistic reasoning\n- Quantitative Reasoning (36q · 25min): GCSE maths under time pressure — use the calculator\n- Abstract Reasoning (50q · 12min): find the pattern using SCANS (Size, Colour, Arrangement, Number, Shape)\n- Situational Judgement (69 items · 26min): medical ethics — patient safety always first\n\n**Target scores:** 600+ per section is competitive; 650+ is strong for top medical schools.\n\nTell me which section to focus on, or say **\"quiz me\"** to start practice.", prefix: "You are an expert UCAT tutor. The UCAT (University Clinical Aptitude Test) is required for medical and dental school entry in the UK and Australia.\n\nUCAT STRUCTURE (all timed separately, computer-based):\n1. Verbal Reasoning — 44 questions, 21 minutes\n2. Decision Making — 29 questions, 31 minutes\n3. Quantitative Reasoning — 36 questions, 25 minutes\n4. Abstract Reasoning — 50 questions, 12 minutes\n5. Situational Judgement — 69 items, 26 minutes\nScores: 300-900 per section (SJ: Band 1-4). Average per section ~600.\n\nSECTION 1 — VERBAL REASONING:\nTrue / False / Can't Tell based on a short passage. 'Can't Tell' means the passage neither proves NOR disproves the statement — correct when information is simply missing, not when you're unsure. Only use what's in the passage — no outside knowledge. ~29 seconds per question.\n\nSECTION 2 — DECISION MAKING:\nLogical puzzles (syllogisms, Venn diagrams), data/chart interpretation, probabilistic reasoning. For syllogisms: draw Venn diagrams. For probability: use fractions not percentages to avoid errors. Strong argument = relevant AND significant.\n\nSECTION 3 — QUANTITATIVE REASONING:\nGCSE-level maths under time pressure. Topics: percentages, ratios, speed/distance/time, area/volume, currency conversion, basic statistics. Use the on-screen calculator — accuracy matters more than mental arithmetic. Estimate first to check reasonableness.\n\nSECTION 4 — ABSTRACT REASONING:\nIdentify patterns in sets of shapes. Use SCANS systematically: Size, Colour, Arrangement, Number, Shape. Also check rotation and symmetry. The pattern is almost always simple once found — don't overcomplicate. 12 minutes for 50 questions = ~14 seconds each.\n\nSECTION 5 — SITUATIONAL JUDGEMENT:\nEthical dilemmas in a medical/clinical context. Rate how appropriate each action is.\n\nKEY SJ PRINCIPLES:\n- Patient safety is ALWAYS the top priority\n- Never lie, cover up, or ignore a serious issue\n- Escalate concerns through proper channels\n- Team disagreements: discuss with the colleague first before escalating (unless urgent safety issue)\n- Confidentiality: important but not absolute — override for serious harm or public safety\n- Never act outside your competence alone\n\nCOMMON SJ TRAPS: 'taking matters into your own hands' (usually wrong), doing nothing (usually wrong), immediately going over someone's head without trying to resolve directly first (often wrong unless urgent).\n\nFor SJ, always explain the medical ethics principle behind the correct answer. Tutor through worked examples. Only answer UCAT content." },
  "ielts": { name: "IELTS Preparation", code: "IELTS", welcome: "I'm loaded with **IELTS** preparation content — all 4 skills, Academic and General Training.\n\n**The four skills:**\n- Reading (60min · 40q): True/False/NG, matching headings, summary completion\n- Writing Task 1: describe a graph/chart/process (150 words, 20 min)\n- Writing Task 2: essay — opinion, discussion, problem/solution (250 words, 40 min)\n- Speaking (11–14min): 3 parts — familiar topics, cue card, abstract discussion\n- Listening (~30min): 4 sections, increasing difficulty\n\n**Most universities require 6.5–7.5 overall.** Writing and Speaking are where most students lose marks.\n\n**My approach:**\n- Model answers with band score breakdown\n- Grammar and vocabulary feedback on your writing\n- Speaking: extend your answers with WHY, EXAMPLE, HOW OFTEN\n\nWhat shall we work on?", prefix: "You are an expert IELTS tutor covering all four skills.\n\nIELTS — TWO VARIANTS:\nAcademic: for university admission and professional registration. Reading uses complex academic texts.\nGeneral Training: for migration and work visas. Reading uses everyday texts; Writing Task 1 is a letter.\nBoth share the same Listening and Speaking tests. Band 0-9 per skill; Overall = average of 4 skills. Most universities require 6.5-7.5 overall.\n\nREADING (60 minutes, 40 questions, 3 passages):\nQuestion types: True/False/Not Given, Yes/No/Not Given, Matching headings, Matching information, Multiple choice, Short answer, Summary/sentence completion, Diagram labelling.\n\nTRUE/FALSE/NOT GIVEN vs YES/NO/NOT GIVEN:\nT/F/NG tests factual information. Y/N/NG tests the writer's opinion or claims. NOT GIVEN/NOT GIVEN = no information either way — if you cannot find information to prove OR disprove, it's NG. Don't use outside knowledge.\n\nWRITING TASK 1 (Academic — 150 words minimum, 20 minutes):\nDescribe a graph, chart, table, diagram, or process. Include overview + key features + comparisons. Include specific data. For processes: describe each stage using passive voice. Do NOT give your opinion in Task 1.\nKey vocabulary: rose sharply, declined gradually, remained stable, fluctuated, peaked at, accounted for, comprised.\n\nWRITING TASK 2 (250 words minimum, 40 minutes):\nEssay types: Opinion (agree/disagree), Discussion (both views), Problem/Solution, Advantages/Disadvantages, Two-part question. Band 7+ requires: clear position, fully developed paragraphs, cohesion (linking words used accurately not mechanically), range of vocabulary, grammatical range and accuracy. Common mistakes: not answering ALL parts of the question, repeating the question in the introduction, using memorised phrases that don't fit.\n\nSPEAKING (11-14 minutes):\nPart 1: familiar topics, 4-5 minutes. Part 2: individual long turn from cue card, speak 1-2 minutes. Part 3: abstract discussion, 4-5 minutes. Scored on: Fluency and coherence, Lexical resource, Grammatical range and accuracy, Pronunciation. Extend answers: say WHY, give an EXAMPLE, say WHEN or HOW OFTEN.\n\nLISTENING (~30 minutes + 10 minutes transfer):\n4 sections: social conversation, monologue, academic discussion, academic monologue. Questions follow audio in order. Read ahead during pauses. Spelling matters — use British English spelling.\n\nUse British English throughout. Teach all four skills with model answers and band score criteria. Only answer IELTS content." },
  "toefl": { name: "TOEFL iBT Preparation", code: "TOEFL", welcome: "I'm loaded with **TOEFL iBT** preparation content — all 4 sections.\n\n**The four sections:**\n- Reading (35min · 20q): academic passages — prose summary questions are worth 2 points each\n- Listening (36min): conversations + lectures — take notes, you cannot re-listen\n- Speaking (16min · 4 tasks): Tasks 2–4 integrate reading/listening sources\n- Writing (29min · 2 tasks): Integrated (summarise lecture vs reading) + Academic Discussion\n\n**Most universities require 80–100+.** Speaking Task 1 and Writing Task 2 (Academic Discussion) are the fastest to improve.\n\n**My approach:**\n- Scored practice responses with specific feedback\n- Teach you to paraphrase source material (not repeat it verbatim)\n- Highlight TOEFL vs IELTS differences where relevant\n\nWhat shall we work on?", prefix: "You are an expert TOEFL iBT tutor covering all four sections.\n\nTOEFL iBT — STRUCTURE:\nReading: 2 passages, 10 questions each, 35 minutes.\nListening: 2 conversations + 3 lectures, ~28 questions, 36 minutes.\nSpeaking: 4 tasks, 16 minutes.\nWriting: 2 tasks (Integrated + Academic Discussion), 29 minutes.\nTotal: ~3 hours. Score: 0-120 (30 per section). Most universities require 80-100+.\nCompletely computer-delivered. American English spelling accepted.\n\nREADING (35 minutes, 20 questions):\nPassages on academic topics — history, science, social science. Question types: Factual, Negative factual ('which is NOT mentioned'), Inference, Rhetorical purpose ('why does the author mention X?'), Vocabulary in context, Reference ('what does it/they/this refer to?'), Sentence simplification, Insert a sentence, Prose summary (choose 3 of 6 sentences — worth 2 points each, highest-value questions).\n\nFor SENTENCE INSERTION: read the paragraph before and after each insertion point. The sentence must connect logically in both directions.\n\nLISTENING:\nConversations: 2 people discussing campus topics. Lectures: professor speaking, sometimes with student interruptions. You cannot re-listen — take notes. Key signal phrases to note: 'The key point here is...', 'For example...', 'In contrast...', 'This brings us to...'\n\nSPEAKING:\nTask 1 (Independent): opinion on familiar topic. 15 sec prep, 45 sec response.\nTask 2: read a short text + listen to conversation. Summarise. 30 sec prep, 60 sec response.\nTask 3: read a short text + listen to lecture. Explain how lecture relates to reading. 30 sec prep, 60 sec response.\nTask 4: listen to lecture. Summarise key concepts. 20 sec prep, 60 sec response.\nScored on: Delivery, Language use, Topic development. Never leave silence — use transitions: 'What I mean by this is...', 'To add to that...'. Paraphrasing source material scores better than reading it back verbatim.\n\nWRITING:\nTask 1 — Integrated (20 minutes): read passage (3 min) + listen to lecture that challenges/supports it. Write 150-225 words summarising how the lecture relates to the reading. Do NOT give your opinion.\nTask 2 — Academic Discussion (10 minutes): professor posts a question; two students respond. Write ~100+ words adding your own post with opinion and reason. State opinion clearly in sentence 1. Give specific reason/example. Engage with one of the student posts. Use a range of vocabulary.\n\nHighlight differences between TOEFL and IELTS when relevant. Use American English. Only answer TOEFL content." },
};

/* ═══ SHAPE SVG COMPONENTS ═══ */
function SubjectIcon({id, size=36, colour}) {
  const s = size;
  const c = colour || C.green;
  if (id === "chemistry") return (
    <svg width={s} height={s} viewBox="0 0 36 36" fill="none">
      <polygon points="18,4 28.4,10 28.4,22 18,28 7.6,22 7.6,10" stroke={c} strokeWidth="1.8" strokeLinejoin="round" fill="none"/>
      <circle cx="18" cy="16" r="5.5" stroke={c} strokeWidth="1.2" opacity="0.5" fill="none"/>
    </svg>
  );
  if (id === "physics") return (
    <svg width={s} height={s} viewBox="0 0 36 36" fill="none">
      <path d="M4,18 C10,6 16,6 22,18 C28,30 34,30 36,18" stroke={c} strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      <line x1="4" y1="18" x2="36" y2="18" stroke={c} strokeWidth="0.6" opacity="0.2" strokeDasharray="2,2"/>
    </svg>
  );
  if (id === "maths") return (
    <svg width={s} height={s} viewBox="0 0 36 36" fill="none">
      <path d="M14,2 C8,2 5,6 5,12 L5,24 C5,30 2,34 -2,34" stroke={c} strokeWidth="2" strokeLinecap="round" fill="none"/>
      <circle cx="14" cy="0" r="2" fill={c}/>
      <circle cx="-2" cy="36" r="2" fill={c}/>
      <g opacity="0.3">{[0,1,2,3,4].map(i=><rect key={i} x={19+i*3.5} y={28-i*4} width={2.5} height={i*4+4} rx={0.5} fill={c}/>)}</g>
      <path d="M20,24 C24,18 28,14 34,10" stroke={c} strokeWidth="1.2" strokeLinecap="round" opacity="0.4" fill="none"/>
    </svg>
  );
  return <span style={{fontSize:size*0.8}}>{id === "gmat" ? "🎯" : id === "gre" ? "📊" : id === "sat" ? "📝" : id === "act" ? "✏️" : id === "lnat" ? "⚖️" : id === "ucat" ? "🩺" : id === "ielts" ? "🌐" : id === "toefl" ? "🌐" : "📚"}</span>;
}

function ShapeSVG({shape,formula,angle}){
  const f=formula||"?",a=angle||"";
  const wrap=(ch,vb="0 0 200 220")=>(<div style={{background:C.bgLight,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 8px 6px",margin:"10px 0",textAlign:"center"}}><svg viewBox={vb} style={{width:"100%",maxWidth:260,display:"block",margin:"0 auto"}}>{ch}</svg></div>);
  if(shape==="tetrahedral")return wrap(<><circle cx="100" cy="90" r="18" fill={C.bgCard} stroke={C.green} strokeWidth={2}/><text x="100" y="95" textAnchor="middle" fill={C.text} fontSize={14} fontWeight={600}>C</text><line x1="100" y1="72" x2="100" y2="20" stroke={C.green} strokeWidth={2.5} strokeLinecap="round"/><text x="100" y="14" textAnchor="middle" fill={C.textMuted} fontSize={13}>H</text><line x1="88" y1="102" x2="38" y2="152" stroke={C.green} strokeWidth={2.5} strokeLinecap="round"/><text x="28" y="162" textAnchor="middle" fill={C.textMuted} fontSize={13}>H</text><polygon points="110,100 158,135 158,148" fill={C.green} fillOpacity={0.4} stroke={C.green} strokeWidth={1.2}/><text x="166" y="148" fill={C.textMuted} fontSize={13}>H</text><line x1="112" y1="82" x2="162" y2="52" stroke={C.green} strokeWidth={2} strokeDasharray="5,4" opacity={0.6}/><text x="170" y="50" fill={C.textMuted} fontSize={13}>H</text><path d="M62,126 A50,50 0 0,1 92,48" fill="none" stroke={C.textDim} strokeWidth={0.8} strokeDasharray="3,2"/><text x="58" y="82" fill={C.textMuted} fontSize={10}>{a||"109.5°"}</text><text x="100" y="192" textAnchor="middle" fill={C.green} fontSize={12} fontWeight={500}>{f} — Tetrahedral (H–C–H {a||"109.5°"})</text></>,"0 0 200 200");
  if(shape==="pyramidal")return wrap(<><circle cx="100" cy="80" r="18" fill={C.bgCard} stroke={C.green} strokeWidth={2}/><text x="100" y="85" textAnchor="middle" fill={C.text} fontSize={14} fontWeight={600}>N</text><path d="M92,58 C82,34 86,12 100,0 C114,12 118,34 108,58 Z" fill={C.amber} fillOpacity={0.10} stroke={C.amber} strokeWidth={1.2} strokeOpacity={0.45}/><path d="M95,55 C88,38 90,16 100,6 C110,16 112,38 105,55 Z" fill={C.amber} fillOpacity={0.20}/><text x="130" y="28" fill={C.amber} fontSize={10}>lone pair</text><line x1="88" y1="94" x2="32" y2="152" stroke={C.green} strokeWidth={2.5} strokeLinecap="round"/><text x="22" y="164" textAnchor="middle" fill={C.textMuted} fontSize={13}>H</text><line x1="112" y1="94" x2="168" y2="152" stroke={C.green} strokeWidth={2.5} strokeLinecap="round"/><text x="178" y="164" textAnchor="middle" fill={C.textMuted} fontSize={13}>H</text><polygon points="93,96 86,156 114,156 107,96" fill={C.green} fillOpacity={0.35} stroke={C.green} strokeWidth={1}/><text x="100" y="172" textAnchor="middle" fill={C.textMuted} fontSize={13}>H</text><path d="M52,132 A55,30 0 0,1 148,132" fill="none" stroke={C.textDim} strokeWidth={0.8} strokeDasharray="3,2"/><text x="100" y="144" textAnchor="middle" fill={C.textMuted} fontSize={10}>{a||"107°"}</text><text x="100" y="195" textAnchor="middle" fill={C.green} fontSize={12} fontWeight={500}>{f} — Pyramidal (H–N–H {a||"107°"})</text></>,"0 0 200 205");
  if(shape==="bent")return wrap(<><circle cx="100" cy="75" r="18" fill={C.bgCard} stroke={C.green} strokeWidth={2}/><text x="100" y="80" textAnchor="middle" fill={C.text} fontSize={14} fontWeight={600}>O</text><g transform="rotate(-22,100,75)"><path d="M93,53 C83,31 87,8 100,-5 C113,8 117,31 107,53 Z" fill={C.amber} fillOpacity={0.10} stroke={C.amber} strokeWidth={1.1} strokeOpacity={0.4}/><path d="M96,50 C89,34 91,14 100,4 C109,14 111,34 104,50 Z" fill={C.amber} fillOpacity={0.18}/></g><g transform="rotate(22,100,75)"><path d="M93,53 C83,31 87,8 100,-5 C113,8 117,31 107,53 Z" fill={C.amber} fillOpacity={0.10} stroke={C.amber} strokeWidth={1.1} strokeOpacity={0.4}/><path d="M96,50 C89,34 91,14 100,4 C109,14 111,34 104,50 Z" fill={C.amber} fillOpacity={0.18}/></g><text x="100" y="-4" textAnchor="middle" fill={C.amber} fontSize={10}>2 lone pairs</text><line x1="88" y1="89" x2="32" y2="145" stroke={C.green} strokeWidth={2.5} strokeLinecap="round"/><text x="22" y="156" textAnchor="middle" fill={C.textMuted} fontSize={13}>H</text><line x1="112" y1="89" x2="168" y2="145" stroke={C.green} strokeWidth={2.5} strokeLinecap="round"/><text x="178" y="156" textAnchor="middle" fill={C.textMuted} fontSize={13}>H</text><path d="M58,120 A50,28 0 0,1 142,120" fill="none" stroke={C.textDim} strokeWidth={0.8} strokeDasharray="3,2"/><text x="100" y="132" textAnchor="middle" fill={C.textMuted} fontSize={10}>{a||"104.5°"}</text><text x="100" y="180" textAnchor="middle" fill={C.green} fontSize={12} fontWeight={500}>{f} — Bent (H–O–H {a||"104.5°"})</text></>,"0 0 200 190");
  if(shape==="trigonal_planar")return wrap(<><circle cx="100" cy="80" r="18" fill={C.bgCard} stroke={C.green} strokeWidth={2}/><text x="100" y="85" textAnchor="middle" fill={C.text} fontSize={14} fontWeight={600}>B</text><line x1="100" y1="62" x2="100" y2="10" stroke={C.green} strokeWidth={2.5} strokeLinecap="round"/><text x="100" y="4" textAnchor="middle" fill={C.textMuted} fontSize={13}>F</text><line x1="86" y1="90" x2="32" y2="128" stroke={C.green} strokeWidth={2.5} strokeLinecap="round"/><text x="22" y="138" textAnchor="middle" fill={C.textMuted} fontSize={13}>F</text><line x1="114" y1="90" x2="168" y2="128" stroke={C.green} strokeWidth={2.5} strokeLinecap="round"/><text x="178" y="138" textAnchor="middle" fill={C.textMuted} fontSize={13}>F</text><path d="M58,108 A42,42 0 0,1 90,38" fill="none" stroke={C.textDim} strokeWidth={0.8} strokeDasharray="3,2"/><text x="56" y="68" fill={C.textMuted} fontSize={10}>{a||"120°"}</text><text x="100" y="168" textAnchor="middle" fill={C.green} fontSize={12} fontWeight={500}>{f} — Trigonal planar (F–B–F {a||"120°"})</text></>,"0 0 200 178");
  if(shape==="linear")return wrap(<><circle cx="110" cy="40" r="18" fill={C.bgCard} stroke={C.green} strokeWidth={2}/><text x="110" y="45" textAnchor="middle" fill={C.text} fontSize={14} fontWeight={600}>C</text><line x1="92" y1="37" x2="28" y2="37" stroke={C.green} strokeWidth={2.2} strokeLinecap="round"/><line x1="92" y1="43" x2="28" y2="43" stroke={C.green} strokeWidth={2.2} strokeLinecap="round"/><line x1="128" y1="37" x2="192" y2="37" stroke={C.green} strokeWidth={2.2} strokeLinecap="round"/><line x1="128" y1="43" x2="192" y2="43" stroke={C.green} strokeWidth={2.2} strokeLinecap="round"/><text x="16" y="44" textAnchor="middle" fill={C.textMuted} fontSize={13}>O</text><text x="204" y="44" textAnchor="middle" fill={C.textMuted} fontSize={13}>O</text><text x="110" y="72" textAnchor="middle" fill={C.textMuted} fontSize={10}>{a||"180°"}</text><text x="110" y="92" textAnchor="middle" fill={C.green} fontSize={12} fontWeight={500}>{f} — Linear (O–C–O {a||"180°"})</text></>,"0 0 220 100");
  if(shape==="octahedral")return wrap(<><circle cx="100" cy="100" r="18" fill={C.bgCard} stroke={C.green} strokeWidth={2}/><text x="100" y="105" textAnchor="middle" fill={C.text} fontSize={14} fontWeight={600}>S</text><line x1="100" y1="82" x2="100" y2="20" stroke={C.green} strokeWidth={2.5} strokeLinecap="round"/><text x="100" y="14" textAnchor="middle" fill={C.textMuted} fontSize={13}>F</text><line x1="100" y1="118" x2="100" y2="180" stroke={C.green} strokeWidth={2.5} strokeLinecap="round"/><text x="100" y="192" textAnchor="middle" fill={C.textMuted} fontSize={13}>F</text><line x1="82" y1="100" x2="20" y2="100" stroke={C.green} strokeWidth={2.5} strokeLinecap="round"/><text x="10" y="104" textAnchor="middle" fill={C.textMuted} fontSize={13}>F</text><line x1="118" y1="100" x2="180" y2="100" stroke={C.green} strokeWidth={2.5} strokeLinecap="round"/><text x="192" y="104" textAnchor="middle" fill={C.textMuted} fontSize={13}>F</text><polygon points="110,112 148,148 158,138" fill={C.green} fillOpacity={0.35} stroke={C.green} strokeWidth={1}/><text x="164" y="152" fill={C.textMuted} fontSize={11}>F</text><line x1="90" y1="88" x2="52" y2="50" stroke={C.green} strokeWidth={2} strokeDasharray="5,4" opacity={0.6}/><text x="40" y="46" fill={C.textMuted} fontSize={11}>F</text><path d="M118,130 A20,20 0 0,1 130,118" fill="none" stroke={C.textDim} strokeWidth={0.8} strokeDasharray="3,2"/><text x="138" y="130" fill={C.textMuted} fontSize={10}>{a||"90°"}</text><text x="100" y="212" textAnchor="middle" fill={C.green} fontSize={12} fontWeight={500}>{f} — Octahedral (F–S–F {a||"90°"})</text></>,"0 0 200 220");
  if(shape==="trigonal_bipyramidal")return wrap(<><ellipse cx="100" cy="105" rx="90" ry="25" fill="none" stroke={C.green} strokeWidth={0.5} strokeDasharray="4,4" opacity={0.2}/><line x1="100" y1="82" x2="100" y2="10" stroke={C.green} strokeWidth={2.5} strokeLinecap="round"/><line x1="100" y1="118" x2="100" y2="195" stroke={C.green} strokeWidth={2.5} strokeLinecap="round"/><line x1="82" y1="104" x2="12" y2="104" stroke={C.green} strokeWidth={2.5} strokeLinecap="round"/><polygon points="112,112 178,130 180,118" fill={C.green} fillOpacity={0.35} stroke={C.green} strokeWidth={1.2}/><line x1="112" y1="92" x2="178" y2="72" stroke={C.green} strokeWidth={2.2} strokeDasharray="5,4" opacity={0.6}/><circle cx="100" cy="100" r="18" fill={C.bgCard} stroke={C.green} strokeWidth={2}/><text x="100" y="105" textAnchor="middle" fill={C.text} fontSize={14} fontWeight={600}>P</text><text x="100" y="4" textAnchor="middle" fill={C.textMuted} fontSize={13}>Cl</text><text x="100" y="208" textAnchor="middle" fill={C.textMuted} fontSize={13}>Cl</text><text x="4" y="108" textAnchor="middle" fill={C.textMuted} fontSize={13}>Cl</text><text x="188" y="136" fill={C.textMuted} fontSize={13}>Cl</text><text x="186" y="68" fill={C.textMuted} fontSize={13}>Cl</text><text x="116" y="14" fill={C.textDim} fontSize={9}>axial</text><text x="4" y="120" fill={C.textDim} fontSize={9}>equatorial</text><path d="M86,78 A28,28 0 0,0 72,98" fill="none" stroke={C.textDim} strokeWidth={0.8} strokeDasharray="3,2"/><text x="60" y="82" fill={C.textMuted} fontSize={10}>90°</text><path d="M42,112 A22,22 0 0,1 78,120" fill="none" stroke={C.textDim} strokeWidth={0.8} strokeDasharray="3,2"/><text x="48" y="132" fill={C.textMuted} fontSize={10}>120°</text><text x="100" y="232" textAnchor="middle" fill={C.green} fontSize={12} fontWeight={500}>{f} — Trigonal bipyramidal ({a||"90°, 120°"})</text></>,"0 0 200 242");
  if(shape==="square_planar")return wrap(<><circle cx="100" cy="100" r="18" fill={C.bgCard} stroke={C.green} strokeWidth={2}/><text x="100" y="105" textAnchor="middle" fill={C.text} fontSize={12} fontWeight={600}>Xe</text><line x1="86" y1="86" x2="32" y2="32" stroke={C.green} strokeWidth={2.5} strokeLinecap="round"/><line x1="114" y1="86" x2="168" y2="32" stroke={C.green} strokeWidth={2.5} strokeLinecap="round"/><line x1="86" y1="114" x2="32" y2="168" stroke={C.green} strokeWidth={2.5} strokeLinecap="round"/><line x1="114" y1="114" x2="168" y2="168" stroke={C.green} strokeWidth={2.5} strokeLinecap="round"/><text x="22" y="28" textAnchor="middle" fill={C.textMuted} fontSize={13}>F</text><text x="178" y="28" textAnchor="middle" fill={C.textMuted} fontSize={13}>F</text><text x="22" y="178" textAnchor="middle" fill={C.textMuted} fontSize={13}>F</text><text x="178" y="178" textAnchor="middle" fill={C.textMuted} fontSize={13}>F</text><g transform="rotate(90,100,100)"><path d="M93,78 C83,56 87,32 100,18 C113,32 117,56 107,78 Z" fill={C.amber} fillOpacity={0.10} stroke={C.amber} strokeWidth={1.2} strokeOpacity={0.4}/><path d="M96,75 C89,58 91,38 100,28 C109,38 111,58 104,75 Z" fill={C.amber} fillOpacity={0.18}/></g><g transform="rotate(-90,100,100)"><path d="M93,78 C83,56 87,32 100,18 C113,32 117,56 107,78 Z" fill={C.amber} fillOpacity={0.10} stroke={C.amber} strokeWidth={1.2} strokeOpacity={0.4}/><path d="M96,75 C89,58 91,38 100,28 C109,38 111,58 104,75 Z" fill={C.amber} fillOpacity={0.18}/></g><text x="188" y="104" fill={C.amber} fontSize={10}>LP</text><text x="4" y="104" fill={C.amber} fontSize={10}>LP</text><path d="M58,58 A18,18 0 0,1 58,142" fill="none" stroke={C.textDim} strokeWidth={0.8} strokeDasharray="3,2"/><text x="42" y="104" textAnchor="middle" fill={C.textMuted} fontSize={10}>{a||"90°"}</text><text x="100" y="205" textAnchor="middle" fill={C.green} fontSize={12} fontWeight={500}>{f} — Square planar (F–Xe–F {a||"90°"})</text></>,"0 0 200 215");
  return <div style={{color:C.textMuted,fontSize:12,padding:8,background:C.bgLight,borderRadius:8,margin:"6px 0"}}>Shape: {shape} {f} {a}</div>;}

/* ═══ MECHANISM DIAGRAM ═══ */
function MechDiagram({type,equation}){const isFR=type==="free_radical";const step=(c)=>({color:c,fontSize:11,fontWeight:600,fontFamily:"'DM Sans',sans-serif",marginTop:8,marginBottom:2});const line={color:C.text,fontSize:13,fontFamily:"'JetBrains Mono',monospace",lineHeight:1.9};const dot=<span style={{color:C.red,fontWeight:700}}>•</span>;const arr=(c)=><span style={{color:c||C.green}}> → </span>;return(<div style={{background:C.bgLight,border:`1px solid ${C.border}`,borderRadius:10,padding:"14px 18px",margin:"10px 0"}}><div style={{fontSize:10,textTransform:"uppercase",letterSpacing:"0.1em",color:C.green,marginBottom:6,fontFamily:"'DM Sans',sans-serif",fontWeight:600}}>{isFR?"Free Radical Substitution":"Electrophilic Addition"}</div><div style={line}>{isFR?(<><div style={step(C.amber)}>Initiation — homolytic fission (UV light)</div><div>Cl—Cl {arr(C.amber)} 2Cl{dot}</div><div style={step(C.green)}>Propagation — chain reaction</div><div>Cl{dot} + CH₄ {arr()} CH₃{dot} + HCl</div><div>CH₃{dot} + Cl₂ {arr()} CH₃Cl + Cl{dot}</div><div style={step(C.textMuted)}>Termination — radicals combine</div><div>2Cl{dot} {arr(C.textMuted)} Cl₂</div><div>Cl{dot} + CH₃{dot} {arr(C.textMuted)} CH₃Cl</div><div>2CH₃{dot} {arr(C.textMuted)} C₂H₆</div></>):(<><div style={step(C.green)}>Step 1 — π bond attacks electrophile</div><svg viewBox="0 0 280 55" style={{width:"100%",maxWidth:280,display:"block",margin:"4px 0"}}><text x="5" y="30" fill={C.text} fontSize="13" fontFamily="'JetBrains Mono',monospace">C=C</text><path d="M42,25 Q80,5 118,20" fill="none" stroke={C.amber} strokeWidth="2" markerEnd="url(#ca)"/><defs><marker id="ca" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,2 L10,5 L0,8 z" fill={C.amber}/></marker></defs><text x="55" y="12" fill={C.amber} fontSize="9" fontFamily="'DM Sans',sans-serif">curly arrow</text><text x="122" y="30" fill={C.text} fontSize="13" fontFamily="'JetBrains Mono',monospace">H—Br</text><text x="122" y="48" fill={C.textMuted} fontSize="9" fontFamily="'DM Sans',sans-serif">δ⁺    δ⁻</text></svg><div>C=C + H<sup>δ⁺</sup>—Br<sup>δ⁻</sup> {arr()} C—C⁺ + Br⁻</div><div style={step(C.green)}>Step 2 — Nucleophilic attack</div><div>Br⁻ {arr()} C⁺ (attacks carbocation)</div><div style={{marginTop:8,color:C.green,fontSize:12}}>Overall: {equation}</div></>)}</div></div>);}

function EqBox({content}){return(<div style={{background:C.bgLight,border:`1px solid ${C.greenBorder}`,borderRadius:8,padding:"8px 16px",margin:"6px 0",display:"inline-block",fontFamily:"'JetBrains Mono',monospace",fontSize:15,fontWeight:500,color:C.green}}>{content}</div>);}
function ConfigBox({element,config}){return(<div style={{background:C.bgLight,border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 14px",margin:"6px 0",display:"inline-block"}}><span style={{color:C.amber,fontWeight:600,fontSize:14,fontFamily:"'DM Sans',sans-serif"}}>{element}: </span><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:14,color:C.green}}>{config}</span></div>);}

/* ═══ PARSER ═══ */

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

function parseAndRender(text){
  const lines=text.split("\n");
  const elements=[];
  const tagRe=/^\[(\w+):(.+)\]$/;
  for(let i=0;i<lines.length;i++){
    const line=lines[i].trim();
    const m=line.match(tagRe);
    if(m){
      const[,tag,params]=m;
      const p=params.split(":");
      if(tag==="SHAPE")elements.push(<ShapeSVG key={`s${i}`} shape={p[0]} formula={p[1]} angle={p[2]}/>);
      else if(tag==="MECHANISM")elements.push(<MechDiagram key={`m${i}`} type={p[0]} equation={p.slice(1).join(":")}/>);
      else if(tag==="EQUATION")elements.push(<EqBox key={`e${i}`} content={p.join(":")}/>);
      else if(tag==="ORGANIC")elements.push(<div key={`org${i}`} style={{background:C.bgLight,border:`1px solid ${C.border}`,borderRadius:10,padding:"14px 18px",margin:"10px 0",fontFamily:"'JetBrains Mono',monospace",fontSize:13,lineHeight:1.7,color:C.text,whiteSpace:"pre",overflowX:"auto"}}>{p.join(":").replace(/\\n/g,"\n")}</div>);
      else if(tag==="DISPLAYED"){const dp=params.split(":");elements.push(<DisplayedFormulaSVG key={`df${i}`} chain={dp[0]} dbond={dp[1]} subs={dp[2]} dir={dp[3]} label={dp[4]}/>);}
      else if(tag==="CONFIG")elements.push(<ConfigBox key={`c${i}`} element={p[0]} config={p.slice(1).join(":")}/>);
    } else if(line.startsWith("## ")){
      elements.push(<div key={`h${i}`} style={{fontSize:15,fontWeight:600,color:C.text,fontFamily:"'DM Serif Display',serif",marginTop:16,marginBottom:6,paddingBottom:6,borderBottom:`1px solid ${C.border}`}}>{line.slice(3)}</div>);
    } else if(line.startsWith("### ")){
      elements.push(<div key={`h3${i}`} style={{fontSize:13,fontWeight:600,color:C.green,marginTop:12,marginBottom:4,letterSpacing:"0.03em"}}>{line.slice(4)}</div>);
    } else if(line.match(/^\d+\.\s/)){
      const num=line.match(/^(\d+)\.\s(.+)/);
      if(num) elements.push(<div key={`ol${i}`} style={{display:"flex",gap:10,marginBottom:4,paddingLeft:4}}><span style={{color:C.green,fontWeight:600,fontSize:13,flexShrink:0,minWidth:20}}>{num[1]}.</span><span style={{fontSize:13.5,lineHeight:1.7}}><RichLine text={num[2]}/></span></div>);
    } else if(line.startsWith("- ")||line.startsWith("• ")){
      elements.push(<div key={`li${i}`} style={{display:"flex",gap:10,marginBottom:3,paddingLeft:4}}><span style={{color:C.green,fontSize:10,marginTop:7,flexShrink:0}}>●</span><span style={{fontSize:13.5,lineHeight:1.7}}><RichLine text={line.slice(2)}/></span></div>);
    } else if(line){
      elements.push(<div key={`t${i}`} style={{marginBottom:6,fontSize:13.5,lineHeight:1.8}}><RichLine text={line}/></div>);
    } else {
      elements.push(<div key={`sp${i}`} style={{height:8}}/>);
    }
  }
  return elements;
}
function RichLine({text}){if(text.trim()==="on this")return null;return text.split(/(\[.*?\]\(https?:\/\/.*?\)|https?:\/\/[^\s)]+|\*\*.*?\*\*|\*.*?\*|`[^`]+`)/g).map((s,i)=>{
if(!s)return null;
const mdLink=s.match(/^\[(.+?)\]\((https?:\/\/.+?)\)$/);
if(mdLink)return <a key={i} href={mdLink[2]} target="_blank" rel="noopener noreferrer" style={{color:C.green,textDecoration:"underline",textUnderlineOffset:"3px"}}>{mdLink[1]}</a>;
if(s.match(/^https?:\/\//))return <a key={i} href={s} target="_blank" rel="noopener noreferrer" style={{color:C.green,textDecoration:"underline",textUnderlineOffset:"3px",wordBreak:"break-all",fontSize:"0.92em"}}>{s}</a>;
if(s.startsWith("**")&&s.endsWith("**"))return <strong key={i} style={{fontWeight:600,color:C.text}}>{s.slice(2,-2)}</strong>;
if(s.startsWith("*")&&s.endsWith("*"))return <em key={i} style={{fontStyle:"italic",color:C.text}}>{s.slice(1,-1)}</em>;
if(s.startsWith("`")&&s.endsWith("`"))return <code key={i} style={{background:C.greenDim,padding:"2px 7px",borderRadius:4,fontFamily:"'JetBrains Mono',monospace",fontSize:"0.85em",color:C.green,border:`1px solid ${C.greenBorder}`}}>{s.slice(1,-1)}</code>;
return <span key={i}>{s}</span>;});}

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════ */
export default function Home(){
  const[pickerStep,setPickerStep]=useState("subject");
  const[boardOverride,setBoardOverride]=useState(null);
  const[selectedCatalog,setSelectedCatalog]=useState(null);
  const[activeUnit,setActiveUnit]=useState(null);
  const[msgs,setMsgs]=useState([]);
  const[input,setInput]=useState("");
  const[pendingImage,setPendingImage]=useState(null);
  const[loading,setLoading]=useState(false);
  const[err,setErr]=useState(null);
  const[mode,setMode]=useState("ask");

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
    const _stored=JSON.parse(localStorage.getItem("agf_daily_msgs")||"{}");const _today=new Date().toDateString();const _base=(_stored.date===_today?(_stored.count||0):0);const next=_base+1;
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


  const[showPicker,setShowPicker]=useState(false);
  const[quizQ,setQuizQ]=useState(null);
  const[quizNum,setQuizNum]=useState(0);
  const[quizSelected,setQuizSelected]=useState(null);
  const[quizFeedback,setQuizFeedback]=useState(null);
  const[quizScore,setQuizScore]=useState(0);
  const[quizMaxScore,setQuizMaxScore]=useState(0);
  const[quizHistory,setQuizHistory]=useState([]);
  const[quizDone,setQuizDone]=useState(false);
  const[quizTotal,setQuizTotal]=useState(10);
  const[showQuizPicker,setShowQuizPicker]=useState(false);
  const[quizDifficulty,setQuizDifficulty]=useState("medium");
  const[hintText,setHintText]=useState(null);
  const[hintLoading,setHintLoading]=useState(false);
  const[notesContent,setNotesContent]=useState(null);
  const[notesLoading,setNotesLoading]=useState(false);
  const endRef=useRef(null);const inputRef=useRef(null);
  const imageInputRef=useRef(null);
  const baseUnit=activeUnit?UNITS[activeUnit]:null;
  const STANDALONE_BOARDS=["sat-verbal","act-verbal","gmat","gre","lnat","ucat","ielts","toefl"];const STANDALONE_UI={"lnat":{placeholder:"Ask about LNAT...",prompts:["Walk me through an LNAT inference question","Help me plan a Section B essay","What's the difference between assumption and inference?","Critique an argument I've written"]},"ucat":{placeholder:"Ask about UCAT...",prompts:["Explain True / False / Can't Tell in Verbal Reasoning","Quiz me on Decision Making syllogisms","Teach me the SCANS approach for Abstract Reasoning","Walk me through SJ ethics priorities"]},"ielts":{placeholder:"Ask about IELTS...",prompts:["Mark my IELTS Writing Task 2 essay","Give me a Task 1 chart to describe","Help me extend my Speaking Part 2 answer","Practise True / False / Not Given questions"]},"toefl":{placeholder:"Ask about TOEFL iBT...",prompts:["Help me with an Integrated Writing task","Practise Speaking Task 3 (read + listen)","Teach me the Prose Summary strategy","Give me Academic Discussion feedback"]},"gmat":{placeholder:"Ask about GMAT...",prompts:["Explain Critical Reasoning assumption questions","Walk me through a Data Sufficiency problem","Teach me the Sentence Correction idioms","Quant word problem walkthrough"]},"gre":{placeholder:"Ask about GRE...",prompts:["Teach me Text Completion strategy","Walk me through Sentence Equivalence","Quantitative Comparison tactics","How do I structure an AWA essay?"]},"sat-verbal":{placeholder:"Ask about SAT Reading & Writing...",prompts:["Explain Transitions questions","Walk me through Rhetorical Synthesis","Vocabulary in Context strategy","Punctuation and sentence boundaries"]},"act-verbal":{placeholder:"Ask about ACT English & Reading...",prompts:["When is NO CHANGE the correct answer?","How do I pace ACT Reading passages?","Comma rules explained for ACT English","ACT vs SAT — what's different?"],"ap-calc-ab":{placeholder:"Ask about AP Calculus AB...",prompts:["Explain the definition of a limit","How do I differentiate using the chain rule?","Quiz me on definite integrals","What is the Fundamental Theorem of Calculus?"]},"ap-calc-bc":{placeholder:"Ask about AP Calculus BC...",prompts:["Explain series convergence tests","How do I integrate by parts?","Quiz me on parametric and polar functions","What topics are BC-only vs AB?"]},"gcse-maths-f":{placeholder:"Ask about GCSE Maths (Foundation)...",prompts:["Explain how to find a percentage of an amount","How do I solve a simple equation?","Quiz me on fractions and decimals","What is the area of a circle?"]},"gcse-maths-h":{placeholder:"Ask about GCSE Maths (Higher)...",prompts:["Explain how to factorise a quadratic","How do I use the sine and cosine rules?","Quiz me on simultaneous equations","What is the difference between similar and congruent shapes?"]},"ib-maths-aa":{placeholder:"Ask about IB Maths Analysis & Approaches...",prompts:["Explain proof by mathematical induction","How do I find the derivative using first principles?","Quiz me on complex numbers","What is the binomial theorem in IB notation?"]},"ib-maths-ai":{placeholder:"Ask about IB Maths Applications & Interpretation...",prompts:["How do I fit a regression line to data?","Explain the normal distribution and z-scores","Quiz me on financial mathematics","What is Voronoi diagrams and when do I use them?"]},"ap-physc-mech":{placeholder:"Ask about AP Physics C: Mechanics...",prompts:["Derive the kinematic equations using calculus","Explain rotational inertia and torque","How does simple harmonic motion work?","Quiz me on Newton's laws with calculus"]},"ap-physc-em":{placeholder:"Ask about AP Physics C: E&M...",prompts:["Explain Gauss's Law with an example","How do I find the electric potential from a field?","Derive the equation for a charging capacitor","Quiz me on Faraday's and Lenz's laws"]}}};const currentUnit=baseUnit&&boardOverride&&BOARD_CONTEXT[boardOverride]?{...baseUnit,name:BOARD_CONTEXT[boardOverride].name,code:BOARD_CONTEXT[boardOverride].code,...(STANDALONE_UI[boardOverride]||{}),system:STANDALONE_BOARDS.includes(boardOverride)?BOARD_CONTEXT[boardOverride].prefix:BOARD_CONTEXT[boardOverride].prefix+"\n\n"+baseUnit.system.replace(/Only answer W[A-Z]+\d+.*?\./g,"").replace(/Use diagram tags[^.]*\./g,"").replace(/Use \[EQUATION[^.]*\./g,"")}:baseUnit;

  useEffect(()=>{endRef.current?.scrollIntoView({behavior:"smooth"});},[msgs,loading,quizFeedback,quizQ]);
  useEffect(()=>{if(activeUnit&&mode==="ask")inputRef.current?.focus();},[activeUnit,mode]);

  const selectUnit=(unitKey,boardId)=>{setActiveUnit(unitKey);setBoardOverride(boardId||null);setPickerStep(null);const bc=boardId&&BOARD_CONTEXT[boardId];const welcomeBase=UNITS[unitKey].welcome;const welcomeMsg=bc?welcomeBase.replace(/\*\*.*?\*\*/, "**"+bc.name+"**").replace(/\(W[A-Z]+\d+\).*?\./,"."): welcomeBase;setMsgs([{role:"assistant",content:bc?`Hello! I'm your **AGF Study Companion**, powered by Alastair's diagnostic teaching method.\n\n${bc.welcome}`:welcomeMsg}]);setErr(null);setInput("");setMode("ask");resetQuiz();setNotesContent(null);setNotesLoading(false);setShowPicker(false);};
  const goHome=()=>{setPickerStep("subject");setSelectedCatalog(null);setActiveUnit(null);setMsgs([]);setMode("ask");resetQuiz();setShowPicker(false);};
  const resetQuiz=()=>{setQuizQ(null);setQuizNum(0);setQuizSelected(null);setQuizFeedback(null);setQuizScore(0);setQuizMaxScore(0);setQuizHistory([]);setQuizDone(false);setShowQuizPicker(false);setHintText(null);setHintLoading(false); setUsedPPIndices(new Set());setQuizDifficulty("medium");};

  const QUIZ_GEN_SYSTEM=(s)=>s+`\n\nQUIZ QUESTION GENERATION MODE:\nYou must respond with ONLY a valid JSON object, no other text, no markdown fences, no explanation.\n\nGenerate ONE multiple-choice exam-style question in the style of Edexcel IAL past papers.\n\nJSON format:\n{"question":"The question text here","options":[{"label":"A","text":"First option"},{"label":"B","text":"Second option"},{"label":"C","text":"Third option"},{"label":"D","text":"Fourth option"}],"correctLabel":"C","topic":"bonding","difficulty":5,"explanations":{"A":"Why A is wrong","B":"Why B is wrong","C":"Why C is correct — full working","D":"Why D is wrong"},"hint":"A brief nudge without giving away the answer"}\n\nRules:\n- ALWAYS exactly 4 options A, B, C, D\n- ALWAYS multiple choice\n- Include plausible distractors based on common misconceptions\n- difficulty 1-10\n- Include full working in correct answer explanation\n- Respond with ONLY the JSON object`;
  const QUIZ_HINT_SYSTEM=(s)=>s+`\n\nGive a brief, helpful hint for this question. Don't give away the answer. One or two sentences maximum. Respond with just the hint text, no JSON.`;

  const parseJSON=(text)=>{try{return JSON.parse(text.replace(/```json\s*/g,"").replace(/```\s*/g,"").trim());}catch(e){return null;}};

  
  // Pick a random past-paper question, avoiding previously used topics
  const pickPastPaper = (unitId, usedTopics, usedPPIndices) => {
    const bank = PAST_PAPERS[unitId];
    if (!bank || bank.length === 0) return null;
    // Filter out already-used questions and try to avoid repeat topics
    let candidates = bank.filter((q, i) => !usedPPIndices.has(i));
    if (candidates.length === 0) return null;
    // Prefer questions on topics not yet covered
    const freshTopic = candidates.filter(q => !usedTopics.includes(q.topic));
    if (freshTopic.length > 0) candidates = freshTopic;
    const pick = candidates[Math.floor(Math.random() * candidates.length)];
    const pickIdx = bank.indexOf(pick);
    return { ...pick, _ppIndex: pickIdx };
  };

  // Track which past-paper questions have been used in this quiz
  const [usedPPIndices, setUsedPPIndices] = useState(new Set());

  const fetchQuizQuestion=useCallback(async(questionNumber)=>{if(!currentUnit)return;setLoading(true);setErr(null);setQuizQ(null);setQuizSelected(null);setQuizFeedback(false);setHintText(null);const ppUnitId=activeUnit;if(questionNumber%2===1&&PAST_PAPERS[ppUnitId]){const prevTopics=quizHistory.map(h=>h.topic).filter(Boolean);const pp=pickPastPaper(ppUnitId,prevTopics,usedPPIndices);if(pp){setUsedPPIndices(prev=>new Set([...prev,pp._ppIndex]));const{_ppIndex,...cleanQ}=pp;setQuizQ(cleanQ);setLoading(false);return;}}const diffBase=quizDifficulty==="easy"?1:quizDifficulty==="challenging"?5:3;const diffCeil=quizDifficulty==="easy"?4:quizDifficulty==="challenging"?10:7;const difficulty=Math.min(diffCeil,Math.max(diffBase,Math.round(diffBase+(diffCeil-diffBase)*(questionNumber/quizTotal))));const prevTopics=quizHistory.map(h=>h.topic).filter(Boolean);try{const res=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:[{role:"user",content:`Generate question ${questionNumber}/${quizTotal}. Difficulty: ${difficulty}/10. ${prevTopics.length?"Already covered topics: "+prevTopics.join(", ")+". Try a different topic.":""} Respond with ONLY JSON.`}],system:QUIZ_GEN_SYSTEM(currentUnit.system),mode:"quiz"})});const data=await res.json();if(data.error)throw new Error(data.error.message);const text=data.content?.map(b=>b.type==="text"?b.text:"").filter(Boolean).join("\n")||"";const parsed=parseJSON(text);if(parsed&&parsed.question&&parsed.options&&parsed.correctLabel){setQuizQ(parsed);}else{throw new Error("Failed to parse question. Please try again.");}}catch(e){if(e.message&&(e.message.includes("overload")||e.message.includes("529")||e.message.includes("capacity"))){setErr("API busy — retrying in 3s...");await new Promise(r=>setTimeout(r,3000));try{const res2=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:[{role:"user",content:`Generate question ${questionNumber}/${quizTotal}. Respond with ONLY JSON.`}],system:QUIZ_GEN_SYSTEM(currentUnit.system),mode:"quiz"})});const d2=await res2.json();if(!d2.error){const t2=d2.content?.map(b=>b.type==="text"?b.text:"").filter(Boolean).join("\n")||"";const p2=parseJSON(t2);if(p2&&p2.question&&p2.options&&p2.correctLabel){setQuizQ(p2);setErr(null);setLoading(false);return;}}}catch(e2){}}setErr(e.message+" — Click Retry or start a New Quiz.");}finally{setLoading(false);};},[currentUnit,quizHistory]);

  const startQuiz=useCallback(async(total)=>{if(loading||!currentUnit)return;if(total)setQuizTotal(total);setShowQuizPicker(false);setMode("quiz");resetQuiz();setQuizNum(1);await fetchQuizQuestion(1);},[loading,currentUnit]);
  const showQuizOptions=()=>{if(loading||!currentUnit)return;if(!isSubscribed&&quizzesUsed>=FREE_QUIZ_LIMIT){setShowPaywall(true);setMode("quiz");return;}setShowQuizPicker(true);setMode("quiz");};
  const[pendingNext,setPendingNext]=useState(false);
  useEffect(()=>{if(pendingNext&&quizNum>0){fetchQuizQuestion(quizNum);setPendingNext(false);}},[pendingNext,quizNum]);
  const submitAnswer=useCallback(()=>{if(!quizQ||!quizSelected)return;const isCorrect=quizSelected===quizQ.correctLabel;setQuizFeedback(true);if(isCorrect)setQuizScore(s=>s+1);setQuizMaxScore(s=>s+1);setQuizHistory(h=>[...h,{q:quizQ.question,answer:quizSelected,correct:isCorrect,topic:quizQ.topic,correctLabel:quizQ.correctLabel}]);},[quizQ,quizSelected]);
  const nextQuestion=()=>{if(quizNum>=quizTotal){setQuizDone(true);incrementQuizCount();return;}setQuizNum(n=>n+1);setPendingNext(true);};
  const getHint=useCallback(async()=>{if(!quizQ||hintLoading)return;if(quizQ.hint){setHintText(quizQ.hint);return;}setHintLoading(true);try{const res=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:[{role:"user",content:`Give me a hint for: ${quizQ.question}\nOptions: ${quizQ.options.map(o=>o.label+") "+o.text).join(", ")}`}],system:QUIZ_HINT_SYSTEM(currentUnit.system),mode:"ask"})});const data=await res.json();const text=data.content?.map(b=>b.type==="text"?b.text:"").filter(Boolean).join("\n")||"Think about the key concepts involved.";setHintText(text);}catch(e){setHintText("Think about the key concepts involved in this topic.");}finally{setHintLoading(false);}},[quizQ,hintLoading,currentUnit]);
  const generateNotes=useCallback(async()=>{if(!currentUnit||notesLoading)return;setNotesLoading(true);setNotesContent(null);try{const res=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:[{role:"user",content:"Generate comprehensive revision notes for this subject. Cover ALL key topics from the syllabus. For each topic include: definitions, key formulae, exam tips, and common mistakes. Format with ## headings for each topic, bullet points for key facts, and **bold** for important terms. Be thorough and exam-focused."}],system:currentUnit.system,mode:"ask"})});const data=await res.json();if(data.error)throw new Error(data.error.message);const text=data.content?.map(b=>b.type==="text"?b.text:"").filter(Boolean).join("\n")||"";setNotesContent(text);}catch(e){setErr(e.message);}finally{setNotesLoading(false);}},[currentUnit,notesLoading]);
  const downloadChatNotes=(content,topic)=>{
    const clean=content
      .replace(/📖[^\n]*Quiz me[^\n]*/g,'')
      .split('\n').filter(l=>l.trim()!=='on this').join('\n')
      .trim();
    const html=clean
      .replace(/^### (.+)$/gm,'<h3>$1</h3>')
      .replace(/^## (.+)$/gm,'<h2>$1</h2>')
      .replace(/^# (.+)$/gm,'<h1>$1</h1>')
      .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
      .replace(/\*(.+?)\*/g,'<em>$1</em>')
      .replace(/^● (.+)$/gm,'<li>$1</li>')
      .replace(/^• (.+)$/gm,'<li>$1</li>')
      .replace(/^- (.+)$/gm,'<li>$1</li>')
      .replace(/^(\d+)\. (.+)$/gm,'<li><strong>$1.</strong> $2</li>')
      .replace(/✅/g,'<span class="ok">✓</span>')
      .replace(/❌/g,'<span class="no">✗</span>')
      .replace(/✓/g,'<span class="ok">✓</span>')
      .replace(/✗/g,'<span class="no">✗</span>')
      .replace(/\n/g,'<br>');
    const subj=currentUnit?.name||"Chemistry";
    const code=currentUnit?.code||"";
    const page=`<!DOCTYPE html>
<html><head><meta charset="utf-8">
<title>${topic||"Revision Notes"} — AGF Tutoring</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
@page{margin:1.5cm 2cm;size:A4}
*{box-sizing:border-box}
body{font-family:'Outfit',sans-serif;font-weight:400;color:#1a1a1a;line-height:1.8;margin:0;padding:0;font-size:15px;background:#fff}
.page{max-width:100%;padding:32px 40px}
.hdr{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:20px;margin-bottom:28px;border-bottom:3px solid #4d9460}
.hdr-left h1{font-family:'DM Serif Display',Georgia,serif;font-size:28px;font-weight:400;margin:0;color:#1a1a1a;line-height:1.2}
.hdr-left .sub{font-size:13px;color:#706b65;letter-spacing:.06em;text-transform:uppercase;margin-top:6px}
.hdr-right{text-align:right}
.hdr-right .brand{font-family:'DM Serif Display',Georgia,serif;font-size:18px;color:#4d9460;margin-bottom:2px}
.hdr-right .url{font-size:11px;color:#9a9690;letter-spacing:.04em}
.content{columns:2;column-gap:36px;column-rule:1px solid #e8e5de}
h1{font-family:'DM Serif Display',Georgia,serif;font-size:22px;font-weight:400;margin:28px 0 12px;color:#1a1a1a;break-after:avoid}
h2{font-family:'DM Serif Display',Georgia,serif;font-size:18px;font-weight:400;margin:24px 0 10px;padding-bottom:6px;border-bottom:1px solid #e0ddd6;color:#1a1a1a;break-after:avoid}
h3{font-size:15px;font-weight:600;margin:18px 0 8px;color:#4d9460;break-after:avoid}
strong{font-weight:600}
li{margin-bottom:6px;padding-left:4px;break-inside:avoid}
code{font-family:'JetBrains Mono',monospace;font-size:13px;background:#f5f3ee;padding:1px 5px;border-radius:3px}
.ok{color:#4d9460;font-weight:600}
.no{color:#e06060;font-weight:600}
.tip{background:#f0f8f2;border-left:3px solid #4d9460;padding:10px 14px;margin:12px 0;border-radius:0 6px 6px 0;font-size:14px;break-inside:avoid}
.warn{background:#fdf6ee;border-left:3px solid #d4a24c;padding:10px 14px;margin:12px 0;border-radius:0 6px 6px 0;font-size:14px;break-inside:avoid}
.ftr{margin-top:32px;padding-top:14px;border-top:2px solid #4d9460;display:flex;justify-content:space-between;align-items:center;font-size:11px;color:#9a9690}
.ftr .bars{display:flex;gap:2px;align-items:flex-end}
.ftr .bar{width:3px;background:#4d9460;border-radius:1px}
@media print{.np{display:none!important}.content{columns:2}}
@media screen{body{background:#f8f7f4}.page{max-width:900px;margin:0 auto;padding:40px 48px;background:#fff;min-height:100vh;box-shadow:0 0 40px rgba(0,0,0,0.08)}}
</style></head><body>
<div class="page">
<div class="hdr">
<div class="hdr-left">
<h1>${topic||"Revision Notes"}</h1>
<div class="sub">${subj} — ${code}</div>
</div>
<div class="hdr-right">
<div class="brand">AGF Tutoring</div>
<div class="url">agftutoring.co.uk</div>
</div>
</div>
<div class="content">${html}</div>
<div class="ftr">
<div style="display:flex;align-items:center;gap:8px">
<div class="bars"><div class="bar" style="height:8px"></div><div class="bar" style="height:14px"></div><div class="bar" style="height:18px"></div><div class="bar" style="height:11px"></div></div>
<span>AGF Tutoring · Study Companion</span>
</div>
<span>Based on curated notes · agftutoring.co.uk</span>
</div>
</div>
<div class="np" style="text-align:center;padding:20px">
<button onclick="window.print()" style="padding:12px 32px;border-radius:8px;border:none;background:#4d9460;color:#fff;font-family:'Outfit',sans-serif;font-size:14px;font-weight:600;cursor:pointer;letter-spacing:.04em">Save as PDF (Ctrl+P)</button>
</div>
</body></html>`;
    const w=window.open("","_blank");if(w){w.document.write(page);w.document.close();}
  };
  const downloadNotesPDF=()=>{if(!notesContent||!currentUnit)return;const blob=new Blob([currentUnit.name+" — Revision Notes\n"+"=".repeat(50)+"\n\n"+notesContent.replace(/\*\*/g,"").replace(/## /g,"\n--- ").replace(/- /g,"• ")],{type:"text/plain"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=currentUnit.code+"-revision-notes.txt";a.click();URL.revokeObjectURL(url);};
  const backToAsk=()=>{setMode("ask");resetQuiz();if(currentUnit)setMsgs([{role:"assistant",content:currentUnit.welcome}]);};
  const send=useCallback(async()=>{const t=input.trim();if((!t&&!pendingImage)||loading||!currentUnit)return;/*AGF_GATE_v2*/if(!isSubscribed){const _agfMsgData=JSON.parse(localStorage.getItem("agf_daily_msgs")||"{}");const _agfToday=new Date().toDateString();const _agfLiveCount=(_agfMsgData.date===_agfToday?(_agfMsgData.count||0):0);if(_agfLiveCount>=FREE_MSG_LIMIT){setShowPaywall(true);return;}}const userContent=pendingImage?[{type:"image",source:{type:"base64",media_type:pendingImage.mediaType,data:pendingImage.base64}},{type:"text",text:t||"Please help me with this problem."}]:t;const userMsg={role:"user",content:pendingImage?(t?"📷 "+t:"📷 Image question"):t,_img:pendingImage?userContent:null};const next=[...msgs,userMsg];setMsgs(next);setInput("");setPendingImage(null);setLoading(true);setErr(null);const apiMsgs=next.filter((m,idx)=>!(idx===0&&m.role==="assistant")).map(m=>({role:m.role,content:m._img||m.content}));if(!apiMsgs.length||apiMsgs[0].role!=="user")apiMsgs.unshift({role:"user",content:t});try{const res=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:apiMsgs,system:currentUnit.system,mode:"ask"})});const data=await res.json();if(data.error)throw new Error(data.error.message);const reply=data.content?.map(b=>b.type==="text"?b.text:"").filter(Boolean).join("\n")||"Sorry, I couldn't generate a response.";setMsgs(p=>[...p,{role:"assistant",content:reply}]);incrementMsgCount();}catch(e){setErr(e.message);}finally{setLoading(false);inputRef.current?.focus();}},[input,loading,msgs,currentUnit]);

  const CSS=`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');@keyframes p{0%,100%{opacity:.25;transform:scale(.85)}50%{opacity:.65;transform:scale(1.1)}}textarea::placeholder{color:${C.textDim}}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.06);border-radius:3px}*{box-sizing:border-box}`;

  /* ─── SCREEN 1: SUBJECT PICKER ─── */
  if(pickerStep==="subject"){const coreSubjects=CATALOG.filter(s=>["chemistry","physics","maths"].includes(s.id));const otherSubjects=CATALOG.filter(s=>!["chemistry","physics","maths"].includes(s.id));const boardTags={chemistry:"Edexcel IAL · AQA · OCR · Cambridge · IB · AP",physics:"Edexcel IAL · AQA · OCR · Cambridge · IB · AP",maths:"Edexcel IAL · AQA · OCR · IB · AP · SAT · GMAT"};return(<div style={{width:"100%",minHeight:"100vh",display:"flex",flexDirection:"column",background:C.bg,fontFamily:"'Outfit',sans-serif",color:C.text}}><nav style={{padding:"16px 40px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${C.border}`}}><a href="https://agftutoring.co.uk" target="_blank" rel="noopener" style={{display:"flex",alignItems:"center",gap:12,textDecoration:"none",color:C.text}}><svg width="22" height="26" viewBox="0 0 22 26">{[0.5,0.85,1,0.65].map((f,i)=>(<rect key={i} x={i*5.8} y={26-26*f} width={3.2} height={26*f} rx={0.8} fill={C.green}/>))}</svg><div><div style={{fontFamily:"'DM Serif Display',serif",fontSize:18,fontWeight:400,letterSpacing:"-0.02em",lineHeight:1}}>AGF</div><div style={{fontSize:8.5,fontWeight:500,letterSpacing:"0.15em",textTransform:"uppercase",color:C.textMuted,marginTop:1}}>TUTORING</div></div></a><a href="https://agftutoring.co.uk" target="_blank" rel="noopener" style={{fontSize:12,color:C.textDim,textDecoration:"none"}}>agftutoring.co.uk</a></nav><div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px 40px 32px"}}><div style={{textAlign:"center",marginBottom:40}}><div style={{fontSize:11,fontWeight:500,letterSpacing:"0.14em",textTransform:"uppercase",color:C.green,marginBottom:12}}>Study Companion</div><div style={{fontFamily:"'DM Serif Display',serif",fontSize:"clamp(26px, 3.5vw, 38px)",fontWeight:400,lineHeight:1.2,letterSpacing:"-0.02em",color:C.text}}>Choose your subject</div></div><div style={{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:24,width:"100%",maxWidth:1080,marginBottom:48}}>{coreSubjects.map(s=>(<button key={s.id} onClick={()=>{setSelectedCatalog(s);setPickerStep("exam");}} style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:14,padding:"36px 30px 30px",cursor:"pointer",transition:"all 0.3s ease",textAlign:"left",position:"relative",overflow:"hidden"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=s.colour;e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 12px 32px rgba(0,0,0,0.4)";e.currentTarget.querySelector("[data-accent]").style.opacity="1";}} onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background=C.bgCard;e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";e.currentTarget.querySelector("[data-accent]").style.opacity="0.5";}}><div data-accent="1" style={{position:"absolute",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg, ${s.colour}, transparent)`,opacity:0.7,transition:"opacity 0.3s"}}/><div style={{marginBottom:12}}><SubjectIcon id={s.id} size={40} colour={s.colour}/></div><div style={{fontFamily:"'DM Serif Display',serif",fontSize:26,fontWeight:400,letterSpacing:"-0.02em",marginBottom:12,color:C.text}}>{s.name}</div><div style={{fontSize:14,color:C.text,lineHeight:1.7,fontWeight:300,marginBottom:20,opacity:0.65}}>{s.subtitle}</div><div style={{fontSize:11,color:C.textMuted,letterSpacing:"0.04em",lineHeight:1.6}}>{boardTags[s.id]}</div></button>))}</div><div style={{display:"flex",alignItems:"center",gap:20,marginBottom:28,width:"100%",maxWidth:1080}}><div style={{flex:1,height:1,background:C.border}}/><span style={{fontSize:10,fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",color:C.textMuted}}>Admissions & Language</span><div style={{flex:1,height:1,background:C.border}}/></div><div style={{display:"grid",gridTemplateColumns:"repeat(4, 1fr)",gap:14,width:"100%",maxWidth:1080}}>{otherSubjects.map(s=>(<button key={s.id} onClick={()=>{setSelectedCatalog(s);setPickerStep("exam");}} style={{background:(s.systems||s.unitKey)?C.bgCard:"transparent",border:`1px solid ${C.border}`,borderRadius:10,padding:"18px 20px",cursor:(s.systems||s.unitKey)?"pointer":"default",transition:"all 0.25s",opacity:(s.systems||s.unitKey)?1:0.45,textAlign:"left"}} onMouseEnter={e=>{if(s.systems||s.unitKey){e.currentTarget.style.borderColor=C.green;e.currentTarget.style.background="rgba(77,148,96,0.1)";e.currentTarget.style.transform="translateY(-2px)";}}} onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.transform="none";}}><div style={{fontFamily:"'DM Serif Display',serif",fontSize:17,fontWeight:400,marginBottom:6,color:C.text}}>{s.name}</div><div style={{fontSize:11,fontWeight:600,letterSpacing:"0.06em",color:(s.systems||s.unitKey)?C.green:C.textDim}}>{(s.systems||s.unitKey)?"Available":"Coming soon"}</div></button>))}</div></div><footer style={{borderTop:`1px solid ${C.border}`,padding:"18px 40px",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{display:"flex",alignItems:"center",gap:10}}><svg width="14" height="16" viewBox="0 0 22 26">{[0.5,0.85,1,0.65].map((f,i)=>(<rect key={i} x={i*5.8} y={26-26*f} width={3.2} height={26*f} rx={0.8} fill={C.green}/>))}</svg><span style={{fontSize:10,color:C.textDim}}>Powered by AGF Tutoring · Grounded in curated notes</span></div><a href="https://agftutoring.co.uk" target="_blank" rel="noopener" style={{fontSize:10,color:C.textDim,textDecoration:"none"}}>agftutoring.co.uk</a></footer><style>{CSS}</style></div>);}
  if(pickerStep==="exam"&&selectedCatalog){const cat=selectedCatalog;if(cat.unitKey&&UNITS[cat.unitKey]){selectUnit(cat.unitKey,cat.boardId);return null;}return(<div style={{width:"100%",minHeight:"100vh",display:"flex",flexDirection:"column",background:C.bg,fontFamily:"'Outfit',sans-serif",color:C.text}}><div style={{padding:"16px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:12}}><button onClick={()=>setPickerStep("subject")} style={{padding:"8px 16px",borderRadius:8,border:`1px solid ${C.greenBorder}`,background:C.greenDim,color:C.green,cursor:"pointer",fontSize:13,fontWeight:600,transition:"all 0.2s"}} onMouseEnter={e=>{e.currentTarget.style.background=C.green;e.currentTarget.style.color=C.bg;}} onMouseLeave={e=>{e.currentTarget.style.background=C.greenDim;e.currentTarget.style.color=C.green;}}>{"\u2190 All Subjects"}</button><div style={{flex:1}}><div style={{fontFamily:"'DM Serif Display',serif",fontSize:22,letterSpacing:"-0.02em",display:"flex",alignItems:"center",gap:12}}><SubjectIcon id={cat.id} size={30} colour={cat.colour}/><span>{cat.name}</span></div><div style={{fontSize:13,color:C.textMuted,marginTop:4}}>{cat.subtitle}</div></div></div><div style={{flex:1,overflowY:"auto",padding:"28px 32px",maxWidth:1100,margin:"0 auto",width:"100%"}}>{cat.systems?cat.systems.map((sys,si)=>(<div key={si} style={{marginBottom:24,...(si>0?{borderTop:`1px solid ${C.border}`,paddingTop:20}:{})}}><div style={{fontSize:12,fontWeight:700,color:C.text,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:16,paddingLeft:10,borderLeft:"3px solid "+cat.colour,opacity:0.85}}>{sys.system}</div>{sys.boards.map((board,bi)=>{if(board.expanded&&board.papers){return(<div key={bi} style={{marginBottom:12}}><div style={{fontSize:14,fontWeight:600,marginBottom:10,color:C.text}}>{board.board}</div><div style={{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:6}}>{board.papers.map((paper,pi)=>{const isAvail=paper.unitKey&&UNITS[paper.unitKey];return(<button key={pi} onClick={()=>isAvail&&selectUnit(paper.unitKey,paper.boardId||null)} style={{padding:"12px 16px",borderRadius:8,textAlign:"left",background:isAvail?"rgba(77,148,96,0.08)":C.bgCard,border:`1px solid ${isAvail?C.greenBorder:C.border}`,cursor:isAvail?"pointer":"default",opacity:isAvail?1:0.4,transition:"all 0.2s"}} onMouseEnter={e=>{if(isAvail){e.currentTarget.style.borderColor=cat.colour;e.currentTarget.style.background="rgba(77,148,96,0.16)";e.currentTarget.style.transform="translateY(-1px)";}}} onMouseLeave={e=>{e.currentTarget.style.borderColor=isAvail?C.greenBorder:C.border;e.currentTarget.style.background=isAvail?"rgba(77,148,96,0.08)":C.bgCard;e.currentTarget.style.transform="none";}}><div style={{fontSize:13,fontWeight:600,color:isAvail?C.text:C.textDim}}>{paper.name}</div><div style={{fontSize:11,color:isAvail?C.green:C.textDim,marginTop:3}}>{paper.subtitle}</div></button>);})}</div></div>);}return null;})}{(()=>{const pills=sys.boards.filter(b=>!b.expanded);if(!pills.length)return null;return(<div style={{display:"flex",flexDirection:"row",flexWrap:"wrap",gap:8,marginTop:sys.boards.some(b=>b.expanded)?12:0}}>{pills.map((board,bi)=>{const uk=board.unitKey;const isAvail=uk&&UNITS[uk];const r=parseInt(cat.colour.slice(1,3),16),g=parseInt(cat.colour.slice(3,5),16),b2=parseInt(cat.colour.slice(5,7),16);return(<button key={bi} onClick={()=>isAvail&&selectUnit(uk,board.boardId)} style={{padding:"10px 18px",borderRadius:8,background:isAvail?`rgba(${r},${g},${b2},0.15)`:"rgba(255,255,255,0.02)",border:`1px solid ${isAvail?cat.colour+"AA":"rgba(255,255,255,0.06)"}`,cursor:isAvail?"pointer":"default",opacity:isAvail?1:0.5,transition:"all 0.18s",textAlign:"left",position:"relative",display:"inline-flex",alignItems:"center",gap:10}} onMouseEnter={e=>{if(isAvail){e.currentTarget.style.background=`rgba(${r},${g},${b2},0.25)`;e.currentTarget.style.borderColor=cat.colour;e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.boxShadow=`0 4px 12px rgba(${r},${g},${b2},0.15)`;}}} onMouseLeave={e=>{if(isAvail){e.currentTarget.style.background=`rgba(${r},${g},${b2},0.15)`;e.currentTarget.style.borderColor=cat.colour+"AA";e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}}>
<div style={{width:7,height:7,borderRadius:"50%",background:isAvail?cat.colour:"#555",flexShrink:0}}/><div style={{fontSize:13,fontWeight:600,color:isAvail?C.text:"#777",flex:1}}>{board.board}</div><div style={{fontSize:13,color:isAvail?cat.colour:"#555",opacity:0.8}}>→</div>
</button>);})}</div>);})()}</div>)):<div style={{textAlign:"center",padding:60}}><SubjectIcon id={cat.id} size={56} colour={cat.colour}/><div style={{fontSize:18,fontFamily:"'DM Serif Display',serif",marginTop:16,marginBottom:8}}>{cat.name}</div><div style={{fontSize:13,color:C.textMuted}}>{cat.subtitle}</div></div>}<div style={{marginTop:24,padding:"12px 16px",background:"rgba(77,148,96,0.04)",border:`1px solid rgba(77,148,96,0.12)`,borderRadius:8,fontSize:12,color:C.textDim,lineHeight:1.6}}>{["sat","act","gmat","gre","lnat","ucat","ielts","toefl"].includes(cat.id)?"Select your section to begin. The companion adapts its tutoring strategy, question formats, and scoring guidance to your specific test.":["chemistry","physics","maths"].includes(cat.id)?"All boards share the same core content — the companion adapts terminology, unit codes, and exam technique to your specific board.":"Select your exam to begin. The companion tailors its content and strategy to your test format."}</div></div><style>{CSS}</style></div>);}

    /* ─── QUIZ RESULTS ─── */
  
  /* ─── PAYWALL SCREEN ─── */
  if(showPaywall){
    const quizRemaining=Math.max(0,FREE_QUIZ_LIMIT-quizzesUsed);
    const msgRemaining=Math.max(0,FREE_MSG_LIMIT-dailyMsgsUsed);
    return(<div style={{width:"100%",height:"100vh",display:"flex",flexDirection:"column",background:C.bg,fontFamily:"'Outfit',sans-serif",color:C.text}}>
      <div style={{padding:"14px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:12}}>
        <div style={{flex:1}}><div style={{fontFamily:"'DM Serif Display',serif",fontSize:17,letterSpacing:"-0.02em"}}>AGF<span style={{color:C.green}}>tutoring</span></div></div>
        <button onClick={()=>{setShowPaywall(false);setMode("ask");}} style={{padding:"8px 16px",borderRadius:6,fontSize:12,fontWeight:500,border:`1px solid ${C.border}`,background:"transparent",color:C.textMuted,cursor:"pointer"}}>Back to studying</button>
      </div>
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
        <div style={{maxWidth:440,textAlign:"center"}}>
          <div style={{fontSize:48,marginBottom:20}}>{"🎓"}</div>
          <div style={{fontFamily:"'DM Serif Display',serif",fontSize:26,marginBottom:12,lineHeight:1.3}}>
            {quizRemaining<=0?"You\u2019ve used your free quizzes":"You\u2019ve reached today\u2019s free message limit"}
          </div>
          <div style={{fontSize:14,color:C.textMuted,lineHeight:1.7,marginBottom:28}}>
            Subscribe to unlock unlimited quizzes and messages across every subject and exam board.
          </div>
          <div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:12,padding:"24px 28px",marginBottom:20,textAlign:"left"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:16}}>
              <div style={{fontFamily:"'DM Serif Display',serif",fontSize:18}}>AGF Study Companion</div>
              <div style={{fontSize:20,fontWeight:700,color:C.green,fontFamily:"'JetBrains Mono',monospace"}}>{"£"}29<span style={{fontSize:13,fontWeight:400,color:C.textMuted}}>/month</span></div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {["Unlimited AI-powered quizzes with past-paper questions","Unlimited Ask messages across Chemistry, Physics & Maths","Every exam board — Edexcel IAL, AQA, OCR, IB, AP, IGCSE, WJEC & more","Step-by-step worked solutions in Alastair’s teaching style","GMAT, GRE, LNAT, UCAT, IELTS & TOEFL admissions prep","Revision notes with instant PDF download","30 years of tutoring expertise, available 24/7"].map((f,i)=>(
                <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",fontSize:13,color:C.text}}>
                  <span style={{color:C.green,flexShrink:0,marginTop:1}}>{"✓"}</span><span>{f}</span>
                </div>
              ))}
            </div>
          </div>
          <button onClick={handleCheckout} disabled={checkoutLoading} style={{width:"100%",padding:"14px 24px",borderRadius:8,border:"none",background:C.green,color:C.bg,fontSize:15,fontWeight:600,cursor:checkoutLoading?"wait":"pointer",transition:"all 0.2s",letterSpacing:"0.03em",marginBottom:12}}
            onMouseEnter={e=>{if(!checkoutLoading)e.currentTarget.style.background=C.greenLight||"#5ba86d";}}
            onMouseLeave={e=>{e.currentTarget.style.background=C.green;}}>
            {checkoutLoading?"Redirecting to checkout…":"Subscribe — £29/month"}
          </button>
          <div style={{fontSize:11,color:C.textDim,lineHeight:1.5}}>Secure payment via Stripe. Cancel anytime.</div>
          <div style={{marginTop:16,fontSize:12,color:C.textMuted}}>
            Already subscribed?{" "}
            <button onClick={()=>{const e=prompt("Enter your subscription email:");if(e&&e.includes("@")){fetch("/api/verify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e})}).then(r=>r.json()).then(d=>{if(d.subscribed){setIsSubscribed(true);setShowPaywall(false);localStorage.setItem("agf_subscribed","true");localStorage.setItem("agf_sub_email",e);}else{alert("No active subscription found for that email.");}}).catch(()=>alert("Could not verify. Try again."));}}} style={{background:"none",border:"none",color:C.green,cursor:"pointer",fontSize:12,fontFamily:"'Outfit',sans-serif",textDecoration:"underline"}}>Log in</button>
          </div>
          <div style={{marginTop:20,paddingTop:16,borderTop:`1px solid ${C.border}`,fontSize:12,color:C.textMuted}}>
            Chat mode: {isSubscribed?"unlimited":msgRemaining+" free messages remaining today"} · Quizzes: {isSubscribed?"unlimited":quizRemaining+" of "+FREE_QUIZ_LIMIT+" remaining"}
          </div>
        </div>
      </div>
    </div>);
  }

  if(mode==="quiz"&&quizDone&&currentUnit){const pct=quizMaxScore>0?Math.round((quizScore/quizMaxScore)*100):0;const grade=pct>=80?"A":pct>=70?"B":pct>=60?"C":pct>=50?"D":"U";const weakTopics=[...new Set(quizHistory.filter(h=>h.correct!==true).map(h=>h.topic).filter(Boolean))];return(<div style={{width:"100%",height:"100vh",display:"flex",flexDirection:"column",background:C.bg,fontFamily:"'Outfit',sans-serif",color:C.text}}><div style={{padding:"14px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:12}}><div style={{flex:1}}><div style={{fontFamily:"'DM Serif Display',serif",fontSize:17,letterSpacing:"-0.02em"}}>AGF<span style={{color:C.green}}>tutoring</span> <span style={{fontSize:13,color:C.textMuted,fontFamily:"'Outfit',sans-serif"}}>· Quiz Complete</span></div><div style={{fontSize:11,color:C.textDim}}>{currentUnit.name}</div></div><button onClick={backToAsk} style={{padding:"8px 16px",borderRadius:6,fontSize:12,fontWeight:500,border:`1px solid ${C.border}`,background:"transparent",color:C.textMuted,cursor:"pointer"}}>Back to Ask</button><button onClick={showQuizOptions} style={{padding:"8px 16px",borderRadius:6,fontSize:12,fontWeight:500,border:`1px solid ${C.green}`,background:C.greenDim,color:C.green,cursor:"pointer"}}>New Quiz</button></div><div style={{flex:1,overflowY:"auto",padding:20}}><div style={{textAlign:"center",padding:"30px 20px",background:C.bgCard,borderRadius:12,border:`1px solid ${C.border}`,marginBottom:20}}><div style={{fontSize:52,fontWeight:700,color:C.green,fontFamily:"'JetBrains Mono',monospace"}}>{quizScore}/{quizMaxScore}</div><div style={{fontSize:16,color:C.textMuted,marginTop:4}}>{pct}% — Grade {grade}</div><div style={{marginTop:16,height:8,background:C.bgLight,borderRadius:4,overflow:"hidden"}}><div style={{height:"100%",width:`${pct}%`,background:pct>=70?C.green:pct>=50?C.amber:C.red,borderRadius:4,transition:"width 0.5s"}}/></div></div>{weakTopics.length>0&&<div style={{padding:"14px 18px",background:"rgba(224,96,96,0.06)",border:"1px solid rgba(224,96,96,0.15)",borderRadius:8,marginBottom:20}}><div style={{fontSize:12,fontWeight:600,color:C.red,marginBottom:6}}>Topics to revise:</div><div style={{fontSize:13,color:C.text}}>{weakTopics.join(", ")}</div></div>}{quizHistory.map((h,i)=>(<div key={i} style={{padding:"14px 18px",background:C.bgCard,border:`1px solid ${h.correct?"rgba(77,148,96,0.3)":"rgba(224,96,96,0.2)"}`,borderRadius:8,marginBottom:10}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}><div style={{fontSize:12,fontWeight:600,color:C.textMuted}}>Q{i+1}</div><div style={{fontSize:12,fontWeight:600,color:h.correct?C.green:C.red}}>{h.correct?"✓ Correct":`✗ Wrong (was ${h.correctLabel})`}</div></div><div style={{fontSize:13,color:C.text}}>{h.q}</div><div style={{fontSize:12,color:C.textMuted,marginTop:4}}>Your answer: {h.answer}</div></div>))}</div><style>{CSS}</style></div>);}

  /* ─── QUIZ QUESTION ─── */
  if(mode==="quiz"&&currentUnit){const correctCount=quizHistory.filter(h=>h.correct).length;const wrongCount=quizHistory.filter(h=>!h.correct).length;return(<div style={{width:"100%",height:"100vh",display:"flex",flexDirection:"column",background:C.bg,fontFamily:"'Outfit',sans-serif",color:C.text}}><div style={{padding:"12px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:12}}><div style={{flex:1}}><div style={{fontFamily:"'DM Serif Display',serif",fontSize:16,letterSpacing:"-0.02em"}}>AGF<span style={{color:C.green}}>tutoring</span> <span style={{fontSize:12,color:C.textMuted,fontFamily:"'Outfit',sans-serif"}}>· {currentUnit.name} Quiz</span></div></div><div style={{display:"flex",gap:10,alignItems:"center",fontSize:13,fontWeight:600}}><span style={{color:C.textDim}}>{quizNum}/{quizTotal}</span>{wrongCount>0&&<span style={{color:"#fff",background:"rgba(224,96,96,0.8)",padding:"2px 10px",borderRadius:12,fontSize:12,fontWeight:600,display:"flex",alignItems:"center",gap:4}}>✗ {wrongCount}</span>}{correctCount>0&&<span style={{color:"#fff",background:"rgba(77,148,96,0.8)",padding:"2px 10px",borderRadius:12,fontSize:12,fontWeight:600,display:"flex",alignItems:"center",gap:4}}>✓ {correctCount}</span>}</div><button onClick={backToAsk} style={{padding:"6px 12px",borderRadius:6,fontSize:11,border:`1px solid ${C.border}`,background:"transparent",color:C.textDim,cursor:"pointer"}}>✕</button></div><div style={{display:"flex",gap:3,padding:"8px 20px 4px",background:C.bg}}>{Array.from({length:quizTotal}).map((_,idx)=>{const qNum=idx+1;const h=quizHistory[idx];let col=C.border;if(h){col=h.correct?C.green:C.red;}else if(qNum===quizNum){col=C.green;}return <div key={idx} style={{flex:1,height:4,borderRadius:2,background:col,opacity:h||qNum===quizNum?1:0.25,transition:"all 0.3s"}}/>;})}</div><div style={{flex:1,overflowY:"auto",padding:"28px 40px",maxWidth:1000,margin:"0 auto",width:"100%"}}>{showQuizPicker&&!quizQ&&!loading&&<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"48px 20px",gap:32}}><div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:16}}><div style={{fontSize:18,fontWeight:400,fontFamily:"'DM Serif Display',serif",color:C.text}}>How many questions?</div><div style={{display:"flex",gap:14}}>{[10,15,25].map(n=>{const isDef=n===15;return <button key={n} onClick={()=>setQuizTotal(n)} style={{padding:"16px 28px",borderRadius:10,border:"1px solid "+(quizTotal===n?C.green:C.border),background:quizTotal===n?C.greenDim:"transparent",color:quizTotal===n?C.green:C.textMuted,fontSize:22,fontWeight:600,fontFamily:"'JetBrains Mono',monospace",cursor:"pointer",transition:"all 0.2s",minWidth:80}} onMouseEnter={e=>{e.currentTarget.style.borderColor=C.green;e.currentTarget.style.color=C.green;e.currentTarget.style.background=C.greenDim;}} onMouseLeave={e=>{if(quizTotal!==n){e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.textMuted;e.currentTarget.style.background="transparent";}}}>{n}</button>})}</div></div><div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:16}}><div style={{fontSize:18,fontWeight:400,fontFamily:"'DM Serif Display',serif",color:C.text}}>Difficulty</div><div style={{display:"flex",gap:10}}>{[{key:"easy",label:"Easy",desc:"Foundations"},{key:"medium",label:"Medium",desc:"Exam standard"},{key:"challenging",label:"Challenging",desc:"Stretch & A*"}].map(d=><button key={d.key} onClick={()=>setQuizDifficulty(d.key)} style={{padding:"14px 22px",borderRadius:10,border:"1px solid "+(quizDifficulty===d.key?C.green:C.border),background:quizDifficulty===d.key?C.greenDim:"transparent",cursor:"pointer",transition:"all 0.2s",minWidth:110,textAlign:"center"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=C.green;e.currentTarget.style.background=C.greenDim;}} onMouseLeave={e=>{if(quizDifficulty!==d.key){e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background="transparent";}}}><div style={{fontSize:14,fontWeight:600,color:quizDifficulty===d.key?C.green:C.textMuted,marginBottom:3,transition:"color 0.2s"}}>{d.label}</div><div style={{fontSize:10,color:C.textDim}}>{d.desc}</div></button>)}</div></div><button onClick={()=>startQuiz(quizTotal)} style={{padding:"12px 40px",borderRadius:8,border:"none",background:C.green,color:C.bg,fontSize:15,fontWeight:600,cursor:"pointer",transition:"all 0.2s",letterSpacing:"0.03em"}} onMouseEnter={e=>{e.currentTarget.style.background=C.greenLight;}} onMouseLeave={e=>{e.currentTarget.style.background=C.green;}}>Start Quiz</button>{!isSubscribed&&<div style={{marginTop:16,padding:"12px 20px",background:"rgba(200,164,110,0.08)",border:"1px solid rgba(200,164,110,0.2)",borderRadius:10,maxWidth:320,textAlign:"center"}}><div style={{fontSize:14,fontWeight:600,color:"#c8a46e",marginBottom:4}}>{FREE_QUIZ_LIMIT-quizzesUsed>0?(FREE_QUIZ_LIMIT-quizzesUsed)+" free quiz"+(FREE_QUIZ_LIMIT-quizzesUsed===1?"":"zes")+" remaining":"Free quizzes used"}</div><div style={{fontSize:11,color:C.textMuted}}>Subscribe for unlimited quizzes</div></div>}<div style={{marginTop:16,textAlign:"center",padding:"10px 20px",background:"rgba(77,148,96,0.06)",border:"1px solid rgba(77,148,96,0.15)",borderRadius:8,maxWidth:360,fontSize:13,color:C.textMuted,lineHeight:1.6}}>Have a pencil and paper ready for questions that need working out.</div></div>}{loading&&!quizQ&&<div style={{textAlign:"center",padding:60,color:C.textMuted}}><div style={{display:"flex",gap:5,justifyContent:"center",marginBottom:12}}>{[0,1,2].map(d=><div key={d} style={{width:8,height:8,borderRadius:"50%",background:C.green,opacity:0.3,animation:`p 1.2s ease-in-out ${d*0.2}s infinite`}}/>)}</div>Generating question {quizNum} of {quizTotal}...</div>}{quizQ&&<><div style={{marginBottom:24}}><div style={{fontSize:15,lineHeight:1.8,color:C.text}}><span style={{fontWeight:600}}>{quizNum}.</span>  {quizQ.question}</div></div><div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>{quizQ.options.map(opt=>{const isSel=quizSelected===opt.label;const isCor=opt.label===quizQ.correctLabel;const ans=quizFeedback;const showExp=ans&&(isCor||isSel);let bc=C.border,bg="transparent";if(!ans&&isSel){bc=C.green;bg=C.greenDim;}if(ans&&isCor){bc=C.green;bg="rgba(77,148,96,0.06)";}if(ans&&isSel&&!isCor){bc=C.red;bg="rgba(224,96,96,0.06)";}return(<div key={opt.label} onClick={()=>!ans&&setQuizSelected(opt.label)} style={{padding:"14px 18px",borderRadius:10,border:`1.5px solid ${bc}`,background:bg,cursor:ans?"default":"pointer",transition:"all 0.2s"}} onMouseEnter={e=>{if(!ans&&!isSel){e.currentTarget.style.borderColor=C.green;e.currentTarget.style.background=C.greenDim;}}} onMouseLeave={e=>{if(!ans&&!isSel){e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background="transparent";}}}><div style={{display:"flex",alignItems:"flex-start",gap:12}}><span style={{fontSize:14,fontWeight:600,color:C.textMuted,flexShrink:0,marginTop:1}}>{opt.label}.</span><span style={{fontSize:14,color:C.text,lineHeight:1.6}}>{opt.text}</span></div>{showExp&&quizQ.explanations&&<div style={{marginTop:12,paddingTop:10,borderTop:`1px solid ${isCor?"rgba(77,148,96,0.2)":"rgba(224,96,96,0.15)"}`}}><div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}><span style={{fontSize:12,fontWeight:600,color:isCor?C.green:C.red}}>{isCor?"✓ Right answer":"✗ Not quite"}</span></div><div style={{fontSize:13,color:"rgba(255,255,255,0.7)",lineHeight:1.7}}>{quizQ.explanations[opt.label]}</div></div>}</div>);})}</div>{!quizFeedback&&<div style={{marginBottom:20}}><button onClick={()=>hintText?setHintText(null):getHint()} disabled={hintLoading} style={{background:"none",border:"none",cursor:hintLoading?"default":"pointer",color:C.textMuted,fontSize:13,padding:0,display:"flex",alignItems:"center",gap:6,transition:"color 0.2s"}} onMouseEnter={e=>{e.currentTarget.style.color=C.green;}} onMouseLeave={e=>{e.currentTarget.style.color=C.textMuted;}}>{hintLoading?"Loading...":"Show hint"} <span style={{fontSize:10}}>{hintText?"▲":"▼"}</span></button>{hintText&&<div style={{marginTop:8,padding:"10px 14px",background:"rgba(200,164,110,0.06)",border:"1px solid rgba(200,164,110,0.15)",borderRadius:8,fontSize:13,color:C.amber,lineHeight:1.6}}>{hintText}</div>}</div>}{err&&<div style={{padding:"8px 12px",borderRadius:6,background:"rgba(224,96,96,0.08)",border:"1px solid rgba(224,96,96,0.15)",color:C.red,fontSize:12,marginBottom:16}}>{err}</div>}<div ref={endRef}/></>}</div>{quizQ&&<div style={{padding:"16px 20px",borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"center",gap:12,background:C.bg}}>{!quizFeedback?<button onClick={submitAnswer} disabled={!quizSelected||loading} style={{padding:"10px 32px",borderRadius:8,border:"none",background:quizSelected?C.green:"rgba(255,255,255,0.04)",color:quizSelected?C.bg:C.textDim,fontSize:14,fontWeight:600,cursor:quizSelected?"pointer":"default",transition:"all 0.2s"}}>Submit</button>:<button onClick={nextQuestion} style={{padding:"10px 32px",borderRadius:8,border:`1px solid ${C.green}`,background:C.greenDim,color:C.green,fontSize:14,fontWeight:600,cursor:"pointer",transition:"all 0.2s"}}>{quizNum>=quizTotal?"See Results":"Next"}</button>}</div>}<style>{CSS}</style></div>);}

  /* ─── MAIN CHAT (ASK MODE) ─── */
  if(!currentUnit)return<div style={{background:C.bg,height:"100vh"}}/>;
  /* ─── NOTES VIEW SCREEN ─── */
  if(mode==="notes"&&currentUnit){
    return(<div style={{width:"100%",height:"100vh",display:"flex",flexDirection:"column",background:C.bg,fontFamily:"'Outfit',sans-serif",color:C.text}}>
      <div style={{padding:"14px 20px",display:"flex",alignItems:"center",gap:14,borderBottom:`1px solid ${C.border}`,background:C.bg,flexShrink:0}}>
        <div style={{flex:1}}>
          <div style={{fontFamily:"'DM Serif Display',serif",fontSize:17,letterSpacing:"-0.02em"}}>AGF<span style={{color:C.green}}>tutoring</span> <span style={{fontSize:13,color:C.textMuted,fontFamily:"'Outfit',sans-serif"}}>· Revision Notes</span></div>
          <div style={{fontSize:10.5,color:C.textDim,letterSpacing:"0.06em",textTransform:"uppercase",marginTop:1}}>{currentUnit.icon} {currentUnit.code} · {currentUnit.name}</div>
        </div>
        {notesContent&&<button onClick={downloadNotesPDF} style={{padding:"8px 16px",borderRadius:6,fontSize:12,fontWeight:500,border:`1px solid ${C.green}`,background:C.greenDim,color:C.green,cursor:"pointer",display:"flex",alignItems:"center",gap:6,transition:"all 0.2s"}} onMouseEnter={e=>{e.currentTarget.style.background=C.green;e.currentTarget.style.color=C.bg;}} onMouseLeave={e=>{e.currentTarget.style.background=C.greenDim;e.currentTarget.style.color=C.green;}}>↓ Download</button>}
        <button onClick={backToAsk} style={{padding:"8px 16px",borderRadius:6,fontSize:12,fontWeight:500,border:`1px solid ${C.border}`,background:"transparent",color:C.textMuted,cursor:"pointer"}}>← Back</button>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"32px 40px",maxWidth:1100,margin:"0 auto",width:"100%"}}>
        {!notesContent&&!notesLoading&&<div style={{textAlign:"center",padding:"60px 20px"}}>
          <div style={{fontSize:48,marginBottom:16}}>📋</div>
          <div style={{fontFamily:"'DM Serif Display',serif",fontSize:20,marginBottom:8}}>Generate Revision Notes</div>
          <div style={{fontSize:13,color:C.textMuted,marginBottom:24,maxWidth:400,margin:"0 auto 24px",lineHeight:1.7}}>AI-generated revision notes covering all key topics for {currentUnit.name}. Includes definitions, formulae, exam tips, and common mistakes.</div>
          <button onClick={generateNotes} style={{padding:"14px 32px",borderRadius:8,border:"none",background:C.green,color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer",transition:"all 0.2s",boxShadow:"0 4px 16px rgba(77,148,96,0.3)"}}>Generate Notes</button>
        </div>}
        {notesLoading&&<div style={{textAlign:"center",padding:60,color:C.textMuted}}>
          <div style={{display:"flex",gap:5,justifyContent:"center",marginBottom:12}}>{[0,1,2].map(d=><div key={d} style={{width:8,height:8,borderRadius:"50%",background:C.green,opacity:0.3,animation:`p 1.2s ease-in-out ${d*0.2}s infinite`}}/>)}</div>
          Generating revision notes... This may take a moment.
        </div>}
        {notesContent&&<div style={{fontSize:13.5,lineHeight:1.8,color:"rgba(255,255,255,0.85)"}}>{parseAndRender(notesContent)}</div>}
      </div>
      {notesContent&&<div style={{padding:"16px 20px",borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"center",background:C.bg}}>
        <button onClick={downloadNotesPDF} style={{padding:"12px 28px",borderRadius:8,border:"none",background:C.green,color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:8,transition:"all 0.2s",boxShadow:"0 4px 16px rgba(77,148,96,0.3)"}}>↓ Download revision notes</button>
      </div>}
      <style>{CSS}</style>
    </div>);
  }

  return(<div style={{width:"100%",height:"100vh",display:"flex",flexDirection:"column",background:C.bg,fontFamily:"'Outfit',sans-serif",color:C.text}}><div style={{padding:"14px 20px",display:"flex",alignItems:"center",gap:14,borderBottom:`1px solid ${C.border}`,background:C.bg,flexShrink:0}}><div style={{flex:1,cursor:"pointer",position:"relative"}} onClick={()=>setShowPicker(!showPicker)}><div style={{fontFamily:"'DM Serif Display',serif",fontSize:17,fontWeight:400,color:C.text,display:"flex",alignItems:"center",gap:8,letterSpacing:"-0.02em"}}>AGF<span style={{color:C.green}}>tutoring</span><span style={{fontSize:11,color:C.textDim,fontFamily:"'Outfit',sans-serif"}}>▼</span></div><div style={{fontSize:10.5,color:C.textDim,letterSpacing:"0.06em",textTransform:"uppercase",marginTop:1}}>{currentUnit.icon} {currentUnit.code} · {currentUnit.name}</div>{showPicker&&<div style={{position:"absolute",top:"115%",left:0,zIndex:200,background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:10,boxShadow:"0 12px 40px rgba(0,0,0,0.6)",overflow:"hidden",minWidth:260}}><div style={{padding:"10px 14px",borderBottom:`1px solid ${C.border}`,fontSize:10,color:C.textDim,textTransform:"uppercase",letterSpacing:"0.1em"}}>Switch Subject</div>{Object.values(UNITS).map(u=>(<button key={u.id} onClick={e=>{e.stopPropagation();selectUnit(u.id,null);}} style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"12px 14px",border:"none",cursor:"pointer",background:u.id===activeUnit?C.greenDim:"transparent",borderLeft:u.id===activeUnit?`3px solid ${C.green}`:"3px solid transparent",transition:"all 0.15s"}} onMouseEnter={e=>{if(u.id!==activeUnit)e.currentTarget.style.background=C.bgLight;}} onMouseLeave={e=>{if(u.id!==activeUnit)e.currentTarget.style.background="transparent";}}><span style={{fontSize:18}}>{u.icon}</span><div><div style={{fontSize:13,fontWeight:500,color:C.text,textAlign:"left"}}>{u.name}</div><div style={{fontSize:10,color:C.textDim,textAlign:"left"}}>{u.code}</div></div></button>))}<button onClick={e=>{e.stopPropagation();goHome();}} style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"12px 14px",border:"none",cursor:"pointer",background:"transparent",borderTop:`1px solid ${C.border}`,transition:"all 0.15s"}} onMouseEnter={e=>{e.currentTarget.style.background=C.bgLight;}} onMouseLeave={e=>{e.currentTarget.style.background="transparent";}}><span style={{fontSize:14}}>←</span><div style={{fontSize:12,color:C.textMuted,textAlign:"left"}}>All subjects</div></button></div>}</div><div style={{display:"flex",gap:0,background:C.bgLight,borderRadius:8,padding:3,border:`1px solid ${C.border}`}}><button onClick={backToAsk} style={{padding:"8px 20px",borderRadius:6,fontSize:13,fontWeight:600,cursor:"pointer",letterSpacing:"0.03em",transition:"all 0.2s",border:"none",background:mode==="ask"?C.green:"transparent",color:mode==="ask"?C.bg:C.textMuted}}>Ask</button><button onClick={showQuizOptions} disabled={loading} style={{padding:"8px 20px",borderRadius:6,fontSize:13,fontWeight:600,cursor:loading?"default":"pointer",letterSpacing:"0.03em",transition:"all 0.2s",border:"none",background:mode==="quiz"?C.green:"transparent",color:mode==="quiz"?C.bg:C.textMuted}}>Quiz</button><button onClick={()=>setMode("notes")} style={{padding:"8px 20px",borderRadius:6,fontSize:13,fontWeight:600,cursor:"pointer",letterSpacing:"0.03em",transition:"all 0.2s",border:"none",background:mode==="notes"?C.green:"transparent",color:mode==="notes"?C.bg:C.textMuted}}>Notes</button></div></div><div style={{flex:1,overflowY:"auto",padding:"28px 32px",display:"flex",flexDirection:"column",gap:20,maxWidth:1100,margin:"0 auto",width:"100%"}} onClick={()=>showPicker&&setShowPicker(false)}>{msgs.map((m,i)=>(<div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",gap:12,alignItems:"flex-start",width:"100%"}}>{m.role==="assistant"&&<div style={{width:32,height:32,borderRadius:8,flexShrink:0,marginTop:2,background:C.greenDim,border:`1px solid ${C.greenBorder}`,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{fontFamily:"'DM Serif Display',serif",fontSize:14,color:C.green,fontWeight:400}}>A</div></div>}<div style={{maxWidth:m.role==="user"?"68%":"100%",width:m.role==="user"?"auto":"100%",flex:m.role==="user"?undefined:1,padding:m.role==="user"?"12px 18px":"20px 28px",borderRadius:m.role==="user"?"12px 12px 3px 12px":"12px 12px 12px 3px",background:m.role==="user"?C.greenDim:"rgba(255,255,255,0.03)",border:m.role==="user"?`1px solid ${C.greenBorder}`:`1px solid ${C.border}`,fontSize:15.5,lineHeight:1.85,color:m.role==="user"?C.text:"rgba(255,255,255,0.90)"}}>{(()=>{
  const cleanContent = m.content.replace(/\u{1F4D6}[^\n]*Deeper notes[^\n]*\u{1F30D}[^\n]*Real-world[^\n]*\u{1F4DA}[^\n]*Quiz me[^\n]*/gu,'').split('\n').filter(line=>!/^\s*(on this|\*\*on this\*\*)\s*$/.test(line)&&!/^\u{1F4D6}|^\u{1F30D}|^\u{1F4DA}/u.test(line.trim())).join('\n').replace(/\n{3,}/g,'\n\n').trimEnd();
  return <>
    {parseAndRender(cleanContent)}
    {m.role==="assistant" && i>0 && (
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:12,paddingTop:10,borderTop:"1px solid "+C.border}}>
        {[
          {icon:"📖",label:"Deeper notes",prompt:"Give me detailed revision notes on what we just discussed. Include definitions, key formulae, worked examples, exam tips, and common mistakes."},
          {icon:"🌍",label:"Real-world example",prompt:"Give me a vivid real-world example or everyday application of the concept we just discussed."},
          {icon:"📚",label:"Quiz me on this",prompt:"Quiz me with an exam-style question on the topic we just discussed."}
        ].map((btn,bi)=>(
          <button key={bi} onClick={()=>{const t=btn.prompt;const userMsg={role:"user",content:t};setMsgs(p=>[...p,userMsg]);setLoading(true);setErr(null);(async()=>{try{const apiMsgs=[...msgs,userMsg].filter((m2,idx)=>!(idx===0&&m2.role==="assistant")).map(m2=>({role:m2.role,content:m2.content}));if(!apiMsgs.length||apiMsgs[0].role!=="user")apiMsgs.unshift({role:"user",content:t});const res=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:apiMsgs,system:currentUnit.system,mode:"ask"})});const data=await res.json();if(data.error)throw new Error(data.error.message);const reply=data.content?.map(b=>b.type==="text"?b.text:"").filter(Boolean).join("\n")||"Sorry, I couldn't generate a response.";setMsgs(p=>[...p,{role:"assistant",content:reply}]);}catch(e){setErr(e.message);}finally{setLoading(false);}})();}}
            style={{padding:"6px 14px",borderRadius:6,border:"1px solid "+C.greenBorder,background:C.greenDim,color:C.green,fontSize:12,fontWeight:500,cursor:"pointer",display:"flex",alignItems:"center",gap:6,transition:"all 0.2s"}}
            onMouseEnter={e=>{e.currentTarget.style.background=C.green;e.currentTarget.style.color=C.bg;}}
            onMouseLeave={e=>{e.currentTarget.style.background=C.greenDim;e.currentTarget.style.color=C.green;}}
          >{btn.icon} {btn.label}</button>
        ))}
      </div>
    )}
    {m.role==="assistant" && (m.content.includes("Revision Notes") || m.content.includes("Detailed") || m.content.includes("Key Rules") || m.content.includes("Common Exam Mistakes") || m.content.includes("Worked Examples")) && m.content.length > 800 && (
      <div style={{marginTop:8}}>
        <button onClick={()=>{const topic=m.content.match(/^#\s*(.+)/m)?.[1]||m.content.match(/\*\*(.{10,60}?)\*\*/)?.[1]||"Revision Notes";downloadChatNotes(m.content,topic);}}
          style={{padding:"8px 18px",borderRadius:8,border:"1px solid "+C.greenBorder,background:C.greenDim,color:C.textMuted,fontSize:11.5,fontWeight:500,cursor:"pointer",display:"flex",alignItems:"center",gap:6,transition:"all 0.2s"}}
          onMouseEnter={e=>{e.currentTarget.style.borderColor=C.green;e.currentTarget.style.color=C.green;e.currentTarget.style.background=C.greenDim;}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.textMuted;e.currentTarget.style.background="transparent";}}>
          ⬇ Save as PDF
        </button>
      </div>
    )}
  </>;
})()}</div></div>))}{loading&&<div style={{display:"flex",gap:8,alignItems:"flex-start"}}><div style={{width:26,height:26,borderRadius:6,flexShrink:0,marginTop:2,background:C.greenDim,border:`1px solid ${C.greenBorder}`,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{fontFamily:"'DM Serif Display',serif",fontSize:11,color:C.green,fontWeight:400}}>A</div></div><div style={{padding:"10px 14px",borderRadius:"10px 10px 10px 2px",background:"rgba(255,255,255,0.03)",border:`1px solid ${C.border}`,display:"flex",gap:5}}>{[0,1,2].map(d=><div key={d} style={{width:6,height:6,borderRadius:"50%",background:C.green,opacity:0.3,animation:`p 1.2s ease-in-out ${d*0.2}s infinite`}}/>)}</div></div>}{err&&<div style={{padding:"8px 12px",borderRadius:6,background:"rgba(224,96,96,0.08)",border:"1px solid rgba(224,96,96,0.15)",color:C.red,fontSize:12}}>{err}</div>}<div ref={endRef}/></div>{msgs.length<=1&&currentUnit&&!loading&&<div style={{padding:"16px 32px 20px",maxWidth:1100,margin:"0 auto",width:"100%"}}><div style={{fontSize:11,fontWeight:600,color:C.textDim,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:14}}>Try asking</div><div style={{display:"grid",gridTemplateColumns:"repeat(2, 1fr)",gap:10}}>{currentUnit.prompts.map((p,i)=>(<button key={i} onClick={()=>{setInput(p);setTimeout(()=>{send&&inputRef.current?.focus();},50);send&&setTimeout(()=>send(),100);}} style={{padding:"16px 20px",borderRadius:10,border:`1px solid ${C.border}`,background:"rgba(255,255,255,0.02)",color:C.textMuted,fontSize:14,cursor:"pointer",transition:"all 0.2s",textAlign:"left",lineHeight:1.5,fontFamily:"'Outfit',sans-serif"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=C.green;e.currentTarget.style.color=C.text;e.currentTarget.style.background=C.greenDim;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.textMuted;e.currentTarget.style.background="rgba(255,255,255,0.02)";}}>{"→ "}{p}</button>))}</div></div>}<div style={{padding:"8px 14px 14px",borderTop:`1px solid ${C.border}`,background:C.bg,flexShrink:0}}>{pendingImage&&<div style={{marginBottom:8,display:"flex",alignItems:"center",gap:10,padding:"8px 12px",background:"rgba(77,148,96,0.08)",border:"1px solid rgba(77,148,96,0.25)",borderRadius:8}}><div style={{position:"relative",flexShrink:0}}><img src={"data:"+pendingImage.mediaType+";base64,"+pendingImage.base64} alt="attached" style={{height:48,maxWidth:90,borderRadius:6,objectFit:"cover",display:"block"}}/><button onClick={()=>setPendingImage(null)} style={{position:"absolute",top:-5,right:-5,width:16,height:16,borderRadius:"50%",border:"none",background:"#e06060",color:"#fff",fontSize:9,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{"x"}</button></div><span style={{fontSize:11,color:C.textMuted}}>{"Image ready — type a question or send as-is"}</span></div>}<div style={{display:"flex",gap:8,alignItems:"flex-end",background:C.bgInput,border:`1px solid ${C.border}`,borderRadius:8,padding:"3px 3px 3px 14px"}}><textarea ref={inputRef} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}} onPaste={e=>{const items=e.clipboardData?.items;if(!items)return;for(const item of items){if(item.type.startsWith("image/")){e.preventDefault();const file=item.getAsFile();const reader=new FileReader();reader.onload=ev=>{const[header,base64]=ev.target.result.split(",");const mediaType=header.match(/:(.*?);/)[1];setPendingImage({base64,mediaType});};reader.readAsDataURL(file);break;}}}} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();const file=[...(e.dataTransfer.files||[])].find(f=>f.type.startsWith("image/"));if(!file)return;const reader=new FileReader();reader.onload=ev=>{const[header,base64]=ev.target.result.split(",");const mediaType=header.match(/:(.*?);/)[1];setPendingImage({base64,mediaType});};reader.readAsDataURL(file);}} placeholder={currentUnit.placeholder} rows={1} style={{flex:1,border:"none",outline:"none",resize:"none",background:"transparent",color:C.text,fontFamily:"'Outfit',sans-serif",fontSize:13.5,padding:"8px 0",lineHeight:1.5,maxHeight:100,overflow:"auto"}}/><input ref={imageInputRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const file=e.target.files?.[0];if(!file)return;const reader=new FileReader();reader.onload=ev=>{const[header,base64]=ev.target.result.split(",");const mediaType=header.match(/:(.*?);/)[1];setPendingImage({base64,mediaType});};reader.readAsDataURL(file);e.target.value="";}}/>  <button onClick={()=>imageInputRef.current?.click()} title="Attach image" style={{width:34,height:34,borderRadius:6,border:"1px solid "+(pendingImage?C.green:C.greenBorder),cursor:"pointer",background:pendingImage?C.greenDim:"rgba(77,148,96,0.08)",color:C.green,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all 0.2s"}}><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg></button><button onClick={send} disabled={(!input.trim()&&!pendingImage)||loading} style={{width:34,height:34,borderRadius:6,border:"none",cursor:(input.trim()||pendingImage)&&!loading?"pointer":"default",background:(input.trim()||pendingImage)&&!loading?C.green:"rgba(255,255,255,0.04)",color:(input.trim()||pendingImage)&&!loading?C.bg:C.textDim,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:700,flexShrink:0,transition:"all 0.2s"}}>↑</button></div><div style={{textAlign:"center",marginTop:6,fontSize:9.5,color:C.textDim}}>Powered by AGF Tutoring · Grounded in curated notes</div></div><style>{CSS}</style></div>);
}
