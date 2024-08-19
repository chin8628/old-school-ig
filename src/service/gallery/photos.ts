"use server";
import { prisma } from "@/repository/db";
import { ExifData } from "@/service/gallery/upload";
import { getServerSession } from "next-auth";

const MINIO_PUBLIC_UPLOAD_PHOTO_PATH = "https://minio.cloudian.in.th/old-school-ig/upload/photo";

export type MediaResponse = {
  nonNextJsMediaUrl: string;
  mediaUrl: string;
  exif: ExifData;
  capturedAt: string;
};

export type PostResponse = {
  id: string;
  media: MediaResponse[];
  createdAt: string;
  content: string;
  vibeSong: {
    youtubeId?: string;
    startTime?: string;
    endTime?: string;
  };
  permission: {
    canDelete: boolean;
  };
};

export const getPhotoListWithPagination = async (
  username: string,
  page: number,
  perPage: number
): Promise<PostResponse[]> => {
  const session = await getServerSession();
  const result = await prisma.post.findMany({
    where: {
      user: {
        username,
      },
    },
    orderBy: {
      id: "desc",
    },
    include: {
      vibeSong: true,
      Media: true,
    },
    skip: (page - 1) * perPage,
    take: perPage,
  });

  return result.map((post) => {
    return {
      id: post.id.toString(),
      createdAt: post.createdAt.toISOString(),
      content: post.content,
      media: post.Media.map((media) => ({
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
      story: post.content,
      vibeSong: {
        youtubeId: post.vibeSong?.youtubeId ?? undefined,
        startTime: post.vibeSong?.startTime?.toFixed() ?? undefined,
        endTime: post.vibeSong?.endTime?.toFixed() ?? undefined,
      },
      permission: {
        canDelete: session?.user?.name === username,
      },
    };
  });
};

export const getTotalNumberOfPosts = async (username: string): Promise<number> => {
  return await prisma.post.count({
    where: {
      user: {
        username,
      },
    },
  });
};
