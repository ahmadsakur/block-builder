"use client";

import { createContext, useContext } from "react";
import type { ManagedUser, Plan } from "../../../types/users.types";

type UserTable = {
  plans: readonly Plan[];
  onChangePlan: (user: ManagedUser) => void;
};

const UserTableContext = createContext<UserTable | null>(null);

export const UserTableProvider = UserTableContext.Provider;

export function useUserTable() {
  return useContext(UserTableContext);
}
