export default function Hero() {
  return (
    <section className="bg-[#6CA8F7] text-white py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 px-6 items-center relative">
        {/* LEFT */}
        <div>
          <h1 className="text-6xl font-extrabold leading-tight tracking-tight">
            SERVICE <br /> CENTER
          </h1>

          <p className="mt-6 text-white/90 text-xl max-w-sm font-medium leading-relaxed">
            Manage, book, and track vehicle services with ease and reliability.
          </p>

          {/* Buttons Row */}
          <div className="flex items-center gap-4 mt-10">
            <button className="bg-white text-black text-sm font-semibold px-4 py-2 rounded-full shadow-sm">
              Book Service
            </button>
            <button className="bg-white text-black text-sm font-semibold px-4 py-2 rounded-full shadow-sm">
              Manage Services
            </button>
          </div>

          {/* Learn More */}
          <button className="mt-6 bg-white text-black px-6 py-2 rounded-full font-semibold shadow">
            Learn More
          </button>
        </div>

        {/* RIGHT IMAGE (Large Oval, Cropped, No Border) */}
        <div className="flex justify-center md:justify-end">
          <div className="w-[700px] h-[380px] rounded-[200px] overflow-hidden shadow-xl transform translate-x-10 md:translate-x-24">
            <img
              src="/assets/login-bg.jpg"
              alt="Service Center"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
