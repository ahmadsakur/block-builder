import { LockIcon } from "lucide-react";
import Link from "next/link";
import EmptyState from "@/components/_common/empty-state";
import { buttonVariants } from "@/components/_ui/button";
import { upgradeHref } from "@/lib/auth/routes";
import { lockedCopy } from "../../logic/entitlements.logic";
import type { PermissionKey } from "../../types/entitlements.types";

type LockedFeatureProps = {
  permission: PermissionKey;
  planName?: string;
  message?: string;
};

export default function LockedFeature({
  permission,
  planName,
  message,
}: LockedFeatureProps) {
  const copy = lockedCopy(permission, planName);

  return (
    <EmptyState
      bordered
      icon={<LockIcon />}
      title={copy.title}
      description={message ?? copy.description}
      action={
        <Link href={upgradeHref(permission)} className={buttonVariants()}>
          See plans
        </Link>
      }
    />
  );
}
