"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function TaxesPanel() {
  const [loading, setLoading] = useState(false);
  const [features, setFeatures] = useState<{ enableVAT: boolean; enablePAYE: boolean; enableNIS: boolean; enablePropTax: boolean } | null>(null);

  useEffect(() => {
    setFeatures({ enableVAT: true, enablePAYE: false, enableNIS: false, enablePropTax: false });
  }, []);

  async function updateFeatures(patch: Partial<{ enableVAT: boolean; enablePAYE: boolean; enableNIS: boolean; enablePropTax: boolean }>) {
    setLoading(true);
    await fetch("/api/settings/tax/features", { method: "POST", body: JSON.stringify(patch) });
    setLoading(false);
    setFeatures((prev) => (prev ? { ...prev, ...patch } as any : prev));
  }

  async function schedulePAYE(ev: FormData) {
    setLoading(true);
    const effectiveFrom = (ev.get("payeDate") as string) || new Date().toISOString().slice(0, 10);
    const brackets = [
      { order: 1, upTo: ev.get("payeUpTo1") as string, rate: ev.get("payeRate1") as string },
      { order: 2, upTo: ev.get("payeUpTo2") as string, rate: ev.get("payeRate2") as string },
      { order: 3, upTo: null as any, rate: ev.get("payeRate3") as string },
    ];
    await fetch("/api/settings/tax/paye/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ effectiveFrom, brackets }),
    });
    setLoading(false);
  }

  async function scheduleNIS(ev: FormData) {
    setLoading(true);
    const effectiveFrom = (ev.get("nisDate") as string) || new Date().toISOString().slice(0, 10);
    const employeeRate = ev.get("nisEmp") as string;
    const employerRate = ev.get("nisEr") as string;
    const ceilingAmount = (ev.get("nisCeil") as string) || null;
    const ceilingPeriod = (ev.get("nisPeriod") as string) || "monthly";
    await fetch("/api/settings/tax/nis/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ effectiveFrom, employeeRate, employerRate, ceilingAmount, ceilingPeriod }),
    });
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <Card className="p-4 space-y-3">
        <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">VAT</div>
              <div className="text-sm text-muted-foreground">Standard 14%, plus zero-rated and exempt codes.</div>
            </div>
            <Button variant={features?.enableVAT ? "default" : "outline"} onClick={() => updateFeatures({ enableVAT: !features?.enableVAT })} disabled={loading}>
              {features?.enableVAT ? "Enabled" : "Enable"}
            </Button>
        </div>
      </Card>

      <Card className="p-4 space-y-3">
        <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">PAYE</div>
              <div className="text-sm text-muted-foreground">Personal allowance rule + brackets by effective date.</div>
            </div>
            <Button variant={features?.enablePAYE ? "default" : "outline"} onClick={() => updateFeatures({ enablePAYE: !features?.enablePAYE })} disabled={loading}>
              {features?.enablePAYE ? "Enabled" : "Enable"}
            </Button>
        </div>

        <form action={async (fd) => schedulePAYE(fd)} className="grid md:grid-cols-6 gap-2 mt-3">
            <Input name="payeDate" type="date" className="md:col-span-2" placeholder="Effective from" />
            <Input name="payeUpTo1" placeholder="Band1 upTo e.g. 130000.00" />
            <Input name="payeRate1" placeholder="Band1 rate e.g. 0.0000" />
            <Input name="payeUpTo2" placeholder="Band2 upTo e.g. 260000.00" />
            <Input name="payeRate2" placeholder="Band2 rate e.g. 0.2500" />
            <Input name="payeRate3" placeholder="Top band rate e.g. 0.3500" />
            <Button className="md:col-span-6" type="submit" disabled={loading}>
              Schedule PAYE
            </Button>
        </form>
      </Card>

      <Card className="p-4 space-y-3">
        <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">NIS</div>
              <div className="text-sm text-muted-foreground">Employee/Employer rates + ceiling per period.</div>
            </div>
            <Button variant={features?.enableNIS ? "default" : "outline"} onClick={() => updateFeatures({ enableNIS: !features?.enableNIS })} disabled={loading}>
              {features?.enableNIS ? "Enabled" : "Enable"}
            </Button>
        </div>

        <form action={async (fd) => scheduleNIS(fd)} className="grid md:grid-cols-6 gap-2 mt-3">
            <Input name="nisDate" type="date" className="md:col-span-2" placeholder="Effective from" />
            <Input name="nisEmp" placeholder="Employee rate e.g. 0.0560" />
            <Input name="nisEr" placeholder="Employer rate e.g. 0.0840" />
            <Input name="nisCeil" placeholder="Ceiling e.g. 280000.00 (optional)" />
            <Input name="nisPeriod" placeholder="monthly|weekly|annual" />
            <Button className="md:col-span-6" type="submit" disabled={loading}>
              Schedule NIS
            </Button>
        </form>
      </Card>
    </div>
  );
}

