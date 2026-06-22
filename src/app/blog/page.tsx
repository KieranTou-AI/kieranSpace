import { getAllPosts } from "@/lib/posts";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "博客 — kieranSpace",
  description: "技术教程 & 知识分享",
};

export default function BlogList() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <header className="mb-12">
        <Link
          href="/"
          className="mb-4 inline-block text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← 返回首页
        </Link>
        <h1 className="text-3xl font-bold">博客</h1>
        <p className="mt-2 text-muted-foreground">技术教程 & 知识分享</p>
      </header>

      {posts.length === 0 ? (
        <p className="text-center text-muted-foreground py-20">还没有文章</p>
      ) : (
        <div className="space-y-8">
          {posts.map((post) => (
            <article key={post.slug}>
              <Link href={`/blog/${post.slug}`} className="group block">
                <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">
                  {post.frontmatter.title}
                </h2>
                <p className="mt-1 text-muted-foreground">
                  {post.frontmatter.description}
                </p>
                <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
                  <time dateTime={post.frontmatter.date}>
                    {new Date(post.frontmatter.date).toLocaleDateString(
                      "zh-CN",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </time>
                  {post.frontmatter.tags && (
                    <div className="flex gap-1">
                      {post.frontmatter.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded bg-muted px-2 py-0.5 text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
