// USUARIO
export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  plan: 'free' | 'pro';
  created_at: string;
  updated_at: string;
}

// CRÉDITOS
export interface Credits {
  id: string;
  user_id: string;
  total_monthly: number;
  used: number;
  reset_date: string;
  blocked_until?: string;
}

// DOCUMENTO
export interface Document {
  id: string;
  user_id: string;
  title: string;
  original_text: string;
  word_count: number;
  file_path?: string;
  created_at: string;
}

// RESUMEN
export type SummaryMode = 'study' | 'brief' | 'deep' | 'conceptmap';

export interface Summary {
  id: string;
  document_id: string;
  mode: SummaryMode;
  summary_json: SummaryContent;
  tokens_used: number;
  confidence_score: number;
  created_at: string;
}

export interface SummaryContent {
  mode: SummaryMode;
  summary: {
    sections: SummarySection[];
    key_concepts: KeyConcept[];
    relationships: Relationship[];
    exam_questions: ExamQuestion[];
    ambiguities: Ambiguity[];
    trace_mapping: TraceMapping[];
  };
  metadata: {
    total_tokens: number;
    processing_time_ms: number;
    overall_confidence: number;
  };
}

export interface SummarySection {
  heading: string;
  content: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'AMBIGUOUS';
  source_paragraphs: number[];
  quotes: string[];
}

export interface KeyConcept {
  term: string;
  definition: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  source_paragraph: number;
}

export interface Relationship {
  concept_a: string;
  concept_b: string;
  relationship: string;
  evidence: string;
  source_paragraph: number;
}

export interface ExamQuestion {
  question: string;
  likely_answers: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  source_paragraph: number;
  confidence: number;
}

export interface Ambiguity {
  location: string;
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  suggestion: string;
}

export interface TraceMapping {
  summary_section_id: number;
  source_paragraph: number;
  confidence: number;
}

// REQUEST/RESPONSE
export interface SummarizeRequest {
  document_id?: string;
  text?: string;
  mode: SummaryMode;
  word_limit?: number;
}

export interface SummarizeResponse {
  success: boolean;
  summary?: Summary;
  error?: string;
  credits_remaining?: number;
  blocked_until?: string;
}

// VALIDACIÓN
export interface ValidationResult {
  is_valid: boolean;
  hallucinations: string[];
  unsupported_claims: string[];
  confidence_score: number;
  ambiguities: Ambiguity[];
  warnings: string[];
}

// SUSCRIPCIÓN
export interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id: string;
  stripe_subscription_id?: string;
  plan: 'free' | 'pro';
  status: 'active' | 'past_due' | 'canceled';
  current_period_start: string;
  current_period_end: string;
}
