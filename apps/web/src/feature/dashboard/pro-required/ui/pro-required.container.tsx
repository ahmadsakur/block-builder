"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { buttonVariants } from "@/components/_ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/_ui/dialog";
import { homeFor } from "@/lib/auth/routes";

const HOME = homeFor("user");

export default function ProRequiredContainer() {
  const router = useRouter();

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) router.push(HOME);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>This page is on Pro</DialogTitle>
          <DialogDescription>
            Upgrade your plan to open it and everything else Pro includes.
          </DialogDescription>
        </DialogHeader>
        <div className="text-muted-foreground rounded-lg border border-dashed p-6 text-center text-sm">
          Plan options will show here.
        </div>
        <DialogFooter>
          <Link href={HOME} className={buttonVariants({ variant: "outline" })}>
            Back to home
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
