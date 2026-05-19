"use client";

import { useState } from "react";
import { uploadImage } from "../lib/cloudinary";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  section: string;
  label?: string;
}

export default function ImageUpload({ value, onChange, section, label = "Upload Gambar" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi ukuran maksimal 2MB
    if (file.size > 2 * 1024 * 1024) {
      setError("Ukuran file maksimal adalah 2 MB");
      return;
    }

    setError("");
    setIsUploading(true);

    try {
      const url = await uploadImage(file, section);
      onChange(url); // Kirim URL ke state form (Hero, About, dll)
    } catch (err: any) {
      setError(err.message || "Gagal meng-upload gambar");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
        {label}
      </label>
      <div className="flex flex-col gap-3">
        {value && (
          <div className="relative w-full h-32 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
            className="block w-full text-sm text-slate-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-xl file:border-0
              file:text-xs file:font-semibold
              file:bg-indigo-50 file:text-indigo-600
              hover:file:bg-indigo-100
              disabled:opacity-50 cursor-pointer"
          />
          {isUploading && (
            <span className="absolute right-4 top-2 text-xs font-bold text-indigo-600 animate-pulse">
              Meng-upload...
            </span>
          )}
        </div>
        {error && <span className="text-xs text-red-500 font-semibold">{error}</span>}
      </div>
    </div>
  );
}
