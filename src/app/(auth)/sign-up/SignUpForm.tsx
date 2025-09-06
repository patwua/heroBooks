'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import type { Plan } from '@/lib/plans';

export default function SignUpForm({ initialPlan, demo }: { initialPlan: Plan; demo: boolean }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const email = form.get('email');
    const password = form.get('password');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.error || 'Registration failed');
        setLoading(false);
        return;
      }
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      if (result?.error) {
        setError(result.error);
        setLoading(false);
        return;
      }
      const nextUrl = demo
        ? '/continue-demo'
        : initialPlan === 'business'
        ? '/checkout?plan=business'
        : '/dashboard';
      router.push(nextUrl);
    } catch (e: any) {
      setError('Registration failed');
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <input type="hidden" name="plan" value={initialPlan} />
      {demo && <input type="hidden" name="demo" value="1" />}
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
        {loading ? 'Creating account…' : 'Create account'}
      </button>
      <p className="text-xs text-muted-foreground">
        By creating an account, you agree to our <a className="underline" href="/legal/terms">Terms</a> and
        <a className="underline" href="/legal/privacy">Privacy Policy</a>.
      </p>
    </form>
  );
}

