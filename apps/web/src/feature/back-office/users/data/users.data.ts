import type { SortRule } from "@/lib/list-query";

export const USERS_PAGE_SIZE = 10;

export const USERS_DEFAULT_SORT: SortRule[] = [{ desc: true, id: "createdAt" }];
