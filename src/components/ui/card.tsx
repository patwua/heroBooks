import { cn } from "@/lib/utils";
import React from "react";
export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-2xl bg-slate-900/60 border border-slate-800 p-5", className)} {...props} />;
}
