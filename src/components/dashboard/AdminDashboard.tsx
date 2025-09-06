export default function AdminDashboard() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <section className="md:col-span-2 p-4 border rounded">
        <h3 className="font-semibold mb-2">Platform Analytics</h3>
        <ul className="text-sm list-disc ml-5">
          <li>Signups (7d)</li>
          <li>Locked feature impressions (7d)</li>
          <li>Conversion to enable/upgrade</li>
        </ul>
      </section>
      <section className="p-4 border rounded">
        <h3 className="font-semibold mb-2">Audit Log</h3>
        <p className="text-sm text-muted-foreground">
          Recent critical actions will appear here.
        </p>
      </section>
    </div>
  );
}

