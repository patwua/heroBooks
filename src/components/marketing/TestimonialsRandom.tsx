import Image from "next/image";
import { cookies, headers } from "next/headers";

const TESTIMONIALS = [
  { img: "/photos/testimonials/shop-owner.webp", quote: "heroBooks saves me hours every VAT month.", name: "Shawn — Shop owner, Georgetown" },
  { img: "/photos/testimonials/salon-owner.webp", quote: "Invoices and receipts that my customers love.", name: "Latoya — Salon owner, New Amsterdam" },
  { img: "/photos/testimonials/transport-owner.webp", quote: "Bank imports and reconciliation are a breeze.", name: "Marcus — Logistics, Linden" },
];
const COOKIE = "hb_testimonial";
const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];

export default function TestimonialsRandom() {
  headers();
  const jar = cookies();
  let chosenIdx = Number(jar.get(COOKIE)?.value ?? NaN);
  if (Number.isNaN(chosenIdx) || chosenIdx < 0 || chosenIdx >= TESTIMONIALS.length) {
    chosenIdx = Math.floor(Math.random() * TESTIMONIALS.length);
    jar.set(COOKIE, String(chosenIdx), { path: "/", httpOnly: false, sameSite: "lax", maxAge: 60 * 60 * 12 });
  }
  const t = TESTIMONIALS[chosenIdx];

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
