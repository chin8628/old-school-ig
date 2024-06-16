import Image from "next/image";
import { ReactEventHandler, useRef, useState } from "react";
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

type AvatarSelectionProps = {
  avatarUrl: string;
};

export const AvatarSelection = (props: AvatarSelectionProps) => {
  const imgRef = useRef<HTMLImageElement>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [avatarUrl, setAvatarUrl] = useState<string>(props.avatarUrl);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const onSelectFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length === 1) {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      const uploadedFile = e.target.files[0];
      const objectUrl = URL.createObjectURL(uploadedFile);
      setPreviewUrl(objectUrl);
    }
  };

  const onConfirm = async () => {
    if (!completedCrop || !imgRef.current) {
      return;
    }

    const offscreen = new OffscreenCanvas(300, 300);
    const ctx = offscreen.getContext("2d");
    if (!ctx) throw new Error("No 2d context");

    const image = imgRef.current;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const srcWidth = scaleX * completedCrop.width;
    const srcHeight = scaleY * completedCrop.height;
    const srcX = scaleX * completedCrop.x;
    const srcY = scaleY * completedCrop.y;
    ctx.drawImage(imgRef.current, srcX, srcY, srcWidth, srcHeight, 0, 0, offscreen.width, offscreen.height);

    const blob = await offscreen.convertToBlob({
      type: "image/jpeg",
      quality: 0.9,
    });

    const croppedAvatar = URL.createObjectURL(blob);
    setAvatarUrl(croppedAvatar);

    let file = new File([blob], "new-avatar.jpg", { type: "image/jpeg", lastModified: new Date().getTime() });
    let container = new DataTransfer();
    container.items.add(file);
    // @ts-ignore
    fileInputRef.current.files = container.files;
    // fileInputRef.current.dispatchEvent(new Event('change', { 'bubbles': true }))
    setPreviewUrl(null);
  };

  const onPreviewLoad: ReactEventHandler<HTMLImageElement> = (e) => {
    const defaultCrop = centerCrop(
      makeAspectCrop(
        {
          unit: "px",
          height: e.currentTarget.height,
        },
        1,
        e.currentTarget.width,
        e.currentTarget.height
      ),
      e.currentTarget.width,
      e.currentTarget.height
    );

    setCrop(defaultCrop);
    setCompletedCrop(defaultCrop);
  };

  return (
    <div className="border w-full py-4 px-4 mb-6 rounded-md flex flex-row justify-between items-center">
      <div className="w-16 h-16 rounded-full overflow-hidden shrink-0">
        <img src={avatarUrl} alt="Profile" width={64} height={64} />
      </div>

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="p-2 bg-gray-300 text-xs text-neutral-800 hover:bg-gray-200 rounded no-underline"
      >
        Change Photo
      </button>
      <input
        hidden
        name="avatar"
        type="file"
        accept="image/jpeg"
        ref={fileInputRef}
        onChange={onSelectFile}
        onClick={() => (fileInputRef.current!.value = "")}
      />

      {previewUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center px-6">
          <div className="bg-white p-4 rounded-md">
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => {
                setCrop(percentCrop);
              }}
              onComplete={(crop) => setCompletedCrop(crop)}
              aspect={1}
              circularCrop
              className="w-full max-h-[50vh]"
              ruleOfThirds
            >
              <img ref={imgRef} src={previewUrl} onLoad={onPreviewLoad} />
            </ReactCrop>

            <div className="flex justify-center mt-4 space-x-2 text-sm">
              <button
                type="button"
                className="text-black p-2 rounded-md hover:bg-slate-100"
                onClick={() => setPreviewUrl(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="w-full bg-slate-800 hover:bg-slate-700 p-2 text-white rounded-md"
                onClick={() => onConfirm()}
              >
                Select
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
