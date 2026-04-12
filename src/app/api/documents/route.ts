import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: documents, error } = await supabase
      .from('documents')
      .select('*, summaries:summaries(*)')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(documents);
  } catch (error) {
    console.error('[GET DOCUMENTS] Error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, text } = body;
    const wordCount = text.split(/\s+/).length;

    const { data: document, error } = await supabase
      .from('documents')
      .insert({
        user_id: session.user.id,
        title,
        original_text: text,
        word_count: wordCount,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(document);
  } catch (error) {
    console.error('[CREATE DOCUMENT] Error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
