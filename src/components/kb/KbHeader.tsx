"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft } from "lucide-react";
import SearchExpand from "@/components/SearchExpand";
import ThemeToggle from "@/components/ThemeToggle";
import NotificationsBell from "@/components/topbar/NotificationsBell";
import UserMenu from "@/components/topbar/UserMenu";

export default function KbHeader() {
  const router = useRouter();
  const { data } = useSession();
  const homeHref = "/kb";
  return (
    <header className="w-full sticky top-0 z-40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="mx-auto flex h-24 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Left: back + logo (session-aware target) */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Go back"
            className="rounded-md p-3 hover:bg-muted"
            onClick={() => {
              if (data?.user) router.push('/dashboard');
              else router.push('/');
            }}
          >
            <ArrowLeft className="h-10 w-10" />
          </button>
          <Link href={homeHref} className="flex items-center gap-2" aria-label="heroBooks home">
            <Image
              src="/logos/heroBook%20Full%20Color.webp"
              alt="heroBooks"
              width={540}
              height={144}
              priority
              className="h-20 w-auto"
            />
          </Link>
        </div>

        {/* Center: Helpdesk nav (no marketing links) */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/kb">Tips</Link>
          <Link href="/stories">Blog</Link>
          <Link href="/help">FAQ</Link>
        </nav>

        {/* Right: tools */}
        <div className="flex items-center gap-2">
          <SearchExpand />
          <ThemeToggle />
          <NotificationsBell />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
