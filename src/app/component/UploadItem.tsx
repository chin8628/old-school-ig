"use client";
import { PlusIcon } from "@heroicons/react/24/outline";
import { uploadPhotoAction } from "@/action/actions";
import { useRef } from "react";

type GridUploadButtonProps = {};

export const GridUploadButton: React.FC<GridUploadButtonProps> = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = () => {
    fileInputRef.current!.click();
  };

  return (
    <form ref={formRef} action={uploadPhotoAction}>
      <button
        type="button"
        onClick={handleUpload}
        className="w-full h-full max-w-300px max-h-300px relative border border-gray-300 flex items-center justify-center"
      >
        <PlusIcon className="w-24 h-24 text-gray-300" />
      </button>
      <input
        hidden
        type="file"
        accept="image/jpeg"
        name="photo"
        ref={fileInputRef}
        onChange={(e) => {
          if (e.target.files?.length === 1) {
            formRef.current!.requestSubmit();
          }
        }}
      />
    </form>
  );
};
