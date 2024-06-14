"use server";
import { prisma } from "@/repository/db";
import { ExifData } from "@/service/gallery/upload";

const MINIO_PUBLIC_UPLOAD_PHOTO_PATH = "https://minio.cloudian.in.th/old-school-ig/upload/photo";

export type PhotoInfo = {
  id: string;
  nonNextJsPhotoUrl: string;
  photoUrl: string;
  createdAt: string;
  exif: ExifData;
  story: string;
  vibeSong: {
    youtubeId?: string;
    startTime?: string;
    endTime?: string;
  };
};

export const getPhotoListWithPagination = async (
  username: string,
  page: number,
  perPage: number
): Promise<PhotoInfo[]> => {
  const result = await prisma.photo.findMany({
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
    },
    skip: (page - 1) * perPage,
    take: perPage,
  });

  // @ts-ignore
  return result.map((photo) => {
    return {
      id: photo.id.toString(),
      nonNextJsPhotoUrl: `${MINIO_PUBLIC_UPLOAD_PHOTO_PATH}/${photo.fileName}`,
      photoUrl: `${process.env.MINIO_PHOTO_PATH}/${photo.fileName}`,
      createdAt: photo.createdAt?.toISOString() || "",
      exif: {
        iso: photo.iso,
        shutterSpeed: photo.shutterSpeed,
        fNumber: photo.fNumber,
        focalLength: photo.focalLength,
        maker: photo.maker,
        model: photo.model,
        lensModel: photo.lensModel,
        createDate: photo.createDate?.toISOString() || "",
        imageHeight: photo.imageHeight,
        imageWidth: photo.imageWidth,
      },
      story: photo.story || "",
      vibeSong: {
        youtubeId: photo.vibeSong?.youtubeId ?? undefined,
        startTime: photo.vibeSong?.startTime?.toFixed() ?? undefined,
        endTime: photo.vibeSong?.endTime?.toFixed() ?? undefined,
      },
    };
  });
};

export const getTotalNumberOfPhotos = async (username: string): Promise<number> => {
  return await prisma.photo.count({
    where: {
      user: {
        username,
      },
    },
  });
};
