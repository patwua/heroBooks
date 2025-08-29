"use client";

import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await signIn("credentials", { email, password });
  };

  return (
    <div className="p-8">
      <h1 className="mb-4 text-xl">Sign in</h1>
      <form onSubmit={handleSubmit} className="mb-4 flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded border px-2 py-1"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded border px-2 py-1"
        />
        <button type="submit" className="rounded bg-blue-500 px-4 py-2 text-white">
          Sign in
        </button>
      </form>
      <button
        onClick={() => signIn("google")}
        className="rounded bg-red-500 px-4 py-2 text-white"
      >
        Sign in with Google
      </button>
    </div>
  );
}
