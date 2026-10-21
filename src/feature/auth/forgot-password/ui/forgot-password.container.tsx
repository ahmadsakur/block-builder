"use client";

import BrandLogo from "@/components/_common/brand-logo";
import { Button } from "@/components/_ui/button";
import { AuthLayout } from "@/components/dashboardblocks/auth";
import { useRequestPasswordReset } from "../../_shared/query/auth.query";
import AuthLink from "../../_shared/ui/auth-link";
import ForgotPasswordForm from "./components/forgot-password-form";

export default function ForgotPasswordContainer() {
  const request = useRequestPasswordReset();
  const footer = <AuthLink href="/sign-in">Back to sign in</AuthLink>;

  if (request.isSuccess) {
    return (
      <AuthLayout
        brand={<BrandLogo />}
        title="Check your email"
        description={`If an account exists for ${request.variables.email}, we sent a link to reset its password. The link works once.`}
        footer={footer}
      >
        <Button variant="outline" onClick={() => request.reset()}>
          Use a different email
        </Button>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      brand={<BrandLogo />}
      title="Reset your password"
      description="Enter the email you sign in with, and we'll send you a link to set a new password."
      footer={footer}
    >
      <ForgotPasswordForm
        pending={request.isPending}
        error={request.error?.message}
        onSubmit={(values) => request.mutate(values)}
      />
    </AuthLayout>
  );
}
