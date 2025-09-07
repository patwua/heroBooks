"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function FloatingTrialCTA() {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button asChild>
        <Link href="/sign-up">Start a free trial</Link>
      </Button>
    </div>
  );
}
