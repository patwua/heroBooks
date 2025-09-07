import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function ZelleInstructionsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const intent = (Array.isArray(params?.intent) ? params.intent[0] : params?.intent) ?? "";
  const rec = intent ? await prisma.checkoutIntent.findUnique({ where: { id: intent } }) : null;

  return (
    <section className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-2xl font-semibold">Pay with Zelle</h1>
      <p className="text-sm text-muted-foreground mt-1">Send your payment using the reference below, then we’ll confirm and activate your plan.</p>

      <div className="rounded-xl border p-6 mt-6 grid gap-3 text-sm">
        <div className="flex items-center justify-between"><span>Reference</span><code className="font-mono">{intent || "—"}</code></div>
        <div className="flex items-center justify-between"><span>Zelle to</span><span>{process.env.ZELLE_HANDLE ?? "your-zelle-email@example.com"}</span></div>
        <div className="flex items-center justify-between"><span>Amount (GYD)</span><span>{rec ? `GYD $${rec.amount.toLocaleString()}` : "See checkout"}</span></div>
        <p className="text-xs text-muted-foreground">
          After sending, email a screenshot or confirmation to <a className="underline" href="mailto:billing@herobooks.net">billing@herobooks.net</a> with the reference above. We’ll mark it paid promptly.
        </p>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <Link href="/pricing" className="rounded-md border px-4 py-2 text-sm">Back to pricing</Link>
        <Link href="/checkout" className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm">Use a different method</Link>
      </div>
    </section>
  );
}
