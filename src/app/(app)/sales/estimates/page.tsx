"use client";

import { useEffect, useState } from "react";
import { fmtMoney, fmtDate } from "@/lib/format";

interface LineForm {
  description: string;
  quantity: string;
  unitPrice: string;
  taxCodeId: string;
}

export default function EstimatesPage() {
  const [customerId, setCustomerId] = useState("");
  const [line, setLine] = useState<LineForm>({ description: "", quantity: "1", unitPrice: "", taxCodeId: "" });
  const [lines, setLines] = useState<LineForm[]>([]);
  const [estimates, setEstimates] = useState<any[]>([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const e = await fetch("/api/estimates").then((r) => r.json());
    setEstimates(e);
  }

  function addLine() {
    if (!line.description || !line.unitPrice) return;
    setLines([...lines, line]);
    setLine({ description: "", quantity: "1", unitPrice: "", taxCodeId: "" });
  }

  async function saveEstimate() {
    await fetch("/api/estimates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerId,
        items: lines.map((l) => ({
          description: l.description,
          quantity: parseInt(l.quantity),
          unitPrice: parseFloat(l.unitPrice),
          taxCodeId: l.taxCodeId || undefined
        }))
      })
    });
    setCustomerId("");
    setLines([]);
    await load();
  }

  async function convert(id: string) {
    await fetch(`/api/estimates/${id}/convert`, { method: "POST" });
    await load();
  }

  return (
    <div>
      <h1 className="text-xl mb-4">Estimates</h1>
      <div className="space-y-2 mb-6">
        <input
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          placeholder="Customer ID"
          className="border p-1 w-full"
        />
        <div className="flex gap-2">
          <input
            value={line.description}
            onChange={(e) => setLine({ ...line, description: e.target.value })}
            placeholder="Description"
            className="border p-1 flex-1"
          />
          <input
            type="number"
            value={line.quantity}
            onChange={(e) => setLine({ ...line, quantity: e.target.value })}
            className="border p-1 w-20"
          />
          <input
            type="number"
            step="0.01"
            value={line.unitPrice}
            onChange={(e) => setLine({ ...line, unitPrice: e.target.value })}
            className="border p-1 w-28"
          />
          <input
            value={line.taxCodeId}
            onChange={(e) => setLine({ ...line, taxCodeId: e.target.value })}
            placeholder="Tax Code"
            className="border p-1 w-28"
          />
          <button type="button" onClick={addLine} className="bg-gray-200 px-2">
            Add
          </button>
        </div>
        {lines.length > 0 && (
          <ul className="list-disc pl-5">
            {lines.map((l, i) => (
              <li key={i}>{`${l.description} (${l.quantity} x ${l.unitPrice})`}</li>
            ))}
          </ul>
        )}
        <button onClick={saveEstimate} className="bg-blue-500 text-white px-2 py-1">
          Save Estimate
        </button>
      </div>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th>Number</th>
            <th>Date</th>
            <th>Total</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {estimates.map((est) => (
            <tr key={est.id} className="border-t">
              <td>{est.number}</td>
              <td>{fmtDate(est.issueDate)}</td>
              <td>{fmtMoney(est.total)}</td>
              <td>{est.status}</td>
              <td>
                {est.status !== "converted" && (
                  <button onClick={() => convert(est.id)} className="underline">
                    Convert to Invoice
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
