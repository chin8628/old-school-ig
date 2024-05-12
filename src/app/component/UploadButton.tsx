"use client";
import { PlusIcon } from "@heroicons/react/24/outline";

type UploadButtonProps = {
  handleUpload: () => void;
};

export const UploadButton = (props: UploadButtonProps) => {
  return (
    <button
      type="button"
      onClick={props.handleUpload}
      className="w-12 h-12 max-w-300px max-h-300px relative border border-gray-300 hover:bg-gray-50 flex items-center justify-center rounded-full"
    >
      <div className="w-[300px] flex items-center justify-center aspect-square">
        <PlusIcon className="w-full h-full text-gray-300" />
      </div>
    </button>
  );
};
