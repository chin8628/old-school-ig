import { useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

type PhotoModalProps = {
  close?: () => void;
  children: React.ReactNode;
};

export const ModalContainer = (props: PhotoModalProps) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div
      className="fixed flex-col inset-0 flex justify-center items-center bg-black bg-opacity-80 backdrop-blur-sm z-50"
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
