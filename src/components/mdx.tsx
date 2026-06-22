import { MDXRemote, type MDXRemoteProps } from "next-mdx-remote/rsc";
import type { ComponentPropsWithoutRef } from "react";

const components: MDXRemoteProps["components"] = {
  pre: (props: ComponentPropsWithoutRef<"pre">) => (
    <pre className="overflow-x-auto rounded-lg bg-zinc-950 p-4 text-sm text-zinc-50" {...props} />
  ),
  code: (props: ComponentPropsWithoutRef<"code">) => (
    <code className="rounded bg-zinc-100 px-1 py-0.5 text-sm dark:bg-zinc-800" {...props} />
  ),
  a: (props: ComponentPropsWithoutRef<"a">) => (
    <a className="underline underline-offset-2" target="_blank" rel="noopener noreferrer" {...props} />
  ),
  img: (props: ComponentPropsWithoutRef<"img">) => (
    <img className="rounded-lg" {...props} />
  ),
};

export function MDXContent({ source }: { source: string }) {
  return (
    <div className="prose prose-zinc dark:prose-invert max-w-none">
      <MDXRemote source={source} components={components} />
    </div>
  );
}
