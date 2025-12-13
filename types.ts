
export type ViewerType = "founder" | "recruiter" | "team_member" | "client" | "self";

export interface Attachment {
  id: string;
  name: string;
  mimeType: string;
  data: string; // Base64 string
}

export interface DiagnosticInputs {
  identity: string;
  workTraces: string;
  friction: string;
  failures: string;
  preferences: string;
  nonNegotiables: string;
  background: string;
}

export interface EvidenceItem {
  claim: string;
  evidence: string[];
  confidence: "high" | "medium" | "low";
}

export interface TimelineEvent {
  horizon: "2_weeks" | "3_months" | "6_months";
  effects: EvidenceItem[];
}

export interface ContextItem {
  context: string;
  why?: string;
  failure_pattern?: string;
  evidence: string[];
}

export interface FailureMode {
  mode: string;
  trigger: string;
  symptom: string;
  mitigation: string;
}

export interface Tradeoff {
  tradeoff: string;
  upside: string;
  cost: string;
}

export interface ViewerLens {
  title: string;
  bullets: string[];
}

export interface ProofHook {
  claim_to_validate: string;
  how_to_check: string;
}

export interface Confidence {
  overall: "high" | "medium" | "low";
  notes: string;
}

export interface AntiPortfolioData {
  meta: {
    viewer: ViewerType;
    language: string;
    version: string;
  };
  subject: {
    name: string;
    role: string;
    location: string;
    experience: string;
  };
  headline: string;
  diagnosis_summary: string[];
  systemic_effects_timeline: TimelineEvent[];
  best_fit_contexts: ContextItem[];
  toxic_contexts: ContextItem[];
  failure_modes: FailureMode[];
  tradeoffs: Tradeoff[];
  dont_work_with_me_if: string[];
  viewer_lens_section: ViewerLens;
  proof_hooks: ProofHook[];
  confidence: Confidence;
}
