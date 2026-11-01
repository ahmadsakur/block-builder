"use client";

import { PERMISSION_KEYS } from "@block-builder/shared/entitlements";
import { parseAsStringLiteral, useQueryStates } from "nuqs";

const upgradeParams = {
  permission: parseAsStringLiteral(PERMISSION_KEYS),
};

export function useUpgradeParams() {
  return useQueryStates(upgradeParams, { history: "replace" });
}
