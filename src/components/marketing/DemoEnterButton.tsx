"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function DemoEnterButton({ label = "Try the demo" }: { label?: string }) {
  const [pending, start] = useTransition();
  const router = useRouter();

  return (
    <Button
      size="lg"
      onClick={() =>
        start(async () => {
          const res = await fetch("/api/demo/enter", { method: "POST" });
          const data = await res.json().catch(() => ({}));
          if (!res.ok) {
            alert(data?.error ?? "Could not enter demo");
            return;
          }
          if (data?.redirect) router.push(data.redirect);
          else router.refresh();
        })
      }
      disabled={pending}
    >
      {pending ? "Entering…" : label}
    </Button>
  );
}

