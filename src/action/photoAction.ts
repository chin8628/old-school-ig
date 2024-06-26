"use server";

import { prisma } from "@/repository/db";
import { deleteFileFromMinio } from "@/repository/s3";
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
    console.debug(validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  await uploadPhoto(session?.user?.name, {
    file: validatedFields.data.photo,
    story: cleanStoryInput(validatedFields.data.story),
    youtubeId: validatedFields.data.youtubeLink?.match(validateToHaveYoutubeId)?.[1],
    startTime: (validatedFields.data.startTime && Number.parseInt(validatedFields.data.startTime, 10)) || undefined,
    stopTime: (validatedFields.data.stopTime && Number.parseInt(validatedFields.data.stopTime, 10)) || undefined,
  });

  return {
    errors: {},
  };
};

// Should be moved to service
export const deletePhotoAction = async (photoId: string) => {
  const session = await getServerSession();
  if (!session) {
    console.error("User is not authenticated");
    return;
  }

  try {
    // Verify that the user owns the photo
    const photo = await prisma.photo.findFirst({
      where: {
        id: Number.parseInt(photoId),
        user: {
          username: session.user?.name || "",
        },
      },
    });

    await prisma.photo.delete({
      where: {
        id: photo?.id || -1,
      },
    });

    await deleteFileFromMinio(`/upload/photo/${photo?.fileName}` || "");
  } catch (error) {
    console.error("Error deleting photo", error);
    return {
      errors: {
        photo: ["Could not delete photo"],
      },
    };
  }
};
