import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  category?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
  category,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const buildHref = (page: number) => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    if (category) params.set("category", category);
    return `${basePath}?${params.toString()}`;
  };

  return (
    <div className="flex items-center gap-2 pt-8">
      {currentPage > 1 && (
        <Link
          href={buildHref(currentPage - 1)}
          className="px-3 py-1.5 text-sm text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 rounded-md transition-colors"
        >
          上一页
        </Link>
      )}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Link
          key={page}
          href={buildHref(page)}
          className={`w-8 h-8 flex items-center justify-center text-sm rounded-md transition-colors ${
            page === currentPage
              ? "bg-zinc-900 text-white"
              : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100"
          }`}
        >
          {page}
        </Link>
      ))}
      {currentPage < totalPages && (
        <Link
          href={buildHref(currentPage + 1)}
          className="px-3 py-1.5 text-sm text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 rounded-md transition-colors"
        >
          下一页
        </Link>
      )}
    </div>
  );
}
