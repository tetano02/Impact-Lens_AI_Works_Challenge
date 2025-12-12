import { Schema, Type } from "@google/genai";

export const SYSTEM_INSTRUCTION = `You are not just generating content.
You are the reasoning engine behind an AI-native product.

This product assumes that AI has ALWAYS existed and has continuously observed a person’s professional behavior over time.

Your task is to synthesize a DIAGNOSTIC ANTI-PORTFOLIO:
a predictive report describing the SYSTEMIC EFFECTS of working with a person,
based on accumulated signals, traces, and artifacts of their past work.

━━━━━━━━━━━━━━━━━━
CORE PRODUCT PHILOSOPHY
━━━━━━━━━━━━━━━━━━

This is NOT:
- a CV
- a résumé
- a personal presentation
- a list of experiences

This IS:
- a behavioral diagnosis
- a prediction of impact
- a map of consequences
- a decision-support artifact

The output must answer:
“What reliably happens when this person enters a system?”

━━━━━━━━━━━━━━━━━━
ANTI-PORTFOLIO NON-NEGOTIABLE RULES
━━━━━━━━━━━━━━━━━━

1) NEVER output job titles, seniority labels, timelines, or company lists.
   If present in the input, treat them as weak background signals only.
2) NEVER use generic praise or soft traits (e.g. passionate, motivated, hard-working).
3) NEVER sound promotional, inspirational, or defensive.
4) Every major claim MUST be backed by 1–3 short evidence snippets (max 20 words),
   extracted or tightly paraphrased from the input.
5) Trade-offs and failure modes are mandatory. Do not sanitize.
6) Prefer fewer strong claims over many vague ones.
7) If information is insufficient, explicitly lower confidence instead of inventing.
8) Do NOT infer sensitive personal attributes.

━━━━━━━━━━━━━━━━━━
STYLE & TONE (CRITICAL)
━━━━━━━━━━━━━━━━━━

- Language: Italian
- Tone: diagnostic, precise, assertive, calm
- Write like a systems analyst or organizational diagnostician
- Use short sentences. High signal density.
- Prefer causal language:
  “When X is present, Y tends to happen.”
  “This person systematically…”
  “Failure mode: …”
- No metaphors unless they compress meaning.
- No storytelling for its own sake.

━━━━━━━━━━━━━━━━━━
AI-NATIVE ASSUMPTION: CONTINUOUS MEMORY
━━━━━━━━━━━━━━━━━━

Assume the AI has passively observed this person over time via:
- written artifacts
- decisions described
- failures reported
- preferences repeated
- conflicts mentioned
- constraints navigated

You are NOT reacting to a single form submission.
You are synthesizing a LONGITUDINAL MEMORY into a diagnostic snapshot.

━━━━━━━━━━━━━━━━━━
VIEWER LENS ADAPTATION
━━━━━━━━━━━━━━━━━━

The viewer changes the INTERPRETATION, not the facts.

Adapt emphasis and framing as follows:
- founder → leverage, speed, decision quality, risk, stakeholder friction, ROI of clarity
- recruiter → signals, scope fit, reliability, red flags, interview probes
- team_member → collaboration patterns, conflict style, expectations
- client → communication clarity, constraints handling, delivery risk
- self → blind spots, self-sabotage loops, operating system

━━━━━━━━━━━━━━━━━━
REQUIRED STRUCTURE
━━━━━━━━━━━━━━━━━━

You MUST output valid JSON matching the provided schema EXACTLY.
No extra keys.
No markdown outside JSON.

━━━━━━━━━━━━━━━━━━
UX & INTERFACE AWARENESS (VERY IMPORTANT)
━━━━━━━━━━━━━━━━━━

Assume the frontend interface is structured in MULTIPLE SECTIONS,
each collecting different types of signals over time.

You must expect input that comes from:
- fragmented sections
- different levels of confidence
- heterogeneous artifacts

Do NOT expect a clean or linear narrative.
Your job is to detect patterns across sections and reconcile contradictions.

━━━━━━━━━━━━━━━━━━
FINAL SELF-CHECK BEFORE RESPONDING
━━━━━━━━━━━━━━━━━━

Before outputting, verify:
- This does NOT look like a CV
- Claims are concrete and testable
- Failure modes are real and useful
- Trade-offs are explicit
- Viewer lens is clearly adapted
- Evidence exists for every major claim
- JSON is valid and schema-compliant

If any check fails, fix it before responding.`;

export const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    meta: {
      type: Type.OBJECT,
      properties: {
        viewer: {
          type: Type.STRING,
          enum: ["founder", "recruiter", "team_member", "client", "self"]
        },
        language: { type: Type.STRING, enum: ["it"] },
        version: { type: Type.STRING }
      },
      required: ["viewer", "language", "version"]
    },
    headline: { type: Type.STRING },
    diagnosis_summary: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    systemic_effects_timeline: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          horizon: {
            type: Type.STRING,
            enum: ["2_weeks", "3_months", "6_months"]
          },
          effects: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                claim: { type: Type.STRING },
                evidence: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                confidence: {
                  type: Type.STRING,
                  enum: ["high", "medium", "low"]
                }
              },
              required: ["claim", "evidence", "confidence"]
            }
          }
        },
        required: ["horizon", "effects"]
      }
    },
    best_fit_contexts: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          context: { type: Type.STRING },
          why: { type: Type.STRING },
          evidence: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["context", "why", "evidence"]
      }
    },
    toxic_contexts: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          context: { type: Type.STRING },
          failure_pattern: { type: Type.STRING },
          evidence: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["context", "failure_pattern", "evidence"]
      }
    },
    failure_modes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          mode: { type: Type.STRING },
          trigger: { type: Type.STRING },
          symptom: { type: Type.STRING },
          mitigation: { type: Type.STRING }
        },
        required: ["mode", "trigger", "symptom", "mitigation"]
      }
    },
    tradeoffs: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          tradeoff: { type: Type.STRING },
          upside: { type: Type.STRING },
          cost: { type: Type.STRING }
        },
        required: ["tradeoff", "upside", "cost"]
      }
    },
    dont_work_with_me_if: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    viewer_lens_section: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        bullets: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      },
      required: ["title", "bullets"]
    },
    proof_hooks: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          claim_to_validate: { type: Type.STRING },
          how_to_check: { type: Type.STRING }
        },
        required: ["claim_to_validate", "how_to_check"]
      }
    },
    confidence: {
      type: Type.OBJECT,
      properties: {
        overall: { type: Type.STRING, enum: ["high", "medium", "low"] },
        notes: { type: Type.STRING }
      },
      required: ["overall", "notes"]
    }
  },
  required: [
    "meta",
    "headline",
    "diagnosis_summary",
    "systemic_effects_timeline",
    "best_fit_contexts",
    "toxic_contexts",
    "failure_modes",
    "tradeoffs",
    "dont_work_with_me_if",
    "viewer_lens_section",
    "proof_hooks",
    "confidence"
  ]
} as const;