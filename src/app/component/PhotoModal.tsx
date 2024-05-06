import Image from "next/image";
import React from "react";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { PhotoInfo } from "@/service/gallery/photoName";

type PhotoModalProps = {
  photo: PhotoInfo;
  close: () => void;
};

export const PhotoModal = (props: PhotoModalProps) => {
  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-60 z-50"
      onClick={props.close}
    >
      <div className="relative" onClick={stopPropagation}>
        <Image
          src={props.photo.photoUrl}
          alt="Photo"
          width={0}
          height={0}
          quality={90}
          sizes="1920px"
          className="w-full max-h-[90vh] max-w-[90vw]"
        />
      </div>
      <div className="w-8 h-8 m-4 flex items-center justify-center text-white">
        <a href={props.photo.photoUrl} target="_blank" className="flex items-center space-x-2">
          <ArrowDownTrayIcon className="w-4 h-4" />
          <span>Download</span>
        </a>
      </div>
    </div>
  );
};
