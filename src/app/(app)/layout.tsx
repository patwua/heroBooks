import "../globals.css";
import Sidebar from "@/components/nav/Sidebar";
import Topbar from "@/components/topbar/Topbar";
import AssistSidebar from "@/components/app/AssistSidebar";
import AppFooter from "@/components/app/AppFooter";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <Topbar />
            <div className="flex flex-1">
              <main className="flex-1">{children}</main>
              <AssistSidebar />
            </div>
            <AppFooter />
          </div>
        </div>
      </body>
    </html>
  );
}
