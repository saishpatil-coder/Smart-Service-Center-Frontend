import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Trophy, CheckCircle2, Clock } from "lucide-react";
import api from "@/lib/axios";

export const Leaderboard = ({ timeframe }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Matching the new backend endpoint and response structure
    api
      .get(`/admin/dashboard/leaderboard?timeframe=${timeframe}`)
      .then((res) => {
        // Mapping backend keys to frontend-friendly names
        const formattedData = res.data.map((item) => ({
          name: `${item["mechanic.name"]}`,
          efficiency: parseFloat(item.efficiency),
          total: parseInt(item.totalCompleted),
          onTime: parseInt(item.onTimeTasks),
        }));
        setData(formattedData);
      })
      .catch((err) => console.error("Leaderboard Load Error:", err))
      .finally(() => setLoading(false));
  }, [timeframe]);

  // Custom Tooltip to show all 3 values
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-white p-4 shadow-xl border border-slate-100 rounded-2xl">
          <p className="font-bold text-slate-800 mb-2">{d.name}</p>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between gap-4">
              <span className="text-slate-500">Efficiency:</span>
              <span className="font-mono font-bold text-blue-600">
                {d.efficiency}%
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-500">On-Time:</span>
              <span className="font-mono text-emerald-600">
                {d.onTime} tasks
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-500">Total:</span>
              <span className="font-mono text-slate-700">{d.total} tasks</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 font-mono">
          <Trophy size={16} className="text-amber-500" /> Mechanic Performance
        </h3>
        {/* Quick stats legend */}
        <div className="flex gap-3 text-[10px] font-bold uppercase text-slate-400">
          <span className="flex items-center gap-1">
            <CheckCircle2 size={12} className="text-emerald-500" /> On-Time
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} className="text-blue-500" /> Efficiency %
          </span>
        </div>
      </div>

      <div className="h-[340px] flex items-center justify-center">
        {loading ? (
          <div className="w-10 h-10 border-4 border-slate-100 border-t-amber-500 rounded-full animate-spin" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ left: 20, right: 30 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={true}
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis type="number" domain={[0, 100]} hide />
              <YAxis
                dataKey="name"
                type="category"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#1e293b", fontWeight: 500 }}
                width={140}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "#f8fafc" }}
              />

              {/* The main Efficiency Bar */}
              <Bar dataKey="efficiency" radius={[0, 8, 8, 0]} barSize={24}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.efficiency > 85
                        ? "#10b981"
                        : entry.efficiency > 60
                        ? "#3b82f6"
                        : "#f43f5e"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
