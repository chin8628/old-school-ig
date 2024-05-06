"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

type SignInProps = {
  searchParams: {
    error: string;
  };
};

export default function SignIn(props: SignInProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = () => {
    signIn("credentials", {
      username,
      password,
      callbackUrl: "/",
    });
  };

  return (
    <div className="flex items-center justify-center h-screen bg-slate-50">
      <div>
        <h1 className="mb-8 text-3xl font-semibold text-center">Sign in</h1>
        <div className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full border rounded-md p-2"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full border rounded-md p-2"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {props.searchParams.error === "CredentialsSignin" ? (
            <div>
              <button className="w-full bg-red-600 text-white rounded-md p-2" onClick={handleSignIn}>
                Sign in again
              </button>
              <p className="mt-2 text-xs w-full text-center">Authentication is invalid.</p>
            </div>
          ) : (
            <button className="w-full bg-slate-800 text-white rounded-md p-2" onClick={handleSignIn}>
              Sign in
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
