"use client";

import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import formatRupiah from "@/lib/helpers/formatRupiah";

const compact = (value) => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}jt`;
  if (value >= 1_000) return `${Math.round(value / 1_000)}rb`;
  return `${value}`;
};

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover/95 px-3 py-2 text-xs shadow-xl backdrop-blur">
      <p className="mb-1 font-bold text-foreground">{label}</p>
      {payload.map((item) => (
        <p key={item.dataKey} className="flex items-center gap-2 text-muted-foreground">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: item.color }}
          />
          {item.name}: {formatRupiah(item.value)}
        </p>
      ))}
    </div>
  );
};

const TrendChart = ({ data }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="glass-card rounded-xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-foreground">Tren Transaksi</h2>
          <p className="text-xs text-muted-foreground">Setor &amp; tarik per hari</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" />
            Setor
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-500" />
            Tarik
          </span>
        </div>
      </div>

      <div className="h-64 w-full text-muted-foreground">
        {mounted ? (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 6, right: 6, bottom: 0, left: -8 }}>
            <defs>
              <linearGradient id="setorFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="tarikFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="currentColor"
              strokeOpacity={0.12}
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{ fill: "currentColor", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fill: "currentColor", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={compact}
              width={42}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: "currentColor", strokeOpacity: 0.2 }} />
            <Area
              type="monotone"
              dataKey="setor"
              name="Setor"
              stroke="#22c55e"
              strokeWidth={2.5}
              fill="url(#setorFill)"
              isAnimationActive
              animationDuration={1000}
            />
            <Area
              type="monotone"
              dataKey="tarik"
              name="Tarik"
              stroke="#f59e0b"
              strokeWidth={2.5}
              fill="url(#tarikFill)"
              isAnimationActive
              animationDuration={1200}
            />
          </AreaChart>
        </ResponsiveContainer>
        ) : null}
      </div>
    </div>
  );
};

export default TrendChart;
