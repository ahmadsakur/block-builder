"use client";

import { createContext, useContext } from "react";
import type { ManagedUser, PlanId } from "../../../types/users.types";

type UserTable = {
  planName: (id: PlanId) => string;
  onChangePlan: (user: ManagedUser) => void;
};

const UserTableContext = createContext<UserTable | null>(null);

export const UserTableProvider = UserTableContext.Provider;

export function useUserTable() {
  return useContext(UserTableContext);
}
