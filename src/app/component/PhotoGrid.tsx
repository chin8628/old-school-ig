"use client";
import { LoadingSpinner } from "@/app/component/LoadingSpinner";
import { PhotoItem } from "@/app/component/PhotoItem";
import { PhotoModal } from "@/app/component/PhotoModal";
import { PhotoInfo, getPhotoListWithPagination } from "@/service/gallery/photos";
import { useEffect, useRef, useState } from "react";

let reachedTheEnd = false;

export const PhotoGrid = () => {
  const [photos, setPhotos] = useState<PhotoInfo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoInfo | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const getPhotos = async () => {
    if (reachedTheEnd) return;

    setLoading(true);
    const newPhotos = await getPhotoListWithPagination(page, 18);
    reachedTheEnd = newPhotos.length === 0;
    setPhotos((prevPhotos) => {
      const mergedPhotos = new Map();
      prevPhotos.forEach((photo) => mergedPhotos.set(photo.id, photo));
      newPhotos.forEach((photo) => mergedPhotos.set(photo.id, photo));
      return Array.from(mergedPhotos.values());
    });
    setPage(page + 1);
    setLoading(false);
  };

  useEffect(() => {
    const loadMore = () => {
      if (containerRef.current && containerRef.current.getBoundingClientRect().bottom <= window.innerHeight) {
        getPhotos();
      }
    };

    loadMore();
    window.addEventListener("scroll", loadMore);
    return () => {
      window.removeEventListener("scroll", loadMore);
    };
  }, [page]);

  return (
    <div ref={containerRef}>
      <div className="grid grid-cols-3 gap-1 w-full mx-auto pb-8">
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
      {loading && (
        <div className="w-full flex flex-col items-center py-4">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
};
