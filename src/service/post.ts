"use server";
import { prisma } from "@/repository/db";
import { deleteFiles } from "@/repository/s3";
import { PostResponse } from "@/service/gallery/photos";
import { getServerSession } from "next-auth";

const MINIO_PUBLIC_UPLOAD_PHOTO_PATH = "https://minio.cloudian.in.th/old-school-ig/upload/photo";

export const deletePost = async (postId: string) => {
  const session = await getServerSession();
  if (!session) {
    console.error("User is not authenticated");
    return;
  }

  try {
    const post = await prisma.post.findFirst({
      include: {
        Media: true,
      },
      where: {
        id: Number.parseInt(postId),
        user: {
          username: session.user?.name || "",
        },
      },
    });

    await prisma.post.delete({
      where: {
        id: post?.id,
      },
    });

    if (post && post?.Media.length > 0) {
      const filenames = post.Media.map((media) => `/upload/photo/${media.fileName}`);
      await deleteFiles(filenames);
    }
  } catch (error) {
    console.error("Error deleting post", error);
    return {
      errors: {
        photo: ["Could not delete photo"],
      },
    };
  }
};

export const getPost = async (postId: string): Promise<PostResponse> => {
  const session = await getServerSession();
  const post = await prisma.post.findFirstOrThrow({
    include: {
      Media: true,
      vibeSong: true,
      user: true,
    },
    where: {
      id: Number.parseInt(postId),
    },
  });

  return {
    id: post.id.toString(),
    createdAt: post.createdAt.toISOString(),
    content: post.content,
    media: post.Media.map((media) => ({
      id: media.id.toString(),
      nonNextJsMediaUrl: `${MINIO_PUBLIC_UPLOAD_PHOTO_PATH}/${media.fileName}`,
      mediaUrl: `${process.env.MINIO_PATH}/upload/photo/${media.fileName}`,
      capturedAt: media.createdAt?.toISOString() || "",
      exif: {
        iso: media.iso,
        shutterSpeed: media.shutterSpeed,
        fNumber: media.fNumber,
        focalLength: media.focalLength,
        maker: media.maker,
        model: media.model,
        lensModel: media.lensModel,
        capturedAt: media.capturedAt?.toISOString() || "",
        imageHeight: media.imageHeight,
        imageWidth: media.imageWidth,
      },
    })),
    vibeSong: {
      youtubeId: post.vibeSong?.youtubeId ?? undefined,
      startTime: post.vibeSong?.startTime?.toFixed() ?? undefined,
      endTime: post.vibeSong?.endTime?.toFixed() ?? undefined,
    },
    permission: {
      canDelete: session?.user?.name === post.user?.username,
    },
  };
};
