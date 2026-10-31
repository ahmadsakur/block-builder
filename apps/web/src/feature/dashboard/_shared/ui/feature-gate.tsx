"use client";

import { isAllowed } from "@block-builder/shared/entitlements";
import { CloudAlertIcon, RotateCwIcon } from "lucide-react";
import type { ReactNode } from "react";
import EmptyState from "@/components/_common/empty-state";
import { Button } from "@/components/_ui/button";
import { useEntitlementsQuery } from "../query/entitlements.query";
import type { PermissionKey } from "../types/entitlements.types";
import LockedFeature from "./components/locked-feature";

type FeatureGateProps = {
  permission: PermissionKey;
  fallback: ReactNode;
  children: ReactNode;
};

export default function FeatureGate({
  permission,
  fallback,
  children,
}: FeatureGateProps) {
  const entitlements = useEntitlementsQuery();
  const data = entitlements.data;

  if (!data) {
    if (!entitlements.isError) return fallback;
    return (
      <EmptyState
        bordered
        tone="error"
        icon={<CloudAlertIcon />}
        title="Your plan didn't load"
        description="We couldn't check what your plan includes. Try again in a moment."
        action={
          <Button variant="outline" onClick={() => entitlements.refetch()}>
            <RotateCwIcon />
            Try again
          </Button>
        }
      />
    );
  }

  if (!isAllowed(data.entitlements, permission)) {
    return <LockedFeature permission={permission} planName={data.plan.name} />;
  }

  return children;
}
