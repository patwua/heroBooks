import fs from "fs";
import path from "path";
import matter from "gray-matter";
import yaml from "yaml";
import React from "react";
import KbShell from "./KbShell";
import KbHeader from "@/components/kb/KbHeader";
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
      return { slug: data.slug, title: data.title, category_id: (data as any)?.category_id, status: (data as any)?.status, draft: (data as any)?.draft } as any;
    })
    .filter((a) => a.slug && a.title)
    // Hide drafts from navigation
    .filter((a) => !(a.status === "draft" || a.draft === true))
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
  // Use shared MarketingHeader (single search), no duplicate KB header
  return (
    <div className="min-h-screen flex flex-col">
      <KbHeader />
      <React.Suspense fallback={null}>
        <KbShell articles={articles} rightRail={rightRail}>
          {children}
        </KbShell>
      </React.Suspense>
      <Footer />
    </div>
  );
  }
