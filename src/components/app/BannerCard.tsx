"use client";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { recordFeatureImpression } from "@/lib/telemetry";

export type BannerCardProps = {
  itemId: string;
  headline: string;
  body: string;
  action: { label: string; href: string };
  imgSrc: StaticImageData;
};

export default function BannerCard({ itemId, headline, body, action, imgSrc }: BannerCardProps) {
  useEffect(() => {
    recordFeatureImpression({ feature: "banner_impression", reason: itemId, path: imgSrc.src });
  }, [itemId, imgSrc]);

  return (
    <div className="rounded-lg border overflow-hidden">
      <Image
        src={imgSrc}
        alt=""
        width={400}
        height={300}
        className="w-full object-cover"
      />
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
