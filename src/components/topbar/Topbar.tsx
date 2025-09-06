import Link from "next/link";
import Image from "next/image";
import { getCurrentPlanForActiveOrg } from "@/lib/subscriptions/current-plan";
import { isDemoModeFromCookies } from "@/lib/demo";
import UserMenu from "./UserMenu";

export default async function Topbar() {
  const inDemo = isDemoModeFromCookies();
  const plan = await getCurrentPlanForActiveOrg();

  const showUpgrade =
    plan === "starter" || plan === "none" || plan === "pending_assignment";
  const upgradeLabel = showUpgrade ? "Upgrade" : "Manage plan";
  const upgradeHref = showUpgrade
    ? "/pricing?next=/checkout&highlight=business"
    : "/pricing";

  return (
    <header className="h-14 border-b bg-background/70 backdrop-blur">
      {inDemo && (
        <div className="h-8 border-b bg-amber-50 text-amber-900 text-xs flex items-center justify-center">
          You’re viewing the demo org. Upgrading applies to your real company file.
        </div>
      )}
      <div className="container mx-auto h-14 px-4 flex items-center justify-between">
        {/* Left: brand → Dashboard */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image
            src="/logos/heroBooks mini Color.png"
            alt="heroBooks"
            width={26}
            height={26}
            className="h-6 w-6"
            priority
          />
          <span className="font-semibold tracking-tight hidden sm:inline">
            heroBooks
          </span>
        </Link>

        {/* Right: compact nav */}
        <nav className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-sm hover:underline hidden sm:inline"
          >
            Dashboard
          </Link>
          <Link
            href={upgradeHref}
            className="text-sm rounded-md px-3 py-1.5 border hover:bg-muted"
            title={upgradeLabel}
          >
            {upgradeLabel}
          </Link>
          <UserMenu />
        </nav>
      </div>
    </header>
  );
}

