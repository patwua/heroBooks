import { cn } from "@/lib/utils";
import React from "react";
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-xl border px-3 py-2 text-sm outline-none",
        // light/dark theme tokens
        "bg-background text-foreground border-input focus:ring-1 focus:ring-ring",
        "dark:bg-neutral-900 dark:text-neutral-100 dark:border-neutral-700",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
