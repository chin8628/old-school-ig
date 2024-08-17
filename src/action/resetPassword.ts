"use server";
import { changePassword } from "@/service/auth";
import { getUserByResetPasswordToken } from "@/service/user";
import { z } from "zod";

export const resetPasswordAction = async (_: Record<string, unknown> | null, f: FormData) => {
  const schema = z.object({
    token: z.string(),
    password: z.string(),
    confirmPassword: z.string(),
  });

  const validatedFields = schema.safeParse({
    token: f.get("token"),
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

  let user = null;
  try {
    user = await getUserByResetPasswordToken(validatedFields.data.token);
  } catch (error) {
    return {
      errors: {
        token: ["Invalid token"],
      },
    };
  }

  try {
    await changePassword(user.username, validatedFields.data.password);
  } catch (error) {
    console.error(error);
    return {
      errors: {
        password: ["Having problem changing password. Please try again later."],
      },
    };
  }

  return {
    errors: {},
  };
};
