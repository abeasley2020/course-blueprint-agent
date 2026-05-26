export const PROXY_URL = 'https://anthropic-proxyandrebeasley2012workersdev.andrebeasley2012.workers.dev'
export const MODEL = 'claude-sonnet-4-20250514'
export const MAX_TOKENS = 4000
export const TOOL = 'blueprint'
export const PASSPHRASE = 'CourseProduction2027!'

export const SYSTEM_PROMPT = `You are an expert instructional designer at Purdue University specializing in backward design. Given an ID brief from a faculty SME interview, generate a complete course blueprint with these sections:

1. Course Overview (title, audience, delivery format, estimated duration)
2. Course Outcomes mapped to Bloom's Taxonomy levels (use a table with columns: #, Course Outcome, Bloom Level)
3. Module Sequence (a table with columns: Module, Title, Module Outcomes (aligned to CO#), Activity Types, Seat Time — add a "Weeks" column for courses longer than 8 weeks)
4. Assessment Strategy (a table with columns: Type, Assessment, Aligned Outcomes, Weight — confirm every course outcome is assessed at least once)
5. Design Notes and Flags (gaps, risks, SME assumptions to verify, open questions the ID team should resolve)

Format in clean markdown with clear section headers. Use markdown tables for the outcomes, module sequence, and assessment plan. The two example exchanges below demonstrate the expected level of detail, structure, and tone — match them.`

const EXAMPLE_1_USER = `**Course / Program Name:** Introduction to Data Literacy for Managers

**Target Audience:** Mid-career professionals in marketing and operations, no prior statistics background

**ID Brief:**

Course rationale & format
- 6-week asynchronous course in the executive education portfolio
- Total seat time target: ~12 hours
- Goal: managers can interpret data dashboards and ask better questions of analysts; not to build models themselves

SME notes (Dr. Lin, Krannert)
- Has lecture-style slide decks and a sanitized retail sample dataset
- Wants short video segments (under 6 min) with talking-head + slides
- Wants weekly discussion prompts; comfortable being light-touch in forums
- Concerned about pacing for learners without quantitative background — wants a "math-light" tone

Open questions for the design phase
- Final project: group case study or individual deliverable?
- Should we include a glossary as a standalone module, or weave terms inline?`

