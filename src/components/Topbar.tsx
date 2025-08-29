"use client";
import { usePathname } from "next/navigation";

export default function Topbar() {
  const path = usePathname();
  const title = path?.split("/").at(-1) || "Dashboard";
  return (
    <header className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
      <h1 className="text-lg font-semibold capitalize">{title}</h1>
      <div className="text-xs text-slate-400">Guyana (GYD)</div>
    </header>
  );
}
