import { getSqliteInstance } from "@/repository/db";
import { v4 as uuidv4 } from "uuid";
import ExifReader from "exifreader";
import { uploadFileToMinio } from "../../repository/s3";

export type ExifData = {
  iso: string | null;
  shutterSpeed: string | null;
  fNumber: string | null;
  focalLength: string | null;
  make: string | null;
  model: string | null;
  lensModel: string | null;
  createDate: string | null;
  imageHeight: string | null;
  imageWidth: string | null;
};

const extractExif = (fileBuffer: Buffer): ExifData => {
  const exif = ExifReader.load(fileBuffer);
  return {
    iso: exif.ISOSpeedRatings?.description || null,
    shutterSpeed: exif.ShutterSpeedValue?.description || null,
    fNumber: exif.FNumber?.description || null,
    focalLength: exif.FocalLengthIn35mmFilm?.description || null,
    make: exif.Make?.description || null,
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
    console.log("🚀 ~ fileName:", fileName)

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
    // Handle any errors that occur during the upload process
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
  const db = await getSqliteInstance();
  try {
    if (data.youtubeId) {
      db.run(
        `
          INSERT INTO 
          vibe_song (youtube_id, start_time, end_time)
          VALUES (?, ?, ?)
        `,
        data.youtubeId,
        data.startTime,
        data.stopTime,
        function (err: Error | null) {
          if (err !== null) {
            console.error(err.message);
            return;
          }

          db.run(
            `
              INSERT INTO 
              photos (file_name, story, created_at, iso, shutter_speed, f_number, focal_length, make, model, lens_model, create_date, image_height, image_width, vibe_song)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            data.fileName,
            data.story,
            new Date().toISOString(),
            data.exif.iso,
            data.exif.shutterSpeed,
            data.exif.fNumber,
            data.exif.focalLength,
            data.exif.make,
            data.exif.model,
            data.exif.lensModel,
            data.exif.createDate,
            data.exif.imageHeight,
            data.exif.imageWidth,
            // @ts-ignore
            this.lastID
          );
          return;
        }
      );

      db.run(
        `
          INSERT INTO 
          photos (file_name, story, created_at, iso, shutter_speed, f_number, focal_length, make, model, lens_model, create_date, image_height, image_width, vibe_song_fk)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        data.fileName,
        data.story,
        new Date().toISOString(),
        data.exif.iso,
        data.exif.shutterSpeed,
        data.exif.fNumber,
        data.exif.focalLength,
        data.exif.make,
        data.exif.model,
        data.exif.lensModel,
        data.exif.createDate,
        data.exif.imageHeight,
        data.exif.imageWidth
      );

      return;
    }

    db.run(
      `
        INSERT INTO 
        photos (file_name, story, created_at, iso, shutter_speed, f_number, focal_length, make, model, lens_model, create_date, image_height, image_width)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      data.fileName,
      data.story,
      new Date().toISOString(),
      data.exif.iso,
      data.exif.shutterSpeed,
      data.exif.fNumber,
      data.exif.focalLength,
      data.exif.make,
      data.exif.model,
      data.exif.lensModel,
      data.exif.createDate,
      data.exif.imageHeight,
      data.exif.imageWidth,
    );
  } catch (error) {
    console.error("Error saving file name:", error);
    throw error;
  }
}
