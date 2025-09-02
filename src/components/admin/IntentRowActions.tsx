"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function IntentRowActions({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);

  async function markPaid() {
    setLoading(true);
    try {
      await fetch(`/api/admin/checkout-intents/${id}/mark`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "paid" }),
      });
      location.reload();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button onClick={markPaid} disabled={loading} size="sm">
      Mark paid
    </Button>
  );
}
