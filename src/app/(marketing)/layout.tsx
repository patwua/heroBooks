import MarketingHeader from "@/components/marketing/MarketingHeader";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import { MarketingProviders } from "@/components/marketing/MarketingProviders";

export const metadata = {
  title: "heroBooks — Guyana-first Accounting",
  description:
    "Modern, multi-tenant accounting tailored for Guyana: VAT-ready invoicing, PAYE & NIS payroll basics, clean reports, and a developer-friendly API.",
};

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <MarketingProviders>
      <div className="min-h-screen flex flex-col bg-background">
        <MarketingHeader />
        <main className="flex-1">{children}</main>
        <MarketingFooter />
      </div>
    </MarketingProviders>
  );
}
