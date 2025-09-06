"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function PayrollReportPage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [rows, setRows] = useState<{ month: string; gross: number; paye: number; nisEmp: number; nisEr: number }[]>([]);

  async function load() {
    const qs = new URLSearchParams();
    if (from) qs.set("from", from);
    if (to) qs.set("to", to);
    const res = await fetch(`/api/reports/payroll?${qs.toString()}`);
    const j = await res.json();
    setRows(j.data || []);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-4">
      <Card>
        <div className="p-4 grid md:grid-cols-4 gap-3 items-end">
          <div>
            <div className="text-xs text-muted-foreground mb-1">From</div>
            <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">To</div>
            <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <button className="px-3 py-2 rounded bg-primary text-primary-foreground" onClick={load}>
              Run
            </button>
          </div>
        </div>
      </Card>

      <Card>
        <div className="p-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground">
                <th className="py-2">Month</th>
                <th className="py-2">Gross</th>
                <th className="py-2">PAYE</th>
                <th className="py-2">NIS (Employee)</th>
                <th className="py-2">NIS (Employer)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.month} className="border-t">
                  <td className="py-2">{r.month}</td>
                  <td className="py-2">{r.gross.toFixed(2)}</td>
                  <td className="py-2">{r.paye.toFixed(2)}</td>
                  <td className="py-2">{r.nisEmp.toFixed(2)}</td>
                  <td className="py-2">{r.nisEr.toFixed(2)}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td className="py-6 text-center text-muted-foreground" colSpan={5}>
                    No data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
