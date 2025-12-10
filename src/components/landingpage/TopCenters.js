export default function TopCenters() {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-10 text-gray-900">
        Top Rated Service Centers
      </h2>

      <div className="grid md:grid-cols-2 gap-12">
        {/* LEFT Main Highlight Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition cursor-pointer">
          <img src="/assets/bike.jpg" className="h-80 w-full object-cover" />

          <div className="p-5">
            <p className="text-blue-600 font-semibold text-lg">
              Premium Auto Care
            </p>

            <div className="flex items-center gap-2 mt-2">
              <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
              <p className="text-gray-500 text-sm">4.9 (1.2k reviews)</p>
            </div>

            <p className="text-gray-600 text-sm mt-3">
              Top-rated multi-brand service center located in Pune with expert
              mechanics and fast service.
            </p>

            <div className="flex items-center gap-3 mt-4">
              <img src="/assets/user1.jpg" className="w-8 h-8 rounded-full" />
              <div>
                <p className="font-semibold text-sm">Rahul Mech</p>
                <p className="text-xs text-gray-400">Senior Technician</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE STACK */}
        <div className="space-y-8">
          {/* Card 1 */}
          <div className="bg-white rounded-xl p-4 shadow hover:shadow-md transition flex gap-4 cursor-pointer">
            <img
              src="/assets/mec1.jpg"
              className="w-40 h-28 rounded-xl object-cover"
            />
            <div>
              <p className="text-blue-600 font-semibold">QuickFix Garage</p>

              <div className="text-yellow-500 text-sm mt-1">⭐⭐⭐⭐⭐</div>

              <p className="mt-2 text-sm text-gray-600">
                Trusted for fast turnaround time & top-quality repairs.
              </p>

              <p className="mt-3 text-sm text-gray-600 flex items-center gap-2">
                <img src="/assets/user2.jpg" className="w-6 h-6 rounded-full" />
                Alex Tune – Technician
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-xl p-4 shadow hover:shadow-md transition flex gap-4 cursor-pointer">
            <img
              src="/assets/tyre.jpg"
              className="w-40 h-28 rounded-xl object-cover"
            />
            <div>
              <p className="text-blue-600 font-semibold">WheelPro Services</p>

              <div className="text-yellow-500 text-sm mt-1">⭐⭐⭐⭐⭐</div>

              <p className="mt-2 text-sm text-gray-600">
                Specialists in tyre, alignment & balancing services.
              </p>

              <p className="mt-3 text-sm text-gray-600 flex items-center gap-2">
                <img src="/assets/user3.jpg" className="w-6 h-6 rounded-full" />
                Lisa Drive – Manager
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
