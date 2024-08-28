type PostPageProps = {
  params: {
    postId: string;
  };
};

export default function PostPage(props: PostPageProps) {
  return `Post ID: ${props.params.postId}`;
}
