"use client";

import BrandLogo from "@/components/_common/brand-logo";
import { AuthLayout } from "@/components/dashboardblocks/auth";
import { useSignUp } from "../../_shared/query/auth.query";
import AuthLink from "../../_shared/ui/auth-link";
import SignUpForm from "./components/sign-up-form";

export default function SignUpContainer() {
  const signUp = useSignUp();

  if (signUp.isSuccess) {
    return (
      <AuthLayout
        brand={<BrandLogo />}
        title="Check your email"
        description={`We sent a verification link to ${signUp.variables.email}. Open it to finish creating your account.`}
      >
        <AuthLink href="/sign-in">Back to sign in</AuthLink>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      brand={<BrandLogo />}
      title="Create your account"
      description="It takes less than a minute."
      footer={
        <span>
          Already have an account? <AuthLink href="/sign-in">Sign in</AuthLink>
        </span>
      }
    >
      <SignUpForm
        pending={signUp.isPending}
        error={signUp.error?.message}
        onSubmit={(values) => signUp.mutate(values)}
      />
    </AuthLayout>
  );
}
