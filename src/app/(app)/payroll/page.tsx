"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function PayrollPage() {
  const [form, setForm] = useState({ employeeName: "", employeeEmail: "", period: "", gross: "" });
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function submit() {
    setBusy(true);
    const res = await fetch("/api/payroll/payslips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setResult(data.data);
    setBusy(false);
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-4 grid md:grid-cols-4 gap-3">
          <Input placeholder="Employee name" value={form.employeeName} onChange={(e) => setForm({ ...form, employeeName: e.target.value })} />
          <Input placeholder="Employee email (optional)" value={form.employeeEmail} onChange={(e) => setForm({ ...form, employeeEmail: e.target.value })} />
          <Input type="month" placeholder="Period (YYYY-MM)" value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value + "-01" })} />
          <Input placeholder="Gross (GYD)" value={form.gross} onChange={(e) => setForm({ ...form, gross: e.target.value })} />
          <div className="md:col-span-4">
            <Button onClick={submit} disabled={busy || !form.employeeName || !form.period || !form.gross}>Create payslip</Button>
          </div>
        </div>
      </Card>

      {result && (
        <Card>
          <div className="p-4 space-y-2 text-sm">
            <div><b>{result.employeeName}</b> — {new Date(result.period).toLocaleDateString()}</div>
            <div>Gross: {result.gross}</div>
            <div>Allowance: {result.allowance}</div>
            <div>Chargeable: {result.chargeable}</div>
            <div>PAYE: {result.payeTax}</div>
            <div>NIS (Employee): {result.nisEmployee}</div>
            <div>NIS (Employer): {result.nisEmployer}</div>
            <div>Insurable: {result.nisInsurable}</div>
            <div><b>Net:</b> {result.net}</div>
          </div>
        </Card>
      )}
    </div>
  );
}
