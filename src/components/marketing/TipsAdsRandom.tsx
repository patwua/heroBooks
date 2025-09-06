import Link from "next/link";
import { chooseOnce } from "@/lib/randomize";

const CARDS = [
  { title: "Try the demo", text: "See sample data with VAT-ready invoices.", href: "/sign-up?plan=business&demo=1", event: "tip_try_demo" },
  { title: "Compare plans", text: "Starter is free during beta.", href: "/pricing?highlight=business", event: "tip_compare_plans" },
  { title: "Invite your accountant", text: "Collaboration is free.", href: "/sign-in", event: "tip_invite_accountant" },
];

export default function TipsAdsRandom() {
  const c = chooseOnce("hb_tip", CARDS);
  return (
    <section className="mt-16">
      <div className="rounded-2xl border p-6 bg-primary/5">
        <div className="text-lg font-medium">{c.title}</div>
        <p className="text-sm text-muted-foreground mt-2">{c.text}</p>
        <Link
          href={c.href}
          className="inline-flex mt-4 rounded-md border px-3 py-1.5 text-sm hover:bg-muted"
          onClick={() =>
            fetch("/api/track/marketing", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ event: c.event, meta: { where: "tips_ads" } }),
              keepalive: true,
            })
          }
        >
          Learn more
        </Link>
      </div>
    </section>
  );
}
