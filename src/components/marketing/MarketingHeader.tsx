import Link from "next/link"
import Image from "next/image"
import { resolveUiForRequest, isModuleEnabled } from "@/lib/modules"
import SearchExpand from "@/components/SearchExpand"
import ThemeToggle from "@/components/ThemeToggle"
import NotificationsBell from "@/components/topbar/NotificationsBell"
import UserMenu from "@/components/topbar/UserMenu"

export default async function MarketingHeader() {
  const ui = await resolveUiForRequest()
  return (
    <header className="w-full sticky top-0 z-40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {isModuleEnabled(ui.modules, 'promo:banner') && (
        <div className="bg-blue-600/95 text-white text-center py-2 text-sm">
          Early adopters: 2 months 50% off on Business plan. Use code <span className="font-semibold">GYA-LAUNCH</span>.
        </div>
      )}
      <div className="mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Left: logo + primary CTA */}
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logos/logo.svg" alt="heroBooks" width={160} height={48} priority className="h-12 w-auto" />
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/#pricing" className="hidden sm:inline-flex rounded-xl bg-blue-600 px-4 py-2 text-white text-sm hover:bg-blue-700">
            Start free trial
          </Link>
        </div>

        {/* Right: nav anchors + tools (search, theme, bell, user) */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/#features">Features</Link>
          <Link href="/#pricing">Pricing</Link>
          <Link href="/about">About</Link>
          <Link href="/help">Help</Link>
          <Link href="/kb">Docs/Guides</Link>
        </nav>
        <div className="flex items-center gap-2">
          {/* Expandable search */}
          <SearchExpand />
          {/* Dark mode toggle keeps 'class' strategy for dark: variants */}
          <ThemeToggle />
          {/* Platform notifications only (visitor-side) */}
          <NotificationsBell />
          {/* Auth dropdown: Sign in / Sign up links (plan selection) */}
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
