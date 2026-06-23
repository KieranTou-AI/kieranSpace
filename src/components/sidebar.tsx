"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

const DEFAULT_FILTERS = [
  { key: "", label: "全部" },
  { key: "articles", label: "随笔" },
  { key: "tools", label: "工具栏" },
];

interface SidebarProps {
  section: string;
  filters?: { key: string; label: string }[];
}

export default function Sidebar({ section, filters }: SidebarProps) {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "";
  const displayFilters = filters ?? DEFAULT_FILTERS;

  return (
    <aside className="w-44 shrink-0">
      <nav className="space-y-0.5 sticky top-20">
        {displayFilters.map((f) => {
          const href = f.key ? `/${section}?category=${f.key}` : `/${section}`;
          const isActive = currentCategory === f.key;
          return (
            <Link
              key={f.key}
              href={href}
              className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                isActive
                  ? "bg-zinc-200/80 text-zinc-900 font-medium"
                  : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100"
              }`}
            >
              {f.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
