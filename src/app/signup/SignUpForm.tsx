"use client";
import { signUpAction } from "@/action/authAction";
import { LoadingSpinner } from "@/app/component/LoadingSpinner";
import { isActionStateOk } from "@/lib/isActionStateOk";
import { useDeferredPending } from "@/lib/useDeferredPending";
import { Button, Input } from "@nextui-org/react";
import Link from "next/link";
import { useFormState } from "react-dom";

export const SignUpForm = () => {
  const [state, formAction] = useFormState(signUpAction, null);
  const { setPending, deferredPending } = useDeferredPending(state);

  if (isActionStateOk(state)) {
    return (
      <div className="">
        Sign up successful. Please <Link href="/signin">sign in</Link>.
      </div>
    );
  }

  return (
    <>
      <h1 className="mb-8 text-3xl font-semibold text-center">Sign up</h1>
      <form
        className="space-y-4 w-[80%]"
        action={formAction}
        onSubmit={() => {
          setPending(true);
        }}
      >
        <Input
          type="text"
          id="email"
          name="email"
          label="Email"
          variant="bordered"
          isInvalid={!!state?.errors.email}
          errorMessage={state?.errors.email?.[0]}
          classNames={{
            inputWrapper: "w-full border rounded-md p-2 bg-white",
          }}
        />
        <Input
          type="text"
          id="username"
          name="username"
          label="Username"
          variant="bordered"
          isInvalid={!!state?.errors.username}
          errorMessage={state?.errors.username?.[0]}
          classNames={{
            inputWrapper: "w-full border rounded-md p-2 bg-white",
          }}
        />
        <Input
          type="password"
          name="password"
          label="Password"
          variant="bordered"
          isInvalid={!!state?.errors.password}
          errorMessage={state?.errors.password?.[0]}
          classNames={{
            inputWrapper: "w-full border rounded-md p-2 bg-white",
          }}
        />
        <Input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm Password"
          variant="bordered"
          isInvalid={!!state?.errors.confirmPassword}
          errorMessage={state?.errors.confirmPassword?.[0]}
          classNames={{
            inputWrapper: "w-full border rounded-md p-2 bg-white",
          }}
        />
        <Button className="w-full bg-slate-800 text-white rounded-md p-2" type="submit" aria-disabled={deferredPending}>
          {deferredPending ? <LoadingSpinner /> : "Sign up"}
        </Button>
      </form>
      <div className="mt-4 text-center">
        <Link className="text-sm" href="/signin">
          Already have an account?
        </Link>
      </div>
    </>
  );
};
