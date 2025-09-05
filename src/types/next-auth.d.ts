import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      email?: string | null;
      name?: string | null;
    };
    demo?: boolean;
    orgId?: string;          // active org for the session (demo uses DEMO_ORG_ID)
    demoSessionId?: string;  // per-session UUID for demo isolation
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    uid?: string;
    email?: string | null;
    name?: string | null;
    demo?: boolean;
    orgId?: string;
    demoSessionId?: string;
  }
}

