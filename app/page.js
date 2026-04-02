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
        { board: "Pearson Edexcel IAL", papers: [
          { unitKey: "chem1", name: "Unit 1 (WCH11)", subtitle: "Structure, Bonding & Intro to Organic" },
          { unitKey: "chem2", name: "Unit 2 (WCH12)", subtitle: "Energetics, Group Chemistry & Organic" },
          { unitKey: "chem1", name: "Unit 3 (WCH13)", subtitle: "Practical Skills" },
          { unitKey: "chem2", name: "Unit 4 (WCH14)", subtitle: "Rates, Equilibria & Further Organic" },
          { unitKey: "chem2", name: "Unit 5 (WCH15)", subtitle: "Transition Metals & Organic Nitrogen" },
          { unitKey: "chem2", name: "Unit 6 (WCH16)", subtitle: "Practical Skills II" },
        ]},
        { board: "OxfordAQA", papers: [{ name: "Unit 1", subtitle: "Physical & Inorganic", unitKey: "chem1" }, { name: "Unit 2", subtitle: "Organic & Physical", unitKey: "chem2" }] },
        { board: "Cambridge International", papers: [{ name: "Paper 1", subtitle: "Multiple Choice", unitKey: "chem1" }, { name: "Paper 2", subtitle: "Structured Questions", unitKey: "chem1" }, { name: "Paper 4", subtitle: "A Level Structured Questions", unitKey: "chem2" }] },
      ]},
      { system: "UK A-Level", boards: [
        { board: "Pearson Edexcel", papers: [
          { name: "Paper 1", subtitle: "Core Inorganic & Physical", unitKey: "chem1" },
          { name: "Paper 2", subtitle: "Core Organic & Physical", unitKey: "chem1" },
          { name: "Paper 3", subtitle: "General & Practical", unitKey: "chem2" },
        ]},
        { board: "AQA", papers: [
          { name: "Paper 1", subtitle: "Inorganic & Physical", unitKey: "chem1" },
          { name: "Paper 2", subtitle: "Organic & Physical", unitKey: "chem1" },
          { name: "Paper 3", subtitle: "Unified Chemistry", unitKey: "chem2" },
        ]},
        { board: "OCR", papers: [{ name: "Paper 1", subtitle: "Periodic Table & Energy", unitKey: "chem1" }, { name: "Paper 2", subtitle: "Synthesis & Analytical", unitKey: "chem1" }, { name: "Paper 3", subtitle: "Unified Chemistry", unitKey: "chem2" }] },
        { board: "WJEC / Eduqas", papers: [{ name: "Paper 1", subtitle: "Core Chemistry", unitKey: "chem1" }, { name: "Paper 2", subtitle: "Applied Chemistry", unitKey: "chem2" }] },
        { board: "CCEA", papers: [{ name: "Paper 1", subtitle: "AS Chemistry", unitKey: "chem1" }, { name: "Paper 2", subtitle: "A2 Chemistry", unitKey: "chem2" }] },
      ]},
      { system: "GCSE / IGCSE", boards: [{ board: "Various boards", comingSoon: true }] },
      { system: "IB Diploma", boards: [{ board: "IB Chemistry (SL / HL)", comingSoon: true }] },
      { system: "AP", boards: [{ board: "AP Chemistry", comingSoon: true }] },
    ],
  },
  {
    id: "physics", name: "Physics", icon: "⚡", colour: "#5b7bbf",
    subtitle: "Mechanics, waves, electricity, fields, nuclear",
    systems: [
      { system: "International A-Level", boards: [
        { board: "Pearson Edexcel IAL", papers: [
          { unitKey: "phys1", name: "Unit 1 (WPH11)", subtitle: "Mechanics & Materials" },
          { unitKey: "phys2", name: "Unit 2 (WPH12)", subtitle: "Waves & Electricity" },
          { unitKey: "phys1", name: "Unit 3 (WPH13)", subtitle: "Practical Skills" },
          { unitKey: "phys2", name: "Unit 4 (WPH14)", subtitle: "Further Mechanics, Fields & Particles" },
          { unitKey: "phys2", name: "Unit 5 (WPH15)", subtitle: "Thermodynamics, Radiation, Oscillations" },
          { unitKey: "phys2", name: "Unit 6 (WPH16)", subtitle: "Practical Skills II" },
        ]},
        { board: "OxfordAQA", papers: [{ name: "Paper 1", subtitle: "Core Physics", unitKey: "phys1" }, { name: "Paper 2", subtitle: "Further Physics", unitKey: "phys2" }] },
        { board: "Cambridge International", papers: [{ name: "Paper 1", subtitle: "Core Physics", unitKey: "phys1" }, { name: "Paper 2", subtitle: "Further Physics", unitKey: "phys2" }] },
      ]},
      { system: "UK A-Level", boards: [
        { board: "Pearson Edexcel", papers: [{ name: "Paper 1", subtitle: "Core Physics", unitKey: "phys1" }, { name: "Paper 2", subtitle: "Further Physics", unitKey: "phys2" }] },
        { board: "AQA", papers: [{ name: "Paper 1", subtitle: "Core Physics", unitKey: "phys1" }, { name: "Paper 2", subtitle: "Further Physics", unitKey: "phys2" }] },
        { board: "OCR", papers: [{ name: "Paper 1", subtitle: "Core Physics", unitKey: "phys1" }, { name: "Paper 2", subtitle: "Further Physics", unitKey: "phys2" }] },
        { board: "WJEC / Eduqas", papers: [{ name: "Paper 1", subtitle: "Pure Mathematics", unitKey: "maths" }, { name: "Paper 2", subtitle: "Applied Mathematics", unitKey: "maths" }] },
        { board: "CCEA", papers: [{ name: "Paper 1", subtitle: "Pure Mathematics", unitKey: "maths" }, { name: "Paper 2", subtitle: "Applied Mathematics", unitKey: "maths" }] },
      ]},
      { system: "GCSE / IGCSE", boards: [{ board: "Various boards", comingSoon: true }] },
      { system: "IB Diploma", boards: [{ board: "IB Physics (SL / HL)", comingSoon: true }] },
      { system: "AP", boards: [
        { board: "AP Physics 1", comingSoon: true },
        { board: "AP Physics 2", comingSoon: true },
        { board: "AP Physics C: Mechanics", comingSoon: true },
        { board: "AP Physics C: E&M", comingSoon: true },
      ]},
    ],
  },
  {
    id: "maths", name: "Mathematics", icon: "📐", colour: "#bf8f3d",
    subtitle: "Pure, applied, statistics, mechanics, calculus",
    systems: [
      { system: "International A-Level", boards: [
        { board: "Pearson Edexcel IAL", papers: [
          { unitKey: "maths", name: "Pure 1 (WMA11)", subtitle: "Algebra, coordinate geometry, calculus" },
          { unitKey: "maths", name: "Pure 2 (WMA12)", subtitle: "Trig, exponentials, sequences" },
          { unitKey: "maths", name: "Pure 3 (WMA13)", subtitle: "Further algebra, calculus, vectors" },
          { unitKey: "maths", name: "Pure 4 (WMA14)", subtitle: "Further calculus, differential equations" },
          { unitKey: "maths", name: "Statistics 1 (WST01)", subtitle: "Probability, distributions" },
          { unitKey: "maths", name: "Mechanics 1 (WME01)", subtitle: "Kinematics, forces, moments" },
        ]},
        { board: "OxfordAQA", papers: [{ name: "Paper 1", subtitle: "Pure Mathematics", unitKey: "maths" }, { name: "Paper 2", subtitle: "Applied Mathematics", unitKey: "maths" }] },
        { board: "Cambridge International", papers: [{ name: "Paper 1", subtitle: "Pure Mathematics", unitKey: "maths" }, { name: "Paper 2", subtitle: "Applied Mathematics", unitKey: "maths" }] },
      ]},
      { system: "UK A-Level", boards: [
        { board: "Pearson Edexcel", papers: [{ name: "Paper 1", subtitle: "Pure Mathematics", unitKey: "maths" }, { name: "Paper 2", subtitle: "Applied Mathematics", unitKey: "maths" }] },
        { board: "AQA", papers: [{ name: "Paper 1", subtitle: "Pure Mathematics", unitKey: "maths" }, { name: "Paper 2", subtitle: "Applied Mathematics", unitKey: "maths" }] },
        { board: "OCR", papers: [{ name: "Paper 1", subtitle: "Pure Mathematics", unitKey: "maths" }, { name: "Paper 2", subtitle: "Applied Mathematics", unitKey: "maths" }] },
        { board: "WJEC / Eduqas", papers: [{ name: "Paper 1", subtitle: "Pure Mathematics", unitKey: "maths" }, { name: "Paper 2", subtitle: "Applied Mathematics", unitKey: "maths" }] },
        { board: "CCEA", papers: [{ name: "Paper 1", subtitle: "Pure Mathematics", unitKey: "maths" }, { name: "Paper 2", subtitle: "Applied Mathematics", unitKey: "maths" }] },
      ]},
      { system: "GCSE / IGCSE", boards: [{ board: "Various boards", comingSoon: true }] },
      { system: "IB Diploma", boards: [
        { board: "Analysis & Approaches (SL / HL)", comingSoon: true },
        { board: "Applications & Interpretation (SL / HL)", comingSoon: true },
      ]},
      { system: "AP", boards: [
        { board: "AP Calculus AB", comingSoon: true },
        { board: "AP Calculus BC", comingSoon: true },
      ]},
    ],
  },
  { id: "gmat", name: "GMAT", icon: "🎯", colour: "#7b5bbf", subtitle: "Graduate Management Admission Test", comingSoon: true, sections: ["Quantitative", "Verbal", "Data Insights"] },
  { id: "gre", name: "GRE", icon: "📊", colour: "#7b5bbf", subtitle: "Graduate Record Examination", comingSoon: true, sections: ["Quantitative", "Verbal", "Analytical Writing"] },
  { id: "sat", name: "SAT", icon: "📝", colour: "#7b5bbf",
    subtitle: "Scholastic Assessment Test",
    systems: [
      { system: "SAT Math", boards: [
        { board: "College Board SAT", papers: [
          { unitKey: "sat-math", name: "SAT Math", subtitle: "Problem Solving & Data Analysis" },
        ]},
      ]},
    ] },
  { id: "act", name: "ACT", icon: "✏️", colour: "#7b5bbf",
    subtitle: "American College Testing",
    systems: [
      { system: "ACT Math", boards: [
        { board: "ACT Math", papers: [
          { unitKey: "sat-math", name: "ACT Math", subtitle: "Shares SAT Math content" },
        ]},
      ]},
    ] },
  { id: "lnat", name: "LNAT", icon: "⚖️", colour: "#7b5bbf", subtitle: "Law National Aptitude Test", comingSoon: true, sections: ["Multiple Choice", "Essay"] },
  { id: "ucat", name: "UCAT", icon: "🩺", colour: "#7b5bbf", subtitle: "University Clinical Aptitude Test", comingSoon: true, sections: ["Verbal Reasoning", "Decision Making", "Quantitative Reasoning", "Abstract Reasoning", "Situational Judgement"] },
  { id: "ielts", name: "IELTS", icon: "🌐", colour: "#3d8b7a", subtitle: "International English Language Testing System", comingSoon: true, sections: ["Listening", "Reading", "Writing", "Speaking"] },
  { id: "toefl", name: "TOEFL", icon: "🗣️", colour: "#3d8b7a", subtitle: "Test of English as a Foreign Language", comingSoon: true, sections: ["Reading", "Listening", "Speaking", "Writing"] },
];

