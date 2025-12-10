import { Search } from "lucide-react";

export default function SearchCenter() {
  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-[0_4px_14px_rgba(0,0,0,0.06)] -mt-12 relative z-20">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Find a Service Center
      </h2>

      <div className="flex items-center gap-4">
        {/* Input Wrapper with Icon */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />

          <input
            type="text"
            placeholder="Search by city, pincode, or service center name"
            className="w-full border border-gray-300 pl-12 pr-4 py-3 rounded-xl text-gray-700 bg-gray-50 
                       focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none transition-all"
          />
        </div>

        {/* Button */}
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-sm transition">
          Search
        </button>
      </div>
    </div>
  );
}
