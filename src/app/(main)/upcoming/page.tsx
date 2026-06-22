import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "敬请期待 — kieranSpace",
};

export default function UpcomingPage() {
  return (
    <div className="mx-auto flex max-w-6xl items-center justify-center px-6 py-32">
      <p className="text-zinc-400 text-sm">更多内容即将到来</p>
    </div>
  );
}
