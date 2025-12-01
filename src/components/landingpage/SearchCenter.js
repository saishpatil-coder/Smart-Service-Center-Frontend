export default function SearchCenter() {
  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md -mt-10 relative z-10">
      <h2 className="text-xl font-semibold text-gray-800 mb-3">
        Find a Service Center
      </h2>
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Enter your city or pincode"
          className="flex-1 border p-3 rounded-lg"
        />
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg">
          Search
        </button>
      </div>
    </div>
  );
}
