import {
  parseSort,
  type SortRule,
  serializeSort,
} from "@block-builder/shared/list-query";
import { createParser, parseAsInteger, parseAsString } from "nuqs";

export type {
  ListQuery,
  ListResult,
  SortRule,
} from "@block-builder/shared/list-query";

export const parseAsSort = createParser<SortRule[]>({
  parse: parseSort,
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
