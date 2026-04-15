import { createClient } from "@supabase/supabase-js";
import type { SummaryContent } from "@/types";

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables");
  }
  return createClient(supabaseUrl, supabaseKey);
}

export const supabase = (() => {
  try {
    return getSupabaseClient();
  } catch {
    // Return a proxy that throws on use - allows module to load at build time
    return new Proxy({} as ReturnType<typeof createClient>, {
      get() {
        throw new Error("Supabase client not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
      },
    });
  }
})();

export async function getDocument(documentId: string) {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('id', documentId)
    .single();

  if (error) throw error;
  return data;
}

export async function createDocument(
  userId: string,
  title: string,
  text: string
) {
  const wordCount = text.split(/\s+/).length;

  const { data, error } = await supabase
    .from('documents')
    .insert({
      user_id: userId,
      title,
      original_text: text,
      word_count: wordCount,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function saveSummary(
  documentId: string,
  mode: string,
  summaryJson: SummaryContent,
  tokensUsed: number,
  confidenceScore: number
) {
  const { data, error } = await supabase
    .from('summaries')
    .insert({
      document_id: documentId,
      mode,
      summary_json: summaryJson,
      tokens_used: tokensUsed,
      confidence_score: confidenceScore,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getUserCredits(userId: string) {
  const { data, error } = await supabase
    .from('credits')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data;
}

export async function deductCredit(userId: string) {
  const credits = await getUserCredits(userId);

  if (credits.blocked_until && new Date(credits.blocked_until) > new Date()) {
    throw new Error('User is blocked. Credits reset needed.');
  }

  if (credits.used >= credits.total_monthly) {
    const blockedUntil = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

    await supabase
      .from('credits')
      .update({ blocked_until: blockedUntil })
      .eq('user_id', userId);

    throw new Error('No credits available. Blocked for 24 hours.');
  }

  const { error } = await supabase
    .from('credits')
    .update({ used: credits.used + 1 })
    .eq('user_id', userId);

  if (error) throw error;

  return {
    remaining: credits.total_monthly - (credits.used + 1),
  };
}
