import ThemeToggle from "./ThemeToggle";
import OrgSwitcher from "./OrgSwitcher";
import UserMenu from "./UserMenu";
import { auth } from "@/lib/auth";
import { isDemoSession } from "@/lib/demo";

export default async function Topbar() {
  const session = await auth();
  const demo = await isDemoSession(session);

  return (
    <header className="h-14 border-b bg-background/60 backdrop-blur flex items-center justify-between px-4">
      <div className="text-sm text-muted-foreground">
        {/* breadcrumbs placeholder */}
      </div>
      <div className="flex items-center gap-2">
        {demo && (
          <form action="/api/demo/leave" method="post" className="flex items-center gap-2 mr-2">
            <span className="rounded-full bg-amber-100 text-amber-800 px-2 py-1 text-xs">
              Demo company
            </span>
            <button className="text-xs underline">Leave demo &amp; clear my data</button>
          </form>
        )}
        <OrgSwitcher />
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
