import { notFound } from "next/navigation";
import {
  getCategoryDisplayName,
  getAllPosts,
  CATEGORY_MAP,
} from "@/lib/posts";
import Link from "next/link";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return Object.keys(CATEGORY_MAP).map((key) => ({ category: key }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const displayName = getCategoryDisplayName(category);
  if (displayName === category) return { title: "Not Found" };
  return {
    title: `${displayName} — kieranSpace`,
    description: `浏览 ${displayName} 分类下的所有文章`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const displayName = getCategoryDisplayName(category);
  if (displayName === category) notFound();

  const posts = getAllPosts().filter(
    (p) => p.frontmatter.category === category
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <header className="mb-12">
        <Link href="/blog" className="mb-4 inline-block text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← 返回博客
        </Link>
        <h1 className="text-3xl font-bold">{displayName}</h1>
        <p className="mt-2 text-muted-foreground">共 {posts.length} 篇文章</p>
      </header>

      {posts.length === 0 ? (
        <p className="text-center text-muted-foreground py-20">该分类下还没有文章</p>
      ) : (
        <div className="space-y-8">
          {posts.map((post) => (
            <article key={post.slug}>
              <Link href={`/blog/${post.slug}`} className="group block">
                <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">
                  {post.frontmatter.title}
                </h2>
                <p className="mt-1 text-muted-foreground">{post.frontmatter.description}</p>
                <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
                  <time dateTime={post.frontmatter.date}>
                    {new Date(post.frontmatter.date).toLocaleDateString("zh-CN", {
                      year: "numeric", month: "long", day: "numeric",
                    })}
                  </time>
                  {post.frontmatter.tags?.map((tag) => (
                    <span key={tag} className="rounded bg-muted px-2 py-0.5 text-xs">{tag}</span>
                  ))}
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
