import { CheckIcon, LockIcon } from "lucide-react";
import type {
  PermissionKey,
  PlanWithEntitlements,
} from "@/feature/dashboard/_shared/types/entitlements.types";
import { cn } from "@/lib/utils";
import type { PlanFeature } from "../../../types/upgrade.types";

type PlanCardProps = {
  plan: PlanWithEntitlements;
  features: PlanFeature[];
  current: boolean;
  recommended: boolean;
  focus?: PermissionKey;
};

function FeatureValue({ feature }: { feature: PlanFeature }) {
  if (feature.kind === "limit") {
    return <span className="font-medium tabular-nums">{feature.value}</span>;
  }
  if (feature.included) {
    return (
      <span className="text-success flex items-center">
        <CheckIcon aria-hidden className="size-4" />
        <span className="sr-only">Included</span>
      </span>
    );
  }
  return (
    <span className="text-muted-foreground flex items-center">
      <LockIcon aria-hidden className="size-4" />
      <span className="sr-only">Not included</span>
    </span>
  );
}

export default function PlanCard({
  plan,
  features,
  current,
  recommended,
  focus,
}: PlanCardProps) {
  return (
    <article
      aria-labelledby={`plan-${plan.id}`}
      className={cn(
        "flex flex-col gap-3 rounded-xl border p-4",
        (current || recommended) && "border-primary ring-primary ring-1",
      )}
    >
      <header className="flex flex-wrap items-baseline justify-between gap-x-2">
        <h2 id={`plan-${plan.id}`} className="font-medium">
          {plan.name}
        </h2>
        {current ? (
          <span className="text-muted-foreground text-xs">Current plan</span>
        ) : (
          recommended && (
            <span className="text-primary text-xs font-medium">
              Recommended
            </span>
          )
        )}
      </header>
      {plan.description && (
        <p className="text-muted-foreground text-sm">{plan.description}</p>
      )}
      <ul className="flex flex-col gap-2 border-t pt-3 text-sm">
        {features.map((feature) => (
          <li
            key={feature.key}
            className={cn(
              "flex items-center justify-between gap-3 rounded-md",
              feature.key === focus && "bg-muted -mx-2 px-2 py-1",
            )}
          >
            <span className={cn(!feature.included && "text-muted-foreground")}>
              {feature.label}
            </span>
            <FeatureValue feature={feature} />
          </li>
        ))}
      </ul>
      <p className="text-muted-foreground mt-auto border-t pt-3 text-sm">
        {current
          ? "You're on this plan."
          : `Ask an admin to move you to ${plan.name}.`}
      </p>
    </article>
  );
}
