"use server";
import { getSqliteInstance } from '@/repository/db';

export const getAllPhotoNames = async (): Promise<{ id: string, photoUrl: string }[]> => {
  const db = await getSqliteInstance();
  const result = (await db.all('SELECT id, photo_name FROM photos')).map((photo) => ({
    id: photo.id as string,
    photoUrl: `/images/${photo.photo_name}`
  }));

  return result;
}