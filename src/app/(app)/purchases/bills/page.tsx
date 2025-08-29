"use client";

import { useEffect, useState } from "react";
import { fmtMoney } from "@/lib/format";

export default function BillsPage() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [bills, setBills] = useState<any[]>([]);
  const [form, setForm] = useState({
    vendorId: "",
    description: "",
    amount: "",
    taxCodeId: "",
    whtRate: ""
  });

  async function load() {
    const v = await fetch(`/api/vendors`).then((r) => r.json());
    const b = await fetch(`/api/bills`).then((r) => r.json());
    setVendors(v);
    setBills(b);
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await fetch(`/api/bills`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        vendorId: form.vendorId,
        lines: [
          {
            description: form.description,
            quantity: 1,
            unitCost: parseFloat(form.amount),
            taxCodeId: form.taxCodeId || undefined
          }
        ],
        whtRate: form.whtRate ? parseFloat(form.whtRate) : undefined
      })
    });
    setForm({ vendorId: "", description: "", amount: "", taxCodeId: "", whtRate: "" });
    await load();
  }

  return (
    <div>
      <h1 className="text-xl mb-4">Bills</h1>
      <form onSubmit={submit} className="space-y-2 mb-4">
        <select
          value={form.vendorId}
          onChange={(e) => setForm({ ...form, vendorId: e.target.value })}
          className="border p-1 w-full"
          required
        >
          <option value="">Select vendor</option>
          {vendors.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name}
            </option>
          ))}
        </select>
        <input
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Description"
          className="border p-1 w-full"
          required
        />
        <input
          type="number"
          step="0.01"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          placeholder="Amount"
          className="border p-1 w-full"
          required
        />
        <input
          value={form.taxCodeId}
          onChange={(e) => setForm({ ...form, taxCodeId: e.target.value })}
          placeholder="Tax Code ID"
          className="border p-1 w-full"
        />
        <input
          type="number"
          step="0.01"
          value={form.whtRate}
          onChange={(e) => setForm({ ...form, whtRate: e.target.value })}
          placeholder="WHT Rate"
          className="border p-1 w-full"
        />
        <button type="submit" className="bg-blue-500 text-white px-2 py-1">
          Add Bill
        </button>
      </form>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th>Vendor</th>
            <th>Total</th>
            <th>Input VAT</th>
          </tr>
        </thead>
        <tbody>
          {bills.map((b) => (
            <tr key={b.id} className="border-t">
              <td>{b.vendor.name}</td>
              <td>{fmtMoney(b.total)}</td>
              <td>{fmtMoney(b.inputVat)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
