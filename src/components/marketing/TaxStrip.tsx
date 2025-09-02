export default function TaxStrip() {
  return (
    <div className="container mx-auto px-4">
      <div className="rounded-xl border bg-card p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
          <div className="font-medium">Built for Guyana</div>
          <ul className="flex flex-wrap items-center gap-3 text-muted-foreground">
            <li className="rounded-full border px-3 py-1">VAT 14% (standard / zero-rated / exempt)</li>
            <li className="rounded-full border px-3 py-1">PAYE</li>
            <li className="rounded-full border px-3 py-1">NIS</li>
            <li className="rounded-full border px-3 py-1">GRA-friendly exports</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
