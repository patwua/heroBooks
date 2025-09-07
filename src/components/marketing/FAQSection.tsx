export default function FAQSection() {
  const faqs = [
    {
      q: "Is heroBooks built for Guyana?",
      a: "Yes—VAT, PAYE, and NIS are supported across plans with local rules in mind.",
    },
    {
      q: "Can I import my existing data?",
      a: "Yes. Start with CSV/OFX bank files and spreadsheet imports for customers, vendors, and items.",
    },
    {
      q: "Do I need an accountant to use heroBooks?",
      a: "No, but it helps. You can invite your accountant with read-only or role-based access.",
    },
    {
      q: "How do VAT invoices work?",
      a: "Create an invoice and select applicable VAT. heroBooks applies rates and posts to the correct accounts.",
    },
    {
      q: "Can I track costs for each vehicle (dealers)?",
      a: "Yes—attach purchase, duty, and reconditioning to units to get true COGS and margins.",
    },
    {
      q: "Does payroll include PAYE and NIS?",
      a: "Yes—enable payroll basics, set thresholds, and we calculate PAYE/NIS on each run.",
    },
    {
      q: "What reports are included?",
      a: "Profit & Loss, Balance Sheet, Sales & Purchases, VAT summary, and more depending on plan.",
    },
    {
      q: "Can I switch plans later?",
      a: "Anytime. Your data stays intact when upgrading or downgrading.",
    },
    {
      q: "How does the demo work?",
      a: "Explore with sample data. You can reset or switch to your live org when ready.",
    },
    {
      q: "Do you have an API?",
      a: "Yes—Pro includes an API to plug into dealer or service workflows.",
    },
    {
      q: "Is my data secure?",
      a: "We use modern encryption, role-based access, and audit logging. See our Security page.",
    },
    {
      q: "How do I get support?",
      a: "Use the in-app Assistance Sidebar, email support, or request a callback for Pro.",
    },
  ];
  return (
    <section id="faq" className="border-t">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold">Frequently asked questions</h2>
        <div className="mt-6 space-y-4">
          {faqs.map((item) => (
            <details key={item.q} className="group rounded-2xl border p-4">
              <summary className="cursor-pointer list-none font-medium">{item.q}</summary>
              <p className="mt-2 text-sm text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

