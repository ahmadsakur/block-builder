import { LockIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/_ui/alert";
import type { Notice } from "../../types/upgrade.types";

export default function LockedNotice({ notice }: { notice: Notice }) {
  return (
    <Alert role="status">
      <LockIcon aria-hidden />
      <AlertTitle>{notice.title}</AlertTitle>
      <AlertDescription>{notice.description}</AlertDescription>
    </Alert>
  );
}
