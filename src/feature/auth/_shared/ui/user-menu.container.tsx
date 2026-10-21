"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { buttonVariants } from "@/components/_ui/button";
import { Skeleton } from "@/components/_ui/skeleton";
import { SidebarUserMenu } from "@/components/dashboardblocks/app-shell";
import { useSessionQuery, useSignOut } from "../query/auth.query";

export default function UserMenuContainer() {
  const router = useRouter();
  const session = useSessionQuery();
  const signOut = useSignOut();
  const user = session.data?.user;

  if (session.isPending) return <Skeleton className="h-12 w-full" />;

  if (!user) {
    return (
      <Link href="/sign-in" className={buttonVariants({ variant: "outline" })}>
        Sign in
      </Link>
    );
  }

  return (
    <SidebarUserMenu
      links={[]}
      user={{ avatar: user.avatarUrl, email: user.email, name: user.name }}
      onSignOut={() =>
        signOut.mutate(undefined, {
          onSuccess: () => router.push("/sign-in"),
        })
      }
    />
  );
}
