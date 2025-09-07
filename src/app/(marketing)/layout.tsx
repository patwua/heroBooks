import "../globals.css";
import MarketingHeader from "@/components/marketing/MarketingHeader";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import FloatingTrialCTA from "@/components/marketing/FloatingTrialCTA";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MarketingHeader />
      <main className="pt-14">{children}</main>
      <MarketingFooter />
      <FloatingTrialCTA />
    </>
  );
}
