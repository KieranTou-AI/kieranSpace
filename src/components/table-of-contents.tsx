"use client";

import { useEffect, useState, useRef } from "react";
import { extractHeadings, type TocHeading } from "@/components/mdx";

interface TableOfContentsProps {
  source: string;
}

export default function TableOfContents({ source }: TableOfContentsProps) {
  const headings = extractHeadings(source);
  const [activeId, setActiveId] = useState<string>("");
  const intersectionRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const headingElements = headings
      .map((h) => document.getElementById(h.id))
      .filter(Boolean) as HTMLElement[];

    if (headingElements.length === 0) return;

    intersectionRef.current = new IntersectionObserver(
      (entries) => {
        // Find the first heading that is currently visible (intersecting)
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-80px 0px -70% 0px",
        threshold: 0,
      }
    );

    headingElements.forEach((el) => intersectionRef.current?.observe(el));

    return () => {
      intersectionRef.current?.disconnect();
    };
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <aside className="hidden lg:block w-56 shrink-0">
      <nav className="sticky top-20 space-y-0.5">
        <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3">
          目录
        </p>
        {headings.map((h) => (
          <a
            key={h.id}
            href={`#${h.id}`}
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById(h.id);
              if (el) {
                el.scrollIntoView({ behavior: "smooth" });
                // Update URL hash without scroll jump
                history.pushState(null, "", `#${h.id}`);
                setActiveId(h.id);
              }
            }}
            className={`block text-sm py-1 transition-colors border-l-2 ${
              activeId === h.id
                ? "border-zinc-900 text-zinc-900 font-medium"
                : "border-transparent text-zinc-400 hover:text-zinc-600 hover:border-zinc-300"
            } ${h.level === 3 ? "pl-6" : "pl-3"}`}
          >
            {h.text}
          </a>
        ))}
      </nav>
    </aside>
  );
}
