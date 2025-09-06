"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function DemoEnterButton({ label = "Try the demo" }: { label?: string }) {
  const [pending, start] = useTransition();
  const router = useRouter();

  async function isLoggedIn() {
    try {
      const res = await fetch("/api/auth/session", { cache: "no-store" });
      if (!res.ok) return false;
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
          // If logged in: enter demo right away; else send to sign-up with demo=1
          const logged = await isLoggedIn();
          if (logged) {
            const res = await fetch("/api/demo/enter", { method: "POST" });
            if (res.ok) router.push("/dashboard");
            else router.push("/sign-up?plan=business&demo=1");
          } else {
            router.push("/sign-up?plan=business&demo=1");
          }
        })
      }
      disabled={pending}
    >
      {pending ? "Entering…" : label}
    </Button>
  );
}

