import { notFound } from "next/navigation";
import { getPostBySlug, getAllPosts, getCategoryDisplayName } from "@/lib/posts";
import { MDXContent } from "@/components/mdx";
import TableOfContents from "@/components/table-of-contents";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Not Found" };

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
  };
}

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  return (
    <div className="mx-auto flex max-w-6xl gap-10 px-6 py-12">
      <article className="flex-1 min-w-0 max-w-3xl">
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          返回博客
        </Link>

        <header className="mb-8">
          <h1 className="mb-3 text-3xl font-bold">{post.frontmatter.title}</h1>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <time dateTime={post.frontmatter.date}>
              {new Date(post.frontmatter.date).toLocaleDateString("zh-CN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            {post.frontmatter.category && (
              <Link
                href={`/blog/category/${post.frontmatter.category}`}
                className="text-primary hover:underline"
              >
                {getCategoryDisplayName(post.frontmatter.category)}
              </Link>
            )}
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
        </header>

        <MDXContent source={post.source} />
      </article>
      <TableOfContents source={post.source} />
    </div>
  );
}
