"use client";

import Image from "next/image";
import Marquee from "react-fast-marquee";

const logos = [
  { src: "/logos/partner-1.svg", alt: "Partner 1" },
  { src: "/logos/partner-2.svg", alt: "Partner 2" },
  { src: "/logos/partner-3.svg", alt: "Partner 3" },
  { src: "/logos/partner-4.svg", alt: "Partner 4" },
];

export default function LogosMarquee() {
  return (
    <div className="border-y bg-muted/30">
      <Marquee gradient={false} speed={40} pauseOnHover>
        <div className="flex items-center gap-10 py-6">
          {logos.map((l) => (
            <div key={l.src} className="opacity-70 hover:opacity-100 transition">
              <Image src={l.src} alt={l.alt} width={120} height={40} />
            </div>
          ))}
        </div>
      </Marquee>
    </div>
  );
}
