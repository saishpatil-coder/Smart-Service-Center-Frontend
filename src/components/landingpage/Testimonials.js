export default function Testimonials() {
  const data = [
    { name: "Rohit Sharma", msg: "Amazing service and fast delivery!" },
    { name: "Priya Desai", msg: "Very professional and transparent." },
    { name: "Amit Kumar", msg: "Tracking feature is super helpful." },
  ];

  return (
    <section className="py-20 bg-gray-100">
      <h2 className="text-3xl font-bold text-center mb-12">
        What Customers Say
      </h2>

      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 px-6">
        {data.map((t, i) => (
          <div key={i} className="bg-white p-6 shadow rounded-xl">
            <p className="text-gray-700 italic">“{t.msg}”</p>
            <p className="mt-4 font-bold">{t.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
