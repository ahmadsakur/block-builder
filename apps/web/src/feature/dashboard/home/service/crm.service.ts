import { delay } from "@/lib/delay";
import { crmOverview } from "../data/crm.data";
import type { CrmOverview } from "../types/crm.types";

const MOCK_LATENCY_MS = 600;

export async function getCrmOverview(): Promise<CrmOverview> {
  await delay(MOCK_LATENCY_MS);
  return crmOverview(new Date());
}
