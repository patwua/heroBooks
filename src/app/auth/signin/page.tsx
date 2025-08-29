"use client";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  return (
    <div className="p-8">
      <h1 className="mb-4 text-xl">Sign in</h1>
      <button onClick={() => signIn()} className="rounded bg-blue-500 px-4 py-2 text-white">Sign in</button>
    </div>
  );
}
