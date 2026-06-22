import { notFound } from "next/navigation";
import { getPaginatedPosts, getCategoryDisplayName, getCategories } from "@/lib/posts";
import Link from "next/link";
import Sidebar from "@/components/sidebar";
import Pagination from "@/components/pagination";
import type { Metadata } from "next";

const SECTION = "database";
const PER_PAGE = 5;

export async function generateStaticParams() {
  return getCategories(SECTION).map((c) => ({ category: c.key }));
}

interface PageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const name = getCategoryDisplayName(category);
  if (name === category) return { title: "Not Found" };
  return { title: `${name} — kieranSpace` };
}

export default async function Page({ params, searchParams }: PageProps) {
  const { category } = await params;
  const name = getCategoryDisplayName(category);
  if (name === category) notFound();

  const s = await searchParams;
  const page = Math.max(1, parseInt(s.page || "1") || 1);
  const { posts, totalPages } = getPaginatedPosts(SECTION, page, PER_PAGE, category);

  return (
    <div className="mx-auto flex max-w-6xl gap-10 px-6 py-12">
      <Sidebar section={SECTION} />
      <main className="flex-1 min-w-0">
        <h1 className="mb-8 text-xl font-medium text-zinc-800">{name}</h1>
        {posts.length === 0 ? (
          <p className="text-center text-zinc-400 py-20">还没有文章</p>
        ) : (
          <div className="space-y-10">
            {posts.map((post) => (
              <article key={post.slug}>
                <Link href={`/database/${post.slug}`} className="group block">
                  <h2 className="text-lg font-medium text-zinc-800 group-hover:text-zinc-600 transition-colors">
                    {post.frontmatter.title}
                  </h2>
                  <p className="mt-1 text-sm text-zinc-500 leading-relaxed">
                    {post.frontmatter.description}
                  </p>
                </Link>
                <div className="mt-2 flex items-center gap-3 text-xs text-zinc-400">
                  <time dateTime={post.frontmatter.date}>
                    {new Date(post.frontmatter.date).toLocaleDateString("zh-CN", {
                      year: "numeric", month: "long", day: "numeric",
                    })}
                  </time>
                  {post.frontmatter.tags?.map((tag) => (
                    <span key={tag} className="rounded bg-zinc-100 px-2 py-0.5">{tag}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
        <Pagination currentPage={page} totalPages={totalPages} basePath={`/database/category/${category}`} category={category} />
      </main>
    </div>
  );
}