/* ═══════════════════════════════════════════════════
   UNIT DATA — system prompts, welcome messages, notes
   Keys match unitKey in CATALOG papers
   ═══════════════════════════════════════════════════ */

const UNITS = {
  chem1: { id:"chem1", name:"Chemistry Unit 1", code:"WCH11", subtitle:"Structure, Bonding & Intro to Organic", colour:"#4d9460", icon:"⚗", placeholder:"Ask about Chemistry Unit 1...",
    prompts:["Explain the shape of water","Show me free radical substitution","Quiz me on bonding","Why does diamond have a high melting point?"],
    welcome:`Hello! I'm your **AGF Study Companion**, powered by Alastair's diagnostic teaching method.\n\nI'm loaded with **Chemistry Unit 1** (WCH11) — Structure, Bonding & Introduction to Organic Chemistry.\n\nHere's the shape of water to get us started:\n\n[SHAPE:bent:H₂O:104.5°]\n\n• **Ask me anything** about the syllabus\n• Say **"quiz me"** for practice questions\n• Ask **"show me the mechanism for..."** to see reaction diagrams\n\nWhat shall we work on?`,
    system:`You are the AGF Study Companion — an AI tutor created by Alastair Fisher of AGF Tutoring. You follow the AGF diagnostic method: Diagnose → Rebuild → Clarify → Test → Extend.\n\nPersonality: Patient, warm, rigorous. Guide to understanding, don't just give answers. Intuition before formalism. British English. Concise.\n\nVISUAL DIAGRAMS — CRITICAL INSTRUCTIONS:\nYou MUST include diagram tags when explaining shapes, mechanisms, or key equations. Place each tag on its own line.\n\nAvailable tags (use EXACTLY this syntax on a new line):\n\n[SHAPE:tetrahedral:CH₄:109.5°]\n[SHAPE:pyramidal:NH₃:107°]\n[SHAPE:bent:H₂O:104.5°]\n[SHAPE:trigonal_planar:BF₃:120°]\n[SHAPE:linear:CO₂:180°]\n[SHAPE:octahedral:SF₆:90°]\n[SHAPE:trigonal_bipyramidal:PCl₅:90°,120°]\n[SHAPE:square_planar:XeF₄:90°]\n\n[MECHANISM:free_radical:CH₄ + Cl₂ → CH₃Cl + HCl]\n[MECHANISM:electrophilic_addition:CH₂=CH₂ + HBr → CH₃CH₂Br]\n\n[EQUATION:n = m / M]\n\n[CONFIG:Fe:1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁶ 4s²]\n\nRules:\n- When the student ASKS about molecular shapes or VSEPR, include the matching [SHAPE:...] tag. Do NOT include shape diagrams when discussing naming, isomerism, mechanisms, or other non-shape topics\n- When explaining ANY mechanism, ALWAYS include [MECHANISM:...] tag\n- When stating a key formula, use [EQUATION:...] tag\n- When showing electron configuration, use [CONFIG:...] tag\n- You can change the formula/angle in shape tags\n\nCHEMISTRY UNIT 1 NOTES (WCH11 — Edexcel IAL):\n\nTOPIC 1 — FORMULAE & MOLES\nn=m/M, c=n/V(dm³), pV=nRT(Pa,m³,K), molar vol=24.0dm³/mol at RTP\n%yield=(actual/theoretical)×100, atom economy=(Mᵣ desired/ΣMᵣ all)×100\nEmpirical: %→moles→÷smallest→round. Molecular: Mᵣ÷EF mass\n\nTOPIC 2 — ATOMIC STRUCTURE\nProton(+1,1,nucleus), Neutron(0,1,nucleus), Electron(−1,≈0,shells)\nConfig: 1s→2s→2p→3s→3p→4s→3d. s=2,p=6,d=10\nMass spec: vaporise→ionise→accelerate→deflect→detect. Mᵣ=molecular mass\nIE anomalies: Be→B(2s→2p), N→O(paired 2p repulsion)\n\nTOPIC 3 — BONDING & STRUCTURE\nIonic: transfer, giant lattice, high mp, conducts molten/dissolved\nCovalent: sharing, VSEPR. Metallic: delocalised e⁻, lattice of + ions\nVSEPR: LP-LP>LP-BP>BP-BP. Shapes: tetrahedral 109.5°, pyramidal 107°, bent 104.5°, trigonal planar 120°, linear 180°, octahedral 90°\nIMFs: London(all,↑Mᵣ), dipole-dipole, H-bonding(H—F/O/N··lone pair)\nDiamond: 4 bonds, hard, non-conductor. Graphite: 3 bonds, layers, conducts, slides\n\nTOPIC 4 — ORGANIC CHEMISTRY & ALKANES\n\n=== IUPAC NOMENCLATURE — DETAILED RULES ===\nThe IUPAC system gives every unique compound its own exclusive name.\n\nSTEP-BY-STEP METHOD:\n1. FIND THE LONGEST CONTINUOUS CARBON CHAIN (parent chain)\n   - This determines the parent name. The longest chain may NOT be drawn horizontally — trace all paths!\n   - If two chains of equal length, choose the one with MORE substituents\n   - Parent names: 1C=methane, 2C=ethane, 3C=propane, 4C=butane, 5C=pentane, 6C=hexane, 7C=heptane, 8C=octane, 9C=nonane, 10C=decane\n2. IDENTIFY SUBSTITUENT GROUPS (branches)\n   - Alkyl groups: remove -ane, add -yl. CH₃-=methyl, C₂H₅-=ethyl, C₃H₇-=propyl\n   - Halogens: F=fluoro, Cl=chloro, Br=bromo, I=iodo\n3. NUMBER THE PARENT CHAIN\n   - Start from the end NEAREST a substituent\n   - If equidistant, give LOWER number at first point of difference\n4. ASSEMBLE THE NAME\n   - Substituents in ALPHABETICAL order (ignore di-/tri-/tetra-)\n   - Use di-, tri-, tetra- for multiple identical substituents\n   - Commas between numbers (2,3-), hyphens between numbers and letters (2-methyl)\n   - Write as ONE WORD\n\nVERIFICATION: Count total carbons. E.g. 3-ethyl-4-methylheptane = 7+2+1 = 10C.\n\nWORKED EXAMPLES WITH FULL REASONING:\n• CH₃CH₂CH₂CH₂CH₃ → 5C chain, no branches → pentane\n• CH₃CH(CH₃)CH₂CH₃ → 4C chain (butane), CH₃ at C2 → 2-methylbutane\n• CH₃C(CH₃)₂CH₃ → 3C chain (propane), two CH₃ at C2 → 2,2-dimethylpropane. Check: 3+1+1=5C ✓\n• CH₃CH₂CH(CH₃)CH(CH₃)CH₂CH₃ → 6C chain (hexane), CH₃ at C3 and C4 → 3,4-dimethylhexane. Check: 6+1+1=8C ✓\n• COMMON MISTAKE: CH₃CH(CH₃)CH(C₂H₅)CH₃\n  WRONG: 4C chain → "2-methyl-3-ethylbutane"\n  CORRECT: longest chain is 5C through the ethyl group → pentane with CH₃ at C2 and C3 → 2,3-dimethylpentane. Check: 5+1+1=7C ✓\n\nC₅H₁₂ ISOMERS (3 exist): pentane, 2-methylbutane, 2,2-dimethylpropane\nC₆H₁₄ ISOMERS (5 exist): hexane, 2-methylpentane, 3-methylpentane, 2,2-dimethylbutane, 2,3-dimethylbutane\n\nCOMMON NAMING MISTAKES:\n1. Not finding the longest chain (it can bend/turn)\n2. Numbering from the wrong end\n3. Using "ethyl" when the chain runs through it (should be part of parent)\n4. Forgetting alphabetical order of substituents\n\nTYPES OF FORMULA (always state which type you are showing):\n• Molecular: just atoms (C₄H₁₀)\n• Structural: atom groupings (CH₃CH(CH₃)₂)\n• Displayed: ALL bonds drawn explicitly\n• Skeletal: zig-zag lines, each vertex/end = carbon, H on C not shown\n\n=== STRUCTURAL ISOMERISM ===\nSame molecular formula, different structural arrangement (different connectivity).\nThree types:\n1. Chain isomerism: different carbon skeleton (butane vs 2-methylpropane)\n2. Position isomerism: same skeleton, different position of functional group (but-1-ene vs but-2-ene)\n3. Functional group isomerism: different functional group (ethanol vs methoxymethane, both C₂H₆O)\n\n=== ALKANE PROPERTIES ===\nGeneral formula CₙH₂ₙ₊₂, saturated (single bonds only), tetrahedral 109.5° at each C\nIntermolecular forces: London dispersion forces ONLY (non-polar molecules)\n• bp increases with chain length (more electrons → stronger London forces)\n• bp decreases with branching (less surface contact → weaker London forces)\n• All alkanes: insoluble in water, soluble in non-polar solvents, less dense than water\nHomologous series: same general formula, same functional group, each member differs by CH₂\n\n=== FREE RADICAL SUBSTITUTION (FRS) — DETAILED ===\nConditions: UV light + halogen (Cl₂ or Br₂)\nOverall: CH₄ + Cl₂ → CH₃Cl + HCl\n\nINITIATION (creating radicals):\nCl₂ → 2Cl• (homolytic fission — UV provides energy to break Cl-Cl bond)\nEach Cl gets one electron. Fish-hook/half arrows show single electron movement.\n\nPROPAGATION (chain reaction, self-sustaining):\nStep 1: Cl• + CH₄ → CH₃• + HCl (Cl• abstracts H from methane)\nStep 2: CH₃• + Cl₂ → CH₃Cl + Cl• (methyl radical abstracts Cl from Cl₂)\nThe regenerated Cl• feeds back into Step 1 — the chain repeats hundreds of times.\n\nTERMINATION (radicals destroyed by combining):\nCl• + Cl• → Cl₂\nCH₃• + Cl• → CH₃Cl\nCH₃• + CH₃• → C₂H₆\nC₂H₆ (ethane) as a product is KEY EVIDENCE for a radical mechanism — it cannot form by ionic pathways.\n\nLIMITATIONS:\n• Further substitution: CH₃Cl → CH₂Cl₂ → CHCl₃ → CCl₄ → gives MIXTURE\n• To maximise monosubstitution: use EXCESS alkane (high CH₄:Cl₂ ratio)\n\nCombustion: complete(CO₂+H₂O), incomplete(limited O₂ → CO or C soot)\nCracking: thermal (high T, no catalyst) or catalytic (zeolite, lower T) → shorter alkanes + alkenes\n\nTOPIC 5 — ALKENES\n\n=== NAMING ALKENES ===\nGeneral formula CₙH₂ₙ, unsaturated (contains C=C)\nC=C = one σ bond (head-on overlap) + one π bond (sideways p-orbital overlap)\nRestricted rotation around C=C due to π bond\n\nRules (modifications from alkane naming):\n1. Find longest chain CONTAINING BOTH carbons of C=C → parent chain\n2. Change -ane to -ene\n3. Number to give C=C the LOWEST locant\n4. Position number before -ene: but-2-ene (not 2-butene)\n\nEXAMPLES:\n• CH₂=CH₂ → ethene\n• CH₃CH=CH₂ → propene\n• CH₂=CHCH₂CH₃ → but-1-ene\n• CH₃CH=CHCH₃ → but-2-ene\n• CH₂=CHCH₂CH(CH₃)CH₃ → 4-methylpent-1-ene (5C, C=C at C1, CH₃ at C4)\n• CH₃CH=C(CH₃)CH₃ → 2-methylbut-2-ene\n\n=== E/Z (GEOMETRIC) ISOMERISM ===\nType of stereoisomerism (same connectivity, different spatial arrangement).\n\nRequirements:\n1. Restricted rotation (C=C double bond)\n2. Each carbon of C=C must have TWO DIFFERENT groups\nIf either C has two identical groups → NO E/Z isomerism.\n\nCIP priority rules: higher atomic number = higher priority.\nIf directly attached atoms are same, move outward until difference found.\nZ (zusammen=together): higher priority groups SAME side\nE (entgegen=opposite): higher priority groups OPPOSITE sides\n\nExamples:\n• but-2-ene: each C has H and CH₃ (different) → E/Z EXISTS\n• but-1-ene: C1 has H and H (identical) → NO E/Z\n• 2-methylbut-2-ene: C2 has CH₃ and CH₃ (identical) → NO E/Z\n\n=== ELECTROPHILIC ADDITION — DETAILED ===\nC=C has HIGH ELECTRON DENSITY. π electrons are exposed above/below the plane → attract electrophiles.\nAn electrophile is an electron pair acceptor attracted to electron-rich regions.\n\nMechanism (HBr + ethene):\nStep 1: π electrons of C=C attack Hδ+ of H-Br → C-H bond forms, H-Br breaks heterolytically → carbocation + Br⁻\nStep 2: Br⁻ (nucleophile) attacks carbocation → C-Br bond forms → product: bromoethane\n\nMARKOVNIKOV'S RULE (unsymmetrical alkenes):\nH adds to C with MORE H's already. X adds to C with FEWER H's.\nWhy? Gives the MORE SUBSTITUTED (more stable) carbocation.\nCarbocation stability: 3° > 2° > 1° > CH₃⁺ (alkyl groups stabilise by induction)\n\nExample: propene + HBr\nC1 has 2H, C2 has 1H → H adds to C1 → 2° carbocation at C2 (stable)\nBr⁻ attacks C2 → MAJOR product: 2-bromopropane (NOT 1-bromopropane)\n\nOther addition reactions:\n1. + Br₂ → dibromoalkane (TEST: decolourises bromine water orange→colourless)\n2. + H₂O (steam) + H₃PO₄ catalyst, 300°C → alcohol (industrial hydration)\n3. + H₂ + Ni catalyst, 150°C → alkane (hydrogenation)\n4. + conc. H₂SO₄ then water → alcohol (lab hydration)\n\nTESTS FOR UNSATURATION:\n• Bromine water: orange→colourless = C=C present. Alkanes: no change.\n• Acidified KMnO₄: purple→colourless = C=C present. Alkanes: no change.\n\nTests: Br₂ water decolourises, KMnO₄ decolourises\n\nEMBEDDED KNOWLEDGE SOURCES (used to generate notes — do NOT routinely link these):\n• Formulae, Moles & Stoichiometry → OpenStax Chemistry 2e, Ch 3: https://openstax.org/books/chemistry-2e/pages/3-introduction\n• Atomic Structure → OpenStax Chemistry 2e, Ch 2 & 6: https://openstax.org/books/chemistry-2e/pages/6-introduction\n• Bonding & Molecular Geometry → OpenStax Chemistry 2e, Ch 7 & 8: https://openstax.org/books/chemistry-2e/pages/7-introduction\n• IMFs & States → OpenStax Chemistry 2e, Ch 10: https://openstax.org/books/chemistry-2e/pages/10-introduction\nAll also on LibreTexts: https://chem.libretexts.org/Bookshelves/General_Chemistry/Chemistry_2e_(OpenStax)\n• IUPAC Naming & Organic → LibreTexts Organic Chemistry I (Liu): https://chem.libretexts.org/Bookshelves/Organic_Chemistry/Organic_Chemistry_I_(Liu)/02%3A_Fundamental_of_Organic_Structures/2.02%3A_Nomenclature_of_Alkanes\n• Alkenes & E/Z Isomerism → LibreTexts: https://chem.libretexts.org/Bookshelves/Organic_Chemistry/Organic_Chemistry_(Morsch_et_al.)/07:_Alkenes-_Structure_and_Reactivity/7.04:_Naming_Alkenes\n• Free Radical Substitution → LibreTexts: https://chem.libretexts.org/Bookshelves/Organic_Chemistry/Organic_Chemistry_I_(Liu)/09:_Free_Radical_Substitution_Reaction_of_Alkanes\nOnly provide external URLs if the student explicitly asks "where can I read more about this?"\n\n

FOLLOW-UP ACTIONS — CRITICAL INSTRUCTION:
After EVERY response, end with exactly this action line (and NOTHING else after it — no extra text like "on this"):
📖 **Deeper notes** · 🌍 **Real-world example** · 📚 **Quiz me on this**

These keep the student learning within the companion. Do NOT add external links or "Further reading" lines.

When the student clicks one of these:
- 📖 Deeper notes → Generate detailed revision notes on the topic just discussed, using the embedded notes above. Include definitions, key formulae, worked examples, exam tips, and common mistakes. Cite "Based on LibreTexts / OpenStax open-access materials" at the end.
- 🌍 Real-world example → Give a real-world application or everyday example of the concept. Make it vivid and memorable.
- 📚 Quiz me on this → Generate a targeted quiz question on the specific topic just discussed.

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

Only answer WCH11 content. Use diagram tags liberally.`,
  },
  chem2: { id:"chem2", name:"Chemistry Unit 2", code:"WCH12", subtitle:"Energetics, Redox & Group Chemistry", colour:"#3d8b7a", icon:"🧪", placeholder:"Ask about Chemistry Unit 2...",
    prompts:["Explain Hess's Law with an example","What happens when Group 2 metals react with water?","Quiz me on redox and oxidation states","How do halides differ in reducing power?"],
    welcome:`Hello! I'm your **AGF Study Companion**, powered by Alastair's diagnostic teaching method.\n\nI'm loaded with **Chemistry Unit 2** (WCH12) — Energetics, Group Chemistry & Introduction to Organic Chemistry.\n\n[EQUATION:ΔH = Σ bonds broken − Σ bonds formed]\n\n• **Ask me anything** about the syllabus\n• Say **"quiz me"** for practice questions\n• Ask about **enthalpy, groups, halogens, or redox**\n\nWhat shall we work on?`,
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
Only answer WCH12 content. Use diagram tags where relevant.Only answer WCH12 content. Use diagram tags where relevant.Only answer WCH12 content. Use diagram tags where relevant.`,
  },
  phys1: { id:"phys1", name:"Physics Unit 1", code:"WPH11", subtitle:"Mechanics & Materials", colour:"#5b7bbf", icon:"⚡", placeholder:"Ask about Physics Unit 1...",
    prompts:["Explain SUVAT equations with an example","What's the difference between stress and strain?","Quiz me on Newton's laws","How do you resolve forces on a slope?"],
    welcome:`Hello! I'm your **AGF Study Companion**, powered by Alastair's diagnostic teaching method.\n\nI'm loaded with **Physics Unit 1** (WPH11) — Mechanics, Materials & Waves.\n\n[EQUATION:v = u + at]\n\n• **Ask me anything** about the syllabus\n• Say **"quiz me"** for practice questions\n• Ask about **forces, motion, energy, or materials**\n\nWhat shall we work on?`,
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

Only answer WPH11 content. Use [EQUATION:...] tags for key formulae.Only answer WPH11 content. Use [EQUATION:...] tags for key formulae.Only answer WPH11 content. Use [EQUATION:...] tags for key formulae.`,
  },
  phys2: { id:"phys2", name:"Physics Unit 2", code:"WPH12", subtitle:"Waves & Electricity", colour:"#7b5bbf", icon:"🔌", placeholder:"Ask about Physics Unit 2...",
    prompts:["Explain the difference between series and parallel circuits","What is total internal reflection?","Quiz me on waves","How do you calculate resistance in a circuit?"],
    welcome:`Hello! I'm your **AGF Study Companion**, powered by Alastair's diagnostic teaching method.\n\nI'm loaded with **Physics Unit 2** (WPH12) — Waves & Electricity.\n\n[EQUATION:V = IR]\n\n• **Ask me anything** about the syllabus\n• Say **"quiz me"** for practice questions\n• Ask about **waves, optics, circuits, or electricity**\n\nWhat shall we work on?`,
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

Only answer WPH12 content. Use [EQUATION:...] tags for key formulae.Only answer WPH12 content. Use [EQUATION:...] tags for key formulae.Only answer WPH12 content. Use [EQUATION:...] tags for key formulae.`,
  },
  maths: { id:"maths", name:"A-Level Maths", code:"Pure", subtitle:"Pure Mathematics (Core)", colour:"#bf8f3d", icon:"📐", placeholder:"Ask about A-Level Maths...",
    prompts:["Explain completing the square step by step","How do I differentiate from first principles?","Quiz me on integration","What are the factor and remainder theorems?"],
    welcome:`Hello! I'm your **AGF Study Companion**, powered by Alastair's diagnostic teaching method.\n\nI'm loaded with **A-Level Mathematics** — Pure / Core content.\n\n[EQUATION:dy/dx = nxⁿ⁻¹]\n\n• **Ask me anything** about the syllabus\n• Say **"quiz me"** for practice questions\n• Ask me to **work through a problem step by step**\n\nWhat shall we work on?`,
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

Functions: f(x) notation. Domain = set of inputs, range = set of outputs.
Composite: fg(x) = f(g(x)). Apply inner function first. Inverse: f-1(x) - reflect in y = x.
To find inverse: write y = f(x), swap x and y, solve for y. Domain of f-1 = range of f.
Modulus: |f(x)| - reflects negative parts in x-axis. f(|x|) - reflects right half in y-axis.

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
Arithmetic sequences: common difference d. u_n = a + (n-1)d.
Sum: S_n = n/2 x (2a + (n-1)d) = n/2 x (first + last).
Arithmetic mean of a and b = (a+b)/2.

Geometric sequences: common ratio r. u_n = ar^(n-1).
Sum of n terms: S_n = a(1 - r^n)/(1 - r) [r not equal to 1].
Sum to infinity: S_inf = a/(1 - r), convergent only when |r| < 1.
Geometric mean of a and b = sqrt(ab).

Sigma notation: Sum from r=1 to n of u_r. Can split sums, factor constants.
Recurrence relations: u_(n+1) = f(u_n). Increasing if u_(n+1) > u_n, decreasing if u_(n+1) < u_n.

Binomial expansion:
(a + b)^n = Sum of nCr a^(n-r) b^r for r = 0 to n. nCr = n!/(r!(n-r)!). Pascal triangle.
For (1 + x)^n when n is a positive integer: (1+x)^n = 1 + nx + n(n-1)x2/2! + n(n-1)(n-2)x3/3! + ...
For n NOT a positive integer: expansion is infinite, valid only when |x| < 1.
For (a + bx)^n: factor out a^n first, then expand (1 + bx/a)^n, valid when |bx/a| < 1.

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

Only answer A-Level Pure Maths content. Use [EQUATION:...] tags for key formulae. Show all working step by step.`,
  },
  "sat-math": { id:"sat-math", name:"SAT / ACT Math", code:"SAT", subtitle:"Problem Solving, Algebra & Geometry", colour:"#7b5bbf", icon:"📝", placeholder:"Ask about SAT / ACT Math...",
    prompts:["Explain how to solve probability questions","What are permutations vs combinations?","Quiz me on geometry","How do I approach speed/distance/time problems?"],
    welcome:`Hello! I'm your **AGF Study Companion**, powered by Alastair's diagnostic teaching method.

I'm loaded with **SAT / ACT Mathematics** — covering all the key topics you'll face on test day.

[EQUATION:nCr = n! / ((n−r)! × r!)]

• **Ask me anything** about SAT/ACT math topics
• Say **"quiz me"** for practice questions
• Ask me to **work through a problem step by step**

What shall we work on?`,
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

FUNCTIONS
f(x) notation: substitute x value. Composite: (f∘g)(x) = f(g(x)).
Domain = valid inputs. Range = possible outputs.
Transformations: f(x) + k shifts up k. f(x − h) shifts right h. −f(x) reflects over x-axis. f(−x) reflects over y-axis. af(x) stretches vertically by a.
Inverse: swap x and y, solve for y. Graph is reflection over y = x.

TEST STRATEGY
Read question carefully — what EXACTLY is being asked?
Pick Numbers strategy: when variables in answer choices, substitute easy numbers.
Backsolving: plug answer choices into the problem.
Estimate and eliminate: rule out obviously wrong answers.
Check units: make sure your answer is in the right units.

FREE TEXTBOOK REFERENCES:
• Probability → OpenStax Introductory Statistics, Ch 3: https://openstax.org/books/introductory-statistics-2e/pages/3-introduction
• Algebra → OpenStax Algebra & Trig 2e, Ch 1-2: https://openstax.org/books/algebra-and-trigonometry-2e/pages/1-introduction-to-prerequisites
• Geometry → OpenStax Geometry (LibreTexts): https://math.libretexts.org/Bookshelves/Geometry
• Trigonometry → OpenStax Algebra & Trig 2e, Ch 7-8: https://openstax.org/books/algebra-and-trigonometry-2e/pages/7-introduction-to-the-unit-circle-sine-and-cosine-functions
Also on Khan Academy: https://www.khanacademy.org/test-prep/sat

Only answer SAT/ACT Math content. Use [EQUATION:...] tags for key formulae. Show all working step by step.`,
  },
};

