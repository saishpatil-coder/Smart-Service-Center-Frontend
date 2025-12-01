export default function Hero() {
  return (
    <section className="bg-[#6CA8F7] text-white py-20">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 px-6 items-center">
        {/* LEFT */}
        <div>
          <h1 className="text-5xl font-extrabold leading-tight">
            SERVICE
            <br />
            CENTER
          </h1>

          <p className="mt-4 text-white/90 text-lg max-w-sm">
            Find the nearest service center for your vehicle.
          </p>

          <div className="mt-8 flex gap-4">
            <button className="bg-white text-blue-600 px-5 py-2 font-semibold rounded-md">
              Book Now
            </button>
            <button className="bg-white text-blue-600 px-5 py-2 font-semibold rounded-md">
              Manage
            </button>
          </div>

          <button className="mt-4 underline">Learn More</button>
        </div>

        {/* RIGHT IMAGE */}
        <div className="flex justify-center">
          <img
            src="/assets/firetruck.jpg"
            className="w-96 h-96 rounded-full object-cover border-white border-[8px] shadow-lg"
          />
        </div>
      </div>
    </section>
  );
}
