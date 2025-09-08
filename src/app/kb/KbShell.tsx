'use client';
import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "@/components/topbar/ThemeToggle";
import NotificationsBell from "@/components/topbar/NotificationsBell";
import UserMenu from "@/components/topbar/UserMenu";
import React, { useState } from "react";

type Article = {
  slug: string;
  title: string;
};

type RightRailLink = {
  name?: string;
  title?: string;
  link?: string;
  url?: string;
  question?: string;
  open_in_new_tab?: boolean;
};

type RightRail = {
  gra_links?: RightRailLink[];
  nis_links?: RightRailLink[];
  internal_promos?: RightRailLink[];
  popular_snippets?: RightRailLink[];
};

export default function KbShell({
  children,
  articles,
  rightRail,
}: {
  children: React.ReactNode;
  articles: Article[];
  rightRail: RightRail;
}) {
  const [query, setQuery] = useState("");
  const filtered = articles.filter((a) =>
    a.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="h-screen flex flex-col">
      <header className="flex items-center justify-between border-b p-2">
        <div className="flex items-center gap-2">
          <Link href="/" aria-label="Back">
            ←
          </Link>
          <Link href="/">
            <Image src="/logos/logo.svg" alt="heroBooks" width={100} height={24} />
          </Link>
        </div>
        <input
          type="search"
          placeholder="Search KB"
          className="border rounded px-2 py-1 w-1/3"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <NotificationsBell />
          <UserMenu />
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-60 border-r overflow-y-auto p-4">
          <ul className="space-y-2">
            {filtered.map((article) => (
              <li key={article.slug}>
                <Link href={`/kb/${article.slug}`}>{article.title}</Link>
              </li>
            ))}
          </ul>
        </aside>
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
        <aside className="w-60 border-l overflow-y-auto p-4 space-y-4">
          {rightRail.gra_links && (
            <div>
              <h3 className="font-semibold mb-2">GRA Links</h3>
              <ul className="space-y-1">
                {rightRail.gra_links.map((l) => (
                  <li key={l.url}>
                    <a
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {l.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {rightRail.nis_links && (
            <div>
              <h3 className="font-semibold mb-2">NIS Links</h3>
              <ul className="space-y-1">
                {rightRail.nis_links.map((l) => (
                  <li key={l.url}>
                    <a
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {l.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {rightRail.internal_promos && (
            <div>
              <h3 className="font-semibold mb-2">heroBooks</h3>
              <ul className="space-y-1">
                {rightRail.internal_promos.map((l) => (
                  <li key={l.link}>
                    <a
                      href={l.link}
                      target={l.open_in_new_tab ? "_blank" : undefined}
                      rel={l.open_in_new_tab ? "noopener noreferrer" : undefined}
                    >
                      {l.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {rightRail.popular_snippets && (
            <div>
              <h3 className="font-semibold mb-2">Popular</h3>
              <ul className="space-y-1">
                {rightRail.popular_snippets.map((l) => (
                  <li key={l.link}>
                    <Link href={l.link ?? "#"}>{l.question}</Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
