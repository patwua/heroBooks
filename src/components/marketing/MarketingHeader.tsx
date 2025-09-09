import Link from "next/link"
import Image from "next/image"
import { isEnabled } from "@/lib/modules"

export default function MarketingHeader() {
  return (
    <header className="w-full">
      {isEnabled('promo:banner') && (
        <div className="bg-blue-600/95 text-white text-center py-2 text-sm">
          Early adopters: 2 months 50% off on Business plan. Use code <span className="font-semibold">GYA-LAUNCH</span>.
        </div>
      )}
      <div className="mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logos/logo.svg" alt="heroBooks" width={160} height={48} priority className="h-12 w-auto" />
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/features">Features</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/about">Why Local</Link>
          <Link href="/contact">Contact</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/sign-in" className="text-sm">Sign in</Link>
          <Link href="/get-started" className="inline-flex items-center rounded-xl bg-blue-600 px-4 py-2 text-white text-sm hover:bg-blue-700">
            Start free trial
          </Link>
        </div>
      </div>
    </header>
  )
}
