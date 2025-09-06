"use client";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function DemoExitButton() {
  const [pending, start] = useTransition();
  const router = useRouter();
  return (
    <Button
      size="sm"
      variant="outline"
      onClick={() =>
        start(async () => {
          await fetch("/api/demo/leave", { method: "POST" });
          router.push("/dashboard");
          router.refresh();
        })
      }
      disabled={pending}
    >
      Exit demo
    </Button>
  );
}

