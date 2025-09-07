import Link from "next/link";
import Image from "next/image";
import SectionCard from "@/components/UX/SectionCard";
import Page from "@/components/UX/Page";
import { asCssVars } from "@/lib/brand-tokens";
import aboutCopy from "@/lib/copy/about-herobooks";

export const metadata = {
  title: "About Us — heroBooks",
  description: "Simple, local-first accounting for Guyana. Learn about our mission, values, and team.",
};

export default function AboutPage() {
  const brandVars = asCssVars();
  const { hero, mission, whoWeAre, values, leadershipHighlights, standards, reachUs } = aboutCopy;

  return (
    <div style={brandVars as any}>
      <Page title={hero.title} subtitle={hero.subtitle}>
        <SectionCard id="about-mission" className="mb-8">
          <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold" style={{ background: "var(--brand-tag-bg)", color: "var(--brand-tag-text)" }}>{mission.tag}</span>
          <h2 className="mt-2 text-2xl font-bold">{mission.headline}</h2>
          <p className="mt-1 text-[15px] text-slate-600">{mission.body}</p>
          <ul className="mt-3 space-y-1 text-[15px] text-slate-700">
            {mission.bullets.map((b) => (<li key={b}>{b}</li>))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            {mission.ctas.map((c) => (
              <Link key={c.href} href={c.href} className={c.type === "primary" ? "rounded-xl bg-[var(--brand)] px-4 py-2 font-semibold text-white" : "rounded-xl border border-[var(--brand-light)] bg-[var(--brand-lighter)] px-4 py-2 font-semibold text-[var(--brand)]"}>
                {c.label}
              </Link>
            ))}
          </div>
        </SectionCard>

        <div className="mb-8 grid gap-8 lg:grid-cols-2">
          <SectionCard id="about-who-we-are">
            <h2 className="text-2xl font-bold">{whoWeAre.title}</h2>
            {whoWeAre.paragraphs.map((p, i) => (<p key={i} className="mt-2 text-[15px] text-slate-700">{p}</p>))}
          </SectionCard>
          <SectionCard id="about-values">
            <h2 className="text-2xl font-bold">{values.title}</h2>
            <p className="mt-2 text-[15px] text-slate-700">{values.subtitle}</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {values.items.map((v) => (
                <div key={v.t} className="rounded-2xl bg-white p-6 shadow">
                  <strong className="block">{v.t}</strong>
                  <p className="mt-1 text-[15px] text-slate-700">{v.d}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        <SectionCard id="about-leadership" className="mb-8">
          <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold" style={{ background: "var(--brand-tag-bg)", color: "var(--brand-tag-text)" }}>{leadershipHighlights.tag}</span>
          <h2 className="mt-2 text-2xl font-bold">{leadershipHighlights.title}</h2>
          <p className="mt-1 text-[15px] text-slate-700">{leadershipHighlights.subtitle}</p>
          <div className="mt-4 grid gap-6 sm:grid-cols-3">
            {leadershipHighlights.people.map((p) => (
              <article key={p.name} className="text-center">
                <Image src={p.photo} alt={p.name} width={96} height={96} className="mx-auto rounded-full object-cover" />
                <h3 className="mt-3 text-base font-semibold">{p.name}</h3>
                <p className="m-0 text-sm text-slate-600">{p.title}</p>
                <p className="mt-2 text-[15px] text-slate-700">{p.bio}</p>
              </article>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link href="/contact?subject=press" className="inline-block rounded-xl bg-black px-4 py-2 font-semibold text-white">→ {leadershipHighlights.cta}</Link>
          </div>
        </SectionCard>

        <div className="grid gap-8 lg:grid-cols-2">
          <SectionCard id="about-standards">
            <h2 className="text-2xl font-bold">{standards.title}</h2>
            <p className="mt-2 text-[15px] text-slate-700">{standards.intro}</p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-[15px] text-slate-700">
              {standards.bullets.map((b: any) => (
                <li key={b.label}><strong>{b.label}:</strong> {b.text}</li>
              ))}
            </ul>
            <h3 className="mt-4 text-lg font-semibold">{standards.factCheck.title}</h3>
            <ol className="list-decimal space-y-2 pl-5 text-[15px] text-slate-700">
              {standards.factCheck.steps.map((s: string, i: number) => (<li key={i}>{s}</li>))}
            </ol>
            <h3 className="mt-4 text-lg font-semibold">{standards.corrections.title}</h3>
            <p className="text-[15px] text-slate-700">{standards.corrections.text}</p>
            <div className="mt-3">
              <Link href="/contact?subject=support" className="rounded-xl border border-[var(--brand-light)] bg-[var(--brand-lighter)] px-3 py-2 text-sm font-semibold text-[var(--brand)]">{standards.corrections.linkText}</Link>
            </div>
          </SectionCard>
          <SectionCard id="about-reach-us">
            <h2 className="text-2xl font-bold">{reachUs.title}</h2>
            <p className="mt-2 text-[15px] text-slate-700">{reachUs.desc}</p>
            <ul className="mt-4 space-y-4">
              {reachUs.contacts.map((c) => (
                <li key={c.token} className="list-none">
                  <Link href={`/contact?subject=${c.token}`} className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white">{c.label}</Link>
                  <p className="mt-1 text-sm text-slate-600">{c.desc}</p>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-slate-500">{reachUs.note}</p>
          </SectionCard>
        </div>
      </Page>
      <footer className="px-4 pb-8 text-center text-slate-500">© {new Date().getFullYear()} heroBooks — All rights reserved.</footer>
    </div>
  );
}

