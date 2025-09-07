"use client";
import { useEffect } from "react";

export default function Toast({ type, message, onDone, timeout = 3200 }: { type: "success" | "error"; message: string; onDone: () => void; timeout?: number }) {
  useEffect(() => {
    const t = setTimeout(onDone, timeout);
    return () => clearTimeout(t);
  }, [onDone, timeout]);
  return (
    <div className="fixed inset-x-0 bottom-4 z-[100] flex justify-center px-4">
      <div className={`w-full max-w-md rounded-xl border px-4 py-3 text-sm shadow-md ${type === "success" ? "border-emerald-300 bg-emerald-50 text-emerald-900" : "border-red-300 bg-red-50 text-red-900"}`}>
        {message}
      </div>
    </div>
  );
}

