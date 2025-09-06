import { cookies } from "next/headers";
import SignInClient from "./SignInClient";

export default function SignInPage({
  searchParams,
}: {
  searchParams?: { exists?: string; reset?: string };
}) {
  const c = cookies();
  const hadDemoBefore =
    c.get("hb_demo")?.value === "1" || Boolean(c.get("hb_demo_last")?.value);
  const reset = searchParams?.reset === "1";
  const exists = searchParams?.exists === "1";
  return (
    <SignInClient hadDemoBefore={hadDemoBefore} reset={reset} exists={exists} />
  );
}
