"use server";

import { deletePost } from "@/service/post";

export const deletePostAction = async (postId: string) => {
  const response = await deletePost(postId);
  return {
    done: true,
    error: response?.errors,
  };
};
