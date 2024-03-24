import Image from "next/image";

type PhotoItemProps = {
  src: string;
  openModal: () => void;
  priority: boolean;
};

export const PhotoItem: React.FC<PhotoItemProps> = (props) => {
  return (
    <button onClick={props.openModal} className="w-full h-full max-w-300px max-h-300px relative">
      <Image
        src={props.src}
        alt={`Photo`}
        width={0}
        height={0}
        sizes="300px"
        className="object-cover h-auto w-full aspect-square"
        priority={props.priority}
      />
    </button>
  );
};
