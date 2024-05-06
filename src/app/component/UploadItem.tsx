import { uploadPhotoAction } from "@/action/actions";
import { useEffect, useRef } from "react";
import { UploadButton } from "./UploadButton";
import { useFormState } from "react-dom";

type GridUploadButtonProps = {
  onUploadSuccess: () => void;
};

export const GridUploadButton = (props: GridUploadButtonProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = () => {
    fileInputRef.current!.click();
  };

  const [state, formAction] = useFormState(uploadPhotoAction, null);

  useEffect(() => {
    if (state !== null && Object.keys(state.errors).length === 0) {
      props.onUploadSuccess();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction}>
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
