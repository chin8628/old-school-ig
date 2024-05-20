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

  const [state, formAction] = useFormState(uploadPhotoAction, null);

  const handleUpload = () => {
    fileInputRef.current!.click();
  };

  const handleSubmit = () => {};

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length === 1) {
      const objectUrl = URL.createObjectURL(e.target.files[0]);
      setPreviewUrl(objectUrl);
    }
  };

  useEffect(() => {
    if (state !== null && Object.keys(state.errors).length === 0) {
      setUploadCompleted(true);
    }
  }, [state]);

  return (
    <>
      <form ref={formRef} action={formAction} onSubmit={handleSubmit}>
        <UploadButton handleUpload={handleUpload} />
        <input hidden type="file" accept="image/jpeg" name="photo" ref={fileInputRef} onChange={onUpload} />
        {(previewUrl || uploadCompleted) && (
          <UploadModal
            close={() => {
              if (uploadCompleted || confirm("Discard? If you leave, your edits won't be saved.")) {
                setPreviewUrl(null);
                previewUrl && URL.revokeObjectURL(previewUrl);
                setUploadCompleted(false);
              }
            }}
            previewUrl={previewUrl || ""}
            uploadCompleted={uploadCompleted}
          />
        )}
      </form>
    </>
  );
};
