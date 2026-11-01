"use client";

import { PlusIcon, SearchIcon } from "lucide-react";
import { Button } from "@/components/_ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/_ui/input-group";
import {
  PageHeader,
  PageHeaderActions,
  PageHeaderHeading,
  PageHeaderRow,
} from "@/components/dashboardblocks/page-header";

type PlansHeaderProps = {
  description: string;
  search: string;
  onSearch: (search: string) => void;
  onCreate: () => void;
};

export default function PlansHeader({
  description,
  search,
  onSearch,
  onCreate,
}: PlansHeaderProps) {
  return (
    <PageHeader>
      <PageHeaderRow className="@2xl/page-header:items-end">
        <PageHeaderHeading title="Plans" description={description} />
        <PageHeaderActions className="@2xl/page-header:flex-nowrap">
          <InputGroup className="min-w-0 flex-1 @2xl/page-header:w-64 @2xl/page-header:flex-none">
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput
              aria-label="Search plans"
              placeholder="Search plans…"
              type="search"
              value={search}
              onChange={(event) => onSearch(event.target.value)}
            />
          </InputGroup>
          <Button onClick={onCreate}>
            <PlusIcon data-icon="inline-start" />
            New plan
          </Button>
        </PageHeaderActions>
      </PageHeaderRow>
    </PageHeader>
  );
}
