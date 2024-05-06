"use client";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useFormStatus } from "react-dom";
import UploadGridItemLoader from "./UploadGridItemLoader";

type UploadButtonProps = {
  handleUpload: () => void;
};

export const UploadButton = (props: UploadButtonProps) => {
  const { pending } = useFormStatus();

  if (pending)
    return (
      <UploadGridItemLoader className="w-full h-full max-w-300px max-h-300px" />
    );

  return (
    <button
      type="button"
      onClick={props.handleUpload}
      className="w-full h-full max-w-300px max-h-300px relative border border-gray-300 flex items-center justify-center"
    >
      <div className="w-[300px] flex items-center justify-center aspect-square">
        <PlusIcon className="w-24 h-24 text-gray-300" />
      </div>
    </button>
  );
};
