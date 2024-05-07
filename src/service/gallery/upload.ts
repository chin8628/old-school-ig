import { getSqliteInstance } from "@/repository/db";
import { v4 as uuidv4 } from "uuid";
import ExifReader from "exifreader";
import { uploadFileToMinio } from "../../repository/s3";

type ExifData = {
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

export async function uploadPhoto(file: File): Promise<string> {
  try {
    const fileName = `${uuidv4()}.jpg`;
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const exif = extractExif(fileBuffer);

    await uploadFileToMinio(fileBuffer, `/upload/photo/${fileName}`);
    await savePhotoInfo(fileName, exif);

    return fileName;
  } catch (error) {
    // Handle any errors that occur during the upload process
    console.error("Error uploading photo:", error);
    throw error;
  }
}

export async function savePhotoInfo(fileName: string, exif: ExifData): Promise<void> {
  const db = await getSqliteInstance();
  try {
    db.run(
      `
        INSERT INTO 
        photos (file_name, iso, shutter_speed, f_number, focal_length, make, model, lens_model, create_date, image_height, image_width)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      fileName,
      exif.iso,
      exif.shutterSpeed,
      exif.fNumber,
      exif.focalLength,
      exif.make,
      exif.model,
      exif.lensModel,
      exif.createDate,
      exif.imageHeight,
      exif.imageWidth
    );
  } catch (error) {
    // Handle any errors that occur during the saving process
    console.error("Error saving file name:", error);
    throw error;
  }
}
