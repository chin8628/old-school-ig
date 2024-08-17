"use client";

import { signUpAction } from "@/action/authAction";
import Link from "next/link";
import { useState } from "react";
import { useFormState } from "react-dom";

export default function SignUpPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [state, formAction] = useFormState(signUpAction, null);

  return (
    <div className="flex items-center justify-center h-screen bg-slate-50">
      <div className="w-full max-w-[400px] py-2 flex flex-col items-center">
        {state?.errors && Object.keys(state.errors).length === 0 ? (
          <div className="">
            Sign up successful. Please <Link href="/signin">sign in</Link>.
          </div>
        ) : (
          <>
            <h1 className="mb-8 text-3xl font-semibold text-center">Sign up</h1>
            <form className="space-y-4 w-[80%]" action={formAction}>
            <div>
                <label htmlFor="email" className="block text-sm">
                  Email
                </label>
                <input type="text" id="email" name="email" className="w-full border rounded-md p-2" />
                {state?.errors.email && <p className="mt-2 text-xs text-red-600">{state.errors.email}</p>}
              </div>
              <div>
                <label htmlFor="username" className="block text-sm">
                  Username
                </label>
                <input type="text" id="username" name="username" className="w-full border rounded-md p-2" />
                {state?.errors.username && <p className="mt-2 text-xs text-red-600">{state.errors.username}</p>}
              </div>
              <div>
                <label htmlFor="password" className="block text-sm">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="w-full border rounded-md p-2"
                  onChange={(e) => setPassword(e.target.value)}
                />
                {state?.errors.password && <p className="mt-2 text-xs text-red-600">{state.errors.password}</p>}
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="w-full border rounded-md p-2"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {state?.errors.confirmPassword && (
                  <p className="mt-2 text-xs text-red-600">{state.errors.confirmPassword}</p>
                )}
                {password !== confirmPassword && <p className="mt-2 text-xs text-red-600">Passwords do not match</p>}
              </div>
              <button
                className={`w-full bg-slate-800 text-white rounded-md p-2 ${
                  password !== confirmPassword ? "opacity-50 cursor-not-allowed" : ""
                }`}
                type="submit"
                disabled={password !== confirmPassword}
              >
                Sign up
              </button>
            </form>
            <div className="mt-4 text-center">
              <Link className="text-sm" href="/signin">
                Already have an account?
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
