"use client";
import { LoadingSpinner } from "@/app/component/LoadingSpinner";
import { PostItem } from "@/app/component/PostItem";
import { PostResponse, getPostListWithPagination } from "@/service/gallery/photos";
import { useEffect, useRef, useState } from "react";

type PhotoGridProps = {
  username: string;
};

export const PhotoGrid = (props: PhotoGridProps) => {
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [selectedPost, setSelectedPost] = useState<PostResponse | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const reachedTheEnd = useRef<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const getPhotos = async () => {
    if (reachedTheEnd.current) return;

    setLoading(true);
    const newPosts = await getPostListWithPagination(props.username, page, 18);
    reachedTheEnd.current = newPosts.length === 0;
    setPosts((prevPosts: PostResponse[]) => {
      const mergedPosts = new Map();
      prevPosts.forEach((post) => mergedPosts.set(post.id, post));
      newPosts.forEach((post) => mergedPosts.set(post.id, post));
      return Array.from(mergedPosts.values());
    });
    setPage(page + 1);
    setLoading(false);
  };

  useEffect(() => {
    const loadMore = () => {
      if (containerRef.current && containerRef.current.getBoundingClientRect().bottom <= window.innerHeight) {
        getPhotos();
      }
    };

    loadMore();
    window.addEventListener("scroll", loadMore);
    return () => {
      window.removeEventListener("scroll", loadMore);
    };
  }, [page]);

  return (
    <div ref={containerRef}>
      <div className="grid grid-cols-3 gap-1 w-full mx-auto pb-8">
        {posts.map((post, i) => (
          <PostItem
            key={post.id}
            post={post}
            openModal={(post: PostResponse) => setSelectedPost(post)}
            priority={i < 3}
          />
        ))}
      </div>
      {loading && (
        <div className="w-full flex flex-col items-center py-4">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
};
