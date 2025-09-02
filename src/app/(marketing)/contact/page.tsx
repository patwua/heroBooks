export const metadata = { title: "Contact — heroBooks" };

export default function ContactPage() {
  return (
    <section className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-2xl font-semibold">Contact</h1>
      <p className="text-muted-foreground mt-2">
        Questions on VAT, PAYE/NIS, or migrating from spreadsheets? We’re here to help.
      </p>
      <div className="mt-6 rounded-xl border bg-card p-6 space-y-3 text-sm">
        <div><span className="font-medium">Email:</span> billing@herobooks.net</div>
        <div><span className="font-medium">Support hours:</span> Mon–Fri, 9:00–17:00 GYT</div>
        <div><span className="font-medium">Docs:</span> Coming soon</div>
      </div>
    </section>
  );
}
