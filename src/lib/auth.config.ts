import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import { randomUUID } from "crypto";

const providers: NextAuthConfig["providers"] = [];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    })
  );
}

providers.push(
  Credentials({
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const { email, password } = credentials as {
        email?: string;
        password?: string;
      };
      if (!email || !password) return null;
      const normEmail = email.trim().toLowerCase();
      const user = await prisma.user.findUnique({ where: { email: normEmail } });
      if (!user || !user.passwordHash) {
        throw new Error("No user found");
      }
      const valid = await compare(password, user.passwordHash);
      if (!valid) {
        throw new Error("Invalid email or password");
      }
      return { id: user.id, email: user.email ?? undefined, name: user.name ?? undefined };
    },
  })
);

export const authConfig = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  providers,
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.uid = (user as any).id;
        token.email = user.email;
        token.name = user.name;
        if (!token.demoSessionId) token.demoSessionId = randomUUID();
      }
      // Allow session.update({ demo, orgId }) from /api/demo/*
      if (trigger === "update" && session) {
        if (typeof session.demo !== "undefined") token.demo = session.demo as boolean;
        if (typeof session.orgId === "string" || session.orgId === null) {
          token.orgId = (session.orgId as string) ?? undefined;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.uid as string | undefined;
        session.user.email = token.email as string | undefined;
        session.user.name = token.name as string | undefined;
      }
      (session as any).demo = token.demo ?? false;
      (session as any).orgId = token.orgId;
      (session as any).demoSessionId = token.demoSessionId;
      return session;
    },
  },
} satisfies NextAuthConfig;

export default authConfig;
