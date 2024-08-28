import { ModalContainer } from "@/app/component/ModalContainer";
import Image from "next/image";
import { CheckBadgeIcon, MusicalNoteIcon, ClockIcon } from "@heroicons/react/24/outline";
import { ArrowLeftCircleIcon, ArrowRightCircleIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

const LoadingSpinner = () => (
  <div className="fixed inset-0 w-full h-full flex flex-col justify-center items-center bg-white bg-opacity-50 backdrop-blur-sm z-10">
    <div role="status">
      <svg
        aria-hidden="true"
        className="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-orange-400"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  </div>
);

type UploadModalProps = {
  previewUrls: string[];
  close: () => void;
  uploadCompleted: boolean;
  uploading: boolean;
  isShown: boolean;
};

export const UploadModal = (props: UploadModalProps) => {
  const [shownImageIndex, setShownImageIndex] = useState(0);
  const disabledAllInputs = props.uploadCompleted || props.uploading;

  return (
    <ModalContainer close={props.close} isShown={props.isShown} >
      <div className="flex flex-col md:flex-row max-w-[2048px] items-center justify-start md:justify-center py-10 p-4 md:py-4 w-screen h-screen overflow-y-auto text-sm">
        <div
          className="flex flex-col w-full h-screen md:w-[60%] md:h-[90%] relative items-center justify-center drop-shadow-sm bg-white overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="flex w-full h-full transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${shownImageIndex * 100}%)` }}
          >
            {props.previewUrls.map((previewUrl, index) => (
              <div key={index} className="relative w-full h-full flex-shrink-0">
                <Image
                  src={previewUrl}
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
            {shownImageIndex < props.previewUrls.length - 1 && (
              <ArrowRightCircleIcon
                className="absolute top-1/2 right-2 w-6 h-6 text-gray-200 cursor-pointer"
                onClick={() => setShownImageIndex((prev) => prev + 1)}
              />
            )}
            {props.previewUrls.length > 1 && (
              <div className="absolute bottom-2 flex space-x-1">
                {props.previewUrls.map((_, index) => (
                  <div
                    key={index}
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

        <div className="flex flex-col w-full md:max-w-[300px]" onClick={(e) => e.stopPropagation()}>
          <div className="bg-white drop-shadow-sm mt-3 md:mt-0 md:ml-3 w-full md:max-h-[90%]">
            {props.uploading && <LoadingSpinner />}

            {props.uploadCompleted && (
              <div className="fixed inset-0 w-full h-full flex flex-col justify-center items-center bg-white bg-opacity-50 backdrop-blur-sm">
                <CheckBadgeIcon className="h-14 text-orange-400" />
                <p className="mt-4">You photo has been shared.</p>
                <a href="/" className="mt-2">
                  Go Back
                </a>
              </div>
            )}

            <div className="w-full h-10 flex flex-row justify-between items-center p-4 border-b">
              <h2 className="font-medium">New photo</h2>
              <button type="submit" className="text-blue-500 hover:text-blue-800">
                Share
              </button>
            </div>

            <div className="h-[150px] border-b">
              <textarea
                className="p-4 w-full h-full outline-none resize-none appearance-none"
                placeholder="What's a story behind it?"
                name="content"
                autoFocus
                disabled={disabledAllInputs}
              ></textarea>
            </div>

            <div className="flex flex-row items-center">
              <span className="px-2">
                <MusicalNoteIcon className="text-gray-600 w-4" />
              </span>
              <input
                name="youtubeLink"
                placeholder="Add a vibe song by Youtube link"
                className="w-full h-10 pr-4 outline-none autofill:bg-white"
              />
            </div>
            <div className="flex flex-row items-center">
              <span className="px-2">
                <ClockIcon className="text-gray-600 w-4" />
              </span>
              <input
                name="startTime"
                placeholder="Start (optional)"
                className="w-full h-10 pr-4 outline-none"
                disabled={disabledAllInputs}
              />
              <input
                name="stopTime"
                placeholder="Stop (optional)"
                className="w-full h-10 pr-4 outline-none"
                disabled={disabledAllInputs}
              />
            </div>
          </div>
        </div>
      </div>
    </ModalContainer>
  );
};
