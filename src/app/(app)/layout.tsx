import Sidebar from "@/components/nav/Sidebar";
import Topbar from "@/components/topbar/Topbar";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "heroBooks",
};

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/signin");

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Topbar />
          <main className="p-6">{children}</main>
        </div>
      </div>
    </ThemeProvider>
  );
}
