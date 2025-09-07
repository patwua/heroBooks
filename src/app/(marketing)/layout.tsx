import "../globals.css";
import MarketingHeader from "@/components/marketing/MarketingHeader";
import Footer from "@/components/Footer";
import FloatingTrialCTA from "@/components/marketing/FloatingTrialCTA";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MarketingHeader />
      <main className="pt-14">{children}</main>
      <Footer />
      <FloatingTrialCTA />
    </>
  );
}
