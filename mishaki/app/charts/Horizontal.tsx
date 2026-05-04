"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const data = [
  { month: "Jan", sales: 400 },
  { month: "Feb", sales: 700 },
  { month: "Mar", sales: 500 },
];

export default function SalesChart() {
  return (
    <div className="w-full h-80">
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="sales" stroke="#dc2626" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}