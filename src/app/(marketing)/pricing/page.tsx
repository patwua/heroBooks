import PricingSection from "@/components/marketing/PricingSection"
import Page from "@/components/UX/Page"
import SectionCard from "@/components/UX/SectionCard"

export default function PricingPage() {
  return (
    <Page title="Pricing" subtitle="Start simple. Scale when you need.">
      <SectionCard>
        <PricingSection />
      </SectionCard>
    </Page>
  )
}

