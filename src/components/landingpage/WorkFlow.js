export default function Workflow() {
  const steps = [
    {
      id: "01",
      title: "Smart Booking",
      text: "Client logs an issue with photos and details.",
    },
    {
      id: "02",
      title: "Admin Triage",
      text: "Managers approve costs and set SLA deadlines.",
    },
    {
      id: "03",
      title: "Expert Repair",
      text: "Mechanics clock-in and log used parts in real-time.",
    },
    {
      id: "04",
      title: "Finalized",
      text: "Digital invoice generated and vehicle released.",
    },
  ];

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-center text-3xl font-black text-slate-900 mb-16 uppercase tracking-tighter">
          The Workshop Lifecycle
        </h2>
        <div className="grid md:grid-cols-4 gap-4">
          {steps.map((step, i) => (
            <div
              key={i}
              className="relative p-8 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden"
            >
              <span className="absolute -top-4 -right-2 text-8xl font-black text-slate-50 opacity-10">
                {step.id}
              </span>
              <h4 className="text-lg font-bold text-slate-900 mb-2 relative z-10">
                {step.title}
              </h4>
              <p className="text-sm text-slate-500 font-medium relative z-10">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
