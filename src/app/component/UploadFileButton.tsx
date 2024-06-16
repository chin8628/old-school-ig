import { on } from "events";
import { useRef, useState } from "react";

type UploadFileButtonProps = {
  name: string;
  onPreviewUrlChange: (previewUrl: string | null) => void;
  className?: string;
  children: React.ReactNode;
};

export const UploadFileButton = (props: UploadFileButtonProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length === 1) {
      const objectUrl = URL.createObjectURL(e.target.files[0]);
      props.onPreviewUrlChange(objectUrl);
    }
  };

  return (
    <>
      <button type="button" onClick={() => fileInputRef.current?.click()} className={props.className}>
        {props.children}
      </button>
      <input hidden type="file" accept="image/jpeg" name={props.name} ref={fileInputRef} onChange={onUpload} />
    </>
  );
};
