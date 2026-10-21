import { delay } from "@/lib/delay";
import { STOCK, TODAY } from "../data/home.data";
import { buildStoreData } from "../logic/store-data.logic";
import type { StockItem, StoreData, StoreQuery } from "../types/home.types";

const MOCK_LATENCY_MS = 600;

export async function getStoreOverview(query: StoreQuery): Promise<StoreData> {
  await delay(MOCK_LATENCY_MS);
  return buildStoreData(query, TODAY);
}

export async function getLowStock(): Promise<StockItem[]> {
  await delay(MOCK_LATENCY_MS);
  return STOCK;
}
