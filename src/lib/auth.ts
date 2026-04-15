import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _supabase: SupabaseClient | null = null;
function getAuthSupabase(): SupabaseClient {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      throw new Error("Missing Supabase environment variables for auth");
    }
    _supabase = createClient(url, key);
  }
  return _supabase;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  pages: {
    signIn: "/",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;

        const { data: userPlan } = await getAuthSupabase()
          .from("users")
          .select("plan")
          .eq("id", token.sub)
          .single();

        if (userPlan) {
          session.user.plan = userPlan.plan || "free";
        }
      }
      return session;
    },
    async signIn({ user }) {
      if (!user.id) return false;

      const { data: existingUser } = await getAuthSupabase()
        .from("users")
        .select("id")
        .eq("id", user.id)
        .single();

      if (!existingUser) {
        await getAuthSupabase().from("users").insert({
          id: user.id,
          email: user.email,
          name: user.name,
          plan: "free",
          avatar_url: user.image,
        });

        await getAuthSupabase().from("credits").insert({
          user_id: user.id,
          total_monthly: 5,
          used: 0,
          reset_date: new Date(
            new Date().getFullYear(),
            new Date().getMonth() + 1,
            1
          ),
        });
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
};
