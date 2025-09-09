import fs from "fs";
import path from "path";
import matter from "gray-matter";
import yaml from "yaml";
import React from "react";
import KbShell from "./KbShell";
import MarketingHeader from "@/components/marketing/MarketingHeader";
import Footer from "@/components/Footer";

function getArticles() {
  const dir = path.join(process.cwd(), "kb", "articles");
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const { data } = matter(
        fs.readFileSync(path.join(dir, file), "utf8")
      );
      return { slug: data.slug, title: data.title };
    })
    .filter((a) => a.slug && a.title)
    .sort((a, b) => (a.title as string).localeCompare(b.title as string));
}

function getRightRail() {
  const file = fs.readFileSync(
    path.join(process.cwd(), "kb", "right_rail.yaml"),
    "utf8"
  );
  return yaml.parse(file) as any;
}

export default function KnowledgeBaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const articles = getArticles();
  const rightRail = getRightRail();
  // Wrap KB with the same marketing scaffold (sticky header + footer)
    return (
      <div className="min-h-screen flex flex-col">
        <MarketingHeader />
        <KbShell articles={articles} rightRail={rightRail}>
          {children}
        </KbShell>
        {/* Footer opens external links in new tab when authenticated (logic inside) */}
        <Footer />
      </div>
    );
  }
