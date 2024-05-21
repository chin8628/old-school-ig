import { ModalContainer } from "@/app/component/ModalContainer";
import Image from "next/image";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";

const LoadingSpinner = () => (
  <div className="fixed inset-0 w-full h-full flex flex-col justify-center items-center bg-white bg-opacity-50 backdrop-blur-sm">
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
  previewUrl: string;
  close: () => void;
  uploadCompleted: boolean;
  uploading: boolean;
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
          {props.uploading && <LoadingSpinner />}
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
