import ContactClient from "./ContactClient";

export const metadata = { title: "Contact — heroBooks", description: "Reach sales, support, partnerships, press, billing, or our general inbox." };

export default function ContactPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const subjectParam = typeof searchParams.subject === "string" ? searchParams.subject.toLowerCase() : "general";
  return <ContactClient initialSubject={subjectParam} />;
}