const EXAMPLE_1_ASSISTANT = `# Course Blueprint — Introduction to Data Literacy for Managers

## 1. Course Overview

- **Title:** Introduction to Data Literacy for Managers
- **Audience:** Mid-career professionals in marketing and operations, no prior statistics background
- **Delivery format:** Asynchronous online, executive education
- **Estimated duration:** 6 weeks, ~12 hours total seat time (~2 hrs/week)

## 2. Course Outcomes (mapped to Bloom's Taxonomy)

| # | Course Outcome | Bloom Level |
|---|---|---|
| CO1 | Identify the data types and chart conventions used in common business dashboards | Understand |
| CO2 | Interpret a dashboard to summarize what it does and does not show about business performance | Apply |
| CO3 | Distinguish correlation from causation in everyday business-data claims | Analyze |
| CO4 | Critique a data-driven recommendation by surfacing assumptions, missing context, and limitations | Evaluate |

## 3. Module Sequence

| Module | Title | Module Outcomes (aligned to CO) | Activity Types | Seat Time |
|---|---|---|---|---|
| 1 | Why Data Literacy Matters | CO1 | Welcome video (4 min), reading, intro discussion | ~90 min |
| 2 | Reading a Dashboard | CO1, CO2 | 3 short videos, guided dashboard walkthrough, formative quiz | ~2 hr |
| 3 | Variables, Distributions, and Summary Stats — Without the Math | CO1, CO2 | Concept videos, applied exercise on the retail dataset, peer post | ~2.5 hr |
| 4 | Correlation, Causation, and What Dashboards Cannot Tell You | CO3 | Case-vignette video, mini-analysis assignment | ~2 hr |
| 5 | Asking Better Questions of Analysts | CO2, CO4 | Roleplay activity, peer-review discussion | ~2 hr |
| 6 | Putting It Together — A Dashboard Critique | CO2, CO3, CO4 | Final critique deliverable, instructor feedback | ~2 hr |

## 4. Assessment Strategy

| Type | Assessment | Aligned Outcomes | Weight |
|---|---|---|---|
| Formative | Module 2 dashboard-reading quiz (low stakes) | CO1, CO2 | 10% |
| Formative | Module 3 applied exercise (peer-reviewed) | CO2 | 15% |
| Formative | Module 5 "ask better questions" discussion post | CO2, CO4 | 15% |
| Summative | Mini-analysis assignment (Module 4) | CO3 | 20% |
| Summative | Final dashboard critique with written brief (Module 6) | CO2, CO3, CO4 | 40% |

All outcomes are assessed at least once. The final critique covers CO2–CO4; CO1 is covered by Module 2's quiz and Module 3's exercise.

## 5. Design Notes and Flags

- **Open question (SME flagged):** Final project is scoped as an individual critique in this draft. A group case-study variant would deepen CO4 (evaluation by debate) but adds coordination overhead in an async cohort. Recommend individual for v1 and revisiting after the first run.
- **Open question (SME flagged):** Glossary is woven inline (terms defined where first used) rather than standing as its own module — matches the SME's "math-light" tone goal.
- **Risk:** Module 3 ("without the math") is the most likely failure point for non-quantitative learners. Build an optional "if you want to go deeper" sidebar for learners who do have background.
- **SME assumption to verify:** The retail dataset assumes US e-commerce conventions. Confirm before the first cohort whether any learners will be international or in non-retail sectors that need a second dataset variant.
- **Production note:** All videos under 6 minutes per SME preference. Script before recording to keep that tight.`

const EXAMPLE_2_USER = `**Course / Program Name:** Strategic Decision Making Under Uncertainty

**Target Audience:** First-year MBA students; have completed the core statistics course

**ID Brief:**

Course rationale & format
- 15-week, 3-credit-hour online asynchronous elective in the Daniels School MBA
- Total seat time target: ~135 hours (typical 3-credit load)
- Goal: students can frame and analyze decisions under uncertainty using structured tools, and defend their reasoning in writing

SME notes (Prof. Martinez)
- Wants case-based teaching with decision-tree analysis as the backbone
- Existing materials: 8 case studies from the in-person version, prior course syllabus, sample student work
- Concerned about transferring "judgment formation" from live discussion to async format
- Wants weekly written reflection in addition to case work

Open questions for the design phase
- How do we assess collaborative reasoning when the course is fully async — discussion forums alone feel weak
- Is a capstone case (synthesis of multiple frameworks) better than a final exam?`

