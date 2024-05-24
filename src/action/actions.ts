"use server";
import { uploadPhoto } from "@/service/gallery/upload";
import { z } from "zod";

export const uploadPhotoAction = async (_: Record<string, unknown> | null, f: FormData) => {
  console.log("test");

  const validateYoutubeDomain = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)/;
  const validateToHaveYoutubeId = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;

  const schema = z.object({
    photo: z.instanceof(File),
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
    console.log("🚀 ~ uploadPhotoAction ~ validatedFields:", validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  await uploadPhoto({
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
