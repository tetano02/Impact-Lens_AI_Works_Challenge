import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION, RESPONSE_SCHEMA } from "../constants";
import { AntiPortfolioData, ViewerType, DiagnosticInputs } from "../types";

export const generateDiagnostic = async (
  inputs: DiagnosticInputs,
  viewer: ViewerType
): Promise<AntiPortfolioData> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
Viewer lens: ${viewer}
Language: it
Version: v1.1

You will receive structured raw input collected through a multi-section interface.
Each section represents a different type of long-term signal.

The input does NOT represent a single moment in time,
but an accumulation of traces over the person’s professional life.

Your task:
Synthesize these signals into a DIAGNOSTIC ANTI-PORTFOLIO JSON,
strictly adhering to the schema.

━━━━━━━━━━━━━━━━━━
INPUT SECTIONS
━━━━━━━━━━━━━━━━━━

SECTION A — WORK TRACES
(Descriptions of projects, products, decisions, outcomes, artifacts, links)
${inputs.workTraces || "No data provided."}

SECTION B — FRICTION & CONFLICT
(Repeated tensions, conflicts with people or systems, things that “never worked”)
${inputs.friction || "No data provided."}

SECTION C — FAILURES & REGRETS
(Explicit failures, things that went wrong, lessons that still hurt)
${inputs.failures || "No data provided."}

SECTION D — STRONG PREFERENCES
(What this person consistently likes, hates, avoids, or insists on)
${inputs.preferences || "No data provided."}

SECTION E — NON-NEGOTIABLES
(Rules, boundaries, principles they refuse to break)
${inputs.nonNegotiables || "No data provided."}

SECTION F — OPTIONAL BACKGROUND SIGNALS
(CV text, LinkedIn export, bios — treat as LOW-SIGNAL metadata only)
${inputs.background || "No data provided."}

━━━━━━━━━━━━━━━━━━
CONSTRAINTS
━━━━━━━━━━━━━━━━━━

- Convert achievements into SYSTEMIC EFFECTS and TRADE-OFFS.
- Include at least 2 EDGE CASES where the person underperforms.
- For each major claim, include 1–3 evidence snippets.
- Avoid generic praise and buzzwords.
- Do NOT surface job titles, timelines, or company names.
- If signals conflict, surface the tension instead of resolving it.
- Lower confidence explicitly when needed.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        temperature: 0.7,
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as AntiPortfolioData;
    } else {
      throw new Error("No text returned from Gemini");
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};