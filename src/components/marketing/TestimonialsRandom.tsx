import Image from "next/image";
import { chooseOnce } from "@/lib/randomize";

const TESTIMONIALS = [
  { img: "/photos/testimonials/shop-owner.webp", quote: "heroBooks saves me hours every VAT month.", name: "Shawn — Shop owner, Georgetown" },
  { img: "/photos/testimonials/salon-owner.webp", quote: "Invoices and receipts my customers love.", name: "Latoya — Salon owner, New Amsterdam" },
  { img: "/photos/testimonials/transport-owner.webp", quote: "Bank imports and reconciliation are a breeze.", name: "Marcus — Logistics, Linden" },
];

export default function TestimonialsRandom() {
  const t = chooseOnce("hb_testimonial", TESTIMONIALS);

  return (
    <section className="mt-16">
      <div className="rounded-2xl border p-6 grid gap-6 sm:grid-cols-[120px_1fr] items-center bg-muted/30">
        <div className="relative h-24 w-24 overflow-hidden rounded-full border">
          <Image src={t.img} alt={t.name} fill className="object-cover" />
        </div>
        <div className="text-sm">
          <p className="text-foreground text-lg leading-snug">“{t.quote}”</p>
          <p className="text-muted-foreground mt-2">{t.name}</p>
        </div>
      </div>
    </section>
  );
}
