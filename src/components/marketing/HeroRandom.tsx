import Image from "next/image";
import { cookies, headers } from "next/headers";

const POOL = [
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
const COOKIE = "hb_hero";
const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];

export default function HeroRandom() {
  headers(); // make segment dynamic
  const jar = cookies();
  let chosen = jar.get(COOKIE)?.value;
  if (!chosen || !POOL.includes(chosen)) {
    chosen = pick(POOL);
    jar.set(COOKIE, chosen, { path: "/", httpOnly: false, sameSite: "lax", maxAge: 60 * 60 * 12 });
  }

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
          <a href="/get-started" className="inline-flex h-10 items-center rounded-md bg-primary px-6 text-primary-foreground">Get started</a>
          <a href="/sign-up?plan=business&demo=1" className="inline-flex h-10 items-center rounded-md border px-6">Try demo</a>
        </div>
      </div>
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border">
        <Image src={chosen} alt="Guyanese small business using heroBooks" fill sizes="(min-width: 768px) 50vw, 100vw" priority className="object-cover" />
      </div>
    </div>
  );
}
