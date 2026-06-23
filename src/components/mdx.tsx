import { MDXRemote, type MDXRemoteProps } from "next-mdx-remote/rsc";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

// ── Heading ID helpers ──

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9一-鿿]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function extractText(children: ReactNode): string {
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(extractText).join("");
  return "";
}

function HeadingWrapper({
  as: Tag,
  children,
  ...props
}: ComponentPropsWithoutRef<"h2" | "h3"> & {
  as: "h2" | "h3";
  children?: ReactNode;
}) {
  const text = extractText(children);
  const id = slugify(text);
  return (
    <Tag id={id} className="scroll-mt-20" {...props}>
      {children}
    </Tag>
  );
}

// ── Heading extraction for TOC ──

export interface TocHeading {
  level: 2 | 3;
  text: string;
  id: string;
}

export function extractHeadings(source: string): TocHeading[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: TocHeading[] = [];
  let match: RegExpExecArray | null;

  while ((match = headingRegex.exec(source)) !== null) {
    const level = match[1].length as 2 | 3;
    const text = match[2].trim();
    headings.push({ level, text, id: slugify(text) });
  }

  return headings;
}

// ── MDX components ──

const components: MDXRemoteProps["components"] = {
  a: (props: ComponentPropsWithoutRef<"a">) => (
    <a target="_blank" rel="noopener noreferrer" {...props} />
  ),
  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <HeadingWrapper as="h2" {...props} />
  ),
  h3: (props: ComponentPropsWithoutRef<"h3">) => (
    <HeadingWrapper as="h3" {...props} />
  ),
};

export function MDXContent({ source }: { source: string }) {
  return (
    <div className="prose">
      <MDXRemote source={source} components={components} />
    </div>
  );
}
