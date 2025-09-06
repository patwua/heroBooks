"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { normalizePlan, type Plan } from "@/lib/plans";

export default function SignUpPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const raw = Array.isArray(searchParams?.plan)
    ? searchParams.plan[0]
    : searchParams?.plan ?? null;
  const initialPlan: Plan = normalizePlan(raw);
  const demo =
    (Array.isArray(searchParams?.demo)
      ? searchParams.demo[0]
      : searchParams?.demo) === "1";

  const [plan, setPlan] = useState<Plan>(initialPlan);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, plan, demo }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data?.error ?? "Registration failed");
      return;
    }
    const signInRes = await signIn("credentials", { email, password, redirect: false });
    if (signInRes?.error) {
      setError(signInRes.error);
      return;
    }
    if (demo) {
      await fetch("/api/demo/enter", { method: "POST" });
      router.push("/dashboard");
      return;
    }
    alert("Account created!");
    if (plan === "starter") {
      router.push("/settings/profile");
    } else {
      router.push(`/checkout?plan=${plan}`);
    }
  }

  return (
    <section className="container mx-auto px-4 py-12 max-w-md">
      <h1 className="text-2xl font-semibold">Create your account</h1>
      <p className="text-sm text-muted-foreground mt-1">
        Start with the plan that fits—change anytime.{' '}
        <a className="underline" href="/sign-in">Already have an account? Sign in</a>
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {/* Plan picker */}
        <fieldset className="rounded-lg border p-4">
          <legend className="text-sm font-medium px-1">Plan</legend>
          <div className="mt-2 grid gap-2">
            {(["starter", "business", "enterprise"] as Plan[]).map((p) => (
              <label key={p} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="plan"
                  value={p}
                  checked={plan === p}
                  onChange={() => setPlan(p)}
                />
                <span className="capitalize">{p}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Carry demo intent forward */}
        {demo && <input type="hidden" name="demo" value="1" />}

        {/* Your existing fields */}
        <div className="grid gap-2">
          <label className="text-sm">Email</label>
          <input
            name="email"
            type="email"
            required
            className="rounded-md border bg-background px-3 py-2 text-sm"
            placeholder="you@company.gy"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="w-full rounded-md bg-primary text-primary-foreground py-2 text-sm font-medium">
          Create account
        </button>
        {error && <p className="text-sm text-red-500">{error}</p>}

        <p className="text-xs text-muted-foreground">
          By creating an account, you agree to our <a className="underline" href="/legal/terms">Terms</a> and
          <a className="underline" href="/legal/privacy">Privacy Policy</a>.
        </p>
      </form>
    </section>
  );
}
