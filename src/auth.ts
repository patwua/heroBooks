import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import authConfig from "@/lib/auth.config"

// v5 unified server auth helpers
export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma as any),
  ...authConfig,
})
