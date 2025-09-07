import ContactClient from "./ContactClient";

export const metadata = {
  title: "Contact — heroBooks",
  description:
    "Contact heroBooks for sales, support, partnerships, press, billing, or general inquiries.",
};

export default function ContactPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const subjectParam = typeof searchParams.subject === "string" ? searchParams.subject.toLowerCase() : "general";
  return <ContactClient initialSubject={subjectParam} />;
}

