import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentRoot = path.join(process.cwd(), "content");

// ── Section & category config ──

export const SECTIONS: Record<string, string> = {
  ai: "人工智能",
  database: "数据库",
  office: "办公",
};

export const CATEGORY_MAP: Record<string, string> = {
  articles: "随笔",
  tools: "工具栏",
};

export function getCategoryDisplayName(category: string): string {
  return CATEGORY_MAP[category] || category;
}

export function getSectionDisplayName(section: string): string {
  return SECTIONS[section] || section;
}

// ── Interfaces ──

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
  section: string;
  frontmatter: PostFrontmatter;
}

// ── Scanner ──

function scanSectionDir(
  sectionDir: string,
  section: string,
  parentCategory?: string
): Post[] {
  const posts: Post[] = [];
  if (!fs.existsSync(sectionDir)) return posts;

  const entries = fs.readdirSync(sectionDir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(sectionDir, entry.name);

    if (entry.isDirectory()) {
      const cat = CATEGORY_MAP[entry.name] ? entry.name : parentCategory;
      posts.push(...scanSectionDir(fullPath, section, cat));
    } else if (entry.name.endsWith(".mdx")) {
      const fileSlug = entry.name.replace(/\.mdx$/, "");
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);
      const fm = data as PostFrontmatter;

      posts.push({
        slug: fm.slug || fileSlug,
        section,
        frontmatter: {
          ...fm,
          category: fm.category || parentCategory,
        },
      });
    }
  }

  return posts;
}

// ── Public API ──

export function getAllPosts(section?: string): Post[] {
  const sections = section ? [section] : Object.keys(SECTIONS);

  const slugs = new Set<string>();
  const allPosts: Post[] = [];

  for (const sec of sections) {
    const sectionDir = path.join(contentRoot, sec);
    const posts = scanSectionDir(sectionDir, sec);
    for (const post of posts) {
      if (slugs.has(post.slug)) {
        console.warn(`Warning: duplicate slug "${post.slug}" in section "${sec}"`);
      }
      slugs.add(post.slug);
    }
    allPosts.push(...posts);
  }

  return allPosts.sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime()
  );
}

export interface PostWithSource extends Post {
  source: string;
}

function findMdxInDir(dirPath: string, slug: string): string | null {
  if (!fs.existsSync(dirPath)) return null;
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      const result = findMdxInDir(fullPath, slug);
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

export function getPostBySlug(
  slug: string,
  section?: string
): PostWithSource | null {
  const sections = section ? [section] : Object.keys(SECTIONS);

  for (const sec of sections) {
    const fullPath = findMdxInDir(path.join(contentRoot, sec), slug);
    if (!fullPath) continue;

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);
    const fm = data as PostFrontmatter;

    // Infer category from parent directory
    const parentDir = path.basename(path.dirname(fullPath));
    const category = fm.category || (CATEGORY_MAP[parentDir] ? parentDir : undefined);

    return {
      slug,
      section: sec,
      frontmatter: { ...fm, category },
      source: content,
    };
  }

  return null;
}

export function getPostsByCategory(
  section: string,
  category: string
): Post[] {
  return getAllPosts(section).filter(
    (post) => post.frontmatter.category === category
  );
}

export interface PaginatedPosts {
  posts: Post[];
  total: number;
  totalPages: number;
}

export function getPaginatedPosts(
  section: string,
  page: number,
  perPage: number,
  category?: string
): PaginatedPosts {
  const all = category
    ? getPostsByCategory(section, category)
    : getAllPosts(section);
  const start = (page - 1) * perPage;
  return {
    posts: all.slice(start, start + perPage),
    total: all.length,
    totalPages: Math.ceil(all.length / perPage),
  };
}

export function getCategories(
  section: string
): { key: string; displayName: string; count: number }[] {
  const posts = getAllPosts(section);
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
