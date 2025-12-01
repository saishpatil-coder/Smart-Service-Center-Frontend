export default function Features() {
  const items = [
    { icon: "🛠️", label: "Repairs" },
    { icon: "🚌", label: "Maintenance" },
    { icon: "📋", label: "Tracking" },
    { icon: "ℹ️", label: "Services" },
    { icon: "🔧", label: "Recommend" },
    { icon: "⚙️", label: "Tips" },
    { icon: "👍", label: "Updates" },
  ];

  return (
    <section className="py-20 max-w-7xl mx-auto px-6">
      <h2 className="text-4xl font-bold mb-10">
        In my <span className="font-extrabold">GARAGE</span>
      </h2>

      <div className="grid grid-cols-4 md:grid-cols-7 gap-6 text-center">
        {items.map((item, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="p-5 bg-blue-100 rounded-lg text-3xl">
              {item.icon}
            </div>
            <p className="mt-2 text-sm">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
