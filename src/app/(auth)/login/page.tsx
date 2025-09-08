import { redirect } from "next/navigation";

export default function LegacyLoginRedirect() {
  // Hard redirect any legacy /login usages to the canonical sign-in
  redirect("/sign-in");
}

