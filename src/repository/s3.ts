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

// Function to upload a file to Minio
async function uploadFileToMinio(fileBuffer: Buffer, fileName: string): Promise<void> {
  const client = initializeMinioClient();

  const metaData = {
    "Content-Type": "image/jpeg",
  };

  return new Promise(async (resolve, reject) => {
    client.putObject(
      process.env.MINIO_BUCKET!,
      fileName,
      fileBuffer,
      fileBuffer.byteLength,
      metaData,
      (error: Error | null) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      }
    );
  });
}

export async function deleteFileFromMinio(fileName: string): Promise<void> {
  const client = initializeMinioClient();
  return await client.removeObject(process.env.MINIO_BUCKET!, fileName);
}

export { uploadFileToMinio };
