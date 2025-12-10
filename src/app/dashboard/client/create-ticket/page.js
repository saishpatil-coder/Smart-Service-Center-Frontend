"use client";

import { useState, useEffect } from "react";
import {
  FilePlus,
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { getAllServices } from "@/services/admin.service";
import { addTicket } from "@/services/client.service";

export default function CreateTicketPage() {
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const [data, setData] = useState({
    serviceId: "",
    title: "",
    description: "",
    expectedCompletionHours: "",
    expectedCost: "",
  });

  const [selectedService, setSelectedService] = useState(null);

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  /* ------------------ Fetch Services ------------------ */
  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await getAllServices();
        setServices(res.data || []);
        console.log(res.data)
      } catch (err) {
        console.log(err);
      } finally {
        setLoadingServices(false);
      }
    }
    fetchServices();
  }, []);

  /* ------------------ Handle Image Preview ------------------ */
  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  /* ------------------ Handle Service Selection ------------------ */
  const handleServiceSelect = (id) => {
    setData({ ...data, serviceId: id });

    const service = services.find((s) => s.id === id);
    setSelectedService(service || null);

    if (service) {
      setData((prev) => ({
        ...prev,
        expectedCompletionHours: service.defaultExpectedHours || "",
        expectedCost: service.defaultCost || "",
      }));
    }
  };

  /* ------------------ Submit Handler ------------------ */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoadingSubmit(true);

    try {
      const formData = new FormData();

      formData.append("serviceId", data.serviceId);
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("expectedCompletionHours", data.expectedCompletionHours);
      formData.append("expectedCost", data.expectedCost);

      if (image) formData.append("image", image);

      await addTicket(formData);

      setSuccessMsg("Ticket created successfully!");
      setData({
        serviceId: "",
        title: "",
        description: "",
        expectedCompletionHours: "",
        expectedCost: "",
      });
      setSelectedService(null);
      setImage(null);
      setPreview(null);
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || "Failed to create ticket.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <FilePlus size={28} className="text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-800">Create New Ticket</h1>
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md max-w-3xl space-y-4"
      >
        {/* SERVICE SELECT */}
        <div>
          <label className="font-semibold">Select Service</label>

          {loadingServices ? (
            <div className="animate-pulse mt-2 h-12 bg-gray-200 rounded-lg"></div>
          ) : (
            <select
              className="w-full border p-3 rounded-lg mt-1 bg-gray-50 outline-blue-500"
              value={data.serviceId}
              onChange={(e) => handleServiceSelect(e.target.value)}
              required
            >
              <option value="">Choose a service</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.serviceTitle} ({s.type})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* SHOW SERVICE DETAILS */}
        {selectedService && (
          <div className="p-4 border rounded-lg bg-blue-50 shadow-sm">
            <h3 className="font-bold text-blue-700">
              {selectedService.serviceTitle}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {selectedService.description}
            </p>

            <div className="flex gap-4 mt-3 text-sm">
              <span className="font-semibold">
                Expected Hours:{" "}
                <span className="text-gray-700">
                  {selectedService.defaultExpectedHours || "N/A"}
                </span>
              </span>

              <span className="font-semibold">
                Cost:{" "}
                <span className="text-gray-700">
                  ₹ {selectedService.defaultCost || "N/A"}
                </span>
              </span>
            </div>
          </div>
        )}

        {/* TITLE */}
        <div>
          <label className="font-semibold">Title</label>
          <input
            type="text"
            placeholder="Short title (e.g., 'Engine noise issue')"
            className="w-full border p-3 rounded-lg mt-1 bg-gray-50 outline-blue-500"
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
            required
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="font-semibold">Description</label>
          <textarea
            placeholder="Describe the problem in detail..."
            className="w-full border p-3 rounded-lg mt-1 bg-gray-50 outline-blue-500 min-h-[120px]"
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
          />
        </div>

        {/* HOURS + COST */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-semibold">Expected Completion Hours</label>
            <input
              type="number"
              className="w-full border p-3 rounded-lg mt-1 bg-gray-50 outline-blue-500"
              value={data.expectedCompletionHours}
              onChange={(e) =>
                setData({ ...data, expectedCompletionHours: e.target.value })
              }
            />
          </div>

          <div>
            <label className="font-semibold">Expected Cost</label>
            <input
              type="number"
              className="w-full border p-3 rounded-lg mt-1 bg-gray-50 outline-blue-500"
              value={data.expectedCost}
              onChange={(e) =>
                setData({ ...data, expectedCost: e.target.value })
              }
            />
          </div>
        </div>

        {/* IMAGE INPUT */}
        <div>
          <label className="font-semibold">Upload Image (optional)</label>
          <div className="w-full border p-3 rounded-lg mt-2 flex items-center gap-3 bg-gray-50">
            <Upload size={20} className="text-gray-600" />
            <input type="file" accept="image/*" onChange={handleImage} />
          </div>

          {/* PREVIEW */}
          {preview && (
            <div className="mt-3">
              <img
                src={preview}
                alt="preview"
                className="w-40 rounded shadow-md border"
              />
            </div>
          )}
        </div>

        {/* SUCCESS */}
        {successMsg && (
          <div className="flex items-center gap-3 bg-green-100 text-green-700 border border-green-300 p-3 rounded-lg">
            <CheckCircle2 size={20} />
            {successMsg}
          </div>
        )}

        {/* ERROR */}
        {errorMsg && (
          <div className="flex items-center gap-3 bg-red-100 text-red-700 border border-red-300 p-3 rounded-lg">
            <AlertCircle size={20} />
            {errorMsg}
          </div>
        )}

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loadingSubmit}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center"
        >
          {loadingSubmit ? (
            <>
              <Loader2 className="animate-spin mr-2" /> Creating Ticket...
            </>
          ) : (
            "Create Ticket"
          )}
        </button>
      </form>
    </div>
  );
}
