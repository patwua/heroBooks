"use client";

import { signIn } from "next-auth/react";

export default function SignInPage() {
  return (
    <div className="mx-auto max-w-sm py-16">
      <h1 className="mb-6 text-2xl font-semibold">Sign in</h1>
      <button
        onClick={() => signIn("google", { callbackUrl: "/" })}
        className="w-full rounded-md border px-3 py-2"
      >
        Continue with Google
      </button>
      <p className="mt-4 text-sm text-gray-500">
        Accounts are created on first Google sign-in. There is no built-in “Sign up” route in NextAuth.
      </p>
    </div>
  );
}
