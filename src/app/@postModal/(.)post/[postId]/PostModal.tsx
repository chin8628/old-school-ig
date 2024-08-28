"use client";
import { deletePostAction } from "@/app/component/deletePostAction";
import { ModalContainer } from "@/app/component/ModalContainer";
import { SongPlayer } from "@/app/component/SongPlayer";
import { PostResponse } from "@/service/gallery/photos";
import { ExifData } from "@/service/gallery/upload";
import { ArrowLeftCircleIcon, ArrowRightCircleIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

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

type PostModalProps = {
  post: PostResponse;
};

export const PostModal = (props: PostModalProps) => {
  const router = useRouter();
  const [shownImageIndex, setShownImageIndex] = useState(0);

  const deletePhoto = async () => {
    await deletePostAction(props.post.id);
    window.location.reload();
  };

  const close = () => {
    router.back();
  };

  return (
    <ModalContainer close={() => close()} isShown>
      <div className="flex flex-col md:flex-row max-w-[2048px] items-center justify-start md:justify-center py-10 md:py-4 w-screen min:h-0 md:h-screen overflow-y-auto">
        <div
          className="flex flex-col w-full h-screen md:w-[60%] md:h-[90%] relative items-center justify-center md:drop-shadow-sm bg-white overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="flex w-full h-full transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${shownImageIndex * 100}%)` }}
          >
            {props.post.media.map((media) => (
              <div key={media.id} className="relative w-full h-full flex-shrink-0">
                <Image
                  src={media.mediaUrl}
                  alt="Photo"
                  width={0}
                  height={0}
                  fill
                  sizes="(max-width: 768px) 90vw, 1800px"
                  className="object-contain p-2 md:p-8"
                  quality={90}
                />
              </div>
            ))}
          </div>
          <div>
            {shownImageIndex > 0 && (
              <ArrowLeftCircleIcon
                className="absolute top-1/2 left-2 w-6 h-6 text-gray-200 cursor-pointer"
                onClick={() => setShownImageIndex((prev) => prev - 1)}
              />
            )}
            {shownImageIndex < props.post.media.length - 1 && (
              <ArrowRightCircleIcon
                className="absolute top-1/2 right-2 w-6 h-6 text-gray-200 cursor-pointer"
                onClick={() => setShownImageIndex((prev) => prev + 1)}
              />
            )}
            {props.post.media.length > 1 && (
              <div className="absolute bottom-2 flex space-x-1">
                {props.post.media.map((media, index) => (
                  <div
                    key={media.id}
                    className={
                      index === shownImageIndex
                        ? `w-2 h-2 rounded-full bg-gray-600`
                        : `w-2 h-2 rounded-full bg-gray-200`
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div
          className="bg-white md:drop-shadow-sm p-4 md:ml-3 w-full h-full max-h-[50vh] md:max-w-[300px] md:aspect-[3/4] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-row justify-between w-full">
            <p className="text-xs text-neutral-600">
              {new Date(props.post.createdAt).toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
                hour12: false,
              })}
            </p>
            {props.post.vibeSong.youtubeId && (
              <SongPlayer
                youtubeId={props.post.vibeSong.youtubeId}
                startTime={props.post.vibeSong.startTime}
                endTime={props.post.vibeSong.endTime}
              />
            )}
          </div>

          {props.post.content ? (
            <div className="mt-3 flex-grow overflow-y-auto no-scrollbar">
              <p
                className="text-sm text-neutral-600"
                dangerouslySetInnerHTML={{
                  __html: props.post.content,
                }}
              />
            </div>
          ) : (
            <div className="mt-3 flex justify-center items-center flex-grow">
              <p className="text-sm text-neutral-400 align-center">No story</p>
            </div>
          )}
          <div className="h-px w-full my-4 bg-gray-300" />

          <div className="text-xs text-neutral-600">
            <p>
              {getCameraModelTextIfExist(
                props.post.media[shownImageIndex].exif.maker,
                props.post.media[shownImageIndex].exif.model
              )}
            </p>
            <p>{getLensModelTextIfExist(props.post.media[shownImageIndex].exif.lensModel)}</p>
            <p>{getShootingSettingsText(props.post.media[shownImageIndex].exif)}</p>
          </div>

          <div className="mt-2 flex justify-between">
            <a
              href={props.post.media[0].nonNextJsMediaUrl}
              target="_blank"
              className="items-center space-x-2 text-xs text-neutral-600"
            >
              <span>Original</span>
            </a>
            {props.post.permission.canDelete && (
              <a href="#" className="items-center space-x-2 text-xs text-neutral-600" onClick={deletePhoto}>
                Delete
              </a>
            )}
          </div>
        </div>
      </div>
    </ModalContainer>
  );
};
