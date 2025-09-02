import { listUserOrgs } from "@/lib/tenant";
import OrgSwitcherClient from "./OrgSwitcherClient";

type Option = { id: string; name: string; logoUrl: string | null };

export default async function OrgSwitcher() {
  const orgs = await listUserOrgs();
  const options: Option[] = orgs.map((o) => ({
    id: o.org.id,
    name: o.org.name,
    logoUrl: (o.org.theme?.logoUrl as string | null) ?? null,
  }));
  return <OrgSwitcherClient orgs={options} />;
}
