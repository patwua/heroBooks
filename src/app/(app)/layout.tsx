import Sidebar from "@/src/components/Sidebar";
import Topbar from "@/src/components/Topbar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/authOptions";
import { redirect } from "next/navigation";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/sign-in");

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
