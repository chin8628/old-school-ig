"use server";
import { getSqliteInstance } from "@/repository/db";
import { ExifData } from "@/service/gallery/upload";

export type PhotoInfo = {
  id: string;
  photoUrl: string;
  createdAt: string;
  exif: ExifData;
  story: string;
  vibeSong: {
    youtubeId: string;
    startTime?: string;
    endTime?: string;
  };
};

export const getAllPhotos = async (): Promise<PhotoInfo[]> => {
  return new Promise((resolve, reject) => {
    const db = getSqliteInstance();
    const result = null;

    db.all(
      `
        SELECT 
          photos.id as id, 
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
          created_at,
          vibe_song.youtube_id as youtube_id,
          vibe_song.start_time as start_time,
          vibe_song.end_time as end_time
        FROM photos 
        LEFT JOIN vibe_song ON photos.vibe_song = vibe_song.id
        ORDER BY photos.id DESC
      `,
      (err, rows) => {
        if (err) {
          console.error(err.message);
          reject(err);
          return;
        }

        resolve(
          (rows as Record<string, any>[]).map((photo) => ({
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
            vibeSong: {
              youtubeId: photo.youtube_id,
              startTime: photo.start_time,
              endTime: photo.end_time,
            },
          }))
        );
      }
    );

    return result;
  });
};

export const getTotalNumberOfPhotos = async (): Promise<number> => {
  const db = getSqliteInstance();
  return new Promise((resolve, reject) => {
    return db.get(`SELECT COUNT(*) as count FROM photos`, (err, row) => {
      if (err) {
        reject(err.message);
        return;
      }

      resolve((row as Record<string, number>).count);
      return;
    });
  });
};
