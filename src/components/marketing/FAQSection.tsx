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
  ];
  return (
    <section id="faq" className="border-t">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold">Frequently asked questions</h2>
        <div className="mt-6 space-y-3">
          {faqs.map((item) => (
            <details key={item.q} className="group rounded-2xl border p-3">
              <summary className="cursor-pointer list-none font-medium">
                {item.q}
              </summary>
              <p className="mt-2 text-sm text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

