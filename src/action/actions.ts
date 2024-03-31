"use server";
import { saveFileName, uploadPhoto } from "@/service/gallery/upload";
import { z } from "zod";

export const uploadPhotoAction = async (f: FormData) => {
  const schema = z.object({
    photo: z.instanceof(File),
  });

  const validatedFields = schema.safeParse({
    photo: f.get("photo"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const remoteFileName = await uploadPhoto(validatedFields.data.photo);
  saveFileName(remoteFileName);

  return {};
};
