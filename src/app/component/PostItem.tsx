import { MediaResponse, PostResponse } from "@/service/gallery/photos";
import { Square2StackIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";

type MediaItemProps = {
  post: PostResponse;
  openModal: (post: PostResponse) => void;
  priority: boolean;
};

export const PostItem: React.FC<MediaItemProps> = (props) => {
  return (
    <Link href={`/post/${props.post.id}`} className="w-full h-full max-w-300px max-h-300px relative">
      {props.post.media.length > 1 && <Square2StackIcon className="absolute top-2 right-2 w-6 h-6 text-white" />}
      <Image
        src={props.post.media[0].mediaUrl}
        alt={`Photo`}
        width={0}
        height={0}
        sizes="500px"
        className="object-cover h-auto w-full aspect-square"
        priority={props.priority}
      />
    </Link>
  );
};
