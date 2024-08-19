import { MediaResponse, PostResponse } from "@/service/gallery/photos";
import Image from "next/image";

type MediaItemProps = {
  post: PostResponse;
  openModal: (post: PostResponse) => void;
  priority: boolean;
};

export const PostItem: React.FC<MediaItemProps> = (props) => {
  return (
    <button onClick={() => props.openModal(props.post)} className="w-full h-full max-w-300px max-h-300px relative">
      <Image
        src={props.post.media[0].mediaUrl}
        alt={`Photo`}
        width={0}
        height={0}
        sizes="500px"
        className="object-cover h-auto w-full aspect-square"
        priority={props.priority}
      />
    </button>
  );
};
