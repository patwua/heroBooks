'use client';
export const dynamic = 'force-dynamic';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getCsrfToken } from 'next-auth/react';

export default function SignInPage() {
  const searchParams = useSearchParams();
  const exists = searchParams.get('exists') === '1';
  const reset = searchParams.get('reset') === '1';

  const [csrfToken, setCsrfToken] = useState<string | undefined>();
  const [showContinueDemo, setShowContinueDemo] = useState(false);

  useEffect(() => {
    getCsrfToken().then((token) => setCsrfToken(token ?? undefined));
    const getCookie = (name: string) =>
      document.cookie
        .split('; ')
        .find((row) => row.startsWith(name + '='))?.split('=')[1];
    const hadDemoBefore =
      getCookie('hb_demo') === '1' || Boolean(getCookie('hb_demo_last'));
    setShowContinueDemo(reset || hadDemoBefore);
  }, [reset]);

  const oauthCallback = showContinueDemo ? '/continue-demo' : '/dashboard';

  return (
    <Suspense fallback={null}>
      <section className="container mx-auto px-4 py-12 max-w-md">
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <p className="text-sm text-muted-foreground mt-1">
          New here? <a className="underline" href="/sign-up">Create an account</a>
        </p>
        {exists && (
          <div className="mt-3 text-sm text-amber-600">
            Account already exists — try signing in.
          </div>
        )}

        {showContinueDemo && (
          <div className="mt-4 flex items-center gap-2 text-xs">
            <span className="rounded-full border px-2 py-1 bg-amber-50 text-amber-900 dark:bg-amber-900/30 dark:text-amber-200">
              Continue demo
            </span>
            <span className="text-muted-foreground">
              After sign-in, we’ll drop you back into the demo.
            </span>
          </div>
        )}

        <form action="/api/auth/callback/credentials" method="POST" className="mt-6 space-y-4">
          <input type="hidden" name="csrfToken" value={csrfToken} />
          <div className="grid gap-2">
            <label className="text-sm">Email</label>
            <input name="email" type="email" required className="rounded-md border bg-background px-3 py-2 text-sm" placeholder="you@company.gy" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm">Password</label>
            <input name="password" type="password" required className="rounded-md border bg-background px-3 py-2 text-sm" placeholder="••••••••" />
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <button className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm">Sign in</button>

            {showContinueDemo && (
              <button
                type="submit"
                formAction="/api/auth/callback/credentials?callbackUrl=/continue-demo"
                className="rounded-md border px-4 py-2 text-sm"
                title="Sign in and return to demo"
              >
                Sign in & continue demo
              </button>
            )}

            <a className="text-sm underline text-muted-foreground" href="/forgot-password">
              Forgot password?
            </a>
          </div>
        </form>

        {/* Google OAuth with callbackUrl respecting Continue demo */}
        <div className="mt-6">
          <a
            className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm w-full"
            href={`/api/auth/signin/google?callbackUrl=${encodeURIComponent(oauthCallback)}`}
            title={showContinueDemo ? 'Sign in with Google & continue demo' : 'Sign in with Google'}
          >
            Continue with Google
          </a>
        </div>
      </section>
    </Suspense>
  );
}
