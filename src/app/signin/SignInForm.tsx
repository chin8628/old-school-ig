"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";

type SignInProps = {
  error: string;
};

export const SignInForm = (props: SignInProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    await signIn("credentials", {
      username,
      password,
      callbackUrl: "/",
    });
  };

  return (
    <div className="space-y-4 w-[80%]">
      <div>
        <label htmlFor="username" className="block text-sm">
          Username
        </label>
        <input
          type="text"
          id="username"
          name="username"
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
          name="password"
          className="w-full border rounded-md p-2"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {props.error === "CredentialsSignin" ? (
        <div>
          <p className="mb-2 text-xs w-full text-center">Authentication is invalid.</p>
          <button type="submit" className="w-full bg-red-600 text-white rounded-md p-2" onClick={handleSignIn}>
            Sign in again
          </button>
        </div>
      ) : (
        <button type="submit" className="w-full bg-slate-800 text-white rounded-md p-2" onClick={handleSignIn}>
          Sign in
        </button>
      )}
    </div>
  );
};
