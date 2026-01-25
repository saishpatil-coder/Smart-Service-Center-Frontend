"use client";

import { Upload, X } from "lucide-react";
import { toast } from "react-toastify";

export default function CloudinaryUpload({
  file,
  setFile,
  preview,
  setPreview,
}) {
  const handleSelect = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (selected.size > 5 * 1024 * 1024) {
      return toast.error("Image size should be less than 5MB");
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleClear = () => {
    setFile(null);
    setPreview(null);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
        3. Attachment (Optional)
      </label>

      {!preview ? (
        <label className="group flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 hover:bg-blue-50 hover:border-blue-300 transition-all cursor-pointer">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload
              className="text-slate-400 group-hover:text-blue-500 mb-2"
              size={24}
            />
            <p className="text-sm text-slate-500 font-medium">
              Click to upload photo
            </p>
            <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold">
              JPG, PNG up to 5MB
            </p>
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleSelect}
          />
        </label>
      ) : (
        <div className="relative w-40 aspect-square rounded-2xl overflow-hidden border-4 border-white shadow-lg group">
          <img
            src={preview}
            alt="preview"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
