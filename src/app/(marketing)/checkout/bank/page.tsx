import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function BankInstructionsPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const intent = (Array.isArray(searchParams?.intent) ? searchParams.intent[0] : searchParams?.intent) ?? "";
  const rec = intent ? await prisma.checkoutIntent.findUnique({ where: { id: intent } }) : null;

  return (
    <section className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-2xl font-semibold">Bank Transfer (EFT/RTGS)</h1>
      <p className="text-sm text-muted-foreground mt-1">Use the reference below so we can match your payment automatically.</p>

      <div className="rounded-xl border p-6 mt-6 grid gap-3 text-sm">
        <div className="flex items-center justify-between"><span>Reference</span><code className="font-mono">{intent || "—"}</code></div>
        <div className="flex items-center justify-between"><span>Payee</span><span>heroBooks (HeroCart Inc.)</span></div>
        <div className="flex items-center justify-between"><span>Bank</span><span>{process.env.BANK_NAME ?? "—"}</span></div>
        <div className="flex items-center justify-between"><span>Account #</span><span>{process.env.BANK_ACCOUNT ?? "—"}</span></div>
        <div className="flex items-center justify-between"><span>Amount (GYD)</span><span>{rec ? `GYD $${rec.amount.toLocaleString()}` : "See checkout"}</span></div>
        <p className="text-xs text-muted-foreground">
          Email your transfer confirmation to <a className="underline" href="mailto:billing@herobooks.net">billing@herobooks.net</a>. Activation occurs after funds are received.
        </p>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <Link href="/pricing" className="rounded-md border px-4 py-2 text-sm">Back to pricing</Link>
        <Link href="/checkout" className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm">Use a different method</Link>
      </div>
    </section>
  );
}
