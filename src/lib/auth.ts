import NextAuth from "next-auth";
import authConfig from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

export { authConfig, authConfig as authOptions } from "./auth.config";
