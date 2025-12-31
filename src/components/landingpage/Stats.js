export default function Stats() {
  return (
    <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-4xl font-black tracking-tight leading-tight">
            Data-driven workshop <br />
            <span className="text-blue-500 italic">optimization.</span>
          </h2>
          <p className="mt-6 text-slate-400 text-lg leading-relaxed max-w-md">
            Our system tracks every nut and bolt. From revenue growth to
            mechanic efficiency, get the insights you need to scale.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-8">
            <StatItem label="Tickets Resolved" value="12k+" />
            <StatItem label="Revenue Tracked" value="₹2.4Cr" />
            <StatItem label="Uptime" value="99.9%" />
            <StatItem label="SLA Compliance" value="94%" />
          </div>
        </div>
        <div className="relative">
          {/* Decorative Code/Data element */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
            </div>
            <pre className="text-blue-400 text-xs font-mono leading-relaxed">
              {`{
  "workshop_status": "OPTIMIZED",
  "active_mechanics": 14,
  "inventory_health": "HEALTHY",
  "daily_throughput": 128
}`}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatItem({ label, value }) {
  return (
    <div className="space-y-1">
      <p className="text-3xl font-black text-white tracking-tighter">{value}</p>
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
        {label}
      </p>
    </div>
  );
}
