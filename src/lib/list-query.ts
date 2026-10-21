import { createParser, parseAsInteger, parseAsString } from "nuqs";

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

const serializeSort = (rules: SortRule[]) =>
  rules.map((rule) => `${rule.id}.${rule.desc ? "desc" : "asc"}`).join(",");

export const parseAsSort = createParser<SortRule[]>({
  parse: (value) =>
    value
      .split(",")
      .map((part) => {
        const [id, direction] = part.split(".");
        return { desc: direction === "desc", id };
      })
      .filter((rule) => rule.id),
  serialize: serializeSort,
  eq: (a, b) => serializeSort(a) === serializeSort(b),
});

export function listQueryParsers(defaults: {
  pageSize: number;
  sort: SortRule[];
}) {
  return {
    page: parseAsInteger.withDefault(1),
    pageSize: parseAsInteger.withDefault(defaults.pageSize),
    search: parseAsString.withDefault(""),
    sort: parseAsSort.withDefault(defaults.sort),
  };
}

export const LIST_URL_KEYS = { pageSize: "size", search: "q" } as const;
