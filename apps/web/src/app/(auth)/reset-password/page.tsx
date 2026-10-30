import type { Metadata } from "next";
import { Suspense } from "react";
import ResetPasswordContainer from "@/feature/auth/reset-password/ui/reset-password.container";

export const metadata: Metadata = { title: "Set a new password" };

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordContainer />
    </Suspense>
  );
}
