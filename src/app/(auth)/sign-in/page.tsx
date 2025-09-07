import { cookies } from "next/headers";
import SignInClient from "./SignInClient";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ exists?: string; reset?: string }>;
}) {
  const params = await searchParams;
  const c = await cookies();
  const hadDemoBefore =
    c.get("hb_demo")?.value === "1" || Boolean(c.get("hb_demo_last")?.value);
  const reset = params.reset === "1";
  const exists = params.exists === "1";
  return (
    <SignInClient hadDemoBefore={hadDemoBefore} reset={reset} exists={exists} />
  );
}
