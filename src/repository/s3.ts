import { randomUUID } from "crypto";
import * as Minio from "minio";

// Singleton instance of Minio client
let minioClient: Minio.Client | null = null;

// Function to initialize the Minio client
function initializeMinioClient(): Minio.Client {
  if (!minioClient) {
    minioClient = new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT!,
      port: 9000,
      useSSL: false,
      accessKey: process.env.MINIO_ACCESS_KEY!,
      secretKey: process.env.MINIO_SECRET_KEY!,
    });
  }
  return minioClient;
}

export const uploadFiles = async (files: File[]): Promise<{ fileName: string; file: File }[]> => {
  const client = initializeMinioClient();
  const filesWithName = [];
  const promises = [];

  for (const file of files) {
    const filePath = `/upload/photo/`;
    const fileName = `${randomUUID()}.jpg`;
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const metaData = {
      "Content-Type": "image/jpeg",
    };

    const promise = new Promise(async (resolve, reject) => {
      client.putObject(
        process.env.MINIO_BUCKET!,
        `${filePath}${fileName}`,
        fileBuffer,
        fileBuffer.byteLength,
        metaData,
        (error: Error | null) => {
          if (error) {
            reject(error);
          } else {
            resolve(1);
          }
        }
      );
    });

    promises.push(promise);
    filesWithName.push({
      fileName,
      file,
    });
  }

  try {
    await Promise.all(promises);
  } catch (error) {
    console.error("Error uploading files", error);
    throw error;
  }

  return filesWithName;
};

export async function deleteFiles(fileNames: string[]): Promise<void> {
  const client = initializeMinioClient();
  return await client.removeObjects(process.env.MINIO_BUCKET!, fileNames);
}
