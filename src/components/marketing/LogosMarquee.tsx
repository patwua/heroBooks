"use client";

import Image from "next/image";
import Marquee from "react-fast-marquee";
import { useState } from "react";

/**
 * Single logo that gracefully falls back: .svg -> .webp -> .png
 * Provide `name` WITHOUT extension; e.g., name="partner-1"
 */
function MarqueeLogo({ name, alt }: { name: string; alt: string }) {
  const order = [".svg", ".webp", ".png"] as const;
  const [idx, setIdx] = useState(0);
  const src = `/logos/${name}${order[idx]}`;

  return (
    <Image
      src={src}
      alt={alt}
      width={120}
      height={40}
      className="opacity-70 hover:opacity-100 transition"
      onError={() => {
        setIdx((prev) => (prev < order.length - 1 ? prev + 1 : prev));
      }}
    />
  );
}

const logos = [
  // Use the base filename only (no extension). Ensure these exist in /public/logos
  { name: "partner-1", alt: "Partner 1" },
  { name: "partner-2", alt: "Partner 2" },
  { name: "partner-3", alt: "Partner 3" },
  { name: "partner-4", alt: "Partner 4" },
];

export default function LogosMarquee() {
  return (
    <div className="border-y bg-muted/30">
      <Marquee gradient={false} speed={40} pauseOnHover>
        <div className="flex items-center gap-10 py-6">
          {logos.map((l) => (
            <div key={l.name}>
              <MarqueeLogo name={l.name} alt={l.alt} />
            </div>
          ))}
        </div>
      </Marquee>
    </div>
  );
}
