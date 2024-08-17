"use server";

import { sendResetPasswordEmail } from "@/service/resetPassword";
import { z } from "zod";

export const fotgotPasswordAction = async (_: Record<string, unknown> | null, f: FormData) => {
  const schema = z.object({
    email: z.string().email(),
  });

  const validatedFields = schema.safeParse({
    email: f.get("email"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await sendResetPasswordEmail(validatedFields.data.email);
  } catch (e) {
    console.error(e);

    return {
      errors: {
        email: ["Having problem sending email. Please try again later."],
      },
    };
  }

  return {
    errors: {},
  };
};
