"use client";

import { PencilIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/_ui/button";
import {
  ActionsMenu,
  BackLink,
  PageHeader,
  PageHeaderActions,
  type PageHeaderFact,
  PageHeaderFacts,
  PageHeaderHeading,
  PageHeaderRow,
} from "@/components/dashboardblocks/page-header";
import { StatusLabel } from "@/components/dashboardblocks/status-label";
import PlanMark from "../../../../_shared/ui/plan-mark";
import { describePlan } from "../../../logic/plan.logic";
import type { PlanDetail } from "../../../types/plan-detail.types";

type PlanHeaderProps = {
  facts: PageHeaderFact[];
  plan: PlanDetail;
  onEdit: () => void;
  onDelete: () => void;
};

export default function PlanHeader({
  facts,
  plan,
  onEdit,
  onDelete,
}: PlanHeaderProps) {
  return (
    <PageHeader>
      <BackLink href="/back-office/plans">All plans</BackLink>
      <PageHeaderRow>
        <PageHeaderHeading
          wrap
          title={plan.name}
          description={describePlan(plan)}
          media={<PlanMark className="size-10 text-sm" plan={plan} />}
          badge={
            plan.isDefault && (
              <StatusLabel tone="info">Default plan</StatusLabel>
            )
          }
        />
        <PageHeaderActions>
          <Button variant="outline" onClick={onEdit}>
            <PencilIcon data-icon="inline-start" />
            Edit details
          </Button>
          {!plan.isDefault && (
            <ActionsMenu
              label={`More actions for ${plan.name}`}
              items={[
                {
                  icon: <Trash2Icon />,
                  label: "Delete plan",
                  onSelect: onDelete,
                  variant: "destructive",
                },
              ]}
            />
          )}
        </PageHeaderActions>
      </PageHeaderRow>
      <PageHeaderFacts items={facts} />
    </PageHeader>
  );
}
