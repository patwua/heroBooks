import HeroClient from "@/components/marketing/HeroClient"
import { FeatureCard } from "@/components/marketing/FeatureCard"
import { heroCopy } from "@/lib/copy/imageCopy"
import { heroImages } from "@/lib/images"

export default function MarketingHome() {
  const hero = heroCopy.accounting
  const heroImg = heroImages.accounting!
  return (
    <div className="space-y-20 py-12 sm:py-16 lg:py-24">
      <HeroClient
        itemId="accounting"
        headline={hero.headline}
        story={hero.story}
        ctas={hero.ctas}
        imgSrc={heroImg}
      />
      <section className="space-y-10">
        <h2 className="text-3xl font-bold">Feature Highlights</h2>
        <FeatureCard
          title="Smart Invoices"
          body="Create VAT-ready invoices with automatic postings."
          img="/landing/feature-demo.webp"
        />
        <FeatureCard
          title="Dealer COGS"
          body="Attach purchase, duty, and reconditioning per unit."
          img="/landing/dealership.webp"
        />
      </section>
    </div>
  )
}
