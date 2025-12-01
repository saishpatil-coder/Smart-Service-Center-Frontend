export default function HowItWorks() {
  const steps = [
    {
      title: "Book Your Slot",
      desc: "Schedule your service online in seconds.",
    },
    { title: "Vehicle Pickup", desc: "We pick up your vehicle safely." },
    { title: "Live Tracking", desc: "Track service progress in real-time." },
    {
      title: "Home Delivery",
      desc: "Get your vehicle delivered post service.",
    },
  ];

  return (
    <section className="py-20 bg-gray-100">
      <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>

      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10 px-6">
        {steps.map((step, i) => (
          <div key={i} className="text-center">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
              {i + 1}
            </div>
            <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
            <p className="text-gray-600">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
