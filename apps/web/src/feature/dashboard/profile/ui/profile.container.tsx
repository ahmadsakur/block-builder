"use client";

import { CloudAlertIcon, LogInIcon, RotateCwIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useState, useSyncExternalStore } from "react";
import { toast } from "sonner";
import EmptyState from "@/components/_common/empty-state";
import { Button, buttonVariants } from "@/components/_ui/button";
import { useSessionQuery } from "@/lib/auth/session-query";
import { avatarFileError } from "../logic/profile.logic";
import {
  useChangePassword,
  useDeleteAccount,
  useRemoveAvatar,
  useUpdateProfile,
  useUploadAvatar,
} from "../query/profile.query";
import {
  THEME_PREFERENCES,
  type ThemePreference,
} from "../types/profile.types";
import AppearanceSettings from "./components/appearance-settings";
import AvatarPicker from "./components/avatar-picker";
import DeleteAccountDialog from "./components/delete-account-dialog";
import PasswordForm from "./components/password-form";
import ProfileForm from "./components/profile-form";
import ProfileSkeleton from "./components/profile-skeleton";
import SettingsSection from "./components/settings-section";

const subscribeNoop = () => () => {};

function useMounted() {
  return useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
}

function asThemePreference(theme?: string) {
  return THEME_PREFERENCES.find((option) => option === theme);
}

export default function ProfileContainer() {
  const router = useRouter();
  const session = useSessionQuery();
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();
  const deleteAccount = useDeleteAccount();
  const uploadAvatar = useUploadAvatar();
  const removeAvatar = useRemoveAvatar();
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();
  const [profileFormKey, setProfileFormKey] = useState(0);
  const [passwordFormKey, setPasswordFormKey] = useState(0);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const user = session.data?.user;

  if (session.isPending) return <ProfileSkeleton />;

  if (session.isError) {
    return (
      <EmptyState
        bordered
        tone="error"
        icon={<CloudAlertIcon />}
        title="Your profile didn't load"
        description="We couldn't reach your account details. Try again in a moment."
        action={
          <Button variant="outline" onClick={() => session.refetch()}>
            <RotateCwIcon />
            Try again
          </Button>
        }
      />
    );
  }

  if (!user) {
    if (deleteAccount.isPending || deleteAccount.isSuccess) return null;
    return (
      <EmptyState
        bordered
        icon={<LogInIcon />}
        title="You're signed out"
        description="Sign in to manage your profile, password and preferences."
        action={
          <Link href="/sign-in" className={buttonVariants()}>
            Sign in
          </Link>
        }
      />
    );
  }

  const selectAvatar = (file: File) => {
    const problem = avatarFileError(file);
    if (problem) {
      toast.error(problem);
      return;
    }
    uploadAvatar.mutate(file, {
      onError: (error) => toast.error(error.message),
      onSuccess: () => toast.success("Photo updated"),
    });
  };

  const changeTheme = (next: ThemePreference) => {
    setTheme(next);
    toast.success(`Theme set to ${next}`);
  };

  return (
    <div className="flex w-full max-w-5xl flex-col gap-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          Manage your personal details, password and preferences.
        </p>
      </header>
      <SettingsSection
        title="Personal info"
        description="Your photo, name and email show on invoices, comments and invites."
      >
        <ProfileForm
          key={profileFormKey}
          user={user}
          avatar={
            <AvatarPicker
              name={user.name}
              avatarUrl={user.avatarUrl}
              uploading={uploadAvatar.isPending}
              removing={removeAvatar.isPending}
              onSelect={selectAvatar}
              onRemove={() =>
                removeAvatar.mutate(undefined, {
                  onError: (error) => toast.error(error.message),
                  onSuccess: () => toast.success("Photo removed"),
                })
              }
            />
          }
          pending={updateProfile.isPending}
          error={updateProfile.error?.message}
          onSubmit={(values) =>
            updateProfile.mutate(values, {
              onSuccess: () => {
                setProfileFormKey((key) => key + 1);
                toast.success("Profile updated");
              },
            })
          }
        />
      </SettingsSection>
      <SettingsSection
        title="Password"
        description="Use a long password you don't use anywhere else."
      >
        <PasswordForm
          key={passwordFormKey}
          pending={changePassword.isPending}
          error={changePassword.error?.message}
          onSubmit={(values) =>
            changePassword.mutate(values, {
              onSuccess: () => {
                setPasswordFormKey((key) => key + 1);
                toast.success("Password updated");
              },
            })
          }
        />
      </SettingsSection>
      <SettingsSection
        title="Appearance"
        description="Pick a theme, or follow your system setting."
      >
        <AppearanceSettings
          theme={mounted ? asThemePreference(theme) : undefined}
          onChange={changeTheme}
        />
      </SettingsSection>
      <SettingsSection
        tone="destructive"
        title="Delete account"
        description="Permanently remove your account and everything in it."
      >
        <Button
          variant="destructive"
          onClick={() => {
            deleteAccount.reset();
            setDeleteOpen(true);
          }}
        >
          Delete account
        </Button>
      </SettingsSection>
      <DeleteAccountDialog
        open={deleteOpen}
        email={user.email}
        pending={deleteAccount.isPending}
        error={deleteAccount.error?.message}
        onOpenChange={setDeleteOpen}
        onConfirm={() =>
          deleteAccount.mutate(undefined, {
            onSuccess: () => {
              toast.success("Account deleted");
              router.push("/sign-in");
            },
          })
        }
      />
    </div>
  );
}
