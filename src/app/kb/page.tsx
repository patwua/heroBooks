import Link from "next/link";
import Page from "@/components/UX/Page";
import SectionCard from "@/components/UX/SectionCard";
import taxonomy from "@/../kb/taxonomy.json";

export default function KbHome() {
  const cats = (taxonomy as any).categories ?? [];
  return (
    <Page
      title="Principles of Accounting"
      subtitle="Learn it. Run it. — Guyana-ready guides with citations."
    >
      <SectionCard>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-muted-foreground">
            Search tip: press <kbd>/</kbd> to jump to site search.
          </div>
          <div className="flex gap-3">
            <Link href="/continue-demo" className="inline-flex items-center rounded-xl border px-4 py-2 text-sm hover:bg-muted/40">Try the demo</Link>
            <Link href="/get-started" className="inline-flex items-center rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm hover:opacity-90">Start free</Link>
          </div>
        </div>
      </SectionCard>
      <SectionCard>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cats.map((c: any) => (
            <Link
              key={c.id}
              href={`/kb?cat=${c.id}`}
              className="group rounded-2xl border bg-card p-6 hover:shadow-md transition"
            >
              <div className="text-lg font-semibold">{c.name}</div>
              <div className="text-sm text-muted-foreground mt-1">Browse articles</div>
              <div className="mt-4 aspect-square rounded-xl bg-muted group-hover:bg-muted/70" />
            </Link>
          ))}
        </div>
      </SectionCard>
    </Page>
  );
}
