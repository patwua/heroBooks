export default function SalesPage() {
  return (
    <div>
      <h1 className="mb-4 text-xl font-bold">Create Invoice</h1>
      <form action="/api/invoices" method="POST" className="flex flex-col gap-2">
        <input
          type="text"
          name="customer"
          placeholder="Customer"
          className="border p-2"
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          className="border p-2"
        />
        <button type="submit" className="rounded bg-blue-500 p-2 text-white">
          Create Invoice
        </button>
      </form>
    </div>
  );
}
