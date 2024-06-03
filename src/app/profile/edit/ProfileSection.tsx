"use client";
import { editProfileAction } from "@/action/actions";
import { UpdateProfileButton } from "@/app/profile/edit/component/UpdateProfileButton";
import { ProfileInfo } from "@/service/account/profile";
import { useFormState } from "react-dom";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

type ProfileSectionProps = {
  profile: ProfileInfo;
};

export const ProfileSection = (props: ProfileSectionProps) => {
  const [state, formAction] = useFormState(editProfileAction, null);
  const isSaved = state?.errors !== undefined && Object.keys(state?.errors).length === 0;

  const [displayNameLength, setDisplayNameLength] = useState(props.profile.displayName.length);
  const [shortBioLength, setShortBioLength] = useState(props.profile.shortBio.length);

  return (
    <>
      <div className="flex flex-row items-baseline space-x-2 mb-6">
        <h1 className="text-3xl font-semibold">Profile</h1>
        {isSaved && (
          <div className="flex items-center space-x-1">
            <CheckCircleIcon className="text-green-500 w-4 h-4" />
            <span className="text-green-500">Saved</span>
          </div>
        )}
      </div>

      <form className="space-y-3" action={formAction}>
        <div className="space-y-1">
          <div>
            <label htmlFor="displayName" className="block text-sm">
              Display Name <span className="text-neutral-500">({displayNameLength}/100)</span>
            </label>
            <input
              type="text"
              id="displayName"
              name="displayName"
              className="w-full border rounded-md p-2 text-sm"
              defaultValue={props.profile.displayName}
              maxLength={100}
              onChange={(e) => setDisplayNameLength(e.target.value.length)}
            />
            <div className="h-6">
              {state?.errors?.displayName && (
                <span className="text-red-500 text-xs">{state.errors.displayName[0]}</span>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="bio" className="block text-sm">
              Short Bio <span className="text-neutral-500">({shortBioLength}/240)</span>
            </label>
            <textarea
              id="bio"
              name="shortBio"
              className="w-full border rounded-md p-2 text-sm"
              rows={4}
              defaultValue={props.profile.shortBio}
              maxLength={240}
              onChange={(e) => setShortBioLength(e.target.value.length)}
            />
            <div className="h-6 translate-y-[-6px]">
              {state?.errors?.shortBio && <span className="text-red-500 text-xs">{state.errors.shortBio[0]}</span>}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <UpdateProfileButton />
        </div>
      </form>
    </>
  );
};
