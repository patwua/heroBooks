import { auth } from "@/lib/auth";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import UserDashboard from "@/components/dashboard/UserDashboard";

export default async function DashboardPage() {
  const session = await auth();
  const role = (session as any)?.user?.role || "USER";
  const isSuper = (process.env.SUPERUSER_EMAILS || "")
    .toLowerCase()
    .includes((session?.user?.email || "").toLowerCase());
  if (isSuper || role === "ADMIN") return <AdminDashboard />;
  return <UserDashboard />;
}
