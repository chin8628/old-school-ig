import Image from "next/image";
import React from "react";

type PhotoModalProps = {
  close: () => void;
};

export const PhotoModal = (props: PhotoModalProps) => {
  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50" onClick={props.close}>
      <div className="relative" onClick={stopPropagation}>
        <Image
          src="/images/1.jpg"
          alt="Photo"
          width={0}
          height={0}
          sizes="1080px"
          className="w-full max-h-[90vh] max-w-[90vw]"
        />
      </div>
    </div>
  );
};
