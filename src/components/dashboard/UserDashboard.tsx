export default function UserDashboard() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <section className="md:col-span-2 p-4 border rounded">
        <h3 className="font-semibold mb-2">Organization Performance</h3>
        <ul className="text-sm list-disc ml-5">
          <li>Revenue (MTD)</li>
          <li>Outstanding invoices</li>
          <li>Top customers</li>
        </ul>
      </section>
      <section className="p-4 border rounded">
        <h3 className="font-semibold mb-2">Team Activity</h3>
        <p className="text-sm text-muted-foreground">
          Last signed-in users in this org.
        </p>
      </section>
    </div>
  );
}

