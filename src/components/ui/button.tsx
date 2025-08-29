import { cn } from "@/src/lib/utils";
import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary"|"outline" };
export function Button({ className, variant="primary", ...props }: Props) {
  const base = "px-4 py-2 rounded-2xl text-sm font-medium transition shadow";
  const styles = variant === "primary"
    ? "bg-brand hover:opacity-90 text-white"
    : "border border-slate-700 hover:bg-slate-800";
  return <button className={cn(base, styles, className)} {...props} />;
}
