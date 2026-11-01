"use client";

import { useId, useState } from "react";
import {
  BlockStateProvider,
  BlockStateRows,
  type BlockStatus,
  getBlockState,
  SkeletonText,
} from "@/components/dashboardblocks/block-state";
import {
  describeChecklistProgress,
  getChecklistProgress,
  TaskCheckbox,
} from "@/components/dashboardblocks/checklist";
import { Details } from "@/components/dashboardblocks/details";
import { ProgressBar } from "@/components/dashboardblocks/progress-bar";
import {
  getDay,
  getDayOffset,
  getUrgency,
  UrgencyLabel,
} from "@/components/dashboardblocks/schedule";
import { formatDate } from "@/lib/dashboardblocks/format";
import { cn } from "@/lib/utils";
import { dueLabel } from "../../../logic/crm.logic";
import type { FollowUp, FollowUpGroup } from "../../../types/crm.types";

const SOON_DAYS = 2;
const ROWS = 5;
const TITLE = "Follow-ups";

type FollowUpsProps = {
  groups: FollowUpGroup[];
  now?: Date;
  timeZone: string;
  status?: BlockStatus;
};

function DueDate({
  done,
  due,
  now,
  timeZone,
}: {
  done: boolean;
  due: Date;
  now: Date;
  timeZone: string;
}) {
  const offset = getDayOffset(due, now, timeZone);
  const day = getDay(due, timeZone);
  const urgency = done ? "later" : getUrgency(due, now, timeZone, SOON_DAYS);
  return (
    <time dateTime={day.toISOString().slice(0, 10)}>
      <UrgencyLabel
        className={cn(urgency === "later" && "font-normal")}
        label={dueLabel(urgency, offset, formatDate(day, "day"))}
        urgency={urgency}
      />
    </time>
  );
}

function FollowUpGroups({
  groups,
  now,
  timeZone,
}: {
  groups: FollowUpGroup[];
  now: Date;
  timeZone: string;
}) {
  const id = useId();
  const [done, setDone] = useState(
    () =>
      new Set(
        groups.flatMap((group) =>
          group.tasks.filter((task) => task.done).map((task) => task.id),
        ),
      ),
  );
  const [announcement, setAnnouncement] = useState("");
  const tasks = groups.flatMap((group) => group.tasks);
  const progress = getChecklistProgress(
    tasks.map((task) => ({ state: done.has(task.id) ? "done" : "todo" })),
  );
  const overdue = tasks.filter(
    (task) => !done.has(task.id) && getDayOffset(task.due, now, timeZone) < 0,
  ).length;

  const toggle = (task: FollowUp, checked: boolean) => {
    setDone((current) => {
      const next = new Set(current);
      if (checked) next.add(task.id);
      else next.delete(task.id);
      return next;
    });
    setAnnouncement(`${task.title} marked ${checked ? "done" : "not done"}`);
  };

  return (
    <section className="@container flex flex-col gap-5">
      <header className="flex flex-col gap-1">
        <h2 className="font-semibold tracking-tight">{TITLE}</h2>
        <p className="text-muted-foreground text-sm">
          {describeChecklistProgress(progress, { one: "task", other: "tasks" })}
          {overdue > 0 ? `, ${overdue} overdue.` : "."}
        </p>
      </header>
      <p role="status" className="sr-only">
        {announcement}
      </p>
      <div aria-hidden>
        <ProgressBar
          className="h-1.5"
          fillClassName="motion-reduce:transition-none"
          percentage={progress.percentage}
        />
      </div>
      <div className="flex flex-col gap-4">
        {groups.map((group, groupIndex) => {
          const headingId = `${id}-group-${groupIndex}`;
          const groupDone = group.tasks.filter((task) =>
            done.has(task.id),
          ).length;
          return (
            <section
              key={group.name}
              aria-labelledby={headingId}
              className="flex flex-col"
            >
              <h3
                id={headingId}
                className="flex items-baseline justify-between gap-3 border-b pb-2 text-sm font-medium"
              >
                {group.name}
                <span className="text-muted-foreground font-normal tabular-nums">
                  {groupDone} of {group.tasks.length} done
                </span>
              </h3>
              <ul>
                {group.tasks.map((task) => {
                  const checkboxId = `${id}-${task.id}`;
                  const metaId = `${checkboxId}-meta`;
                  const isDone = done.has(task.id);
                  return (
                    <li
                      key={task.id}
                      className="flex items-start gap-3 border-b py-2.5 last:border-b-0 last:pb-0"
                    >
                      <TaskCheckbox
                        id={checkboxId}
                        checked={isDone}
                        aria-describedby={metaId}
                        className="mt-0.5"
                        onChange={(event) => toggle(task, event.target.checked)}
                      />
                      <div className="flex min-w-0 flex-1 flex-col gap-1">
                        <label
                          htmlFor={checkboxId}
                          className={cn(
                            "cursor-pointer text-sm",
                            isDone && "text-muted-foreground line-through",
                          )}
                        >
                          {task.title}
                        </label>
                        <Details
                          id={metaId}
                          className="text-muted-foreground text-xs"
                        >
                          {task.owner}
                          <DueDate
                            done={isDone}
                            due={task.due}
                            now={now}
                            timeZone={timeZone}
                          />
                        </Details>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </section>
  );
}

export default function FollowUps({
  groups,
  now,
  timeZone,
  status,
}: FollowUpsProps) {
  const state = getBlockState(
    status,
    groups.flatMap((group) => group.tasks),
  );

  return (
    <BlockStateProvider state={state}>
      {state || !now ? (
        <section className="@container flex flex-col gap-5">
          <header className="flex flex-col gap-1">
            <h2 className="font-semibold tracking-tight">{TITLE}</h2>
            {state === "loading" && (
              <span className="text-sm">
                <SkeletonText className="w-2/3" />
              </span>
            )}
          </header>
          {state === "loading" && (
            <ProgressBar className="h-1.5" percentage={0} />
          )}
          <BlockStateRows className="border-t" rows={ROWS} />
        </section>
      ) : (
        <FollowUpGroups groups={groups} now={now} timeZone={timeZone} />
      )}
    </BlockStateProvider>
  );
}
