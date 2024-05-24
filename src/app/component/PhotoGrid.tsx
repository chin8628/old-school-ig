"use client";
import { PhotoItem } from "@/app/component/PhotoItem";
import { PhotoModal } from "@/app/component/PhotoModal";
import { PhotoInfo, getAllPhotos } from "@/service/gallery/photos";
import { useEffect, useState } from "react";

export const PhotoGrid = () => {
  const [photos, setPhotos] = useState<PhotoInfo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoInfo | null>(null);

  const getPhotos = async () => {
    const photoRecords = await getAllPhotos();
    setPhotos(photoRecords);
  };

  useEffect(() => {
    getPhotos();
  }, []);

  return (
    <div>
      <div className="grid grid-cols-3 gap-1 w-full mx-auto">
        {photos.map((photo, i) => (
          <PhotoItem
            key={photo.id}
            photo={photo}
            openModal={(photo: PhotoInfo) => setSelectedPhoto(photo)}
            priority={i < 3}
          />
        ))}
      </div>
      {!!selectedPhoto && <PhotoModal photo={selectedPhoto} close={() => setSelectedPhoto(null)} />}
    </div>
  );
};
