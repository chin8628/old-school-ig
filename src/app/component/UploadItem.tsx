import { PlusIcon } from "@heroicons/react/24/outline";

type GridUploadButtonProps = {};

export const GridUploadButton: React.FC<GridUploadButtonProps> = () => {
  return (
    <button onClick={console.log} className="w-full h-full max-w-300px max-h-300px relative border border-gray-300 flex items-center justify-center">
      <PlusIcon className="w-24 h-24 text-gray-300" />
    </button>
  );
};
