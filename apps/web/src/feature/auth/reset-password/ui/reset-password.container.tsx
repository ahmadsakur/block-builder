"use client";

import { useQueryState } from "nuqs";
import BrandLogo from "@/components/_common/brand-logo";
import { AuthLayout } from "@/components/dashboardblocks/auth";
import { useResetPassword } from "../../_shared/query/auth.query";
import AuthLink from "../../_shared/ui/auth-link";
import ResetPasswordForm from "./components/reset-password-form";

export default function ResetPasswordContainer() {
  const [token] = useQueryState("token");
  const reset = useResetPassword();

  if (!token) {
    return (
      <AuthLayout
        brand={<BrandLogo />}
        title="This link doesn't work"
        description="Reset links work once and expire. Ask for a new one and use the latest email."
        footer={<AuthLink href="/sign-in">Back to sign in</AuthLink>}
      >
        <AuthLink href="/forgot-password">Send a new reset link</AuthLink>
      </AuthLayout>
    );
  }

  if (reset.isSuccess) {
    return (
      <AuthLayout
        brand={<BrandLogo />}
        title="Password updated"
        description="You can now sign in with your new password."
      >
        <AuthLink href="/sign-in">Sign in</AuthLink>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      brand={<BrandLogo />}
      title="Set a new password"
      description="Pick a password you don't use anywhere else."
      footer={<AuthLink href="/sign-in">Back to sign in</AuthLink>}
    >
      <ResetPasswordForm
        pending={reset.isPending}
        error={reset.error?.message}
        onSubmit={({ password }) => reset.mutate({ token, password })}
      />
    </AuthLayout>
  );
}
