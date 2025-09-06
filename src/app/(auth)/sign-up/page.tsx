'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import SignUpForm from './SignUpForm';
import { normalizePlan, type Plan } from '@/lib/plans';

export default function SignUpPage() {
  const searchParams = useSearchParams();
  const raw = searchParams.get('plan');
  const initialPlan: Plan = normalizePlan(raw);
  const demo = searchParams.get('demo') === '1';

  const planPretty =
    initialPlan === 'starter' ? 'Starter' : initialPlan === 'business' ? 'Business' : 'Enterprise';

  const changePlanHref = `/pricing?next=/sign-up&highlight=${initialPlan}`;

  return (
    <section className="container mx-auto px-4 py-12 max-w-md">
      {/* Plan summary band */}
      <div className="rounded-md border bg-muted/40 p-3 text-sm flex items-center justify-between">
        <div>
          Selected plan: <b>{planPretty}</b>
        </div>
        <Link href={changePlanHref} className="underline text-muted-foreground">
          Change
        </Link>
      </div>

      <h1 className="text-2xl font-semibold mt-4">Create your account</h1>
      <p className="text-sm text-muted-foreground mt-1">
        Start with the plan that fits—change anytime.{" "}
        <a className="underline" href="/sign-in">
          Already have an account? Sign in
        </a>
      </p>

      <SignUpForm initialPlan={initialPlan} demo={demo} />
    </section>
  );
}

