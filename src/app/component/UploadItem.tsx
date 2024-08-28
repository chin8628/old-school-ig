"use client";
import { createPostAction } from "@/action/postAction";
import { UploadModal } from "@/app/component/UploadModal";
import React, { useEffect, useRef, useState } from "react";
import { UploadButton } from "./UploadButton";
import { useFormState } from "react-dom";

export const GridUploadButton = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [previewUrls, setPreviewUrls] = useState<string[] | null>(null);
  const [uploadCompleted, setUploadCompleted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [state, formAction] = useFormState(createPostAction, null);

  const resetUploadState = () => {
    setPreviewUrls(null);
    setUploadCompleted(false);
    setIsUploading(false);
    if (previewUrls) {
      for (const url of previewUrls) {
        URL.revokeObjectURL(url);
      }
    }
  };

  const handleUpload = () => {
    fileInputRef.current!.click();
  };

  const handleSubmit = () => {
    setIsUploading(true);
  };

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      let objectUrls: string[] = [];
      Array.from(e.target.files).forEach((file) => {
        objectUrls.push(URL.createObjectURL(file));
      })
      setPreviewUrls(objectUrls);
    }
  };

  useEffect(() => {
    if (state !== null && Object.keys(state.errors).length === 0) {
      setUploadCompleted(true);
      setIsUploading(false);
    }
  }, [state]);

  // Need an error handler
  return (
    <>
      {/* Moving form logic to inside of UploadModal */}
      <form ref={formRef} action={formAction} onSubmit={handleSubmit}>
        <UploadButton handleUpload={handleUpload} />
        <input hidden type="file" accept="image/jpeg" name="photos" multiple ref={fileInputRef} onChange={onUpload} />
        {(previewUrls || uploadCompleted) && (
          <UploadModal
            close={() => {
              if (uploadCompleted || confirm("Discard? If you leave, your edits won't be saved.")) {
                resetUploadState();
              }
            }}
            uploading={isUploading}
            previewUrls={previewUrls || []}
            uploadCompleted={uploadCompleted}
            isShown={previewUrls !== null}
          />
        )}
      </form>
    </>
  );
};
