import { chooseOnce } from "@/lib/randomize";
import { bannerCopy, BannerKey } from "@/lib/copy/imageCopy";
import BannerCard from "./BannerCard";

export default async function AssistSidebar() {
  const keys = Object.keys(bannerCopy) as BannerKey[];
  const chosen = await chooseOnce("hb_banner", keys);
  const b = bannerCopy[chosen];
  const imgSrc = `/photos/banners/${chosen}.webp`;

  return (
    <aside className="hidden lg:block w-80 border-l p-4 space-y-6 bg-background">
      <BannerCard
        itemId={chosen}
        headline={b.headline}
        body={b.body}
        action={b.action}
        imgSrc={imgSrc}
      />
    </aside>
  );
}
