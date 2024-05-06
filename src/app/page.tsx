"use client";
import { PhotoModal } from "./component/PhotoModal";
import { useEffect, useState } from "react";
import { Profile } from "./component/Profile";
import { PhotoItem } from "./component/PhotoItem";
import { GridUploadButton } from "./component/UploadItem";
import { PhotoInfo, getAllPhotoNames } from "@/service/gallery/photoName";

export default function Home() {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoInfo | null>(null);

  const [photos, setPhotos] = useState<PhotoInfo[]>([]);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(true);
  useEffect(() => {
    const fetchPhotos = async () => {
      setIsLoadingPhotos(true);
      const photoRecords = await getAllPhotoNames();
      setPhotos(photoRecords);
      setIsLoadingPhotos(false);
    };

    fetchPhotos();
  }, []);

  return (
    <div>
      <main className="flex min-h-screen flex-col items-center p-0 py-8 sm:py-16 sm:px-[20vw]">
        <div className="max-w-[920px]">
          <div className="p-4 sm:p-8">
            <Profile />
          </div>
          <div className="grid grid-cols-3 gap-2 w-full mx-auto">
            <GridUploadButton />
            {photos.map((photo, i) => (
              <PhotoItem
                key={photo.id}
                photo={photo}
                openModal={(photo: PhotoInfo) => setSelectedPhoto(photo)}
                priority={i < 3}
              />
            ))}
          </div>
        </div>
      </main>
      {selectedPhoto !== null && <PhotoModal photo={selectedPhoto} close={() => setSelectedPhoto(null)} />}
    </div>
  );
}
