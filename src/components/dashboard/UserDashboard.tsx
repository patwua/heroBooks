"use client";
import { useEffect, useState } from "react";
import GroupedBarCard from "@/components/charts/GroupedBarCard";
import LineChartCard from "@/components/charts/LineChartCard";
import KpiTiles from "@/components/charts/KpiTiles";

export default function UserDashboard() {
  const [data, setData] = useState<{
    months: { month: string; income: number; expense: number; wages: number }[];
    kpis: any;
  } | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/user/analytics/overview");
      const j = await res.json();
      setData(j.data);
    })();
  }, []);

  if (!data) return null;

  const { months, kpis } = data;
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="md:col-span-3">
        <KpiTiles
          items={[
            { label: "MTD Revenue", value: kpis.mtdIncome },
            { label: "MTD Expenses", value: kpis.mtdExpense },
            { label: "MTD Wages", value: kpis.mtdWages },
            { label: "Outstanding Invoices", value: kpis.outstanding },
          ]}
        />
      </div>
      <div className="md:col-span-2">
        <GroupedBarCard
          title="Income vs Expense (last 6 mo)"
          data={months}
          xKey="month"
          series={[
            { key: "income", label: "Income" },
            { key: "expense", label: "Expense" },
          ]}
        />
      </div>
      <div className="md:col-span-1">
        <LineChartCard title="Wages (last 6 mo)" data={months} xKey="month" yKey="wages" />
      </div>
    </div>
  );
}
