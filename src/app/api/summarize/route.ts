import { auth } from "@/lib/auth";
import { supabase, useCredit, createDocument, saveSummary } from "@/lib/supabase";
import { summarizeText, validateSummary } from "@/lib/claude";
import { SummarizeRequest, SummarizeResponse } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse<SummarizeResponse>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body: SummarizeRequest = await request.json();
    const { document_id, text, mode, word_limit } = body;

    if (!text && !document_id) {
      return NextResponse.json(
        { success: false, error: "Text or document_id required" },
        { status: 400 }
      );
    }

    let originalText = text;
    if (document_id) {
      const doc = await supabase
        .from('documents')
        .select('original_text')
        .eq('id', document_id)
        .single();

      if (doc.error) throw doc.error;
      originalText = doc.data?.original_text;
    }

    const { data: userData } = await supabase
      .from('users')
      .select('plan')
      .eq('id', session.user.id)
      .single();

    const userPlan = userData?.plan;
    const wordCount = originalText!.split(/\s+/).length;

    if (userPlan === 'free' && wordCount > 5000) {
      return NextResponse.json(
        { success: false, error: "Text exceeds free tier limit (5000 words)" },
        { status: 400 }
      );
    }

    let creditsRemaining;
    try {
      const creditResult = await useCredit(session.user.id);
      creditsRemaining = creditResult.remaining;
    } catch (creditError: any) {
      if (creditError.message.includes('blocked')) {
        const { data: credits } = await supabase
          .from('credits')
          .select('blocked_until')
          .eq('user_id', session.user.id)
          .single();

        return NextResponse.json(
          {
            success: false,
            error: "No credits available",
            blocked_until: credits?.data?.blocked_until,
          },
          { status: 429 }
        );
      }
      throw creditError;
    }

    console.log(`[SUMMARIZE] Starting for mode: ${mode}`);

    const summary = await summarizeText(originalText!, mode, word_limit);

    console.log(`[SUMMARIZE] Completed`);

    const validation = await validateSummary(originalText!, summary);

    let docId = document_id;
    if (!docId && text) {
      const doc = await createDocument(
        session.user.id,
        `Resumen - ${new Date().toLocaleDateString()}`,
        originalText!
      );
      docId = doc.id;
    }

    const savedSummary = await saveSummary(
      docId!,
      mode,
      summary,
      summary.metadata.total_tokens,
      validation.confidence_score || summary.metadata.overall_confidence || 0.85
    );

    return NextResponse.json(
      {
        success: true,
        summary: savedSummary,
        credits_remaining: creditsRemaining,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[SUMMARIZE] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
