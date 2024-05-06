"use server";
import { getSqliteInstance } from "@/repository/db";

export type PhotoInfo = {
  id: string;
  photoUrl: string;
};

export const getAllPhotoNames = async (): Promise<PhotoInfo[]> => {
  const db = await getSqliteInstance();
  const result = (await db.all("SELECT id, file_name FROM photos ORDER BY id DESC")).map((photo) => ({
    id: photo.id as string,
    photoUrl: `${process.env.MINIO_PHOTO_PATH}/${photo.file_name}`,
  }));

  return result;
};
