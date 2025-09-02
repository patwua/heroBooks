import { listUserOrgs } from "@/lib/tenant";
import OrgSwitcherClient from "./OrgSwitcherClient";

export default async function OrgSwitcher() {
  const orgs = await listUserOrgs();
  const options = orgs.map((o) => ({
    id: o.org.id,
    name: o.org.name,
    logoUrl: o.org.logoUrl ?? null,
  }));
  return <OrgSwitcherClient orgs={options} />;
}
