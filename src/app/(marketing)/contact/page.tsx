import ContactClient from "./ContactClient";

export const metadata = {
  title: "Contact - heroBooks",
  description:
    "Contact heroBooks for sales, support, partnerships, press, billing, or general inquiries.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const subjectParam =
    typeof params.subject === "string" ? params.subject.toLowerCase() : "general";
  // key ensures component resets when subject changes
  return <ContactClient key={subjectParam} initialSubject={subjectParam} />;
}