/* ═══ SHAPE SVG COMPONENTS ═══ */
function ShapeSVG({shape,formula,angle}){const f=formula||"?",a=angle||"";const S={fill:"none",stroke:C.green,strokeWidth:2};const T={fill:C.text,fontSize:12,fontWeight:600,fontFamily:"'DM Sans',sans-serif",textAnchor:"middle"};const L={fill:C.textMuted,fontSize:10,fontFamily:"'DM Sans',sans-serif",textAnchor:"middle"};const LP={fill:"none",stroke:C.amber,strokeWidth:1.5,strokeDasharray:"3,2"};const Lb={fill:C.green,fontSize:11,fontWeight:500,fontFamily:"'DM Sans',sans-serif",textAnchor:"middle"};const wrap=(ch,vb="0 0 200 180")=>(<div style={{background:C.bgLight,border:`1px solid ${C.border}`,borderRadius:10,padding:"14px 10px 8px",margin:"10px 0",textAlign:"center"}}><svg viewBox={vb} style={{width:"100%",maxWidth:230,display:"block",margin:"0 auto"}}>{ch}</svg></div>);if(shape==="tetrahedral")return wrap(<><circle cx="100" cy="78" r="15" fill={C.bgCard} {...S}/><text x="100" y="83" {...T}>C</text><line x1="100" y1="63" x2="100" y2="20" {...S}/><text x="100" y="14" {...L}>H</text><line x1="115" y1="78" x2="172" y2="58" {...S}/><text x="180" y="62" {...L}>H</text><line x1="88" y1="91" x2="42" y2="138" {...S}/><text x="30" y="148" {...L}>H</text><line x1="112" y1="91" x2="158" y2="138" {...S}/><text x="170" y="148" {...L}>H</text><path d="M132,125 A38,38 0 0,0 152,100" fill="none" stroke={C.textDim} strokeWidth="1" strokeDasharray="3,2"/><text x="155" y="118" fill={C.textMuted} fontSize="9" fontFamily="'DM Sans',sans-serif">{a}</text><text x="100" y="172" {...Lb}>{f} — Tetrahedral</text></>);if(shape==="pyramidal")return wrap(<><circle cx="100" cy="82" r="15" fill={C.bgCard} {...S}/><text x="100" y="87" {...T}>N</text><line x1="100" y1="67" x2="100" y2="28" {...S}/><text x="100" y="22" {...L}>H</text><line x1="87" y1="94" x2="38" y2="142" {...S}/><text x="26" y="152" {...L}>H</text><line x1="113" y1="94" x2="162" y2="142" {...S}/><text x="174" y="152" {...L}>H</text><ellipse cx="100" cy="60" rx="7" ry="4" {...LP}/><ellipse cx="100" cy="55" rx="7" ry="4" {...LP}/><text x="122" y="52" fill={C.amber} fontSize="8" fontFamily="'DM Sans',sans-serif">lone pair</text><text x="100" y="172" {...Lb}>{f} — Pyramidal ({a})</text></>);if(shape==="bent")return wrap(<><circle cx="100" cy="65" r="15" fill={C.bgCard} {...S}/><text x="100" y="70" {...T}>O</text><line x1="87" y1="77" x2="38" y2="125" {...S}/><text x="26" y="135" {...L}>H</text><line x1="113" y1="77" x2="162" y2="125" {...S}/><text x="174" y="135" {...L}>H</text><ellipse cx="86" cy="50" rx="7" ry="4" {...LP}/><ellipse cx="86" cy="45" rx="7" ry="4" {...LP}/><ellipse cx="114" cy="50" rx="7" ry="4" {...LP}/><ellipse cx="114" cy="45" rx="7" ry="4" {...LP}/><text x="100" y="36" fill={C.amber} fontSize="8" fontFamily="'DM Sans',sans-serif">2 lone pairs</text><path d="M56,112 A45,45 0 0,0 78,90" fill="none" stroke={C.textDim} strokeWidth="1" strokeDasharray="3,2"/><text x="46" y="96" fill={C.textMuted} fontSize="9" fontFamily="'DM Sans',sans-serif">{a}</text><text x="100" y="160" {...Lb}>{f} — Bent ({a})</text></>,"0 0 200 165");if(shape==="trigonal_planar")return wrap(<><circle cx="100" cy="78" r="15" fill={C.bgCard} {...S}/><text x="100" y="83" {...T}>B</text><line x1="100" y1="63" x2="100" y2="20" {...S}/><text x="100" y="14" {...L}>F</text><line x1="87" y1="91" x2="38" y2="140" {...S}/><text x="26" y="150" {...L}>F</text><line x1="113" y1="91" x2="162" y2="140" {...S}/><text x="174" y="150" {...L}>F</text><text x="100" y="172" {...Lb}>{f} — Trigonal planar ({a})</text></>);if(shape==="linear")return wrap(<><circle cx="110" cy="35" r="14" fill={C.bgCard} {...S}/><text x="110" y="40" {...T}>C</text><line x1="96" y1="35" x2="30" y2="35" {...S}/><line x1="93" y1="31" x2="33" y2="31" {...S}/><line x1="124" y1="35" x2="190" y2="35" {...S}/><line x1="127" y1="31" x2="187" y2="31" {...S}/><text x="18" y="40" {...L}>O</text><text x="202" y="40" {...L}>O</text><text x="110" y="68" {...Lb}>{f} — Linear ({a})</text></>,"0 0 220 75");if(shape==="octahedral")return wrap(<><circle cx="100" cy="90" r="14" fill={C.bgCard} {...S}/><text x="100" y="95" {...T}>S</text><line x1="100" y1="76" x2="100" y2="22" {...S}/><text x="100" y="16" {...L}>F</text><line x1="100" y1="104" x2="100" y2="158" {...S}/><text x="100" y="170" {...L}>F</text><line x1="86" y1="90" x2="22" y2="90" {...S}/><text x="12" y="94" {...L}>F</text><line x1="114" y1="90" x2="178" y2="90" {...S}/><text x="188" y="94" {...L}>F</text><line x1="110" y1="80" x2="150" y2="42" stroke={C.green} strokeWidth="1.5" strokeDasharray="4,3"/><text x="158" y="40" fill={C.textMuted} fontSize="9">F</text><line x1="90" y1="100" x2="50" y2="138" stroke={C.green} strokeWidth="1.5" strokeDasharray="4,3"/><text x="42" y="148" fill={C.textMuted} fontSize="9">F</text><text x="100" y="186" {...Lb}>{f} — Octahedral ({a})</text></>,"0 0 200 192");if(shape==="trigonal_bipyramidal")return wrap(<><circle cx="100" cy="90" r="14" fill={C.bgCard} {...S}/><text x="100" y="95" {...T}>P</text><line x1="100" y1="76" x2="100" y2="18" {...S}/><text x="100" y="12" {...L}>Cl</text><line x1="100" y1="104" x2="100" y2="165" {...S}/><text x="100" y="178" {...L}>Cl</text><line x1="86" y1="85" x2="28" y2="60" {...S}/><text x="16" y="58" {...L}>Cl</text><line x1="114" y1="85" x2="172" y2="60" {...S}/><text x="184" y="58" {...L}>Cl</text><line x1="114" y1="95" x2="172" y2="120" {...S}/><text x="184" y="124" {...L}>Cl</text><path d="M120,26 A30,30 0 0,1 138,52" fill="none" stroke={C.textDim} strokeWidth="1" strokeDasharray="3,2"/><text x="142" y="36" fill={C.textMuted} fontSize="8" fontFamily="'DM Sans',sans-serif">90°</text><path d="M48,68 A30,30 0 0,0 82,78" fill="none" stroke={C.textDim} strokeWidth="1" strokeDasharray="3,2"/><text x="52" y="82" fill={C.textMuted} fontSize="8" fontFamily="'DM Sans',sans-serif">120°</text><text x="100" y="194" {...Lb}>{f} — Trigonal bipyramidal</text></>,"0 0 200 200");if(shape==="square_planar")return wrap(<><circle cx="100" cy="90" r="14" fill={C.bgCard} {...S}/><text x="100" y="95" {...T}>Xe</text><line x1="86" y1="78" x2="35" y2="35" {...S}/><text x="24" y="30" {...L}>F</text><line x1="114" y1="78" x2="165" y2="35" {...S}/><text x="176" y="30" {...L}>F</text><line x1="86" y1="102" x2="35" y2="145" {...S}/><text x="24" y="155" {...L}>F</text><line x1="114" y1="102" x2="165" y2="145" {...S}/><text x="176" y="155" {...L}>F</text><ellipse cx="100" cy="62" rx="7" ry="4" {...LP}/><ellipse cx="100" cy="57" rx="7" ry="4" {...LP}/><ellipse cx="100" cy="118" rx="7" ry="4" {...LP}/><ellipse cx="100" cy="123" rx="7" ry="4" {...LP}/><text x="100" y="52" fill={C.amber} fontSize="7" fontFamily="'DM Sans',sans-serif">LP</text><text x="100" y="137" fill={C.amber} fontSize="7" fontFamily="'DM Sans',sans-serif">LP</text><path d="M50,48 A30,30 0 0,0 78,74" fill="none" stroke={C.textDim} strokeWidth="1" strokeDasharray="3,2"/><text x="48" y="68" fill={C.textMuted} fontSize="8" fontFamily="'DM Sans',sans-serif">90°</text><text x="100" y="174" {...Lb}>{f} — Square planar</text></>,"0 0 200 180");return <div style={{color:C.textMuted,fontSize:12,padding:8,background:C.bgLight,borderRadius:8,margin:"6px 0"}}>Shape: {shape} {f} {a}</div>;}

