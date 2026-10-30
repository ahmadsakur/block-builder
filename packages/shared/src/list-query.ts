export interface SortRule {
  id: string;
  desc: boolean;
}

export interface ListQuery {
  page: number;
  pageSize: number;
  sort: SortRule[];
  search: string;
}

export interface ListResult<T> {
  rows: T[];
  total: number;
  facets?: Record<string, Record<string, number>>;
}

export function serializeSort(rules: SortRule[]): string {
  return rules
    .map((rule) => `${rule.id}.${rule.desc ? "desc" : "asc"}`)
    .join(",");
}

export function parseSort(value: string): SortRule[] {
  return value
    .split(",")
    .map((part) => {
      const [id, direction] = part.split(".");
      return { desc: direction === "desc", id };
    })
    .filter((rule) => rule.id);
}
