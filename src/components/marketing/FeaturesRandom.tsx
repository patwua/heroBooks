import { chooseNOnce } from "@/lib/randomize";

const ALL_FEATURES = [
  { title: "VAT-ready invoicing", text: "One-click VAT (14%), zero-rated & exempt items." },
  { title: "PAYE & NIS summaries", text: "Local payroll deductions made simple." },
  { title: "Double-entry ledger", text: "Solid accounting fundamentals built-in." },
  { title: "Bank import & reconcile", text: "CSV statements matched in seconds." },
  { title: "Custom sequences & branding", text: "Professional docs with your logo." },
  { title: "Clean API", text: "Plug into your dealer or POS system." },
  { title: "Trial Balance & P&L", text: "Reports your accountant expects." },
  { title: "Email invoicing & PDFs", text: "Send branded PDF invoices instantly." },
];

export default async function FeaturesRandom({
  count = 6,
}: {
  count?: number;
}) {
  const selected = await chooseNOnce("hb_features", ALL_FEATURES, count);

  return (
    <section id="features" className="mt-16 grid gap-6 sm:grid-cols-3">
      {selected.map((f) => (
        <div key={f.title} className="rounded-xl border p-6 bg-card">
          <div className="text-lg font-medium">{f.title}</div>
          <p className="text-sm text-muted-foreground mt-2">{f.text}</p>
        </div>
      ))}
    </section>
  );
}
