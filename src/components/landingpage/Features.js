import {
  Wrench,
  Car,
  ClipboardList,
  Info,
  Settings,
  ThumbsUp,
  RefreshCw,
} from "lucide-react";

export default function Features() {
  const items = [
    { icon: <Wrench className="w-7 h-7 text-blue-600" />, label: "Repairs" },
    { icon: <Car className="w-7 h-7 text-blue-600" />, label: "Maintenance" },
    {
      icon: <ClipboardList className="w-7 h-7 text-blue-600" />,
      label: "Tracking",
    },
    { icon: <Info className="w-7 h-7 text-blue-600" />, label: "Services" },
    {
      icon: <Settings className="w-7 h-7 text-blue-600" />,
      label: "Recommend",
    },
    { icon: <RefreshCw className="w-7 h-7 text-blue-600" />, label: "Tips" },
    { icon: <ThumbsUp className="w-7 h-7 text-blue-600" />, label: "Updates" },
  ];

  return (
    <section className="py-24 max-w-7xl mx-auto px-6">
      <h2 className="text-4xl font-bold mb-12 text-gray-900">
        In my <span className="text-blue-600">GARAGE</span>
      </h2>

      <div className="grid grid-cols-3 md:grid-cols-7 gap-10 text-center">
        {items.map((item, i) => (
          <div key={i} className="flex flex-col items-center group transition">
            {/* Icon Box */}
            <div
              className="p-6 bg-blue-50 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)]
                            group-hover:bg-blue-100 transition"
            >
              {item.icon}
            </div>

            {/* Label */}
            <p className="mt-3 text-sm font-medium text-gray-700 group-hover:text-blue-600 transition">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
