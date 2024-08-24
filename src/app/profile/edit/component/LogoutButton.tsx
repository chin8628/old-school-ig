import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";

export const LogoutButton = () => {
  return (
    <button
      type="button"
      className="w-full border border-slate-800 text-gray-800 rounded-md p-2 text-center flex justify-center"
      onClick={() => {
        signOut();
        redirect("/");
      }}
    >
      Log out
    </button>
  );
};
