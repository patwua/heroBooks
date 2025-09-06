"use client";
import { useEffect, useState } from "react";
import LineChartCard from "@/components/charts/LineChartCard";
import StackedBarCard from "@/components/charts/StackedBarCard";

export default function AdminDashboard() {
  const [data, setData] = useState<{
    signups: any[];
    locked: any[];
    topPaths: any[];
  } | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/admin/analytics/overview");
      const j = await res.json();
      setData(j.data);
    })();
  }, []);

  if (!data) return null;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="md:col-span-2">
        <LineChartCard
          title="Signups (last 30 days)"
          data={data.signups}
          xKey="day"
          yKey="count"
        />
      </div>
      <div className="md:col-span-1 p-4 border rounded">
        <div className="text-sm font-semibold mb-2">Top Locked Pages</div>
        <ol className="text-sm list-decimal ml-6">
          {data.topPaths.map((r: any) => (
            <li
              key={r.path}
              className="truncate flex justify-between gap-2"
            >
              <span className="truncate">{r.path}</span>
              <span>{r.count}</span>
            </li>
          ))}
        </ol>
      </div>
      <div className="md:col-span-3">
        <StackedBarCard
          title="Locked Feature Impressions"
          data={data.locked}
          xKey="feature"
          series={[
            { key: "plan", label: "Upgrade" },
            { key: "toggle", label: "Activate" },
          ]}
        />
      </div>
    </div>
  );
}
