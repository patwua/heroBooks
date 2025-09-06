import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Forgot Password — heroBooks",
};

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // No UI wrapper needed—just host metadata on the server side.
  return children;
}
