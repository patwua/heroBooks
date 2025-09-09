import ContactClient from "./ContactClient"
import Page from "@/components/UX/Page"
import SectionCard from "@/components/UX/SectionCard"

export default function ContactPage() {
  return (
    <Page title="Contact" subtitle="We’re happy to help.">
      <SectionCard>
        <ContactClient />
      </SectionCard>
    </Page>
  )
}

