"use client";
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function LineChartCard({ title, data, xKey, yKey }: { title: string; data: any[]; xKey: string; yKey: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-sm font-semibold mb-2">{title}</div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xKey} />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey={yKey} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
