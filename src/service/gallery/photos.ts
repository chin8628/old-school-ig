"use server";
import { getSqliteInstance } from "@/repository/db";
import { ExifData } from "@/service/gallery/upload";

export type PhotoInfo = {
  id: string;
  photoUrl: string;
  createdAt: string;
  exif: ExifData;
  story: string;
};

export const getAllPhotos = async (): Promise<PhotoInfo[]> => {
  const db = await getSqliteInstance();
  const result = (
    await db.all(
      `
        SELECT 
          id, 
          file_name, 
          story,
          iso, 
          shutter_speed, 
          f_number, 
          focal_length, 
          make, 
          model, 
          lens_model, 
          create_date, 
          image_height, 
          image_width,
          created_at
        FROM photos 
        ORDER BY id DESC
      `
    )
  ).map((photo) => ({
    id: photo.id as string,
    photoUrl: `${process.env.MINIO_PHOTO_PATH}/${photo.file_name}`,
    story: photo.story,
    createdAt: photo.created_at,
    exif: {
      iso: photo.iso,
      shutterSpeed: photo.shutter_speed,
      fNumber: photo.f_number,
      focalLength: photo.focal_length,
      make: photo.make,
      model: photo.model,
      lensModel: photo.lens_model,
      createDate: photo.create_date,
      imageHeight: photo.image_height,
      imageWidth: photo.image_width,
    },
  }));

  return result;
};

export const getTotalNumberOfPhotos = async (): Promise<number> => {
  const db = await getSqliteInstance();
  const result = await db.get(`SELECT COUNT(*) as count FROM photos`);
  return result.count;
};
