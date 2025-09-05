"use client";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  return (
    <main className="min-h-screen grid place-items-center px-6">
      <div className="w-full max-w-sm rounded-2xl border border-slate-800 p-6 bg-slate-900/40">
        <h1 className="text-xl font-semibold">Sign in</h1>
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
          <Button className="w-full" type="submit">
            Continue
          </Button>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </form>
        <Button
          className="w-full mt-3"
          variant="outline"
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        >
          Continue with Google
        </Button>
        <p className="mt-4 text-xs text-slate-400">
          No account? <Link href="/sign-up" className="underline">Sign up</Link>
        </p>
      </div>
    </main>
  );
}
