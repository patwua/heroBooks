"use client";

import { useEffect, useState } from "react";

export default function PaymentsPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [invoiceId, setInvoiceId] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("cash");
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    fetch("/api/invoices")
      .then((res) => res.json())
      .then(setInvoices);
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        invoiceId,
        amount: parseFloat(amount),
        method
      })
    });
    const data = await res.json();
    setResult(data);
  }

  return (
    <div>
      <h1 className="text-xl mb-4">Record Payment</h1>
      <form onSubmit={submit} className="space-y-2">
        <select
          value={invoiceId}
          onChange={(e) => setInvoiceId(e.target.value)}
          className="border p-1"
        >
          <option value="">Select invoice</option>
          {invoices.map((inv) => (
            <option key={inv.id} value={inv.id}>
              {`#${inv.number}`}
            </option>
          ))}
        </select>
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          className="border p-1"
        />
        <input
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          placeholder="Method"
          className="border p-1"
        />
        <button type="submit" className="bg-blue-500 text-white px-2 py-1">
          Pay
        </button>
      </form>
      {result && (
        <div className="mt-4">
          <p>Receipt: {result.receiptNumber}</p>
          <p>Status: {result.status}</p>
          {result.paymentId && (
            <a
              href={`/api/receipts/${result.paymentId}/pdf`}
              target="_blank"
              className="underline"
            >
              View Receipt PDF
            </a>
          )}
        </div>
      )}
    </div>
  );
}
