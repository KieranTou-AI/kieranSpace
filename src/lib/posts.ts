import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "content");

export interface PostFrontmatter {
  title: string;
  description: string;
  date: string;
  tags: string[];
  slug?: string;
}

export interface Post {
  slug: string;
  frontmatter: PostFrontmatter;
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const filenames = fs.readdirSync(postsDirectory);
  const posts = filenames
    .filter((filename) => filename.endsWith(".mdx"))
    .map((filename) => {
      const fileSlug = filename.replace(/\.mdx$/, "");
      const fullPath = path.join(postsDirectory, filename);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);

      return {
        slug: data.slug || fileSlug,
        frontmatter: data as PostFrontmatter,
      };
    })
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    );

  return posts;
}

export interface PostWithSource extends Post {
  source: string;
}

export function getPostBySlug(slug: string): PostWithSource | null {
  // First try direct filename match
  let fullPath = path.join(postsDirectory, `${slug}.mdx`);

  // If not found, search by frontmatter slug
  if (!fs.existsSync(fullPath)) {
    const filenames = fs.readdirSync(postsDirectory);
    const match = filenames.find((filename) => {
      if (!filename.endsWith(".mdx")) return false;
      const fileContents = fs.readFileSync(
        path.join(postsDirectory, filename),
        "utf8"
      );
      const { data } = matter(fileContents);
      return data.slug === slug;
    });
    if (match) {
      fullPath = path.join(postsDirectory, match);
    } else {
      return null;
    }
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug,
    frontmatter: data as PostFrontmatter,
    source: content,
  };
}
