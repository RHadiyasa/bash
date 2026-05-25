"use client";

import { useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import formatRupiah from "@/lib/helpers/formatRupiah";

const COLORS = ["#22c55e", "#f59e0b"];

const ChartTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="rounded-lg border border-border bg-popover/95 px-3 py-2 text-xs shadow-xl backdrop-blur">
      <p className="flex items-center gap-2 text-foreground">
        <span
          className="inline-block h-2 w-2 rounded-full"
          style={{ background: item.payload.fill }}
        />
        {item.name}: {formatRupiah(item.value)}
      </p>
    </div>
  );
};

const CompositionChart = ({ deposit = 0, withdraw = 0 }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const total = deposit + withdraw;
  const data = [
    { name: "Setor", value: deposit, fill: COLORS[0] },
    { name: "Tarik", value: withdraw, fill: COLORS[1] },
  ];
  const depositPct = total > 0 ? Math.round((deposit / total) * 100) : 0;

  return (
    <div className="glass-card rounded-xl p-5">
      <div className="mb-2">
        <h2 className="text-base font-bold text-foreground">Komposisi</h2>
        <p className="text-xs text-muted-foreground">Setor vs tarik tunai</p>
      </div>

      <div className="relative h-48 w-full">
        {mounted ? (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={total > 0 ? data : [{ name: "Belum ada data", value: 1, fill: "hsl(var(--muted))" }]}
              dataKey="value"
              nameKey="name"
              innerRadius="62%"
              outerRadius="90%"
              paddingAngle={total > 0 ? 3 : 0}
              startAngle={90}
              endAngle={-270}
              isAnimationActive
              animationDuration={900}
              stroke="none"
            >
              {(total > 0 ? data : [{ fill: "hsl(var(--muted))" }]).map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Pie>
            {total > 0 ? <Tooltip content={<ChartTooltip />} /> : null}
          </PieChart>
        </ResponsiveContainer>
        ) : null}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black text-foreground">{depositPct}%</span>
          <span className="text-[0.7rem] font-semibold text-muted-foreground">setor</span>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" />
          <span className="text-muted-foreground">Setor</span>
        </div>
        <div className="flex items-center justify-end font-semibold text-foreground">
          {formatRupiah(deposit)}
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-500" />
          <span className="text-muted-foreground">Tarik</span>
        </div>
        <div className="flex items-center justify-end font-semibold text-foreground">
          {formatRupiah(withdraw)}
        </div>
      </div>
    </div>
  );
};

export default CompositionChart;
