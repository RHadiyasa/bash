"use client";

import { useEffect, useState } from "react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

const StatCard = ({
  title,
  value,
  unit,
  icon,
  trend,
  color = "hsl(var(--primary))",
  delta,
}) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const gradientId = `spark-${title.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className="glass-card group relative overflow-hidden rounded-xl p-5 transition-transform duration-300 hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </p>
        <span
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary"
          style={{ color }}
        >
          {icon}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-baseline gap-1.5">
        <span className="text-xl font-black leading-tight tracking-tight text-foreground tabular-nums sm:text-2xl">
          {value}
        </span>
        {unit ? (
          <span className="text-xs font-semibold text-muted-foreground">
            {unit}
          </span>
        ) : null}
      </div>

      {delta ? (
        <p className="mt-1.5 text-xs font-semibold text-muted-foreground">
          {delta}
        </p>
      ) : null}

      {mounted && trend && trend.length > 1 ? (
        <div className="mt-3 h-10 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke={color}
                strokeWidth={2}
                fill={`url(#${gradientId})`}
                isAnimationActive
                animationDuration={900}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : null}
    </div>
  );
};

export default StatCard;
