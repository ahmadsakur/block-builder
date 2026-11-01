"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { buttonVariants } from "@/components/_ui/button";
import { Skeleton } from "@/components/_ui/skeleton";
import {
  UserMenu as AccountMenu,
  type NavItem,
} from "@/components/dashboardblocks/app-shell";
import { useSessionQuery, useSignOut } from "@/lib/auth/session-query";
import { avatarFor } from "@/lib/avatar";
import SignOutDialog from "./sign-out-dialog";

export default function UserMenu({ links }: { links: NavItem[] }) {
  const router = useRouter();
  const session = useSessionQuery();
  const signOut = useSignOut();
  const [confirming, setConfirming] = useState(false);
  const user = session.data?.user;

  if (session.isPending) return <Skeleton className="size-9 rounded-full" />;

  if (!user) {
    return (
      <Link
        href="/sign-in"
        className={buttonVariants({ size: "sm", variant: "outline" })}
      >
        Sign in
      </Link>
    );
  }

  return (
    <>
      <AccountMenu
        links={links.flatMap((page) =>
          page.href
            ? [{ href: page.href, icon: page.icon, label: page.title }]
            : [],
        )}
        user={{ avatar: avatarFor(user), email: user.email, name: user.name }}
        onSignOut={() => {
          signOut.reset();
          setConfirming(true);
        }}
      />
      <SignOutDialog
        open={confirming}
        pending={signOut.isPending}
        onOpenChange={setConfirming}
        onConfirm={() =>
          signOut.mutate(undefined, {
            onSuccess: () => {
              setConfirming(false);
              router.push("/sign-in");
            },
          })
        }
      />
    </>
  );
}
