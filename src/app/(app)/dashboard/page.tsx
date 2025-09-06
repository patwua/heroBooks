import { auth } from "@/lib/auth";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import UserDashboard from "@/components/dashboard/UserDashboard";

export default async function DashboardPage() {
  const session = await auth();
  const role = (session as any)?.user?.role || "USER"; // assuming role is on session

  const superEmail = (process.env.SUPERUSER_EMAILS || "").toLowerCase();
  const isSuper = !!session?.user?.email &&
    superEmail.includes((session.user.email || "").toLowerCase());

  if (isSuper || role === "ADMIN") {
    return <AdminDashboard />;
  }
  return <UserDashboard />;
}

