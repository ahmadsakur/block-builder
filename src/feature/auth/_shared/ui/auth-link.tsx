import Link from "next/link";
import type { ReactNode } from "react";

type AuthLinkProps = {
  href: string;
  children: ReactNode;
  quiet?: boolean;
};

export default function AuthLink({ href, children, quiet }: AuthLinkProps) {
  return (
    <Link
      href={href}
      className={
        quiet
          ? "text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          : "font-medium text-foreground underline-offset-4 hover:underline"
      }
    >
      {children}
    </Link>
  );
}
