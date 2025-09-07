"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { recordFeatureImpression } from "@/lib/telemetry";

export type BannerCardProps = {
  itemId: string;
  headline: string;
  body: string;
  action: { label: string; href: string };
  imgSrc: string;
};

export default function BannerCard({ itemId, headline, body, action, imgSrc }: BannerCardProps) {
  useEffect(() => {
    recordFeatureImpression({ feature: "banner_impression", reason: itemId, path: imgSrc });
  }, [itemId, imgSrc]);

  return (
    <div className="rounded-lg border overflow-hidden">
      <div className="relative aspect-[4/3] w-full">
        <Image src={imgSrc} alt="" fill className="object-cover" />
      </div>
      <div className="p-4 text-sm">
        <h3 className="font-medium">{headline}</h3>
        <p className="mt-2 text-muted-foreground">{body}</p>
        <Link href={action.href} className="mt-4 inline-flex text-primary font-medium hover:underline">
          {action.label}
        </Link>
      </div>
    </div>
  );
}
