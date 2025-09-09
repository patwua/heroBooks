import NextAuth from "next-auth"
import authConfig from "@/lib/auth.config"

// v5 unified server auth helpers
export const { auth, handlers, signIn, signOut } = NextAuth(authConfig)
