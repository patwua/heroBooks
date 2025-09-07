import Link from "next/link";

const featureSections = [
  {
    id: "reports",
    title: "Real-time reports",
    desc: "Dashboards and statements that update the moment your books do.",
  },
  {
    id: "payroll",
    title: "Payroll & NIS",
    desc: "Handle PAYE, NIS, and deductions without complex spreadsheets.",
  },
  {
    id: "vat",
    title: "VAT compliance",
    desc: "Generate VAT-14 and track zero-rated sales with ease.",
  },
  {
    id: "banking",
    title: "Bank reconciliation",
    desc: "Connect accounts and reconcile transactions in minutes.",
  },
  {
    id: "multicurrency",
    title: "Multi-currency",
    desc: "Bill and report in USD, GYD, and more without confusion.",
  },
];

export default function FeaturesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-10">Why heroBooks</h1>
      <div className="space-y-16">
        {featureSections.map((f) => (
          <section key={f.id} id={f.id}>
            <h2 className="text-2xl font-semibold">{f.title}</h2>
            <p className="mt-2 text-muted-foreground">{f.desc}</p>
          </section>
        ))}
      </div>
      <div className="mt-16 text-center">
        <Link href="/get-started" className="rounded-md bg-primary px-6 py-3 text-primary-foreground">
          Start a free trial
        </Link>
      </div>
    </div>
  );
}
