"use client";

import { Toaster } from "react-hot-toast";

export default function ToasterProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster position="top-right" toastOptions={{
        duration: 4000,
        style: { borderRadius: "16px", padding: "12px 20px", fontSize: "14px" },
        success: { iconTheme: { primary: "#059669", secondary: "#fff" } },
        error: { iconTheme: { primary: "#dc2626", secondary: "#fff" } },
      }} />
    </>
  );
}
