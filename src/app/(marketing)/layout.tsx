import "../global.css";
import MarketingHeader from "@/components/marketing/MarketingHeader";
import Footer from "@/components/Footer";
import AuthAutoOpen from "@/components/auth/AuthAutoOpen";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Sticky marketing header */}
      <MarketingHeader />
      {/* Auto-open the dropdown if any client fetch returns 401 */}
      {/* Client-only helper, safe to mount here */}
      <AuthAutoOpen />
      <main className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
