"use client";

import { useState, useEffect, useMemo } from "react";
import {
  FilePlus,
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Clock,
  IndianRupee,
  Calendar,
  Image as ImageIcon,
  X,
  ChevronRight,
  Loader,
} from "lucide-react";
import { getAllServices } from "@/services/admin.service";
import { addTicket } from "@/services/client.service";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";
import CloudinaryUpload from "@/components/dash/client/ImageUpload";

export default function CreateTicketPage() {
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const [data, setData] = useState({
    serviceId: "",
    description: "",
  });

  const [selectedService, setSelectedService] = useState(null);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  /* ------------------ Fetch Services ------------------ */
  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await getAllServices();
        setServices(res.data || []);
      } catch (err) {
        toast.error("Failed to load available services");
      } finally {
        setLoadingServices(false);
      }
    }
    fetchServices();
  }, []);
const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "ccscms");
  formData.append("cloud_name", "daoz0nloc");

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/daoz0nloc/image/upload",
    {
      method: "POST",
      body: formData,
    },
  );

  const result = await res.json();

  if (!result.secure_url) {
    throw new Error("Cloudinary upload failed");
  }

  return result.secure_url;
};

  /* ------------------ Derived SLA Preview ------------------ */
  const slaPreview = useMemo(() => {
    if (!selectedService) return null;

    const now = new Date();
    const severity = selectedService.Severity || {};
    const acceptMs = (severity.max_accept_minutes || 0) * 60000;
    const assignMs = (severity.max_assign_minutes || 0) * 60000;
    const hoursMs = (selectedService.defaultExpectedHours || 0) * 3600000;

    return {
      slaAcceptDeadline: new Date(now.getTime() + acceptMs),
      slaAssignDeadline: new Date(now.getTime() + assignMs),
      expectedCompletionAt: new Date(
        now.getTime() + acceptMs + assignMs + hoursMs,
      ),
      expectedHours: selectedService.defaultExpectedHours,
      expectedCost: selectedService.defaultCost,
    };
  }, [selectedService]);



  const clearImage = () => {
    setImage(null);
    setPreview(null);
  };

  const handleServiceChange = (id) => {
    setData({ ...data, serviceId: id });
    const service = services.find((s) => s.id === id);
    setSelectedService(service || null);
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoadingSubmit(true);

  try {
    let imageUrl = null;

    // 1. Upload image ONLY NOW (on submit)
    if (image) {
      imageUrl = await uploadToCloudinary(image);
      console.log("URL : ",imageUrl)
    }

    // 2. Call backend with Cloudinary URL
    const payload = {
      serviceId: data.serviceId,
      description: data.description,
      image: imageUrl, // send URL, not file
    };

    const res = await addTicket(payload);

    toast.success(res.message || "Ticket created successfully!");

    // Reset
    setData({ serviceId: "", description: "" });
    setSelectedService(null);
    setImage(null);
    setPreview(null);
  } catch (err) {
    toast.error("Failed to create ticket.");
  } finally {
    setLoadingSubmit(false);
  }
};

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3 text-blue-600">
          <FilePlus size={32} strokeWidth={2.5} />
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Create Request
          </h1>
        </div>
        <p className="text-slate-500 font-medium">
          Please provide the details of your service requirement.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            {/* SERVICE SELECT */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                1. Select Service Type
              </label>
              {loadingServices ? (
                <div className="animate-pulse justify-center align-center h-12 bg-slate-100 flex rounded-xl">
                  <Loader2 />
                  Loading Services
                </div>
              ) : (
                <select
                  className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-slate-900 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none appearance-none cursor-pointer font-medium"
                  value={data.serviceId}
                  onChange={(e) => handleServiceChange(e.target.value)}
                  required
                >
                  <option value="">Choose from available services...</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.serviceTitle} — {s.type}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* DESCRIPTION */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                2. Issue Description
              </label>
              <textarea
                placeholder="Explain the problem in detail to help our technicians understand better..."
                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl text-slate-900 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none min-h-[150px] resize-none leading-relaxed"
                value={data.description}
                onChange={(e) =>
                  setData({ ...data, description: e.target.value })
                }
                required
              />
            </div>

            {/* IMAGE UPLOAD */}
            <CloudinaryUpload
              file={image}
              setFile={setImage}
              preview={preview}
              setPreview={setPreview}
            />
          </div>

          <button
            type="submit"
            disabled={loadingSubmit || !data.serviceId}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-3 active:scale-[0.98]"
          >
            {loadingSubmit ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                Submit Request <ChevronRight size={20} />
              </>
            )}
          </button>
        </form>

        {/* Right Sidebar - Preview & SLA */}
        <div className="lg:col-span-5 space-y-6">
          <div
            className={cn(
              "bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-500",
              !selectedService
                ? "opacity-50 grayscale pointer-events-none"
                : "opacity-100",
            )}
          >
            <div className="bg-slate-900 p-6 text-white">
              <h3 className="text-lg font-bold">Service Summary</h3>
              <p className="text-slate-400 text-sm mt-1">
                {selectedService?.serviceTitle ||
                  "Select a service to see details"}
              </p>
            </div>

            <div className="p-6 space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2 text-blue-600 mb-1">
                    <Clock size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      Duration
                    </span>
                  </div>
                  <p className="text-xl font-bold text-slate-900">
                    {slaPreview?.expectedHours || 0} hrs
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2 text-emerald-600 mb-1">
                    <IndianRupee size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      Base Cost
                    </span>
                  </div>
                  <p className="text-xl font-bold text-slate-900">
                    ₹ {slaPreview?.expectedCost || 0}
                  </p>
                </div>
              </div>

              {/* SLA Timeline */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  SLA Deadlines
                </h4>
                <div className="space-y-3">
                  <TimelineItem
                    icon={<CheckCircle2 size={14} />}
                    label="Center Acceptance"
                    time={slaPreview?.slaAcceptDeadline}
                  />
                  <TimelineItem
                    icon={<Clock size={14} />}
                    label="Technician Assigned"
                    time={slaPreview?.slaAssignDeadline}
                  />
                  <TimelineItem
                    icon={<Calendar size={14} />}
                    label="Expected Delivery"
                    time={slaPreview?.expectedCompletionAt}
                    isHighlight
                  />
                </div>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex gap-3">
                <AlertCircle className="text-amber-600 shrink-0" size={18} />
                <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                  Deadlines are calculated based on service severity. Our team
                  will aim to resolve issues faster than estimated.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TimelineItem({ icon, label, time, isHighlight }) {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-3 rounded-xl border transition-colors",
        isHighlight
          ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100"
          : "bg-white border-slate-100 text-slate-600",
      )}
    >
      <div className="flex items-center gap-3">
        <span className={isHighlight ? "text-white" : "text-slate-400"}>
          {icon}
        </span>
        <span className="text-sm font-semibold">{label}</span>
      </div>
      <span
        className={cn(
          "text-[11px] font-bold",
          isHighlight ? "text-blue-100" : "text-slate-400",
        )}
      >
        {time
          ? time.toLocaleString([], {
              hour: "2-digit",
              minute: "2-digit",
              day: "2-digit",
              month: "short",
            })
          : "--:--"}
      </span>
    </div>
  );
}
