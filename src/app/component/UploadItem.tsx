"use client";
import { uploadPhotoAction } from "@/action/actions";
import { useRef } from "react";
import { UploadButton } from "./UploadButton";

export const GridUploadButton = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = () => {
    fileInputRef.current!.click();
  };

  return (
    <form ref={formRef} action={uploadPhotoAction}>
      <UploadButton handleUpload={handleUpload} />
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
