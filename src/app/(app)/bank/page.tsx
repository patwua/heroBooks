"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function BankPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [transactions, setTransactions] = useState<any[]>([]);

  async function fetchTransactions() {
    const res = await fetch("/api/bank/transactions");
    if (res.ok) {
      const data = await res.json();
      setTransactions(data);
    }
  }

  async function upload() {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/bank/import", {
      method: "POST",
      body: formData
    });
    if (res.ok) {
      setStatus("Imported");
      fetchTransactions();
    } else {
      setStatus("Import failed");
    }
  }

  async function reconcile() {
    setStatus("Reconciling...");
    const res = await fetch("/api/bank/reconcile", { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      setStatus(`Matched ${data.matched}`);
      fetchTransactions();
    } else {
      setStatus("Reconcile failed");
    }
  }

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div>
      <h1 className="text-xl mb-4">Bank Reconciliation</h1>
      <div className="space-x-2">
        <Input type="file" accept=".csv" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-auto" />
        <Button onClick={upload} variant="outline">Upload CSV</Button>
        <Button onClick={reconcile} variant="outline">Reconcile</Button>
      </div>
      {status && <p className="mt-2">{status}</p>}
      <table className="mt-4 w-full">
        <thead>
          <tr>
            <th className="text-left">Date</th>
            <th className="text-left">Amount</th>
            <th className="text-left">Memo</th>
            <th className="text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id} className="border-t">
              <td>{new Date(t.date).toLocaleDateString()}</td>
              <td>{t.amount}</td>
              <td>{t.memo}</td>
              <td>{t.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
