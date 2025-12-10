import { Quote } from "lucide-react";

export default function Testimonials() {
  const data = [
    {
      name: "Rohit Sharma",
      msg: "Amazing service! Quick turnaround and excellent customer support.",
      role: "Car Owner",
      img: "/assets/user1.jpg",
    },
    {
      name: "Priya Desai",
      msg: "Very professional and transparent throughout the entire process.",
      role: "Bike Owner",
      img: "/assets/user2.jpg",
    },
    {
      name: "Amit Kumar",
      msg: "Live tracking helped me stay updated at every step. Loved it!",
      role: "SUV Owner",
      img: "/assets/user3.jpg",
    },
  ];

  return (
    <section className="py-24 bg-gray-50">
      <h2 className="text-4xl font-bold text-center text-gray-900 mb-14">
        What Customers Say
      </h2>

      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10 px-6">
        {data.map((t, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-8 shadow-[0_4px_18px_rgba(0,0,0,0.06)]
                       hover:shadow-[0_6px_24px_rgba(0,0,0,0.10)] transition cursor-pointer"
          >
            {/* Quote Icon */}
            <Quote className="w-8 h-8 text-blue-600 mb-4" />

            {/* Message */}
            <p className="text-gray-700 leading-relaxed mb-6">“{t.msg}”</p>

            {/* Profile */}
            <div className="flex items-center gap-4 mt-4">
             

              <div>
                <p className="font-semibold text-gray-900">{t.name}</p>
                <p className="text-sm text-gray-500">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
