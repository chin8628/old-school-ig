"use server";
import { updateProfileInfo } from "@/service/account/profile";
import { uploadPhoto } from "@/service/gallery/upload";
import { getServerSession } from "next-auth";
import { z } from "zod";

export const uploadPhotoAction = async (_: Record<string, unknown> | null, f: FormData) => {
  const session = await getServerSession();
  if (!session?.user?.name) {
    return {
      errors: {
        session: "You need to login to upload a photo.",
      },
    };
  }

  const validateYoutubeDomain = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)/;
  const validateToHaveYoutubeId = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;

  const schema = z.object({
    photo: z
      .any()
      .refine((files) => ["image/jpeg", "image/jpg"].includes(files.type), ".jpg and .jpeg files are accepted."),
    story: z.string().optional().default(""),
    youtubeLink: z
      .string()
      .optional()
      .refine((v) => {
        if (v === undefined || v === "") {
          return true;
        }

        if (!validateYoutubeDomain.test(v) || !validateToHaveYoutubeId.test(v)) {
          return false;
        }

        return true;
      }, {}),
    startTime: z.string().optional(),
    stopTime: z.string().optional(),
  });

  const validatedFields = schema.safeParse({
    photo: f.get("photo"),
    story: f.get("story"),
    youtubeLink: f.get("youtubeLink"),
    startTime: f.get("startTime"),
    stopTime: f.get("stopTime"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  await uploadPhoto(session?.user?.name, {
    file: validatedFields.data.photo,
    story: validatedFields.data.story,
    youtubeId: validatedFields.data.youtubeLink?.match(validateToHaveYoutubeId)?.[1],
    startTime: (validatedFields.data.startTime && Number.parseInt(validatedFields.data.startTime, 10)) || undefined,
    stopTime: (validatedFields.data.stopTime && Number.parseInt(validatedFields.data.stopTime, 10)) || undefined,
  });

  return {
    errors: {},
  };
};

export const editProfileAction = async (_: Record<string, unknown> | null, f: FormData) => {
  "use server";
  const schema = z.object({
    displayName: z.string().max(100).optional().default(""),
    shortBio: z.string().max(240).optional().default(""),
  });

  const validatedFields = schema.safeParse({
    displayName: f.get("displayName"),
    shortBio: f.get("shortBio"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  await updateProfileInfo({
    displayName: validatedFields.data.displayName,
    shortBio: validatedFields.data.shortBio,
  });

  return {
    errors: {},
  };
};
