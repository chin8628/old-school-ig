"use client";
import { uploadPhotoAction } from "@/action/actions";
import { UploadModal } from "@/app/component/UploadModal";
import React, { useEffect, useRef, useState } from "react";
import { UploadButton } from "./UploadButton";
import { useFormState } from "react-dom";

export const GridUploadButton = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadCompleted, setUploadCompleted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [state, formAction] = useFormState(uploadPhotoAction, null);

  const resetUploadState = () => {
    setPreviewUrl(null);
    setUploadCompleted(false);
    setIsUploading(false);
    previewUrl && URL.revokeObjectURL(previewUrl);
  };

  const handleUpload = () => {
    fileInputRef.current!.click();
  };

  const handleSubmit = () => {
    setIsUploading(true);
  };

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length === 1) {
      const objectUrl = URL.createObjectURL(e.target.files[0]);
      setPreviewUrl(objectUrl);
    }
  };

  useEffect(() => {
    if (state !== null && Object.keys(state.errors).length === 0) {
      setUploadCompleted(true);
      setIsUploading(false);
    }
  }, [state]);

  return (
    <>
      {/* Moving form logic to inside of UploadModal */}
      <form ref={formRef} action={formAction} onSubmit={handleSubmit}>
        <UploadButton handleUpload={handleUpload} />
        <input hidden type="file" accept="image/jpeg" name="photo" ref={fileInputRef} onChange={onUpload} />
        {(previewUrl || uploadCompleted) && (
          <UploadModal
            close={() => {
              if (uploadCompleted || confirm("Discard? If you leave, your edits won't be saved.")) {
                resetUploadState();
              }
            }}
            uploading={isUploading}
            previewUrl={previewUrl || ""}
            uploadCompleted={uploadCompleted}
          />
        )}
      </form>
    </>
  );
};
