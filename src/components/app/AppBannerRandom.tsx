import { chooseOnce } from "@/lib/randomize";
import TrackLink from "@/components/marketing/TrackLink";

const BANNERS = [
  { text: "Invite your accountant — it’s free to add users.", href: "/settings/team", color: "bg-blue-50 text-blue-900", event: "banner_invite_accountant" },
  { text: "Import your bank file and reconcile in seconds.", href: "/bank/import", color: "bg-green-50 text-green-900", event: "banner_import_bank" },
  { text: "Try estimates → invoices workflow today.", href: "/estimates", color: "bg-amber-50 text-amber-900", event: "banner_estimates_to_invoices" },
  { text: "VAT reminders keep you on track — check reports.", href: "/reports/vat", color: "bg-purple-50 text-purple-900", event: "banner_vat_reminders" },
];

export default function AppBannerRandom() {
  const b = chooseOnce("hb_app_banner", BANNERS);

  return (
    <div className={`px-4 py-2 border-b ${b.color}`}>
      <div className="container mx-auto flex items-center justify-between text-sm">
        <span>{b.text}</span>
        <TrackLink
          href={b.href}
          className="underline font-medium ml-4"
          event={b.event}
          meta={{ where: "app_banner" }}
        >
          Learn more
        </TrackLink>
      </div>
    </div>
  );
}
