"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { markRead } from "../logic/notifications.logic";
import {
  getNotifications,
  markNotificationsRead,
} from "../service/notifications.service";
import type { UserNotification } from "../types/notifications.types";

export const notificationKeys = {
  all: ["notifications"] as const,
};

export function useNotificationsQuery() {
  return useQuery({
    queryKey: notificationKeys.all,
    queryFn: getNotifications,
  });
}

export function useMarkNotificationsRead() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: markNotificationsRead,
    onMutate: async (ids) => {
      await client.cancelQueries({ queryKey: notificationKeys.all });
      client.setQueryData<UserNotification[]>(
        notificationKeys.all,
        (current) => current && markRead(current, ids),
      );
    },
    onSettled: () =>
      client.invalidateQueries({ queryKey: notificationKeys.all }),
  });
}
