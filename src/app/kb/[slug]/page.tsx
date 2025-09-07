import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const dir = path.join(process.cwd(), "kb", "articles");
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((file) => ({ slug: file.replace(/\.md$/, "") }));
}

export const dynamicParams = false;

function escapeHtml(html: string) {
  return html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const filePath = path.join(
    process.cwd(),
    "kb",
    "articles",
    `${slug}.md`
  );
  let file: string;
  try {
    file = fs.readFileSync(filePath, "utf8");
  } catch (err: any) {
    if (err.code === "ENOENT") {
      notFound();
    }
    throw err;
  }
  const { content, data } = matter(file);
  const renderer = new marked.Renderer();
  renderer.html = (token) => escapeHtml(token.text);
  const html = marked.parse(content, { renderer });
  return (
    <article>
      <h1 className="text-2xl font-bold mb-4">{data.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  );
}
