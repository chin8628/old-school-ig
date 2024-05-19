"use client";
import { uploadPhotoAction } from "@/action/actions";
import { UploadModal } from "@/app/component/UploadModal";
import React, { useRef, useState } from "react";
import { UploadButton } from "./UploadButton";

export const GridUploadButton = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleUpload = () => {
    fileInputRef.current!.click();
  };

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length === 1) {
      const objectUrl = URL.createObjectURL(e.target.files[0]);
      setPreviewUrl(objectUrl);
    }
  };

  return (
    <>
      <form ref={formRef} action={uploadPhotoAction}>
        <UploadButton handleUpload={handleUpload} />
        <input hidden type="file" accept="image/jpeg" name="photo" ref={fileInputRef} onChange={onUpload} />
      </form>
      {previewUrl && (
        <UploadModal
          close={() => {
            if (confirm("Discard? If you leave, your edits won't be saved.")) {
              setPreviewUrl(null);
              URL.revokeObjectURL(previewUrl);
            }
          }}
          previewUrl={previewUrl}
        />
      )}
    </>
  );
};
