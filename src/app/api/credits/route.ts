import { auth } from "@/lib/auth";
import { supabase, getUserCredits } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const credits = await getUserCredits(session.user.id);

    const resetDate = new Date(credits.reset_date);
    const now = new Date();

    if (now > resetDate && credits.blocked_until) {
      await supabase
        .from('credits')
        .update({
          used: 0,
          blocked_until: null,
          reset_date: new Date(now.getFullYear(), now.getMonth() + 1, 1),
        })
        .eq('user_id', session.user.id);

      return NextResponse.json({
        total_monthly: credits.total_monthly,
        used: 0,
        remaining: credits.total_monthly,
        blocked_until: null,
      });
    }

    return NextResponse.json({
      total_monthly: credits.total_monthly,
      used: credits.used,
      remaining: credits.total_monthly - credits.used,
      blocked_until: credits.blocked_until,
    });
  } catch (error) {
    console.error("[CREDITS] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
