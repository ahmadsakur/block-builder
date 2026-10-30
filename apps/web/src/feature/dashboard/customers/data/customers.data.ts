import type { SortRule } from "@/lib/list-query";
import { customerMrr } from "../logic/customers.logic";
import type {
  Customer,
  CustomerPlan,
  CustomerStatus,
} from "../types/customers.types";

export const CUSTOMERS_PAGE_SIZE = 10;

export const CUSTOMERS_DEFAULT_SORT: SortRule[] = [{ desc: true, id: "mrr" }];

const COMPANIES = [
  ["Northwind", "northwind.io"],
  ["Brightpath", "brightpath.dev"],
  ["Loop Studio", "loop.studio"],
  ["Fieldnotes", "fieldnotes.co"],
  ["Harbor", "harbor.app"],
  ["Quanta", "quanta.ai"],
  ["Pinecrest", "pinecrest.com"],
  ["Juniper Labs", "juniperlabs.io"],
  ["Sable", "sable.so"],
  ["Kitefin", "kitefin.com"],
  ["Mosaic", "mosaic.design"],
  ["Arcadia", "arcadia.health"],
  ["Tidewater", "tidewater.co"],
  ["Emberly", "emberly.app"],
  ["Cobalt", "cobalt.sh"],
  ["Wren & Co", "wren.co"],
  ["Lumen", "lumen.fm"],
  ["Orbital", "orbital.dev"],
  ["Parcel", "parcel.shop"],
  ["Stackwise", "stackwise.io"],
  ["Verdant", "verdant.farm"],
  ["Halcyon", "halcyon.travel"],
] as const;

const REGIONS = ["", " EU", " APAC", " LATAM", " Labs"] as const;

const PLANS: CustomerPlan[] = [
  "Pro",
  "Team",
  "Free",
  "Pro",
  "Enterprise",
  "Team",
  "Pro",
];

const STATUSES: CustomerStatus[] = [
  "active",
  "active",
  "trial",
  "active",
  "past-due",
  "active",
  "churned",
  "trial",
];

export const CUSTOMERS: Customer[] = REGIONS.flatMap((region, regionIndex) =>
  COMPANIES.map(([name, domain], companyIndex) => {
    const index = regionIndex * COMPANIES.length + companyIndex;
    const plan = PLANS[index % PLANS.length];
    const status = STATUSES[(index * 3) % STATUSES.length];
    const seats = plan === "Free" ? 1 + (index % 3) : 3 + ((index * 7) % 38);
    const month = String(1 + ((index * 5) % 12)).padStart(2, "0");
    const day = String(1 + ((index * 11) % 28)).padStart(2, "0");
    const subdomain = region.trim().toLowerCase();
    return {
      company: `${name}${region}`,
      email: `billing@${subdomain ? `${subdomain}.` : ""}${domain}`,
      id: `cus_${(1_042 + index * 37).toString(36)}`,
      mrr: customerMrr({ plan, seats, status }),
      plan,
      seats,
      signedUp: `${index % 3 === 0 ? 2024 : 2025}-${month}-${day}`,
      status,
    };
  }),
);
