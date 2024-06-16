"use server";
import { updateProfileInfo } from "@/service/profile";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";
import { z } from "zod";

export const editProfileAction = async (_: Record<string, unknown> | null, f: FormData) => {
  const session = await getServerSession();
  if (!session?.user?.name) throw new Error("User is not authenticated");

  const schema = z.object({
    displayName: z.string().max(100).optional().default(""),
    shortBio: z.string().max(240).optional().default(""),
    avatar: z
      .any()
      .refine((files) => ["image/jpeg", "image/jpg"].includes(files.type), ".jpg and .jpeg files are accepted."),
  });

  const validatedFields = schema.safeParse({
    displayName: f.get("displayName"),
    shortBio: f.get("shortBio"),
    avatar: f.get("avatar"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  await updateProfileInfo(session, {
    displayName: validatedFields.data.displayName,
    shortBio: validatedFields.data.shortBio,
    avatar: validatedFields.data.avatar,
  });

  revalidateTag("profile");

  return {
    errors: {},
  };
};
