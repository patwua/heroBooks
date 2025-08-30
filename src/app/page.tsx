import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <div className="flex items-center gap-3">
          <Image src="/logo.svg" width={40} height={40} alt="heroBooks"/>
          <h1 className="text-3xl font-semibold">heroBooks</h1>
        </div>
        <p className="mt-6 max-w-2xl text-slate-300">
          Modern, multi-tenant accounting tailored for Guyana: VAT-ready invoices, clean reports,
          and an API to plug into your dealer system.
        </p>
        <div className="mt-8 flex gap-3">
          <Link href="/sign-up"><Button>Get started</Button></Link>
          <Link href="/pricing"><Button variant="outline">Pricing</Button></Link>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {["VAT-ready invoicing", "Double-entry ledger", "Clean API"].map((t) => (
            <div key={t} className="rounded-2xl border border-slate-800 p-6 bg-slate-900/40">
              <h3 className="font-medium">{t}</h3>
              <p className="mt-2 text-sm text-slate-400">Built for compliance and speed.</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
