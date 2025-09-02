import ThemeToggle from "./ThemeToggle";
import OrgSwitcher from "./OrgSwitcher";
import UserMenu from "./UserMenu";

export default async function Topbar() {
  return (
    <header className="h-14 border-b bg-background/60 backdrop-blur flex items-center justify-between px-4">
      <div className="text-sm text-muted-foreground">
        {/* breadcrumbs placeholder */}
      </div>
      <div className="flex items-center gap-2">
        <OrgSwitcher />
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
