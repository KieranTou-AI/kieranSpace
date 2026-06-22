import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "content");

export const CATEGORY_MAP: Record<string, string> = {
  articles: "文章",
  tools: "工具栏",
};

export function getCategoryDisplayName(category: string): string {
  return CATEGORY_MAP[category] || category;
}

export interface PostFrontmatter {
  title: string;
  description: string;
  date: string;
  tags: string[];
  slug?: string;
  category?: string;
}

export interface Post {
  slug: string;
  frontmatter: PostFrontmatter;
}

function scanDir(dirPath: string, parentCategory?: string): Post[] {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const posts: Post[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      const category = CATEGORY_MAP[entry.name] ? entry.name : parentCategory;
      posts.push(...scanDir(fullPath, category));
    } else if (entry.name.endsWith(".mdx")) {
      const fileSlug = entry.name.replace(/\.mdx$/, "");
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);
      const fm = data as PostFrontmatter;

      posts.push({
        slug: fm.slug || fileSlug,
        frontmatter: {
          ...fm,
          category: fm.category || parentCategory,
        },
      });
    }
  }

  return posts;
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const slugs = new Set<string>();
  const posts = scanDir(postsDirectory);

  // Detect duplicate slugs
  for (const post of posts) {
    if (slugs.has(post.slug)) {
      console.warn(`Warning: duplicate slug "${post.slug}" detected`);
    }
    slugs.add(post.slug);
  }

  return posts.sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime()
  );
}

function findMdxFile(dirPath: string, slug: string): string | null {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      const result = findMdxFile(fullPath, slug);
      if (result) return result;
    } else if (entry.name.endsWith(".mdx")) {
      const fileSlug = entry.name.replace(/\.mdx$/, "");
      if (fileSlug === slug) return fullPath;

      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);
      if (data.slug === slug) return fullPath;
    }
  }

  return null;
}

export interface PostWithSource extends Post {
  source: string;
}

export function getPostBySlug(slug: string): PostWithSource | null {
  const fullPath = findMdxFile(postsDirectory, slug);
  if (!fullPath) return null;

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const fm = data as PostFrontmatter;

  // Infer category from parent directory
  const parentDir = path.basename(path.dirname(fullPath));
  const category = fm.category || (CATEGORY_MAP[parentDir] ? parentDir : undefined);

  return {
    slug,
    frontmatter: { ...fm, category },
    source: content,
  };
}

export function getPostsByCategory(category: string): Post[] {
  return getAllPosts().filter((post) => post.frontmatter.category === category);
}

export interface PaginatedPosts {
  posts: Post[];
  total: number;
  totalPages: number;
}

export function getPaginatedPosts(
  page: number,
  perPage: number,
  category?: string
): PaginatedPosts {
  const all = category ? getPostsByCategory(category) : getAllPosts();
  const start = (page - 1) * perPage;
  return {
    posts: all.slice(start, start + perPage),
    total: all.length,
    totalPages: Math.ceil(all.length / perPage),
  };
}

export function getAllCategories(): { key: string; displayName: string; count: number }[] {
  const posts = getAllPosts();
  const counts: Record<string, number> = {};

  for (const post of posts) {
    if (post.frontmatter.category) {
      counts[post.frontmatter.category] =
        (counts[post.frontmatter.category] || 0) + 1;
    }
  }

  return Object.keys(CATEGORY_MAP)
    .filter((key) => counts[key] > 0)
    .map((key) => ({
      key,
      displayName: CATEGORY_MAP[key],
      count: counts[key],
    }));
}
