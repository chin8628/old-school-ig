import Image from "next/image";
import React, { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { PhotoInfo } from "@/service/gallery/photos";
import { ExifData } from "@/service/gallery/upload";
import ContentLoader from "react-content-loader";

type PhotoModalProps = {
  photo: PhotoInfo;
  close: () => void;
};

const getIsoTextIfExist = (iso: string | null) => (iso ? `ISO ${iso}` : "");
const getCameraModelTextIfExist = (make: string | null, model: string | null) =>
  make && model ? `${make} ${model}` : "";
const getLensModelTextIfExist = (lensModel: string | null) => (lensModel ? `${lensModel}` : "");
const getFocalLengthTextIfExist = (focalLength: string | null) => (focalLength ? `${focalLength} mm` : "");
const getShutterSpeedTextIfExist = (shutterSpeed: string | null) => (shutterSpeed ? `${shutterSpeed} sec` : "");
const getFNumberTextIfExist = (fNumber: string | null) => (fNumber ? `f/${fNumber}` : "");
const getCaptureDateTextIfExist = (createDate: string | null) =>
  createDate ? new Date(createDate).toLocaleString("en-US", { dateStyle: "medium" }) : "";

const getShootingSettingsText = (exif: ExifData) =>
  [
    getFocalLengthTextIfExist(exif.focalLength),
    getShutterSpeedTextIfExist(exif.shutterSpeed),
    getFNumberTextIfExist(exif.fNumber),
    getIsoTextIfExist(exif.iso),
  ]
    .filter((item) => item !== "")
    .join(", ");

export const PhotoModal = (props: PhotoModalProps) => {
  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div
      className="fixed flex-col inset-0 flex justify-center items-center bg-black bg-opacity-80 backdrop-blur-sm z-50"
      onClick={props.close}
    >
      <div className="fixed top-2 right-2 z-10">
        <XMarkIcon className="h-6 w-6 text-white cursor-pointer" onClick={props.close} />
      </div>
      <div className="flex flex-col md:flex-row items-center p-4 max-w-full overflow-scroll md:overflow-auto">
        <div className="flex flex-col items-center justify-center drop-shadow-sm relative" onClick={stopPropagation}>
          <Image
            src={props.photo.photoUrl}
            alt="Photo"
            width={0}
            height={0}
            quality={90}
            sizes="1920px"
            className="w-full md:max-h-[90vh] md:max-w-[90vw]"
          />
        </div>
        <div
          className="bg-white drop-shadow-sm p-4 mt-3 md:mt-0 md:ml-3 w-full md:max-w-[300px] md:aspect-[3/4]"
          onClick={stopPropagation}
        >
          <div>
            <p className="text-xs text-neutral-600">
              {new Date(props.photo.createdAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
            </p>
          </div>

          <div className="mt-2">
            <p className="text-sm text-neutral-600">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Porro quam repudiandae ab est. Neque voluptatem
              facere itaque nobis aliquid minima asperiores quod sapiente commodi, officiis magni id perferendis, sed
              praesentium!
            </p>
          </div>
          <div className="h-px w-full my-4 bg-gray-300" />

          <div className="text-xs text-neutral-600">
            <p>{getCameraModelTextIfExist(props.photo.exif.make, props.photo.exif.model)}</p>
            <p>{getLensModelTextIfExist(props.photo.exif.lensModel)}</p>
            <p>{getShootingSettingsText(props.photo.exif)}</p>
          </div>

          <div className="mt-2">
            <a
              href={props.photo.photoUrl}
              target="_blank"
              className="flex items-center space-x-2 text-xs text-neutral-600"
            >
              <span>Original</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
