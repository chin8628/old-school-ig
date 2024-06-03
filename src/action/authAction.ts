"use server";

import { createUser } from "@/service/user";
import { signIn } from "next-auth/react";
import { z } from "zod";

export const signUpAction = async (_: Record<string, unknown> | null, f: FormData) => {
  const schema = z.object({
    username: z.string().max(100),
    password: z.string().min(8).max(100),
    confirmPassword: z.string(),
  });

  const validatedFields = schema.safeParse({
    username: f.get("username"),
    password: f.get("password"),
    confirmPassword: f.get("confirmPassword"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  if (validatedFields.data.password !== validatedFields.data.confirmPassword) {
    return {
      errors: {
        confirmPassword: ["Passwords do not match"],
      },
    };
  }

  try {
    await createUser(validatedFields.data.username, validatedFields.data.password);
  } catch (e) {
    return {
      errors: {
        username: ["Having problem creating user. Please try again later."],
      },
    };
  }

  return {
    errors: {},
  };
};

export const signInAction = async (_: Record<string, unknown> | null, f: FormData) => {
  const schema = z.object({
    username: z.string(),
    password: z.string(),
  });

  const validatedFields = schema.safeParse({
    username: f.get("username"),
    password: f.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  await signIn("credentials", {
    username: validatedFields.data.username,
    password: validatedFields.data.password,
    callbackUrl: "/",
  });

  return {
    errors: {},
  };
};
