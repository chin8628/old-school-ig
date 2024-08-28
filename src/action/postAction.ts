"use server";

import { uploadPhoto } from "@/service/gallery/upload";
import { getServerSession } from "next-auth";
import sanitizeHtml from "sanitize-html";
import { z } from "zod";

const cleanStoryInput = (story: string) => {
  return sanitizeHtml(story, {
    allowedTags: [],
    allowedAttributes: {},
  }).replace(/\n/g, "<br>");
};

export const createPostAction = async (_: Record<string, unknown> | null, f: FormData) => {
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
    photos: z
      .any()
      .refine((file) => ["image/jpeg", "image/jpg"].includes(file.type), {
        message: "Only .jpg and .jpeg files are accepted.",
      })
      .array()
      .max(10, "You can only upload up to 10 photos at a time."),
    content: z.string().optional().default(""),
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
    photos: f.getAll("photos"),
    content: f.get("content"),
    youtubeLink: f.get("youtubeLink"),
    startTime: f.get("startTime"),
    stopTime: f.get("stopTime"),
  });
  console.log("🚀 ~ createPostAction ~ validatedFields:", validatedFields)

  if (!validatedFields.success) {
    console.error(validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  await uploadPhoto(session?.user?.name, {
    files: validatedFields.data.photos as File[],
    content: cleanStoryInput(validatedFields.data.content),
    youtubeId: validatedFields.data.youtubeLink?.match(validateToHaveYoutubeId)?.[1],
    startTime: (validatedFields.data.startTime && Number.parseInt(validatedFields.data.startTime, 10)) || undefined,
    stopTime: (validatedFields.data.stopTime && Number.parseInt(validatedFields.data.stopTime, 10)) || undefined,
  });

  return {
    errors: {},
  };
};
