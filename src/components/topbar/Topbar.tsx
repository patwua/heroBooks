import ThemeToggle from "./ThemeToggle";
import OrgSwitcher from "./OrgSwitcher";
import UserMenu from "./UserMenu";
import { isDemoModeFromCookies } from "@/lib/demo";
import DemoExitButton from "./DemoExitButton";
import HideLockedSwitch from "./HideLockedSwitch";

export default async function Topbar() {
  const inDemo = isDemoModeFromCookies();

  return (
    <header className="h-14 border-b bg-background/60 backdrop-blur flex items-center justify-between px-4">
      <div className="flex items-center gap-2 text-sm">
        {/* breadcrumbs placeholder */}
        {inDemo && (
          <span className="px-2 py-0.5 rounded border text-xs bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
            Demo
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <HideLockedSwitch />
        <OrgSwitcher />
        {inDemo ? <DemoExitButton /> : null}
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
