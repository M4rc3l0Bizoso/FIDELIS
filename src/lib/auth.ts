import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { SupabaseAdapter } from "@next-auth/supabase-adapter";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/",
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;

        const { data: userPlan } = await supabase
          .from('users')
          .select('plan')
          .eq('id', user.id)
          .single();

        if (userPlan) {
          session.user.plan = userPlan.plan || 'free';
        }
      }
      return session;
    },
    async signIn({ user }) {
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!existingUser) {
        await supabase.from('users').insert({
          id: user.id,
          email: user.email,
          name: user.name,
          plan: 'free',
          avatar_url: user.image,
        });

        await supabase.from('credits').insert({
          user_id: user.id,
          total_monthly: 5,
          used: 0,
          reset_date: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        });
      }

      return true;
    },
  },
});