const EXAMPLE_2_ASSISTANT = `# Course Blueprint — Strategic Decision Making Under Uncertainty

## 1. Course Overview

- **Title:** Strategic Decision Making Under Uncertainty
- **Audience:** First-year MBA students with core stats completed
- **Delivery format:** Online asynchronous, MBA elective
- **Estimated duration:** 15 weeks, ~135 hours total seat time (3 credit hours)

## 2. Course Outcomes (mapped to Bloom's Taxonomy)

| # | Course Outcome | Bloom Level |
|---|---|---|
| CO1 | Decompose an ambiguous strategic decision into a structured choice with payoffs, probabilities, and stakeholders | Analyze |
| CO2 | Apply decision-tree, expected-value, and option-valuation tools to a business case | Apply |
| CO3 | Evaluate the quality of a recommendation by stress-testing assumptions and surfacing risk | Evaluate |
| CO4 | Compose a defensible written recommendation that integrates quantitative analysis with qualitative judgment | Create |
| CO5 | Critique peer reasoning constructively to sharpen one's own decision frame | Evaluate |

## 3. Module Sequence

| Module | Weeks | Title | Module Outcomes | Activity Types | Seat Time |
|---|---|---|---|---|---|
| 1 | 1 | Framing Decisions — Why Smart Leaders Choose Badly | CO1 | Intro video, reading, framing exercise | ~9 hr |
| 2 | 2–3 | Decision Trees and Expected Value | CO1, CO2 | Concept videos, two short case applications, peer review | ~18 hr |
| 3 | 4–5 | Probability in Practice — Subjective vs Frequentist | CO2 | Lecture videos, calibration exercises, discussion forum | ~18 hr |
| 4 | 6–7 | Real Options and Sequential Decisions | CO2, CO3 | Case study (Cluster A), written reflection | ~18 hr |
| 5 | 8–9 | Stakeholder Analysis and Risk | CO1, CO3 | Case study (Cluster B), peer-review discussion | ~18 hr |
| 6 | 10–11 | Behavioral Pitfalls and Cognitive Bias | CO3 | Lecture videos, reflection on prior decisions | ~18 hr |
| 7 | 12–13 | Integrating Frameworks — Multi-Tool Cases | CO2, CO3, CO4 | Case study (Cluster C), peer-review discussion | ~18 hr |
| 8 | 14–15 | Capstone — A Decision You Will Defend | CO1–CO5 | Capstone case deliverable, peer critique round | ~18 hr |

## 4. Assessment Strategy

| Type | Assessment | Aligned Outcomes | Weight |
|---|---|---|---|
| Formative | Weekly written reflection (1 page) | varies per module | 15% (collectively) |
| Formative | Calibration exercises (Module 3) | CO2 | 5% |
| Summative | Case Cluster A deliverable (Module 4) | CO2, CO3 | 15% |
| Summative | Case Cluster B deliverable (Module 5) | CO1, CO3 | 15% |
| Summative | Case Cluster C deliverable (Module 7) | CO2, CO3, CO4 | 20% |
| Summative | Capstone case + peer-critique round (Module 8) | CO1–CO5 | 30% |

CO5 is assessed primarily through the peer-critique rounds in Case Clusters B, C, and Capstone — converting the "async judgment" concern into a structured peer-review workflow.

## 5. Design Notes and Flags

- **SME concern addressed (judgment in async):** Replaced the in-person Socratic discussion with structured peer critique rounds tied to grades. Each major case cluster includes a "respond to two peers' frames with one structural critique" deliverable. This is the load-bearing design choice — review with SME before building.
- **Open question (SME flagged):** Final assessment is a capstone case rather than a final exam. Capstone integrates all five outcomes and produces an artifact students can use post-graduation; an exam would be faster to grade but lower-ceiling. Recommend capstone.
- **Open question (SME flagged):** Collaborative reasoning assessment is the peer-critique workflow above. If this proves insufficient after the first run, consider adding small (3–4 person) synchronous case-debate sessions as an optional addition.
- **Workload note:** 8 case studies across 15 weeks (one per Cluster A/B/C + capstone, plus shorter applications in Modules 2 and 4) — confirm this fits the SME's available materials. The brief mentions 8 cases; this draft uses 6 named case slots, leaving 2 cases in reserve.
- **SME assumption to verify:** Students have completed core stats and are comfortable with probability notation. If admission patterns shift, may need a Week 0 refresher unit.`

export const FEW_SHOT_MESSAGES = [
  { role: 'user', content: EXAMPLE_1_USER },
  { role: 'assistant', content: EXAMPLE_1_ASSISTANT },
  { role: 'user', content: EXAMPLE_2_USER },
  { role: 'assistant', content: EXAMPLE_2_ASSISTANT },
]

export function buildUserMessage({ brief, courseName, audience }) {
  return [
    courseName && `**Course / Program Name:** ${courseName}`,
    audience && `**Target Audience:** ${audience}`,
    `**ID Brief:**\n\n${brief}`,
  ]
    .filter(Boolean)
    .join('\n\n')
}
