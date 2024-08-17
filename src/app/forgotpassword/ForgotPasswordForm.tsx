"use client";
import { fotgotPasswordAction } from "@/action/forgotPassword";
import { useFormState } from "react-dom";

export const ForgotPasswordForm = () => {
  const [state, formAction] = useFormState(fotgotPasswordAction, null);
  console.log("🚀 ~ ForgotPasswordForm ~ state:", state);

  return (
    <form className="space-y-4 w-[80%]" action={formAction}>
      <div>
        <label htmlFor="email" className="block text-sm">
          Email
        </label>
        <input type="email" id="email" name="email" className="w-full border rounded-md p-2" />
      </div>
      <div>
        {state?.errors?.email &&
          state.errors.email.map((error) => (
            <p key={error} className="text-red-500 text-xs">
              {error}
            </p>
          ))}
      </div>
      {state?.errors && Object.keys(state?.errors).length === 0 ? (
        <button type="submit" className="w-full bg-slate-200 text-gray-800 rounded-md p-2" disabled>
          Sent
        </button>
      ) : (
        <button type="submit" className="w-full bg-slate-800 text-white rounded-md p-2">
          Send reset password email
        </button>
      )}
    </form>
  );
};
