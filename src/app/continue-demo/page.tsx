"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ContinueDemoPage() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/demo/enter", { method: "POST" });
        if (res.ok) router.replace("/dashboard");
        else router.replace("/sign-up?plan=business&demo=1");
      } catch {
        router.replace("/sign-up?plan=business&demo=1");
      }
    })();
  }, [router]);

  return (
    <div className="p-6 text-center">Entering demo…</div>
  );
}

