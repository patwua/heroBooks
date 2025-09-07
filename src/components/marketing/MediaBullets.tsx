import Image from "next/image";

export type MediaBulletsProps = {
  mediaSrc: string;
  bullets: string[];
  reverse?: boolean;
};

export default function MediaBullets({ mediaSrc, bullets, reverse }: MediaBulletsProps) {
  const isVideo = mediaSrc.endsWith(".mp4") || mediaSrc.endsWith(".webm");
  return (
    <div className="relative grid items-center gap-10 py-16 md:grid-cols-2">
      <div className={reverse ? "md:order-2" : undefined}>
        <ul className="list-disc space-y-3 pl-5 text-muted-foreground">
          {bullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <div
        className={`relative aspect-[16/10] w-full overflow-hidden rounded-2xl border ${
          reverse ? "md:order-1" : ""
        }`}
      >
        {isVideo ? (
          <video
            src={mediaSrc}
            className="h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          <Image
            src={mediaSrc}
            alt=""
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        )}
      </div>
    </div>
  );
}

