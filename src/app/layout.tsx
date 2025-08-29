import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "heroBooks",
  description: "Accounting online"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
