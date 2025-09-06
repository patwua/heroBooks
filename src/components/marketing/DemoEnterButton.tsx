"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function DemoEnterButton({ label = "Explore the demo" }: { label?: string }) {
  const [pending, start] = useTransition();
  const router = useRouter();

  async function isLoggedIn() {
    try {
      const res = await fetch("/api/auth/session", { cache: "no-store" });
      const j = await res.json();
      return Boolean(j?.user);
    } catch {
      return false;
    }
  }

  return (
    <Button
      size="lg"
      onClick={() =>
        start(async () => {
          // Track click (non-blocking)
          fetch("/api/track/marketing", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ event: "demo_click" }),
            keepalive: true,
          });

          const logged = await isLoggedIn();
          if (logged) {
            const res = await fetch("/api/demo/enter", { method: "POST" });
            if (res.ok) return router.push("/dashboard");
          }
          router.push("/sign-up?plan=business&demo=1");
        })
      }
      disabled={pending}
    >
      {pending ? "Entering…" : label}
    </Button>
  );
}
