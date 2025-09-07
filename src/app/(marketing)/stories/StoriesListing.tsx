"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { stories } from "@/lib/stories";
import { recordFeatureImpression } from "@/lib/telemetry";

const filters = [
  { tag: "all", label: "All" },
  { tag: "retail", label: "Retail" },
  { tag: "beauty", label: "Beauty" },
  { tag: "logistics", label: "Logistics" },
  { tag: "dealership", label: "Dealership" },
  { tag: "construction", label: "Construction" },
  { tag: "real-estate", label: "Real Estate" },
  { tag: "schools", label: "Schools" },
];

const PAGE_SIZE = 3;

export default function StoriesListing() {
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);

  const filtered = stories
    .filter((s) => s.consent_obtained)
    .filter((s) => filter === "all" || s.tags.includes(filter));

  const visible = filtered.slice(0, page * PAGE_SIZE);

  useEffect(() => {
    recordFeatureImpression({
      feature: "stories_view",
      meta: { filter, page },
    });
  }, [filter, page]);

  const onFilter = (tag: string) => {
    setFilter(tag);
    setPage(1);
    recordFeatureImpression({ feature: "stories_filter", meta: { tag } });
  };

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    recordFeatureImpression({ feature: "stories_load_more", meta: { page: next } });
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold">Customer stories</h1>
      <p className="mt-2 text-muted-foreground">
        Real operations using heroBooks for Guyana—VAT, PAYE, and NIS in the flow.
      </p>

      <div className="mt-6">
        <span className="text-sm font-medium">Filter by sector</span>
        <div className="mt-2 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.tag}
              onClick={() => onFilter(f.tag)}
              className={`rounded-full border px-3 py-1 text-sm ${
                filter === f.tag ? "bg-foreground text-background" : "bg-background"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <label className="text-sm font-medium" htmlFor="stories-sort">
          Sort by
        </label>
        <select id="stories-sort" className="ml-2 rounded-md border px-2 py-1 text-sm">
          <option>Newest</option>
        </select>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {visible.length ? (
          visible.map((story) => (
            <div key={story.id} className="flex flex-col overflow-hidden rounded-2xl border">
              <div className="relative h-40 w-full overflow-hidden">
                <Image src={story.image_src} alt={story.persona.name} fill className="object-cover" />
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="font-semibold">{story.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {story.persona.name} — {story.persona.role}, {story.persona.location}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{story.teaser}</p>
                <Link
                  href={`/stories/${story.slug}`}
                  className="mt-auto text-sm font-medium underline"
                >
                  See how heroBooks works for them
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p>No stories yet for this sector.</p>
        )}
      </div>

      {visible.length < filtered.length && (
        <div className="mt-8 text-center">
          <button
            onClick={loadMore}
            className="rounded-lg border px-4 py-2 text-sm font-medium"
          >
            Load more stories
          </button>
        </div>
      )}

      <p className="mt-8 text-center text-xs text-muted-foreground">
        Testimonials reflect individual experiences. Your results may vary.
      </p>
    </section>
  );
}
