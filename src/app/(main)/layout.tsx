import Link from "next/link";

const NAV_ITEMS = [
  { label: "人工智能", href: "/ai" },
  { label: "数据库", href: "/database" },
  { label: "办公", href: "/office" },
  { label: "敬请期待", href: "/upcoming" },
];

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Top navigation */}
      <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 h-14">
          <Link href="/ai" className="text-sm font-medium text-zinc-800">
            kieranSpace
          </Link>
          <div className="flex gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-1.5 text-sm text-zinc-500 rounded-md transition-colors hover:text-zinc-800 hover:bg-zinc-100"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      {/* Page content */}
      {children}
    </div>
  );
}
