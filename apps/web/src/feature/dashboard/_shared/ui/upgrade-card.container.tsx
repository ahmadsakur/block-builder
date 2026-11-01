"use client";

import { DEFAULT_PLAN } from "@block-builder/shared/plans";
import { useState } from "react";
import { UPGRADE_PATH } from "@/lib/auth/routes";
import { useSessionQuery } from "@/lib/auth/session-query";
import UpgradeCard from "./components/upgrade-card";

export default function UpgradeCardContainer() {
  const user = useSessionQuery().data?.user;
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || user?.plan !== DEFAULT_PLAN) return null;
  return (
    <UpgradeCard href={UPGRADE_PATH} onDismiss={() => setDismissed(true)} />
  );
}
