export default function StatsCards() {
  const stats = [
    { title: "Total Tickets", value: 120, change: "+12%" },
    { title: "Resolved", value: 95, change: "+5%" },
    { title: "Pending", value: 18, change: "−3%" },
    { title: "Mechanics Active", value: 7, change: "+1" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white border shadow-sm p-6 rounded-xl hover:shadow-md transition"
        >
          <p className="text-gray-500 text-sm">{stat.title}</p>
          <p className="text-3xl font-semibold mt-2">{stat.value}</p>
          <span className="text-sm text-green-600">{stat.change}</span>
        </div>
      ))}
    </div>
  );
}
