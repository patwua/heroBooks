"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AuthDropdown({ onClose }: { onClose?: () => void }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const email = form.get("email");
    const password = form.get("password");
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }
    onClose?.();
    router.push("/dashboard");
  }

  return (
    <div className="absolute right-0 mt-2 w-72 rounded-md border bg-background p-4 shadow-md z-50">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid gap-2">
          <label className="text-sm">Email</label>
          <input
            name="email"
            type="email"
            required
            className="rounded-md border bg-background px-3 py-2 text-sm"
            placeholder="you@company.gy"
          />
        </div>
        <div className="grid gap-2">
          <label className="text-sm">Password</label>
          <input
            name="password"
            type="password"
            required
            className="rounded-md border bg-background px-3 py-2 text-sm"
            placeholder="••••••••"
          />
        </div>
        {error && <div className="text-sm text-red-600">{error}</div>}
        <button
          disabled={loading}
          className="w-full rounded-md bg-primary text-primary-foreground py-2 text-sm font-medium"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
      {(!loading || error) && (
        <div className="mt-3 space-y-2 text-center text-sm">
          <Link href="/forgot-password" className="block underline">
            Forgot password?
          </Link>
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full rounded-md border px-4 py-2"
          >
            Sign in with Google
          </button>
          <Link href="/sign-up" className="block underline">
            Create account
          </Link>
        </div>
      )}
    </div>
  );
}

