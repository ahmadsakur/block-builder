"use client";

import ErrorPage from "@/components/_common/error-pages/error-page";

export default function AppError({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  return <ErrorPage error={error} retry={retry} />;
}
