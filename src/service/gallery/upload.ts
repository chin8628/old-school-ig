import { v4 as uuidv4 } from "uuid";
import ExifReader from "exifreader";
import { uploadFileToMinio } from "../../repository/s3";
import { prisma } from "@/repository/db";

export type ExifData = {
  iso: string | null;
  shutterSpeed: string | null;
  fNumber: string | null;
  focalLength: string | null;
  maker: string | null;
  model: string | null;
  lensModel: string | null;
  createDate: string | null;
  imageHeight: string | null;
  imageWidth: string | null;
};

const extractExif = (fileBuffer: Buffer): ExifData => {
  const exif = ExifReader.load(fileBuffer);
  return {
    iso: exif.ISOSpeedRatings?.description.toString() || null,
    shutterSpeed: exif.ShutterSpeedValue?.description || null,
    fNumber: exif.FNumber?.description || null,
    focalLength: exif.FocalLengthIn35mmFilm?.description.toString() || null,
    maker: exif.Make?.description || null,
    model: exif.Model?.description || null,
    lensModel: exif.LensModel?.description || null,
    createDate: exif.CreateDate?.description || null,
    imageHeight: exif["Image Height"]?.description || null,
    imageWidth: exif["Image Width"]?.description || null,
  };
};

export async function uploadPhoto(data: {
  file: File;
  story: string;
  youtubeId?: string;
  startTime?: number;
  stopTime?: number;
}): Promise<string> {
  try {
    const fileName = `${uuidv4()}.jpg`;
    const fileBuffer = Buffer.from(await data.file.arrayBuffer());
    const exif = extractExif(fileBuffer);

    await uploadFileToMinio(fileBuffer, `/upload/photo/${fileName}`);
    await savePhotoInfo({
      fileName,
      exif,
      story: data.story,
      youtubeId: data.youtubeId,
      startTime: data.startTime,
      stopTime: data.stopTime,
    });

    return fileName;
  } catch (error) {
    console.error("Error uploading photo:", error);
    throw error;
  }
}

export async function savePhotoInfo(data: {
  fileName: string;
  exif: ExifData;
  story: string;
  youtubeId?: string;
  startTime?: number;
  stopTime?: number;
}): Promise<void> {
  try {
    await prisma.photo.create({
      data: {
        fileName: data.fileName,
        story: data.story,
        createdAt: new Date().toISOString(),
        iso: data.exif.iso,
        shutterSpeed: data.exif.shutterSpeed,
        fNumber: data.exif.fNumber,
        focalLength: data.exif.focalLength,
        maker: data.exif.maker,
        model: data.exif.model,
        lensModel: data.exif.lensModel,
        createDate: data.exif.createDate,
        imageHeight: data.exif.imageHeight,
        imageWidth: data.exif.imageWidth,
        vibeSong: data.youtubeId
          ? {
              create: {
                youtubeId: data.youtubeId,
                startTime: data.startTime,
                endTime: data.stopTime,
              },
            }
          : undefined,
      },
    });
  } catch (error) {
    console.error("Error saving photo info", error);
    throw error;
  }
}
