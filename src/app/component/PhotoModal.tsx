"use client";
import { deletePhotoAction } from "@/action/photoAction";
import { ModalContainer } from "@/app/component/ModalContainer";
import { SongPlayer } from "@/app/component/SongPlayer";

import { PhotoInfo } from "@/service/gallery/photos";
import { ExifData } from "@/service/gallery/upload";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";

type PhotoModalProps = {
  photo: PhotoInfo;
  close: () => void;
};

const getIsoTextIfExist = (iso: string | null) => (iso ? `ISO ${iso}` : "");
const getCameraModelTextIfExist = (maker: string | null, model: string | null) =>
  maker && model ? `${maker} ${model}` : "";
const getLensModelTextIfExist = (lensModel: string | null) => (lensModel ? `${lensModel}` : "");
const getFocalLengthTextIfExist = (focalLength: string | null) => (focalLength ? `${focalLength} mm` : "");
const getShutterSpeedTextIfExist = (shutterSpeed: string | null) => (shutterSpeed ? `${shutterSpeed} sec` : "");
const getFNumberTextIfExist = (fNumber: string | null) => fNumber || "";

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
  const [session, setSession] = useState<Session | null>();
  useEffect(() => {
    const asyncFn = async () => {
      setSession(await getSession());
    };

    asyncFn();
  }, []);

  return (
    <ModalContainer close={props.close}>
      <div className="flex flex-col md:flex-row max-w-[2048px] items-center justify-start md:justify-center py-10 p-4 md:py-4 w-screen h-screen overflow-y-auto">
        <div
          className="flex flex-col w-full h-fit md:w-[60%] md:h-[90%] relative items-center justify-center drop-shadow-sm p-2 md:p-8 bg-white"
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            src={props.photo.photoUrl}
            alt="Photo"
            width={0}
            height={0}
            sizes="(max-width: 768px) 90vw, 1200px"
            className="w-auto h-auto max-w-full max-h-full shadow-[0_0_60px_0_rgba(255,255,255,0.2)]"
          />
        </div>
        <div
          className="bg-white drop-shadow-sm p-4 mt-3 md:mt-0 md:ml-3 w-full h-full max-h-[50vh] md:max-w-[300px] md:aspect-[3/4] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-row justify-between w-full">
            <p className="text-xs text-neutral-600">
              {new Date(props.photo.createdAt).toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
                hour12: false,
              })}
            </p>
            {props.photo.vibeSong.youtubeId && (
              <SongPlayer
                youtubeId={props.photo.vibeSong.youtubeId}
                startTime={props.photo.vibeSong.startTime}
                endTime={props.photo.vibeSong.endTime}
              />
            )}
          </div>

          {props.photo.story ? (
            <div className="mt-3 flex-grow overflow-y-auto no-scrollbar">
              <p className="text-sm text-neutral-600">{props.photo.story || ""}</p>
            </div>
          ) : (
            <div className="mt-3 flex justify-center items-center flex-grow">
              <p className="text-sm text-neutral-400 align-center">No story</p>
            </div>
          )}
          <div className="h-px w-full my-4 bg-gray-300" />

          <div className="text-xs text-neutral-600">
            <p>{getCameraModelTextIfExist(props.photo.exif.maker, props.photo.exif.model)}</p>
            <p>{getLensModelTextIfExist(props.photo.exif.lensModel)}</p>
            <p>{getShootingSettingsText(props.photo.exif)}</p>
          </div>

          <div className="mt-2 flex justify-between">
            <a href={props.photo.photoUrl} target="_blank" className="items-center space-x-2 text-xs text-neutral-600">
              <span>Original</span>
            </a>
            {session && (
              <a
                href="#"
                className="items-center space-x-2 text-xs text-neutral-600"
                onClick={() => deletePhotoAction(props.photo.id)}
              >
                Delete
              </a>
            )}
          </div>
        </div>
      </div>
    </ModalContainer>
  );
};
