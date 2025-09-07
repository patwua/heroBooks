import { chooseOnce } from "@/lib/randomize";
import { heroCopy, HeroKey } from "@/lib/copy/imageCopy";
import HeroClient from "./HeroClient";

export default function HeroRandom() {
  const keys = Object.keys(heroCopy) as HeroKey[];
  const chosen = chooseOnce("hb_hero", keys);
  const copy = heroCopy[chosen];
  const imgSrc = `/photos/landing/${chosen}.webp`;
  return (
    <HeroClient
      itemId={chosen}
      headline={copy.headline}
      subhead={copy.subhead}
      cta={copy.cta}
      imgSrc={imgSrc}
    />
  );
}
