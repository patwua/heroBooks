import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

export async function generateStaticParams() {
  const dir = path.join(process.cwd(), "kb", "articles");
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((file) => ({ slug: file.replace(/\.md$/, "") }));
}

export default function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const filePath = path.join(
    process.cwd(),
    "kb",
    "articles",
    `${params.slug}.md`
  );
  const file = fs.readFileSync(filePath, "utf8");
  const { content, data } = matter(file);
  const html = marked(content);
  return (
    <article>
      <h1 className="text-2xl font-bold mb-4">{data.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  );
}
