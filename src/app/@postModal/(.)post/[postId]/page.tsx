import { PostModal } from "@/app/@postModal/(.)post/[postId]/PostModal";
import { getPost } from "@/service/post";

type PostModalProps = {
  params: {
    postId: string;
  };
};

export default async function PostModalSlot(props: PostModalProps) {
  const post = await getPost(props.params.postId);

  return post ? <PostModal post={post} /> : null;
}
