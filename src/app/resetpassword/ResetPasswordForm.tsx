"use client";
import { resetPasswordAction } from "@/action/resetPassword";
import { useFormState } from "react-dom";

type ResetPasswordPageProps = {
  token: string;
};

export const ResetPasswordForm = (props: ResetPasswordPageProps) => {
  const [state, formAction] = useFormState(resetPasswordAction, null);

  return (
    <form className="space-y-4 w-[80%]" action={formAction}>
      <input type="hidden" name="token" value={props.token} />

      <div>
        <label htmlFor="password" className="block text-sm">
          Password
        </label>
        <input type="password" id="password" name="password" className="w-full border rounded-md p-2" />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm">
          Confirm Password
        </label>
        <input type="password" id="confirmPassword" name="confirmPassword" className="w-full border rounded-md p-2" />
      </div>

      <div>
        {state?.errors?.confirmPassword?.map((error) => (
          <p key={error} className="text-red-500 text-xs">
            {error}
          </p>
        ))}
      </div>

      {state?.errors && Object.keys(state?.errors).length === 0 ? (
        <button type="submit" className="w-full bg-slate-200 text-gray-800 rounded-md p-2" disabled>
          Updated Password
        </button>
      ) : (
        <button type="submit" className="w-full bg-slate-800 text-white rounded-md p-2">
          Reset Password
        </button>
      )}
    </form>
  );
};
