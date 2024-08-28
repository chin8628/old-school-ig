import { XMarkIcon } from "@heroicons/react/24/outline";

type PhotoModalProps = {
  close?: () => void;
  isShown: boolean;
  children: React.ReactNode;
};

export const ModalContainer = (props: PhotoModalProps) => {
  if (!props.isShown) {
    return null;
  }

  return (
    <div
      className="fixed flex-col inset-0 flex justify-center items-center bg-gray-800 md:bg-opacity-80 backdrop-blur-sm z-50"
      onClick={(e) => {
        props.close?.();
        e.stopPropagation();
      }}
    >
      {props.close && (
        <div className="fixed top-2 right-2 z-10">
          <XMarkIcon className="h-6 w-6 text-white cursor-pointer" onClick={props.close} />
        </div>
      )}
      {props.children}
    </div>
  );
};
