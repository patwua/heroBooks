import Image from "next/image";
import { chooseOnce } from "@/lib/randomize";
import TrackLink from "@/components/marketing/TrackLink";

const HERO_IMAGES = [
  "/photos/landing/construction.webp",
  "/photos/landing/salon.webp",
  "/photos/landing/barbershop.webp",
  "/photos/landing/logistics.webp",
  "/photos/landing/dealership.webp",
  "/photos/landing/accounting.webp",
  "/photos/landing/real-estate.webp",
  "/photos/landing/school-board.webp",
  "/photos/landing/carwash.webp",
];

export default function HeroRandom() {
  const chosen = chooseOnce("hb_hero", HERO_IMAGES);

  return (
    <div className="relative grid items-center gap-10 md:grid-cols-2 pt-16">
      <div>
        <h1 className="text-4xl font-semibold tracking-tight">
          Accounting built for Guyana — VAT, NIS & PAYE made simple
        </h1>
        <p className="mt-3 text-muted-foreground">
          Local compliance, faster invoices, clean reports, and an API when you’re ready.
        </p>
        <div className="mt-6 flex items-center gap-3">
          <TrackLink
            href="/get-started"
            className="inline-flex h-10 items-center rounded-md bg-primary px-6 text-primary-foreground"
            event="cta_get_started"
            meta={{ hero: chosen }}
          >
            Get started
          </TrackLink>
          <TrackLink
            href="/sign-up?plan=business&demo=1"
            className="inline-flex h-10 items-center rounded-md border px-6"
            event="cta_try_demo"
            meta={{ hero: chosen }}
          >
            Try demo
          </TrackLink>
        </div>
      </div>

      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border">
        <Image
          src={chosen}
          alt="Guyanese small business using heroBooks"
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          priority
          className="object-cover"
        />
      </div>
    </div>
  );
}
