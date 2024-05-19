"use server";
import { uploadPhoto } from "@/service/gallery/upload";
import { z } from "zod";

export const uploadPhotoAction = async (f: FormData) => {
  const schema = z.object({
    photo: z.instanceof(File),
    story: z.string().optional().default(""),
  });

  const validatedFields = schema.safeParse({
    photo: f.get("photo"),
    story: f.get("story"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  await uploadPhoto(validatedFields.data.photo, validatedFields.data.story);

  return {
    errors: {},
  };
};