/* ═══ MECHANISM DIAGRAM ═══ */
function MechDiagram({type,equation}){const isFR=type==="free_radical";const step=(c)=>({color:c,fontSize:11,fontWeight:600,fontFamily:"'DM Sans',sans-serif",marginTop:8,marginBottom:2});const line={color:C.text,fontSize:13,fontFamily:"'JetBrains Mono',monospace",lineHeight:1.9};const dot=<span style={{color:C.red,fontWeight:700}}>•</span>;const arr=(c)=><span style={{color:c||C.green}}> → </span>;return(<div style={{background:C.bgLight,border:`1px solid ${C.border}`,borderRadius:10,padding:"14px 18px",margin:"10px 0"}}><div style={{fontSize:10,textTransform:"uppercase",letterSpacing:"0.1em",color:C.green,marginBottom:6,fontFamily:"'DM Sans',sans-serif",fontWeight:600}}>{isFR?"Free Radical Substitution":"Electrophilic Addition"}</div><div style={line}>{isFR?(<><div style={step(C.amber)}>Initiation — homolytic fission (UV light)</div><div>Cl—Cl {arr(C.amber)} 2Cl{dot}</div><div style={step(C.green)}>Propagation — chain reaction</div><div>Cl{dot} + CH₄ {arr()} CH₃{dot} + HCl</div><div>CH₃{dot} + Cl₂ {arr()} CH₃Cl + Cl{dot}</div><div style={step(C.textMuted)}>Termination — radicals combine</div><div>2Cl{dot} {arr(C.textMuted)} Cl₂</div><div>Cl{dot} + CH₃{dot} {arr(C.textMuted)} CH₃Cl</div><div>2CH₃{dot} {arr(C.textMuted)} C₂H₆</div></>):(<><div style={step(C.green)}>Step 1 — π bond attacks electrophile</div><svg viewBox="0 0 280 55" style={{width:"100%",maxWidth:280,display:"block",margin:"4px 0"}}><text x="5" y="30" fill={C.text} fontSize="13" fontFamily="'JetBrains Mono',monospace">C=C</text><path d="M42,25 Q80,5 118,20" fill="none" stroke={C.amber} strokeWidth="2" markerEnd="url(#ca)"/><defs><marker id="ca" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,2 L10,5 L0,8 z" fill={C.amber}/></marker></defs><text x="55" y="12" fill={C.amber} fontSize="9" fontFamily="'DM Sans',sans-serif">curly arrow</text><text x="122" y="30" fill={C.text} fontSize="13" fontFamily="'JetBrains Mono',monospace">H—Br</text><text x="122" y="48" fill={C.textMuted} fontSize="9" fontFamily="'DM Sans',sans-serif">δ⁺    δ⁻</text></svg><div>C=C + H<sup>δ⁺</sup>—Br<sup>δ⁻</sup> {arr()} C—C⁺ + Br⁻</div><div style={step(C.green)}>Step 2 — Nucleophilic attack</div><div>Br⁻ {arr()} C⁺ (attacks carbocation)</div><div style={{marginTop:8,color:C.green,fontSize:12}}>Overall: {equation}</div></>)}</div></div>);}

function EqBox({content}){return(<div style={{background:C.bgLight,border:`1px solid ${C.greenBorder}`,borderRadius:8,padding:"8px 16px",margin:"6px 0",display:"inline-block",fontFamily:"'JetBrains Mono',monospace",fontSize:15,fontWeight:500,color:C.green}}>{content}</div>);}
function ConfigBox({element,config}){return(<div style={{background:C.bgLight,border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 14px",margin:"6px 0",display:"inline-block"}}><span style={{color:C.amber,fontWeight:600,fontSize:14,fontFamily:"'DM Sans',sans-serif"}}>{element}: </span><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:14,color:C.green}}>{config}</span></div>);}

/* ═══ PARSER ═══ */
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
function RichLine({text}){return text.split(/(\[.*?\]\(https?:\/\/.*?\)|https?:\/\/[^\s)]+|\*\*.*?\*\*|\*.*?\*|`[^`]+`)/g).map((s,i)=>{
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
  const[selectedCatalog,setSelectedCatalog]=useState(null);
  const[activeUnit,setActiveUnit]=useState(null);
  const[msgs,setMsgs]=useState([]);
  const[input,setInput]=useState("");
  const[loading,setLoading]=useState(false);
  const[err,setErr]=useState(null);
  const[mode,setMode]=useState("ask");
  const[showPicker,setShowPicker]=useState(false);
  const[quizQ,setQuizQ]=useState(null);
  const[quizNum,setQuizNum]=useState(0);
  const[quizSelected,setQuizSelected]=useState(null);
  const[quizFeedback,setQuizFeedback]=useState(null);
  const[quizScore,setQuizScore]=useState(0);
  const[quizMaxScore,setQuizMaxScore]=useState(0);
  const[quizHistory,setQuizHistory]=useState([]);
  const[quizDone,setQuizDone]=useState(false);
  const[hintText,setHintText]=useState(null);
  const[hintLoading,setHintLoading]=useState(false);
  const[notesContent,setNotesContent]=useState(null);
  const[notesLoading,setNotesLoading]=useState(false);
  const endRef=useRef(null);const inputRef=useRef(null);
  const currentUnit=activeUnit?UNITS[activeUnit]:null;

  useEffect(()=>{endRef.current?.scrollIntoView({behavior:"smooth"});},[msgs,loading,quizFeedback,quizQ]);
  useEffect(()=>{if(activeUnit&&mode==="ask")inputRef.current?.focus();},[activeUnit,mode]);

  const selectUnit=(unitKey)=>{setActiveUnit(unitKey);setPickerStep(null);setMsgs([{role:"assistant",content:UNITS[unitKey].welcome}]);setErr(null);setInput("");setMode("ask");resetQuiz();setNotesContent(null);setNotesLoading(false);setShowPicker(false);};
  const goHome=()=>{setPickerStep("subject");setSelectedCatalog(null);setActiveUnit(null);setMsgs([]);setMode("ask");resetQuiz();setShowPicker(false);};
  const resetQuiz=()=>{setQuizQ(null);setQuizNum(0);setQuizSelected(null);setQuizFeedback(null);setQuizScore(0);setQuizMaxScore(0);setQuizHistory([]);setQuizDone(false);setHintText(null);setHintLoading(false); setUsedPPIndices(new Set());};

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

  const fetchQuizQuestion=useCallback(async(questionNumber)=>{if(!currentUnit)return;setLoading(true);setErr(null);setQuizQ(null);setQuizSelected(null);setQuizFeedback(false);setHintText(null);const ppUnitId=activeUnit;if(questionNumber%2===1&&PAST_PAPERS[ppUnitId]){const prevTopics=quizHistory.map(h=>h.topic).filter(Boolean);const pp=pickPastPaper(ppUnitId,prevTopics,usedPPIndices);if(pp){setUsedPPIndices(prev=>new Set([...prev,pp._ppIndex]));const{_ppIndex,...cleanQ}=pp;setQuizQ(cleanQ);setLoading(false);return;}}const difficulty=Math.min(10,Math.max(1,Math.ceil(questionNumber*1.1)));const prevTopics=quizHistory.map(h=>h.topic).filter(Boolean);try{const res=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:[{role:"user",content:`Generate question ${questionNumber}/10. Difficulty: ${difficulty}/10. ${prevTopics.length?"Already covered topics: "+prevTopics.join(", ")+". Try a different topic.":""} Respond with ONLY JSON.`}],system:QUIZ_GEN_SYSTEM(currentUnit.system),mode:"quiz"})});const data=await res.json();if(data.error)throw new Error(data.error.message);const text=data.content?.map(b=>b.type==="text"?b.text:"").filter(Boolean).join("\n")||"";const parsed=parseJSON(text);if(parsed&&parsed.question&&parsed.options&&parsed.correctLabel){setQuizQ(parsed);}else{throw new Error("Failed to parse question. Please try again.");}}catch(e){if(e.message&&(e.message.includes("overload")||e.message.includes("529")||e.message.includes("capacity"))){setErr("API busy — retrying in 3s...");await new Promise(r=>setTimeout(r,3000));try{const res2=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:[{role:"user",content:`Generate question ${questionNumber}/10. Respond with ONLY JSON.`}],system:QUIZ_GEN_SYSTEM(currentUnit.system),mode:"quiz"})});const d2=await res2.json();if(!d2.error){const t2=d2.content?.map(b=>b.type==="text"?b.text:"").filter(Boolean).join("\n")||"";const p2=parseJSON(t2);if(p2&&p2.question&&p2.options&&p2.correctLabel){setQuizQ(p2);setErr(null);setLoading(false);return;}}}catch(e2){}}setErr(e.message+" — Click Retry or start a New Quiz.");}finally{setLoading(false);};},[currentUnit,quizHistory]);

  const startQuiz=useCallback(async()=>{if(loading||!currentUnit)return;setMode("quiz");resetQuiz();setQuizNum(1);await fetchQuizQuestion(1);},[loading,currentUnit]);
  const[pendingNext,setPendingNext]=useState(false);
  useEffect(()=>{if(pendingNext&&quizNum>0){fetchQuizQuestion(quizNum);setPendingNext(false);}},[pendingNext,quizNum]);
  const submitAnswer=useCallback(()=>{if(!quizQ||!quizSelected)return;const isCorrect=quizSelected===quizQ.correctLabel;setQuizFeedback(true);if(isCorrect)setQuizScore(s=>s+1);setQuizMaxScore(s=>s+1);setQuizHistory(h=>[...h,{q:quizQ.question,answer:quizSelected,correct:isCorrect,topic:quizQ.topic,correctLabel:quizQ.correctLabel}]);},[quizQ,quizSelected]);
  const nextQuestion=()=>{if(quizNum>=10){setQuizDone(true);return;}setQuizNum(n=>n+1);setPendingNext(true);};
  const getHint=useCallback(async()=>{if(!quizQ||hintLoading)return;if(quizQ.hint){setHintText(quizQ.hint);return;}setHintLoading(true);try{const res=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:[{role:"user",content:`Give me a hint for: ${quizQ.question}\nOptions: ${quizQ.options.map(o=>o.label+") "+o.text).join(", ")}`}],system:QUIZ_HINT_SYSTEM(currentUnit.system),mode:"ask"})});const data=await res.json();const text=data.content?.map(b=>b.type==="text"?b.text:"").filter(Boolean).join("\n")||"Think about the key concepts involved.";setHintText(text);}catch(e){setHintText("Think about the key concepts involved in this topic.");}finally{setHintLoading(false);}},[quizQ,hintLoading,currentUnit]);
  const generateNotes=useCallback(async()=>{if(!currentUnit||notesLoading)return;setNotesLoading(true);setNotesContent(null);try{const res=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:[{role:"user",content:"Generate comprehensive revision notes for this subject. Cover ALL key topics from the syllabus. For each topic include: definitions, key formulae, exam tips, and common mistakes. Format with ## headings for each topic, bullet points for key facts, and **bold** for important terms. Be thorough and exam-focused."}],system:currentUnit.system,mode:"ask"})});const data=await res.json();if(data.error)throw new Error(data.error.message);const text=data.content?.map(b=>b.type==="text"?b.text:"").filter(Boolean).join("\n")||"";setNotesContent(text);}catch(e){setErr(e.message);}finally{setNotesLoading(false);}},[currentUnit,notesLoading]);
  const downloadChatNotes=(content,topic)=>{
    const clean=content
      .replace(/📖[^\n]*Deeper notes[^\n]*🌍[^\n]*Real-world[^\n]*📚[^\n]*Quiz me[^\n]*/g,'')
      .replace(/\non this\s*$/,'')
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
      .replace(/✅/g,'<span style="color:#4d9460">✓</span>')
      .replace(/❌/g,'<span style="color:#e06060">✗</span>')
      .replace(/\n/g,'<br>');
    const page=`<!DOCTYPE html>
<html><head><meta charset="utf-8">
<title>${topic||"Revision Notes"} — AGF Tutoring</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
  @page{margin:2cm 2.5cm;size:A4}
  body{font-family:'Outfit',sans-serif;font-weight:400;color:#1a1a1a;line-height:1.8;max-width:680px;margin:0 auto;padding:40px 20px;font-size:13px}
  .header{border-bottom:2px solid #4d9460;padding-bottom:16px;margin-bottom:24px;display:flex;justify-content:space-between;align-items:flex-end}
  .header h1{font-family:'DM Serif Display',serif;font-size:22px;font-weight:400;margin:0;color:#1a1a1a}
  .header .sub{font-size:11px;color:#706b65;letter-spacing:0.08em;text-transform:uppercase}
  .header .brand{font-family:'DM Serif Display',serif;font-size:14px;color:#4d9460}
  h1{font-family:'DM Serif Display',serif;font-size:20px;font-weight:400;margin:28px 0 12px;color:#1a1a1a}
  h2{font-family:'DM Serif Display',serif;font-size:17px;font-weight:400;margin:24px 0 10px;color:#1a1a1a;border-bottom:1px solid #e0ddd6;padding-bottom:4px}
  h3{font-family:'Outfit',sans-serif;font-size:14px;font-weight:600;margin:18px 0 6px;color:#4d9460}
  strong{font-weight:600;color:#1a1a1a}
  li{margin-bottom:4px;padding-left:4px}
  code{background:#f4f3f0;padding:1px 5px;border-radius:3px;font-size:12px;font-family:monospace}
  .footer{margin-top:40px;padding-top:12px;border-top:1px solid #e0ddd6;font-size:10px;color:#9a9690;text-align:center}
  @media print{.no-print{display:none!important}}
</style></head><body>
<div class="header">
  <div><h1>${topic||"Revision Notes"}</h1><div class="sub">${currentUnit?.name||"Chemistry"} — ${currentUnit?.code||"WCH11"}</div></div>
  <div class="brand">AGF Tutoring</div>
</div>
${html}
<div class="footer">AGF Tutoring · Study Companion · Based on LibreTexts / OpenStax open-access materials</div>
<div class="no-print" style="text-align:center;margin-top:20px">
  <button onclick="window.print()" style="padding:10px 28px;border-radius:6px;border:none;background:#4d9460;color:#fff;font-family:'Outfit',sans-serif;font-size:13px;font-weight:600;cursor:pointer">Save as PDF (Ctrl+P)</button>
</div>
</body></html>`;
    const w=window.open('','_blank');
    if(w){w.document.write(page);w.document.close();}
  };
  const downloadNotesPDF=()=>{if(!notesContent||!currentUnit)return;const blob=new Blob([currentUnit.name+" — Revision Notes\n"+"=".repeat(50)+"\n\n"+notesContent.replace(/\*\*/g,"").replace(/## /g,"\n--- ").replace(/- /g,"• ")],{type:"text/plain"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=currentUnit.code+"-revision-notes.txt";a.click();URL.revokeObjectURL(url);};
  const backToAsk=()=>{setMode("ask");resetQuiz();if(currentUnit)setMsgs([{role:"assistant",content:currentUnit.welcome}]);};
  const send=useCallback(async()=>{const t=input.trim();if(!t||loading||!currentUnit)return;const userMsg={role:"user",content:t};const next=[...msgs,userMsg];setMsgs(next);setInput("");setLoading(true);setErr(null);const apiMsgs=next.filter((m,idx)=>!(idx===0&&m.role==="assistant")).map(m=>({role:m.role,content:m.content}));if(!apiMsgs.length||apiMsgs[0].role!=="user")apiMsgs.unshift({role:"user",content:t});try{const res=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:apiMsgs,system:currentUnit.system,mode:"ask"})});const data=await res.json();if(data.error)throw new Error(data.error.message);const reply=data.content?.map(b=>b.type==="text"?b.text:"").filter(Boolean).join("\n")||"Sorry, I couldn't generate a response.";setMsgs(p=>[...p,{role:"assistant",content:reply}]);}catch(e){setErr(e.message);}finally{setLoading(false);inputRef.current?.focus();}},[input,loading,msgs,currentUnit]);

  const CSS=`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');@keyframes p{0%,100%{opacity:.25;transform:scale(.85)}50%{opacity:.65;transform:scale(1.1)}}textarea::placeholder{color:${C.textDim}}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.06);border-radius:3px}*{box-sizing:border-box}`;

  /* ─── SCREEN 1: SUBJECT PICKER ─── */
  if(pickerStep==="subject"){const coreSubjects=CATALOG.filter(s=>["chemistry","physics","maths"].includes(s.id));const otherSubjects=CATALOG.filter(s=>!["chemistry","physics","maths"].includes(s.id));const boardTags={chemistry:"Edexcel IAL · AQA · OCR · Cambridge · IB · AP",physics:"Edexcel IAL · AQA · OCR · Cambridge · IB · AP",maths:"Edexcel IAL · AQA · OCR · IB · AP · SAT · GMAT"};const coreIcons={chemistry:"⚗",physics:"⚡",maths:"📐"};return(<div style={{width:"100%",minHeight:"100vh",display:"flex",flexDirection:"column",background:C.bg,fontFamily:"'Outfit',sans-serif",color:C.text}}><nav style={{padding:"16px 40px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${C.border}`}}><a href="https://agftutoring.co.uk" target="_blank" rel="noopener" style={{display:"flex",alignItems:"center",gap:12,textDecoration:"none",color:C.text}}><svg width="22" height="26" viewBox="0 0 22 26">{[0.5,0.85,1,0.65].map((f,i)=>(<rect key={i} x={i*5.8} y={26-26*f} width={3.2} height={26*f} rx={0.8} fill={C.green}/>))}</svg><div><div style={{fontFamily:"'DM Serif Display',serif",fontSize:18,fontWeight:400,letterSpacing:"-0.02em",lineHeight:1}}>AGF</div><div style={{fontSize:8.5,fontWeight:500,letterSpacing:"0.15em",textTransform:"uppercase",color:C.textMuted,marginTop:1}}>TUTORING</div></div></a><a href="https://agftutoring.co.uk" target="_blank" rel="noopener" style={{fontSize:12,color:C.textDim,textDecoration:"none"}}>agftutoring.co.uk</a></nav><div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px 40px 32px"}}><div style={{textAlign:"center",marginBottom:40}}><div style={{fontSize:11,fontWeight:500,letterSpacing:"0.14em",textTransform:"uppercase",color:C.green,marginBottom:12}}>Study Companion</div><div style={{fontFamily:"'DM Serif Display',serif",fontSize:"clamp(26px, 3.5vw, 38px)",fontWeight:400,lineHeight:1.2,letterSpacing:"-0.02em",color:C.text}}>Choose your subject</div></div><div style={{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:24,width:"100%",maxWidth:1080,marginBottom:48}}>{coreSubjects.map(s=>(<button key={s.id} onClick={()=>{setSelectedCatalog(s);setPickerStep("exam");}} style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:14,padding:"36px 30px 30px",cursor:"pointer",transition:"all 0.3s ease",textAlign:"left",position:"relative",overflow:"hidden"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=s.colour;e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 12px 32px rgba(0,0,0,0.4)";e.currentTarget.querySelector("[data-accent]").style.opacity="1";}} onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";e.currentTarget.querySelector("[data-accent]").style.opacity="0.5";}}><div data-accent="1" style={{position:"absolute",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg, ${s.colour}, transparent)`,opacity:0.5,transition:"opacity 0.3s"}}/><div style={{fontSize:36,marginBottom:12}}>{coreIcons[s.id]}</div><div style={{fontFamily:"'DM Serif Display',serif",fontSize:24,fontWeight:400,letterSpacing:"-0.02em",marginBottom:12,color:C.text}}>{s.name}</div><div style={{fontSize:14,color:C.textMuted,lineHeight:1.7,fontWeight:300,marginBottom:20}}>{s.subtitle}</div><div style={{fontSize:11,color:C.textDim,letterSpacing:"0.04em",lineHeight:1.6}}>{boardTags[s.id]}</div></button>))}</div><div style={{display:"flex",alignItems:"center",gap:20,marginBottom:28,width:"100%",maxWidth:1080}}><div style={{flex:1,height:1,background:C.border}}/><span style={{fontSize:10,fontWeight:500,letterSpacing:"0.12em",textTransform:"uppercase",color:C.textDim}}>Admissions & Language</span><div style={{flex:1,height:1,background:C.border}}/></div><div style={{display:"grid",gridTemplateColumns:"repeat(4, 1fr)",gap:14,width:"100%",maxWidth:1080}}>{otherSubjects.map(s=>(<button key={s.id} onClick={()=>{setSelectedCatalog(s);setPickerStep("exam");}} style={{background:s.systems?C.bgCard:"transparent",border:`1px solid ${C.border}`,borderRadius:10,padding:"18px 20px",cursor:s.systems?"pointer":"default",transition:"all 0.25s",opacity:s.systems?1:0.45,textAlign:"left"}} onMouseEnter={e=>{if(s.systems){e.currentTarget.style.borderColor=C.green;e.currentTarget.style.transform="translateY(-2px)";}}} onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.transform="none";}}><div style={{fontFamily:"'DM Serif Display',serif",fontSize:16,fontWeight:400,marginBottom:4,color:C.text}}>{s.name}</div><div style={{fontSize:10.5,fontWeight:500,letterSpacing:"0.06em",color:s.systems?C.green:C.textDim}}>{s.systems?"Available":"Coming soon"}</div></button>))}</div></div><footer style={{borderTop:`1px solid ${C.border}`,padding:"18px 40px",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{display:"flex",alignItems:"center",gap:10}}><svg width="14" height="16" viewBox="0 0 22 26">{[0.5,0.85,1,0.65].map((f,i)=>(<rect key={i} x={i*5.8} y={26-26*f} width={3.2} height={26*f} rx={0.8} fill={C.green}/>))}</svg><span style={{fontSize:10,color:C.textDim}}>Powered by AGF Tutoring · Grounded in curated notes</span></div><a href="https://agftutoring.co.uk" target="_blank" rel="noopener" style={{fontSize:10,color:C.textDim,textDecoration:"none"}}>agftutoring.co.uk</a></footer><style>{CSS}</style></div>);}
  if(pickerStep==="exam"&&selectedCatalog){const cat=selectedCatalog;return(<div style={{width:"100%",minHeight:"100vh",display:"flex",flexDirection:"column",background:C.bg,fontFamily:"'Outfit',sans-serif",color:C.text}}><div style={{padding:"16px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:12}}><button onClick={()=>setPickerStep("subject")} style={{padding:"8px 16px",borderRadius:8,border:`1px solid ${C.greenBorder}`,background:C.greenDim,color:C.green,cursor:"pointer",fontSize:13,fontWeight:600,transition:"all 0.2s"}} onMouseEnter={e=>{e.currentTarget.style.background=C.green;e.currentTarget.style.color=C.bg;}} onMouseLeave={e=>{e.currentTarget.style.background=C.greenDim;e.currentTarget.style.color=C.green;}}>← All Subjects</button><div style={{flex:1}}><div style={{fontFamily:"'DM Serif Display',serif",fontSize:20,letterSpacing:"-0.02em",display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:24}}>{cat.icon}</span> {cat.name}</div></div></div><div style={{flex:1,overflowY:"auto",padding:"24px 20px",maxWidth:800,margin:"0 auto",width:"100%"}}>{cat.systems?cat.systems.map((sys,si)=>(<div key={si} style={{marginBottom:32}}><div style={{fontSize:11,fontWeight:600,color:C.green,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:12,paddingBottom:8,borderBottom:`1px solid ${C.border}`}}>{sys.system}</div><div style={{display:"flex",flexDirection:"column",gap:10}}>{sys.boards.map((board,bi)=>(<div key={bi}><div style={{fontSize:14,fontWeight:500,color:board.comingSoon?C.textDim:C.text,marginBottom:8,display:"flex",alignItems:"center",gap:8}}>{board.board}{board.comingSoon&&<span style={{fontSize:9,color:C.amber,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",padding:"2px 6px",background:"rgba(212,162,76,0.1)",borderRadius:3}}>Coming soon</span>}</div>{board.papers&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(200px, 1fr))",gap:8,marginBottom:8,marginLeft:12}}>{board.papers.map((paper,pi)=>{const isAvail=paper.unitKey&&UNITS[paper.unitKey];return(<button key={pi} onClick={()=>isAvail&&selectUnit(paper.unitKey)} style={{padding:"12px 14px",borderRadius:8,textAlign:"left",background:isAvail?C.bgCard:"transparent",border:`1px solid ${isAvail?C.border:C.borderLight}`,cursor:isAvail?"pointer":"default",opacity:isAvail?1:0.45,transition:"all 0.2s"}} onMouseEnter={e=>{if(isAvail){e.currentTarget.style.borderColor=cat.colour;e.currentTarget.style.transform="translateY(-1px)";}}} onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.transform="none";}}><div style={{fontSize:13,fontWeight:500,color:isAvail?C.text:C.textDim}}>{paper.name}</div><div style={{fontSize:11,color:C.textDim,marginTop:2}}>{paper.subtitle}</div>{paper.comingSoon&&<div style={{fontSize:9,color:C.amber,marginTop:4,fontWeight:500}}>Coming soon</div>}</button>);})}</div>}</div>))}</div></div>)):<div style={{textAlign:"center",padding:60}}><div style={{fontSize:48,marginBottom:16}}>{cat.icon}</div><div style={{fontSize:18,fontFamily:"'DM Serif Display',serif",marginBottom:8}}>{cat.name}</div><div style={{fontSize:13,color:C.textMuted,marginBottom:16}}>{cat.subtitle}</div>{cat.sections&&<div style={{fontSize:12,color:C.textDim,marginBottom:20}}>Sections: {cat.sections.join(" · ")}</div>}<div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"10px 20px",background:"rgba(212,162,76,0.08)",border:"1px solid rgba(212,162,76,0.2)",borderRadius:8,fontSize:13,color:C.amber,fontWeight:500}}>Coming soon — we're building this now</div></div>}</div><style>{CSS}</style></div>);}

  /* ─── QUIZ RESULTS ─── */
  if(mode==="quiz"&&quizDone&&currentUnit){const pct=quizMaxScore>0?Math.round((quizScore/quizMaxScore)*100):0;const grade=pct>=80?"A":pct>=70?"B":pct>=60?"C":pct>=50?"D":"U";const weakTopics=[...new Set(quizHistory.filter(h=>h.correct!==true).map(h=>h.topic).filter(Boolean))];return(<div style={{width:"100%",height:"100vh",display:"flex",flexDirection:"column",background:C.bg,fontFamily:"'Outfit',sans-serif",color:C.text}}><div style={{padding:"14px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:12}}><div style={{flex:1}}><div style={{fontFamily:"'DM Serif Display',serif",fontSize:17,letterSpacing:"-0.02em"}}>AGF<span style={{color:C.green}}>tutoring</span> <span style={{fontSize:13,color:C.textMuted,fontFamily:"'Outfit',sans-serif"}}>· Quiz Complete</span></div><div style={{fontSize:11,color:C.textDim}}>{currentUnit.name}</div></div><button onClick={backToAsk} style={{padding:"8px 16px",borderRadius:6,fontSize:12,fontWeight:500,border:`1px solid ${C.border}`,background:"transparent",color:C.textMuted,cursor:"pointer"}}>Back to Ask</button><button onClick={startQuiz} style={{padding:"8px 16px",borderRadius:6,fontSize:12,fontWeight:500,border:`1px solid ${C.green}`,background:C.greenDim,color:C.green,cursor:"pointer"}}>New Quiz</button></div><div style={{flex:1,overflowY:"auto",padding:20}}><div style={{textAlign:"center",padding:"30px 20px",background:C.bgCard,borderRadius:12,border:`1px solid ${C.border}`,marginBottom:20}}><div style={{fontSize:52,fontWeight:700,color:C.green,fontFamily:"'JetBrains Mono',monospace"}}>{quizScore}/{quizMaxScore}</div><div style={{fontSize:16,color:C.textMuted,marginTop:4}}>{pct}% — Grade {grade}</div><div style={{marginTop:16,height:8,background:C.bgLight,borderRadius:4,overflow:"hidden"}}><div style={{height:"100%",width:`${pct}%`,background:pct>=70?C.green:pct>=50?C.amber:C.red,borderRadius:4,transition:"width 0.5s"}}/></div></div>{weakTopics.length>0&&<div style={{padding:"14px 18px",background:"rgba(224,96,96,0.06)",border:"1px solid rgba(224,96,96,0.15)",borderRadius:8,marginBottom:20}}><div style={{fontSize:12,fontWeight:600,color:C.red,marginBottom:6}}>Topics to revise:</div><div style={{fontSize:13,color:C.text}}>{weakTopics.join(", ")}</div></div>}{quizHistory.map((h,i)=>(<div key={i} style={{padding:"14px 18px",background:C.bgCard,border:`1px solid ${h.correct?"rgba(77,148,96,0.3)":"rgba(224,96,96,0.2)"}`,borderRadius:8,marginBottom:10}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}><div style={{fontSize:12,fontWeight:600,color:C.textMuted}}>Q{i+1}</div><div style={{fontSize:12,fontWeight:600,color:h.correct?C.green:C.red}}>{h.correct?"✓ Correct":`✗ Wrong (was ${h.correctLabel})`}</div></div><div style={{fontSize:13,color:C.text}}>{h.q}</div><div style={{fontSize:12,color:C.textMuted,marginTop:4}}>Your answer: {h.answer}</div></div>))}</div><style>{CSS}</style></div>);}

  /* ─── QUIZ QUESTION ─── */
  if(mode==="quiz"&&currentUnit){const correctCount=quizHistory.filter(h=>h.correct).length;const wrongCount=quizHistory.filter(h=>!h.correct).length;return(<div style={{width:"100%",height:"100vh",display:"flex",flexDirection:"column",background:C.bg,fontFamily:"'Outfit',sans-serif",color:C.text}}><div style={{padding:"12px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:12}}><div style={{flex:1}}><div style={{fontFamily:"'DM Serif Display',serif",fontSize:16,letterSpacing:"-0.02em"}}>AGF<span style={{color:C.green}}>tutoring</span> <span style={{fontSize:12,color:C.textMuted,fontFamily:"'Outfit',sans-serif"}}>· {currentUnit.name} Quiz</span></div></div><div style={{display:"flex",gap:10,alignItems:"center",fontSize:13,fontWeight:600}}><span style={{color:C.textDim}}>{quizNum}/10</span>{wrongCount>0&&<span style={{color:C.red,display:"flex",alignItems:"center",gap:3}}>✗ {wrongCount}</span>}{correctCount>0&&<span style={{color:C.green,display:"flex",alignItems:"center",gap:3}}>✓ {correctCount}</span>}</div><button onClick={backToAsk} style={{padding:"6px 12px",borderRadius:6,fontSize:11,border:`1px solid ${C.border}`,background:"transparent",color:C.textDim,cursor:"pointer"}}>✕</button></div><div style={{height:4,background:C.bgLight}}><div style={{height:"100%",width:`${(quizNum/10)*100}%`,background:C.green,transition:"width 0.4s ease",borderRadius:"0 2px 2px 0"}}/></div><div style={{flex:1,overflowY:"auto",padding:"24px 20px",maxWidth:700,margin:"0 auto",width:"100%"}}>{loading&&!quizQ&&<div style={{textAlign:"center",padding:60,color:C.textMuted}}><div style={{display:"flex",gap:5,justifyContent:"center",marginBottom:12}}>{[0,1,2].map(d=><div key={d} style={{width:8,height:8,borderRadius:"50%",background:C.green,opacity:0.3,animation:`p 1.2s ease-in-out ${d*0.2}s infinite`}}/>)}</div>Generating question {quizNum}...</div>}{quizQ&&<><div style={{marginBottom:24}}><div style={{fontSize:15,lineHeight:1.8,color:C.text}}><span style={{fontWeight:600}}>{quizNum}.</span>  {quizQ.question}</div></div><div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>{quizQ.options.map(opt=>{const isSel=quizSelected===opt.label;const isCor=opt.label===quizQ.correctLabel;const ans=quizFeedback;const showExp=ans&&(isCor||isSel);let bc=C.border,bg="transparent";if(!ans&&isSel){bc=C.green;bg=C.greenDim;}if(ans&&isCor){bc=C.green;bg="rgba(77,148,96,0.06)";}if(ans&&isSel&&!isCor){bc=C.red;bg="rgba(224,96,96,0.06)";}return(<div key={opt.label} onClick={()=>!ans&&setQuizSelected(opt.label)} style={{padding:"14px 18px",borderRadius:10,border:`1.5px solid ${bc}`,background:bg,cursor:ans?"default":"pointer",transition:"all 0.2s"}} onMouseEnter={e=>{if(!ans&&!isSel){e.currentTarget.style.borderColor=C.green;e.currentTarget.style.background=C.greenDim;}}} onMouseLeave={e=>{if(!ans&&!isSel){e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background="transparent";}}}><div style={{display:"flex",alignItems:"flex-start",gap:12}}><span style={{fontSize:14,fontWeight:600,color:C.textMuted,flexShrink:0,marginTop:1}}>{opt.label}.</span><span style={{fontSize:14,color:C.text,lineHeight:1.6}}>{opt.text}</span></div>{showExp&&quizQ.explanations&&<div style={{marginTop:12,paddingTop:10,borderTop:`1px solid ${isCor?"rgba(77,148,96,0.2)":"rgba(224,96,96,0.15)"}`}}><div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}><span style={{fontSize:12,fontWeight:600,color:isCor?C.green:C.red}}>{isCor?"✓ Right answer":"✗ Not quite"}</span></div><div style={{fontSize:13,color:"rgba(255,255,255,0.7)",lineHeight:1.7}}>{quizQ.explanations[opt.label]}</div></div>}</div>);})}</div>{!quizFeedback&&<div style={{marginBottom:20}}><button onClick={()=>hintText?setHintText(null):getHint()} disabled={hintLoading} style={{background:"none",border:"none",cursor:hintLoading?"default":"pointer",color:C.textMuted,fontSize:13,padding:0,display:"flex",alignItems:"center",gap:6,transition:"color 0.2s"}} onMouseEnter={e=>{e.currentTarget.style.color=C.green;}} onMouseLeave={e=>{e.currentTarget.style.color=C.textMuted;}}>{hintLoading?"Loading...":"Show hint"} <span style={{fontSize:10}}>{hintText?"▲":"▼"}</span></button>{hintText&&<div style={{marginTop:8,padding:"10px 14px",background:"rgba(200,164,110,0.06)",border:"1px solid rgba(200,164,110,0.15)",borderRadius:8,fontSize:13,color:C.amber,lineHeight:1.6}}>{hintText}</div>}</div>}{err&&<div style={{padding:"8px 12px",borderRadius:6,background:"rgba(224,96,96,0.08)",border:"1px solid rgba(224,96,96,0.15)",color:C.red,fontSize:12,marginBottom:16}}>{err}</div>}<div ref={endRef}/></>}</div>{quizQ&&<div style={{padding:"16px 20px",borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"center",gap:12,background:C.bg}}>{!quizFeedback?<button onClick={submitAnswer} disabled={!quizSelected||loading} style={{padding:"10px 32px",borderRadius:8,border:"none",background:quizSelected?C.green:"rgba(255,255,255,0.04)",color:quizSelected?C.bg:C.textDim,fontSize:14,fontWeight:600,cursor:quizSelected?"pointer":"default",transition:"all 0.2s"}}>Submit</button>:<button onClick={nextQuestion} style={{padding:"10px 32px",borderRadius:8,border:`1px solid ${C.green}`,background:C.greenDim,color:C.green,fontSize:14,fontWeight:600,cursor:"pointer",transition:"all 0.2s"}}>{quizNum>=10?"See Results":"Next"}</button>}</div>}<style>{CSS}</style></div>);}

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
      <div style={{flex:1,overflowY:"auto",padding:"24px 20px",maxWidth:760,margin:"0 auto",width:"100%"}}>
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

  return(<div style={{width:"100%",height:"100vh",display:"flex",flexDirection:"column",background:C.bg,fontFamily:"'Outfit',sans-serif",color:C.text}}><div style={{padding:"14px 20px",display:"flex",alignItems:"center",gap:14,borderBottom:`1px solid ${C.border}`,background:C.bg,flexShrink:0}}><div style={{flex:1,cursor:"pointer",position:"relative"}} onClick={()=>setShowPicker(!showPicker)}><div style={{fontFamily:"'DM Serif Display',serif",fontSize:17,fontWeight:400,color:C.text,display:"flex",alignItems:"center",gap:8,letterSpacing:"-0.02em"}}>AGF<span style={{color:C.green}}>tutoring</span><span style={{fontSize:11,color:C.textDim,fontFamily:"'Outfit',sans-serif"}}>▼</span></div><div style={{fontSize:10.5,color:C.textDim,letterSpacing:"0.06em",textTransform:"uppercase",marginTop:1}}>{currentUnit.icon} {currentUnit.code} · {currentUnit.name}</div>{showPicker&&<div style={{position:"absolute",top:"115%",left:0,zIndex:200,background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:10,boxShadow:"0 12px 40px rgba(0,0,0,0.6)",overflow:"hidden",minWidth:260}}><div style={{padding:"10px 14px",borderBottom:`1px solid ${C.border}`,fontSize:10,color:C.textDim,textTransform:"uppercase",letterSpacing:"0.1em"}}>Switch Subject</div>{Object.values(UNITS).map(u=>(<button key={u.id} onClick={e=>{e.stopPropagation();selectUnit(u.id);}} style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"12px 14px",border:"none",cursor:"pointer",background:u.id===activeUnit?C.greenDim:"transparent",borderLeft:u.id===activeUnit?`3px solid ${C.green}`:"3px solid transparent",transition:"all 0.15s"}} onMouseEnter={e=>{if(u.id!==activeUnit)e.currentTarget.style.background=C.bgLight;}} onMouseLeave={e=>{if(u.id!==activeUnit)e.currentTarget.style.background="transparent";}}><span style={{fontSize:18}}>{u.icon}</span><div><div style={{fontSize:13,fontWeight:500,color:C.text,textAlign:"left"}}>{u.name}</div><div style={{fontSize:10,color:C.textDim,textAlign:"left"}}>{u.code}</div></div></button>))}<button onClick={e=>{e.stopPropagation();goHome();}} style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"12px 14px",border:"none",cursor:"pointer",background:"transparent",borderTop:`1px solid ${C.border}`,transition:"all 0.15s"}} onMouseEnter={e=>{e.currentTarget.style.background=C.bgLight;}} onMouseLeave={e=>{e.currentTarget.style.background="transparent";}}><span style={{fontSize:14}}>←</span><div style={{fontSize:12,color:C.textMuted,textAlign:"left"}}>All subjects</div></button></div>}</div><div style={{display:"flex",gap:0,background:C.bgLight,borderRadius:8,padding:3,border:`1px solid ${C.border}`}}><button onClick={backToAsk} style={{padding:"8px 20px",borderRadius:6,fontSize:13,fontWeight:600,cursor:"pointer",letterSpacing:"0.03em",transition:"all 0.2s",border:"none",background:mode==="ask"?C.green:"transparent",color:mode==="ask"?C.bg:C.textMuted}}>Ask</button><button onClick={startQuiz} disabled={loading} style={{padding:"8px 20px",borderRadius:6,fontSize:13,fontWeight:600,cursor:loading?"default":"pointer",letterSpacing:"0.03em",transition:"all 0.2s",border:"none",background:mode==="quiz"?C.green:"transparent",color:mode==="quiz"?C.bg:C.textMuted}}>Quiz</button><button onClick={()=>setMode("notes")} style={{padding:"8px 20px",borderRadius:6,fontSize:13,fontWeight:600,cursor:"pointer",letterSpacing:"0.03em",transition:"all 0.2s",border:"none",background:mode==="notes"?C.green:"transparent",color:mode==="notes"?C.bg:C.textMuted}}>Notes</button></div></div><div style={{flex:1,overflowY:"auto",padding:"20px 16px",display:"flex",flexDirection:"column",gap:16,maxWidth:760,margin:"0 auto",width:"100%"}} onClick={()=>showPicker&&setShowPicker(false)}>{msgs.map((m,i)=>(<div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",gap:8,alignItems:"flex-start"}}>{m.role==="assistant"&&<div style={{width:26,height:26,borderRadius:6,flexShrink:0,marginTop:2,background:C.greenDim,border:`1px solid ${C.greenBorder}`,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{fontFamily:"'DM Serif Display',serif",fontSize:11,color:C.green,fontWeight:400}}>A</div></div>}<div style={{maxWidth:m.role==="user"?"72%":"92%",padding:m.role==="user"?"10px 14px":"14px 18px",borderRadius:m.role==="user"?"10px 10px 2px 10px":"10px 10px 10px 2px",background:m.role==="user"?C.greenDim:"rgba(255,255,255,0.03)",border:m.role==="user"?`1px solid ${C.greenBorder}`:`1px solid ${C.border}`,fontSize:13.5,lineHeight:1.7,color:m.role==="user"?C.text:"rgba(255,255,255,0.82)"}}>{(()=>{
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
          style={{padding:"6px 14px",borderRadius:20,border:"1px solid "+C.border,background:"transparent",color:C.textMuted,fontSize:11.5,fontWeight:500,cursor:"pointer",display:"flex",alignItems:"center",gap:6,transition:"all 0.2s"}}
          onMouseEnter={e=>{e.currentTarget.style.borderColor=C.green;e.currentTarget.style.color=C.green;e.currentTarget.style.background=C.greenDim;}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.textMuted;e.currentTarget.style.background="transparent";}}>
          ⬇ Download as PDF
        </button>
      </div>
    )}
  </>;
})()}</div></div>))}{loading&&<div style={{display:"flex",gap:8,alignItems:"flex-start"}}><div style={{width:26,height:26,borderRadius:6,flexShrink:0,marginTop:2,background:C.greenDim,border:`1px solid ${C.greenBorder}`,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{fontFamily:"'DM Serif Display',serif",fontSize:11,color:C.green,fontWeight:400}}>A</div></div><div style={{padding:"10px 14px",borderRadius:"10px 10px 10px 2px",background:"rgba(255,255,255,0.03)",border:`1px solid ${C.border}`,display:"flex",gap:5}}>{[0,1,2].map(d=><div key={d} style={{width:6,height:6,borderRadius:"50%",background:C.green,opacity:0.3,animation:`p 1.2s ease-in-out ${d*0.2}s infinite`}}/>)}</div></div>}{err&&<div style={{padding:"8px 12px",borderRadius:6,background:"rgba(224,96,96,0.08)",border:"1px solid rgba(224,96,96,0.15)",color:C.red,fontSize:12}}>{err}</div>}<div ref={endRef}/></div>{msgs.length<=1&&currentUnit&&<div style={{padding:"0 14px 8px",display:"flex",gap:6,flexWrap:"wrap"}}>{currentUnit.prompts.map((p,i)=>(<button key={i} onClick={()=>{setInput(p);setTimeout(()=>inputRef.current?.focus(),50);}} style={{padding:"5px 12px",borderRadius:4,border:`1px solid ${C.border}`,background:"transparent",color:C.textDim,fontSize:11,cursor:"pointer",transition:"all 0.2s"}} onMouseEnter={e=>{e.target.style.borderColor=C.green;e.target.style.color=C.green;}} onMouseLeave={e=>{e.target.style.borderColor=C.border;e.target.style.color=C.textDim;}}>{p}</button>))}</div>}<div style={{padding:"8px 14px 14px",borderTop:`1px solid ${C.border}`,background:C.bg,flexShrink:0}}><div style={{display:"flex",gap:8,alignItems:"flex-end",background:C.bgInput,border:`1px solid ${C.border}`,borderRadius:8,padding:"3px 3px 3px 14px"}}><textarea ref={inputRef} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}} placeholder={currentUnit.placeholder} rows={1} style={{flex:1,border:"none",outline:"none",resize:"none",background:"transparent",color:C.text,fontFamily:"'Outfit',sans-serif",fontSize:13.5,padding:"8px 0",lineHeight:1.5,maxHeight:100,overflow:"auto"}}/><button onClick={send} disabled={!input.trim()||loading} style={{width:34,height:34,borderRadius:6,border:"none",cursor:input.trim()&&!loading?"pointer":"default",background:input.trim()&&!loading?C.green:"rgba(255,255,255,0.04)",color:input.trim()&&!loading?C.bg:C.textDim,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:700,flexShrink:0,transition:"all 0.2s"}}>↑</button></div><div style={{textAlign:"center",marginTop:6,fontSize:9.5,color:C.textDim}}>Powered by AGF Tutoring · Grounded in curated notes</div></div><style>{CSS}</style></div>);
}
