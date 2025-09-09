import Image from "next/image"
import Page from "@/components/UX/Page"
import SectionCard from "@/components/UX/SectionCard"
import ContactClient from "@/app/(marketing)/contact/ContactClient"

export default function AboutPage() {
  return (
    <Page title="About heroBooks" subtitle="Simple, local-first accounting—built in Guyana, ready for the Caribbean.">
      <SectionCard>
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Make bookkeeping effortless for local businesses</h2>
          <p className="text-muted-foreground">We’re building modern accounting that understands VAT, PAYE, NIS, and the realities of running a small business in Guyana—with an eye toward the broader Caribbean.</p>
        </div>
      </SectionCard>
      <SectionCard>
        <h2 className="text-2xl font-semibold">Leadership</h2>
        <p className="text-muted-foreground mb-6">The team guiding our product and customers</p>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { img: "/leadership/founder.webp", name: "A. Founder", title: "CEO" },
            { img: "/leadership/cto.webp", name: "B. Engineer", title: "CTO" },
            { img: "/leadership/finance.webp", name: "C. Finance", title: "Head of Finance & Ops" },
          ].map((p) => (
            <div key={p.name}>
              <Image src={p.img} alt={p.name} width={640} height={640} className="rounded-2xl aspect-square object-cover" />
              <h3 className="mt-4 font-semibold">{p.name}</h3>
              <p className="text-muted-foreground">{p.title}</p>
            </div>
          ))}
        </div>
      </SectionCard>
      <SectionCard>
        <h2 className="text-2xl font-semibold mb-4">Careers</h2>
        <p className="text-muted-foreground">We’ll post opportunities here. In the meantime, send your portfolio to <a className="underline" href="mailto:support@herobooks.gy">support@herobooks.gy</a>.</p>
      </SectionCard>
      <SectionCard>
        <h2 className="text-2xl font-semibold mb-4">Contact</h2>
        <div className="max-w-3xl">
          {/* Existing contact form, embedded at the bottom of About */}
          <ContactClient />
        </div>
      </SectionCard>
    </Page>
  )
}
