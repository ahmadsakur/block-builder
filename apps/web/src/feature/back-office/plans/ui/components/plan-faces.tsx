import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/components/_ui/avatar";
import { initials } from "../../logic/plans.logic";
import type { PlanPerson } from "../../types/plans.types";

export default function PlanFaces({ faces }: { faces: PlanPerson[] }) {
  if (faces.length === 0) return null;
  return (
    <AvatarGroup aria-hidden>
      {faces.map((person) => (
        <Avatar key={person.id} size="sm">
          {person.avatarUrl && <AvatarImage src={person.avatarUrl} alt="" />}
          <AvatarFallback className="text-[0.625rem]">
            {initials(person.name)}
          </AvatarFallback>
        </Avatar>
      ))}
    </AvatarGroup>
  );
}
