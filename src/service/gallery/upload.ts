import { uploadFileToMinio } from "../../repository/s3";
import { v4 as uuidv4 } from "uuid";

export async function uploadPhoto(file: File): Promise<void> {
  try {
    const fileName = `${uuidv4()}.jpg`;
    await uploadFileToMinio(file, `/upload/photo/${fileName}`);
  } catch (error) {
    // Handle any errors that occur during the upload process
    console.error("Error uploading photo:", error);
    throw error;
  }
}
