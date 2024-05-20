import { ModalContainer } from "@/app/component/ModalContainer";
import Image from "next/image";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";

type UploadModalProps = {
  previewUrl: string;
  close: () => void;
  uploadCompleted: boolean;
};

export const UploadModal = (props: UploadModalProps) => {
  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <ModalContainer close={props.close}>
      <div className="flex flex-col md:flex-row items-center justify-start md:justify-center py-10 p-4 md:py-4 w-screen h-screen overflow-y-auto text-sm">
        <div
          className="flex flex-col w-full h-fit md:w-[60%] md:h-[90%] relative items-center justify-center drop-shadow-sm p-2 md:p-8 bg-white"
          onClick={stopPropagation}
        >
          <Image
            src={props.previewUrl}
            alt="Preview"
            width={0}
            height={0}
            className="w-auto h-auto max-h-[40vh] max-w-[98%] md:max-h-[80vh] md:max-w-[50vw] shadow-[0_0_60px_0_rgba(255,255,255,0.2)]"
          />
        </div>
        <div
          className="bg-white drop-shadow-sm mt-3 md:mt-0 md:ml-3 w-full h-full max-h-[20vh] md:max-w-[300px] md:aspect-[3/4]"
          onClick={stopPropagation}
        >
          {/* Need loading indicator while uploading a photo */}
          {props.uploadCompleted && (
            <div className="fixed inset-0 w-full h-full flex flex-col justify-center items-center bg-white bg-opacity-50 backdrop-blur-sm">
              <CheckBadgeIcon className="h-14 text-orange-400" />
              <p className="mt-4">You photo has been shared.</p>
            </div>
          )}
          <div className="w-full h-10 flex flex-row justify-between items-center p-4 border-b">
            <h2 className="font-medium">New photo</h2>
            <button className="text-blue-500 hover:text-blue-800">Share</button>
          </div>
          <div className="p-4 h-full">
            <textarea
              className="w-full outline-none resize-none appearance-none"
              placeholder="What's a story behind it?"
              name="story"
              autoFocus
              disabled={props.uploadCompleted}
            ></textarea>
          </div>
        </div>
      </div>
    </ModalContainer>
  );
};
