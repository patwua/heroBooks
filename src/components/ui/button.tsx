import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn("rounded bg-blue-600 px-4 py-2 text-white", className)}
      {...props}
    />
  );
}
