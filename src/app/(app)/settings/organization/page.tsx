import { Metadata } from "next"
import TaxesPanel from "./TaxesPanel"
import UiSettingsPanel from "@/components/app/UiSettingsPanel"

export const metadata: Metadata = {
  title: "Organization Settings",
}

export default function OrganizationSettingsPage() {
  return (
    <div className="space-y-8">
      <div>Organization — TODO: legal name, address, VAT, sequences.</div>
      <section id="taxes">
        <TaxesPanel />
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">UI & Theme</h2>
        {/* @ts-expect-error Client Component */}
        <UiSettingsPanel />
      </section>
    </div>
  )
}

