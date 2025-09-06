import "../globals.css";
import MarketingHeader from "@/components/marketing/MarketingHeader";
import MarketingFooter from "@/components/marketing/MarketingFooter";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <MarketingHeader />
        <main className="min-h-[70vh]">{children}</main>
        <MarketingFooter />
      </body>
    </html>
  );
}
