import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "heroBooks — Modern Accounting for Guyana",
  description: "Guyana-ready accounting with VAT, WHT, and clean APIs.",
  icons: { icon: "/favicon.svg" },
  metadataBase: new URL("https://herobooks.net")
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
