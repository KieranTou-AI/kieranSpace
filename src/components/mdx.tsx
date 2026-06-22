import { MDXRemote, type MDXRemoteProps } from "next-mdx-remote/rsc";
import type { ComponentPropsWithoutRef } from "react";

const components: MDXRemoteProps["components"] = {
  a: (props: ComponentPropsWithoutRef<"a">) => (
    <a target="_blank" rel="noopener noreferrer" {...props} />
  ),
};

export function MDXContent({ source }: { source: string }) {
  return (
    <div className="prose">
      <MDXRemote source={source} components={components} />
    </div>
  );
}
