import TestimonialsClient from "./TestimonialsClient";
import { chooseNOnce } from "@/lib/randomize";
import { testimonialCopy, TestimonialKey } from "@/lib/copy/imageCopy";

const headings = [
  "Trusted by local professionals",
  "Trusted by local trades",
  "Trusted by growing businesses in Guyana",
];

export default async function TestimonialsSection() {
  const entries = Object.entries(testimonialCopy) as [
    TestimonialKey,
    (typeof testimonialCopy)[TestimonialKey]
  ][];
  const selected = await chooseNOnce("hb_testimonials", entries, 3);
  const heading = headings[Math.floor(Math.random() * headings.length)];

  return (
    <section id="testimonials" className="border-t">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <TestimonialsClient heading={heading} entries={selected} />
      </div>
    </section>
  );
}
