"use server";

import { createUser, EmailUniqueError, UsernameUniqueError } from "@/service/user";
import { signIn } from "next-auth/react";
import { z } from "zod";

export const signUpAction = async (_: Record<string, unknown> | null, f: FormData) => {
  const schema = z
    .object({
      email: z.string().min(1).email(),
      username: z.string().min(1).max(100),
      password: z.string().min(8).max(100),
      confirmPassword: z.string().min(8).max(100),
    })
    .superRefine((data, ctx) => {
      if (data.password !== data.confirmPassword) {
        ctx.addIssue({
          code: "custom",
          message: "The passwords did not match",
          path: ["confirmPassword"],
        });
      }
    });

  const validatedFields = schema.safeParse({
    email: f.get("email"),
    username: f.get("username"),
    password: f.get("password"),
    confirmPassword: f.get("confirmPassword"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await createUser(validatedFields.data.username, validatedFields.data.password, validatedFields.data.email);
  } catch (e) {
    console.error(e);

    if (e instanceof UsernameUniqueError) {
      return {
        errors: {
          username: ["Username already exists"],
        },
      };
    }

    if (e instanceof EmailUniqueError) {
      return {
        errors: {
          email: ["Email already exists"],
        },
      };
    }

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
