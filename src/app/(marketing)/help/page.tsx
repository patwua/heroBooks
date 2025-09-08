import Link from "next/link";

export const metadata = { title: "Help & FAQ - heroBooks" };

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <header className="mb-10">
        <h1 className="text-3xl font-bold">Help & FAQ</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          A single place for getting started, understanding Guyana-specific taxes, and using heroBooks effectively as we scale across the Caribbean.
        </p>
      </header>

      {/* Getting Started */}
      <section className="border rounded-2xl p-6">
        <h2 className="text-xl font-semibold">Getting Started with heroBooks</h2>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-sm text-muted-foreground">
          <li>heroBooks is built for individuals and SMEs in Guyana with VAT, payroll and reporting built-in, and we’re scaling across the Caribbean.</li>
          <li>Create an account, set your business profile, then invite your team with role-based permissions.</li>
          <li>Start with invoicing and expenses; connect payroll later—the system calculates PAYE & NIS automatically.</li>
        </ul>
      </section>

      {/* Platform Navigation */}
      <section className="mt-8 border rounded-2xl p-6">
        <h2 className="text-xl font-semibold">Navigating the Platform</h2>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-sm text-muted-foreground">
          <li>
            <span className="font-medium text-foreground">Dashboard</span>: KPIs, cash flow, upcoming obligations.
          </li>
          <li>
            <span className="font-medium text-foreground">Transactions</span>: import statements, auto-categorize expenses.
          </li>
          <li>
            <span className="font-medium text-foreground">Invoicing</span>: send VAT-ready invoices and track overdue balances.
          </li>
          <li>
            <span className="font-medium text-foreground">Payroll</span>: salaries, PAYE and NIS with statutory caps.
          </li>
        </ul>
      </section>

      {/* Taxes & Statutory Deductions (Guyana) */}
      <section className="mt-8 border rounded-2xl p-6">
        <h2 className="text-xl font-semibold">Taxes & Statutory Deductions (Guyana)</h2>
        <div className="mt-3 space-y-4 text-sm text-muted-foreground">
          <div>
            <h3 className="font-medium text-foreground">PAYE (2025 rules)</h3>
            <p>
              First G$3.12M at 25%, remainder at 35%; tax-free threshold ~G$130k/month. Personal deduction is the
              greater of G$1.56M or one-third of chargeable income. Child allowance up to G$10k/month per child.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-foreground">NIS Contributions</h3>
            <p>Employee 5.6% and Employer 8.4% with a monthly earnings cap; self-employed 12.5%.</p>
          </div>
          <div>
            <h3 className="font-medium text-foreground">VAT & Other Taxes</h3>
            <p>
              VAT 14% (registration required over G$15M turnover). Property tax progressive tiers; capital gains generally
              20% with exemptions.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-foreground">Corporate Tax</h3>
            <p>
              Non-commercial 25%; commercial 40%; some sectors higher. Withholding typically 20% to non-residents
              (treaties/exceptions may apply).
            </p>
          </div>
          <div>
            <h3 className="font-medium text-foreground">Chart of Accounts Tips</h3>
            <p>
              Use simple numbering (1000 assets, 2000 liabilities, 3000 equity, 4000 income, 5000+ expenses). Add
              sub-accounts only when needed.
            </p>
          </div>
        </div>
      </section>

      {/* AI Assistant */}
      <section className="mt-8 border rounded-2xl p-6">
        <h2 className="text-xl font-semibold">Using the AI Assistant</h2>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-sm text-muted-foreground">
          <li>Set reminders for filings and payments; let AI summarize monthly VAT/PAYE.</li>
          <li>Upload documents for OCR and data extraction; always review before filing.</li>
          <li>AI is assistive—consult a professional for complex or edge-case scenarios.</li>
        </ul>
      </section>

      {/* FAQs */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold">FAQs</h2>
        <div className="mt-4 space-y-3">
          {[
            {
              q: "When do I start paying PAYE in 2025?",
              a: "From Jan 1, 2025: first G$3.12M at 25%, remainder at 35%.",
            },
            {
              q: "What deductions can I claim?",
              a: "Greater of G$1.56M or one-third of chargeable income; child allowance up to G$10k/month per child.",
            },
            {
              q: "Do I need to register for VAT?",
              a: "Yes if annual turnover exceeds G$15M; heroBooks can prep your returns.",
            },
            {
              q: "How does property tax work?",
              a: "0% on first G$40M net property, 0.5% on next G$20M, 0.75% thereafter.",
            },
            {
              q: "Capital gains on selling a house?",
              a: "Generally 20%—exemptions may apply based on holding period/thresholds.",
            },
            {
              q: "Corporate tax rates?",
              a: "Non-commercial 25%; commercial 40%; some sectors higher.",
            },
          ].map((f, i) => (
            <details key={i} className="rounded-xl border p-4">
              <summary className="cursor-pointer text-foreground">{f.q}</summary>
              <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}

