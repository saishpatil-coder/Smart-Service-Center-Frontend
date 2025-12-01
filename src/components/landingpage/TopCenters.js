export default function TopCenters() {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Top Rated Service Centers</h2>

      <div className="grid md:grid-cols-2 gap-10">
        {/* LEFT Featured Card */}
        <div>
          <img
            src="/assets/bike.jpg"
            className="rounded-lg h-72 w-full object-cover"
          />

          <div className="flex justify-between text-xs mt-2">
            <p className="text-gray-500">View Centers</p>
            <p className="text-gray-500">3 min read</p>
          </div>

          <div className="flex items-center gap-3 mt-3">
            <img src="/assets/user1.jpg" className="w-8 h-8 rounded-full" />
            <div>
              <p className="font-semibold text-sm">Expert Care</p>
              <p className="text-xs text-gray-500">April 25, 2023</p>
            </div>
          </div>
        </div>

        {/* RIGHT Article Stack */}
        <div className="space-y-6">
          {/* Card 1 */}
          <div className="flex gap-4">
            <img
              src="/assets/mec1.jpg"
              className="w-40 h-28 rounded-lg object-cover"
            />
            <div>
              <p className="font-semibold">Quick Repairs</p>
              <p className="text-xs text-gray-400">2 min read</p>
              <p className="mt-2 text-sm text-gray-600 flex items-center gap-2">
                <img src="/assets/user2.jpg" className="w-6 h-6 rounded-full" />
                Alex Tune • April 20, 2023
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="flex gap-4">
            <img src="/assets/tyre.jpg" className="w-40 h-28 rounded-lg" />
            <div>
              <p className="font-semibold">
                Why Regular Maintenance is Essential?
              </p>
              <p className="text-xs text-gray-400">6 min read</p>
              <p className="mt-2 text-sm text-gray-600 flex items-center gap-2">
                <img src="/assets/user3.jpg" className="w-6 h-6 rounded-full" />
                Lisa Drive • April 22, 2023
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
    