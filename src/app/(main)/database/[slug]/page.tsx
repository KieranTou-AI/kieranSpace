import { notFound } from "next/navigation";
import { getPostBySlug, getAllPosts, getCategoryDisplayName } from "@/lib/posts";
import { MDXContent } from "@/components/mdx";
import Link from "next/link";
import type { Metadata } from "next";

const SECTION = "database";

interface PageProps { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return getAllPosts(SECTION).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug, SECTION);
  if (!post) return { title: "Not Found" };
  return { title: post.frontmatter.title, description: post.frontmatter.description };
}

export default async function Post({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug, SECTION);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/database" className="mb-8 inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-600 transition-colors">
        ← 返回
      </Link>
      <header className="mb-10">
        <h1 className="mb-4 text-2xl font-medium text-zinc-800">{post.frontmatter.title}</h1>
        <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-400">
          <time dateTime={post.frontmatter.date}>
            {new Date(post.frontmatter.date).toLocaleDateString("zh-CN", {
              year: "numeric", month: "long", day: "numeric",
            })}
          </time>
          {post.frontmatter.category && (
            <Link href={`/database?category=${post.frontmatter.category}`}
              className="text-zinc-500 hover:text-zinc-800 transition-colors">
              {getCategoryDisplayName(post.frontmatter.category)}
            </Link>
          )}
          {post.frontmatter.tags?.map((tag) => (
            <span key={tag} className="rounded bg-zinc-100 px-2 py-0.5 text-xs">{tag}</span>
          ))}
        </div>
      </header>
      <MDXContent source={post.source} />
    </article>
  );
}
