"use server";

import { prisma } from "@/repository/db";
import { deleteFileFromMinio } from "@/repository/s3";
import { getServerSession } from "next-auth";

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

    await deleteFileFromMinio(photo?.fileName || "");
  } catch (error) {
    console.error("Error deleting photo", error);
    return {
      errors: {
        photo: ["Could not delete photo"],
      },
    };
  }
};
