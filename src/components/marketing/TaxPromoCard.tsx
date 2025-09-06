"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TaxPromoCard({ kind }: { kind: "PAYE" | "NIS" | "ADVISORY" }) {
  const [busy, setBusy] = useState(false);

  async function enable(kind: "PAYE" | "NIS") {
    setBusy(true);
    await fetch("/api/settings/tax/features", { method: "POST", body: JSON.stringify({ [kind === "PAYE" ? "enablePAYE" : "enableNIS"]: true }) });
    setBusy(false);
  }

  async function applyAdvisory(id: string) {
    setBusy(true);
    await fetch("/api/settings/tax/advisories/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ advisoryId: id }),
    });
    setBusy(false);
  }

  return (
    <Card className="border-dashed p-4 space-y-2">
        {kind === "PAYE" && (
          <>
            <div className="font-medium">Enable PAYE tracking</div>
            <div className="text-sm text-muted-foreground">Apply Guyana 2025 allowance rule and brackets to your payroll.</div>
            <Button size="sm" disabled={busy} onClick={() => enable("PAYE")}>Enable PAYE</Button>
          </>
        )}
        {kind === "NIS" && (
          <>
            <div className="font-medium">Enable NIS contributions</div>
            <div className="text-sm text-muted-foreground">Calculate employee 5.6% and employer 8.4% with a monthly ceiling.</div>
            <Button size="sm" disabled={busy} onClick={() => enable("NIS")}>Enable NIS</Button>
          </>
        )}
        {kind === "ADVISORY" && (
          <>
            <div className="font-medium">Apply tax update from heroBooks</div>
            <div className="text-sm text-muted-foreground">A platform advisory is available for your region.</div>
            <Button size="sm" disabled={busy} onClick={() => applyAdvisory("<ADVISORY_ID>")}>Apply update</Button>
          </>
        )}
    </Card>
  );
}

