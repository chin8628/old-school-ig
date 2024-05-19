import { ModalContainer } from "@/app/component/ModalContainer";
import Image from "next/image";

export const UploadModal = (props: { previewUrl: string; close: () => void }) => {
  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <ModalContainer close={props.close}>
      <div className="flex flex-col md:flex-row justify-center items-center w-full h-full p-4 max-h-full text-sm">
        <div
          className="rounded shadow-sm flex flex-col w-full md:max-w-[60vw] h-auto bg-gray-600 bg-opacity-80 p-4 items-center justify-center drop-shadow-sm relative"
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
          <div className="w-full h-10 flex flex-row justify-between items-center p-4 border-b">
            <h2 className="font-medium">New photo</h2>
            <button className="text-blue-500 hover:text-blue-800">Share</button>
          </div>
          <div className="p-4 h-full">
            <textarea
              className="w-full outline-none resize-none appearance-none"
              placeholder="What's a story behind it?"
              autoFocus
            ></textarea>
          </div>
        </div>
      </div>
    </ModalContainer>
  );
};
