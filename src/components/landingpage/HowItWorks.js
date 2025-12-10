import { Wrench, Calendar, MapPin, Truck } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      title: "Choose Service Type",
      desc: "Select the type of service your vehicle needs.",
      icon: <Wrench className="w-8 h-8" />,
    },
    {
      title: "Select Date & Slot",
      desc: "Pick a convenient date and available time slot.",
      icon: <Calendar className="w-8 h-8" />,
    },
    {
      title: "Live Service Tracking",
      desc: "Monitor your service status in real-time.",
      icon: <MapPin className="w-8 h-8" />,
    },
    {
      title: "Vehicle Delivery",
      desc: "Your vehicle is delivered after completion.",
      icon: <Truck className="w-8 h-8" />,
    },
  ];

  return (
    <section className="py-24 bg-gray-50">
      <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
        How It Works
      </h2>

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Horizontal Line Behind Steps */}
        <div className="absolute top-[48px] left-0 w-full h-1 bg-blue-200 z-0"></div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              {/* Icon Wrapper */}
              <div className="bg-white shadow-md rounded-2xl p-6 border border-blue-100 relative z-10">
                <div className="text-blue-600">{step.icon}</div>
              </div>

              {/* Step Title */}
              <h3 className="font-semibold text-lg mt-6">{step.title}</h3>

              {/* Step Description */}
              <p className="text-gray-600 mt-2 text-sm max-w-[180px]">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
