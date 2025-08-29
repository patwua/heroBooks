"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn("credentials", { email, password, callbackUrl: "/dashboard" });
  };

  return (
    <div className="mx-auto max-w-sm p-8">
      <h1 className="mb-4 text-xl font-bold">Sign In</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" className="w-full">Sign In</Button>
      </form>
      <div className="mt-4">
        <Button onClick={() => signIn("google")} className="w-full bg-red-600">
          Sign in with Google
        </Button>
      </div>
      <p className="mt-4 text-center text-sm">
        Don&apos;t have an account? <Link className="underline" href="/sign-up">Sign Up</Link>
      </p>
    </div>
  );
}
