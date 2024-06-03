"use client";
import { LoadingSpinner } from "@/app/component/LoadingSpinner";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";

export const UpdateProfileButton = () => {
  const { pending } = useFormStatus();
  const [displayPending, setDisplayPending] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    if (pending && !displayPending) {
      timeoutId = setTimeout(() => {
        setDisplayPending(true);
      }, 500);
    } else if (!pending && displayPending) {
      setDisplayPending(false);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [pending, displayPending]);

  return (
    <button
      type="submit"
      className="w-full bg-slate-800 text-white rounded-md p-2 text-center flex justify-center"
      disabled={pending}
    >
      {displayPending ? <LoadingSpinner /> : "Save"}
    </button>
  );
};
