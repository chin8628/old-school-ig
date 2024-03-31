import { getSqliteInstance } from "@/repository/db";
import { v4 as uuidv4 } from "uuid";
import { uploadFileToMinio } from "../../repository/s3";

export async function uploadPhoto(file: File): Promise<string> {
  try {
    const fileName = `${uuidv4()}.jpg`;
    await uploadFileToMinio(file, `/upload/photo/${fileName}`);
    return fileName;
  } catch (error) {
    // Handle any errors that occur during the upload process
    console.error("Error uploading photo:", error);
    throw error;
  }
}

export async function saveFileName(fileName: string): Promise<void> {
  const db = await getSqliteInstance()
  try {
    db.run("INSERT INTO photos (file_name) VALUES (?)", fileName);
  } catch (error) {
    // Handle any errors that occur during the saving process
    console.error("Error saving file name:", error);
    throw error;
  }
}