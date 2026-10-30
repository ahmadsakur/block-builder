import { BREAKDOWN_OTHER_COLOR } from "@/components/dashboardblocks/breakdown";
import type {
  Channel,
  Product,
  Region,
  StockItem,
  StoreQuery,
} from "../types/home.types";

export const TODAY = new Date(Date.UTC(2026, 9, 21));

export const DEFAULT_QUERY: StoreQuery = {
  compare: true,
  preset: "30d",
  region: null,
};

export const DAILY_TARGET = 1_750;

export const REGIONS: Region[] = [
  { name: "North America", phase: 0, share: 0.48 },
  { name: "Europe", phase: 1.3, share: 0.34 },
  { name: "Asia Pacific", phase: 2.6, share: 0.18 },
];

export const CHANNELS: Channel[] = [
  { color: "var(--color-chart-2)", label: "Organic search", share: 0.38 },
  { color: "var(--color-chart-3)", label: "Paid search", share: 0.27 },
  { color: "var(--color-chart-4)", label: "Email", share: 0.17 },
  { color: BREAKDOWN_OTHER_COLOR, label: "Other", share: 0.18 },
];

export const PRODUCTS: Product[] = [
  { category: "Displays", name: 'Studio Display 27"', price: 437, share: 0.29 },
  { category: "Audio", name: "Wireless headphones", price: 144, share: 0.24 },
  { category: "Furniture", name: "Ergonomic chair", price: 435, share: 0.21 },
  {
    category: "Accessories",
    name: "Mechanical keyboard",
    price: 120,
    share: 0.13,
  },
  { category: "Accessories", name: "USB-C dock", price: 90, share: 0.08 },
  { category: "Audio", name: "Desk speakers", price: 90, share: 0.05 },
];

export const STOCK: StockItem[] = [
  {
    dailyDemand: 9,
    leadTimeDays: 12,
    name: 'Studio Display 27"',
    onHand: 0,
    reorderPoint: 110,
    sku: "SD-27-SLV",
  },
  {
    dailyDemand: 21,
    leadTimeDays: 8,
    name: "Wireless headphones",
    onHand: 64,
    onOrder: 200,
    reorderPoint: 170,
    sku: "WH-01-BLK",
  },
  {
    dailyDemand: 6,
    leadTimeDays: 21,
    name: "Ergonomic chair",
    onHand: 88,
    reorderPoint: 126,
    sku: "EC-02-GRY",
  },
  {
    dailyDemand: 14,
    leadTimeDays: 6,
    name: "USB-C dock",
    onHand: 131,
    reorderPoint: 84,
    sku: "UD-11-GRY",
  },
];
