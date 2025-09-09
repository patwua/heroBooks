import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { isDemoModeFromCookies } from "@/lib/demo";
import SearchBar from "./SearchBar";
import ThemeToggle from "./ThemeToggle";
import NotificationsBell from "./NotificationsBell";
import UserMenu from "./UserMenu";

export default async function Topbar() {
  const inDemo = await isDemoModeFromCookies();
  return (
    <header className="sticky top-0 z-50 h-16 border-b bg-background/70 backdrop-blur">
      {inDemo && (
        <div className="h-8 border-b bg-amber-50 text-amber-900 text-xs flex items-center justify-center">
          You’re viewing the demo org. Upgrading applies to your real company file.
        </div>
      )}
      <div className="container mx-auto h-16 px-4 flex items-center gap-4">
        <Link href="/dashboard" className="flex items-center gap-2" aria-label="Dashboard home">
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
        <div className="flex-1 flex justify-center">
          <SearchBar />
        </div>
        <nav className="flex items-center gap-3 ml-auto">
          <ThemeToggle />
          <NotificationsBell />
          <Suspense fallback={null}>
            <UserMenu />
          </Suspense>
        </nav>
      </div>
    </header>
  );
}
