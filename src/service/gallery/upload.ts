import { prisma } from "@/repository/db";
import { MediaType } from "@prisma/client";
import ExifReader from "exifreader";
import { uploadFiles } from "../../repository/s3";

export type ExifData = {
  iso: string | null;
  shutterSpeed: string | null;
  fNumber: string | null;
  focalLength: string | null;
  maker: string | null;
  model: string | null;
  lensModel: string | null;
  capturedAt: string | null;
  imageHeight: string | null;
  imageWidth: string | null;
};

const extractExif = async (file: File): Promise<ExifData> => {
  const exif = ExifReader.load(Buffer.from(await file.arrayBuffer()));
  return {
    iso: exif.ISOSpeedRatings?.description.toString() || null,
    shutterSpeed: exif.ShutterSpeedValue?.description || null,
    fNumber: exif.FNumber?.description || null,
    focalLength: exif.FocalLengthIn35mmFilm?.description.toString() || null,
    maker: exif.Make?.description || null,
    model: exif.Model?.description || null,
    lensModel: exif.LensModel?.description || null,
    capturedAt: exif.CreateDate?.description || null,
    imageHeight: exif["Image Height"]?.description || null,
    imageWidth: exif["Image Width"]?.description || null,
  };
};

export const uploadPhoto = async (
  username: string,
  data: {
    files: File[];
    content: string;
    youtubeId?: string;
    startTime?: number;
    stopTime?: number;
  }
): Promise<string[]> => {
  try {
    const filesWithName = await uploadFiles(data.files);
    let photos = [];
    for (const file of filesWithName) {
      photos.push({
        fileName: file.fileName,
        exif: await extractExif(file.file),
      });
    }
    await savePhotoInfo(username, {
      content: data.content,
      youtubeId: data.youtubeId,
      startTime: data.startTime,
      stopTime: data.stopTime,
      photos,
    });

    return filesWithName.map((file) => file.fileName);
  } catch (error) {
    console.error("Error uploading photo:", error);
    throw error;
  }
};

export async function savePhotoInfo(
  username: string,
  data: {
    content: string;
    youtubeId?: string;
    startTime?: number;
    stopTime?: number;
    photos: {
      fileName: string;
      exif: ExifData;
    }[];
  }
): Promise<void> {
  try {
    await prisma.post.create({
      data: {
        content: data.content,
        createdAt: new Date().toISOString(),
        Media: {
          createMany: {
            data: data.photos.map((photo) => ({
              fileName: photo.fileName,
              iso: photo.exif.iso,
              shutterSpeed: photo.exif.shutterSpeed,
              fNumber: photo.exif.fNumber,
              focalLength: photo.exif.focalLength,
              maker: photo.exif.maker,
              model: photo.exif.model,
              lensModel: photo.exif.lensModel,
              capturedAt: photo.exif.capturedAt,
              imageHeight: photo.exif.imageHeight,
              imageWidth: photo.exif.imageWidth,
              type: MediaType.PHOTO,
            })),
          },
        },
        vibeSong: data.youtubeId
          ? {
              create: {
                youtubeId: data.youtubeId,
                startTime: data.startTime,
                endTime: data.stopTime,
              },
            }
          : undefined,
        user: {
          connect: {
            username,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error saving photo info", error);
    throw error;
  }
}
