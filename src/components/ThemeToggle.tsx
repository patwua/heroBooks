"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const current = theme === "system" ? systemTheme : theme;

  return (
    <button
      onClick={() => setTheme(current === "dark" ? "light" : "dark")}
      className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
      aria-label="Toggle dark mode"
    >
      {current === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
