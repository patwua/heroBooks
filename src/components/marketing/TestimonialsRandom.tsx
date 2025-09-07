import { chooseOnce } from "@/lib/randomize";
import { testimonialCopy, TestimonialKey } from "@/lib/copy/imageCopy";
import TestimonialClient from "./TestimonialClient";

export default function TestimonialsRandom() {
  const keys = Object.keys(testimonialCopy) as TestimonialKey[];
  const chosen = chooseOnce("hb_testimonial", keys);
  const t = testimonialCopy[chosen];
  const imgSrc = `/photos/testimonials/${chosen}.webp`;
  return (
    <TestimonialClient
      itemId={chosen}
      quote={t.quote}
      name={t.name}
      role={t.role}
      imgSrc={imgSrc}
    />
  );
}
