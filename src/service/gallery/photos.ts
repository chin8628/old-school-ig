"use server";
import { prisma } from "@/repository/db";
import { ExifData } from "@/service/gallery/upload";

export type PhotoInfo = {
  id: string;
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

export const getAllPhotos = async (): Promise<PhotoInfo[]> => {
  const result = await prisma.photo.findMany({
    orderBy: {
      id: "desc",
    },
    include: {
      vibeSong: true,
    },
  });

  return result.map((photo) => {
    return {
      id: photo.id.toString(),
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

export const getTotalNumberOfPhotos = async (): Promise<number> => {
  return await prisma.photo.count();
};
