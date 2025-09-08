import fs from "fs";
import path from "path";
import Image from "next/image";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";

function listImages(sub: string) {
  const dir = path.join(process.cwd(), "public", sub);
  if (!fs.existsSync(dir)) return [] as string[];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".webp"))
    .map((f) => `/${sub}/${f}`);
}

export default async function PhotosPreviewPage() {
  const session = await auth();
  const allowed = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
  if (!session?.user?.email || !allowed.includes(session.user.email)) {
    notFound();
  }

  const landing = listImages("landing");
  const testimonials = listImages("testimonials");
  const banners = listImages("banners");

  const section = (title: string, imgs: string[]) => (
    <section className="mb-8">
      <h2 className="mb-4 text-lg font-medium">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {imgs.map((src) => (
          <div key={src} className="relative aspect-square border rounded">
            <Image src={src} alt={src} fill className="object-cover" />
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <div className="p-8">
      {section("Landing", landing)}
      {section("Testimonials", testimonials)}
      {section("Banners", banners)}
    </div>
  );
}
