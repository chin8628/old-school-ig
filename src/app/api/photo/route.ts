import { getAllPhotoNames } from "@/service/gallery/photoName"

export async function GET() {
  const photos = await getAllPhotoNames()
 
  return Response.json({ data: photos })
}