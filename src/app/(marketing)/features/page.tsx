import { FeatureCard } from "@/components/marketing/FeatureCard"
import Page from "@/components/UX/Page"
import SectionCard from "@/components/UX/SectionCard"

export default function FeaturesPage() {
  return (
    <Page title="Features" subtitle="A focused toolkit for Guyanese SMEs">
      <SectionCard>
        <div className="space-y-10">
          <FeatureCard title="Smart Invoices" body="VAT-ready, auto-postings." img="/landing/feature-demo.webp" />
          <FeatureCard title="Dealer COGS" body="Per-unit purchases, duty, repairs." img="/landing/dealership.webp" />
        </div>
      </SectionCard>
    </Page>
  )
}

