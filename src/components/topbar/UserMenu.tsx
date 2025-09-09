"use client"
import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { signIn, signOut, useSession } from "next-auth/react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { User } from "lucide-react"

export default function UserMenu() {
  const { data } = useSession()
  const params = useSearchParams()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const emailRef = useRef<HTMLInputElement>(null)
  const passRef = useRef<HTMLInputElement>(null)
  const authParam = params.get("auth")

  // Decide where to send the user after auth:
  // 1) hb_next cookie (set by middleware), 2) ?next=..., 3) current path, 4) /dashboard
  const callbackUrl = useMemo(() => {
    const cookie = typeof document !== "undefined" ? document.cookie : ""
    const m = /(?:^|;\s*)hb_next=([^;]+)/.exec(cookie)
    if (m) return decodeURIComponent(m[1])
    const next = params.get("next")
    if (next) return next
    if (pathname && pathname !== "/") return pathname
    return "/dashboard"
  }, [params, pathname])

  useEffect(() => {
    if (authParam === "1") setOpen(true)
    const handler = () => setOpen(true)
    window.addEventListener("hb:auth:open", handler)
    if (sessionStorage.getItem("hb_auth_open") === "1") {
      setOpen(true)
      sessionStorage.removeItem("hb_auth_open")
    }
    return () => window.removeEventListener("hb:auth:open", handler)
  }, [authParam])

  // Keep a dropdown for authenticated users (Dashboard + Sign out)
  if (data?.user) {
    return (
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <button className="inline-flex items-center gap-2 text-sm">
            <User className="h-4 w-4" />
            {data.user.name ?? "Account"}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 p-2">
          <Link href="/dashboard" className="block px-2 py-1.5 text-sm hover:underline">Dashboard</Link>
          <button
            className="mt-1 w-full text-left px-2 py-1.5 text-sm hover:underline"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Sign out
          </button>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault()
    const email = emailRef.current?.value || ""
    const password = passRef.current?.value || ""
    await signIn("credentials", {
      email,
      password,
      callbackUrl,
    })
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button className="inline-flex items-center gap-2 text-sm">
          <User className="h-4 w-4" />
          Sign in
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-4 space-y-3">
        <form onSubmit={handleCredentials} className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-medium">Email</label>
            <Input ref={emailRef} type="email" placeholder="you@example.com" required />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium">Password</label>
            <Input ref={passRef} type="password" placeholder="••••••••" required />
          </div>
          <Button type="submit" className="w-full">Sign in</Button>
        </form>
        <div className="flex items-center justify-between text-xs">
          <Link href="/forgot-password" className="underline">Forgot password</Link>
          <Link href="/#pricing" className="underline">Create account</Link>
        </div>
        <div className="pt-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => signIn("google", { callbackUrl })}
          >
            Sign in with Google
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
