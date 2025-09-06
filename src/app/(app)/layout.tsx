import Sidebar from "@/components/nav/Sidebar";
import Topbar from "@/components/topbar/Topbar";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { auth } from "@/lib/auth";
import { isDemoModeFromCookies } from "@/lib/demo";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = {
  title: "heroBooks",
};

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/sign-in");
  const inDemo = isDemoModeFromCookies();

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Topbar />
          {inDemo && (
            <div className="border-b bg-amber-50 text-amber-900 text-sm px-4 py-2">
              You’re exploring the demo. Ready to go live?{" "}
              <Link href="/pricing" className="underline">
                Choose a plan
              </Link>{" "}
              or{" "}
              <Link href="/checkout?plan=business" className="underline">
                start Business
              </Link>
              .
            </div>
          )}
          <main className="p-6">{children}</main>
        </div>
      </div>
    </ThemeProvider>
  );
}
