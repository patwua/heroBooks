"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignIn({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const exists =
    (Array.isArray(searchParams?.exists)
      ? searchParams.exists[0]
      : searchParams?.exists) === "1";
  const reset =
    (Array.isArray(searchParams?.reset)
      ? searchParams.reset[0]
      : searchParams?.reset) === "1";

  return (
    <main className="min-h-screen grid place-items-center px-6">
      <div className="w-full max-w-sm rounded-2xl border border-slate-800 p-6 bg-slate-900/40">
        <h1 className="text-xl font-semibold">Sign in</h1>
        <p className="text-sm text-slate-400 mt-1">
          New here? <a className="underline" href="/sign-up">Create an account</a>
        </p>
        {exists && (
          <div className="mt-3 text-sm text-amber-600">
            Account already exists — try signing in.
          </div>
        )}
        {reset && (
          <div className="mt-3 text-sm text-green-600">
            Password updated. Please sign in.
          </div>
        )}
        <form
          className="mt-6 space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            setError("");
            const res = await signIn("credentials", { email, password, redirect: false });
            if (res?.error) {
              if (res.error === "No user found") {
                router.push("/sign-up");
                return;
              }
              setError(res.error);
            } else {
              router.push("/dashboard");
            }
          }}
        >
          <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <div className="flex items-center justify-between">
            <Button className="rounded-md px-4" type="submit">
              Sign in
            </Button>
            <a
              className="text-sm underline text-slate-400"
              href="/forgot-password"
            >
              Forgot password?
            </a>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </form>
        <Button
          className="w-full mt-3"
          variant="outline"
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        >
          Continue with Google
        </Button>
      </div>
    </main>
  );
}
