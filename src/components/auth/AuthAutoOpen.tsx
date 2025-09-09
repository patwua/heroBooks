"use client"
import { useEffect, useState } from "react"
import Toast from "@/components/Toast"

/**
 * Installs a global fetch wrapper. Any 401 response from same-origin requests
 * triggers the marketing sign-in dropdown to open immediately.
 */
export default function AuthAutoOpen() {
  const [showToast, setShowToast] = useState(false)

  useEffect(() => {
    // Only install once
    if ((window as any).__hbFetchPatched) return
    ;(window as any).__hbFetchPatched = true

    const orig = window.fetch
    window.fetch = async (...args) => {
      const res = await orig(...(args as [RequestInfo, RequestInit?]))
      try {
        const url = typeof args[0] === "string" ? new URL(args[0], location.origin) : new URL((args[0] as Request).url)
        const sameOrigin = url.origin === location.origin
        if (sameOrigin && res.status === 401) {
          sessionStorage.setItem("hb_auth_open", "1")
          window.dispatchEvent(new CustomEvent("hb:auth:open"))
          const u = new URL(window.location.href)
          u.searchParams.set("auth", "1")
          window.history.replaceState(null, "", u.toString())
          setShowToast(true)
        }
      } catch {}
      return res
    }
  }, [])

  return showToast ? (
    <Toast
      type="error"
      message="Session expired — please sign in"
      onDone={() => setShowToast(false)}
    />
  ) : null
}
