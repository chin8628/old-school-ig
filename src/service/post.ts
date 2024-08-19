"use server";
import { prisma } from "@/repository/db";
import { deleteFiles } from "@/repository/s3";
import { getServerSession } from "next-auth";

export const deletePost = async (postId: string) => {
  const session = await getServerSession();
  if (!session) {
    console.error("User is not authenticated");
    return;
  }

  try {
    const post = await prisma.post.findFirst({
      include: {
        Media: true,
      },
      where: {
        id: Number.parseInt(postId),
        user: {
          username: session.user?.name || "",
        },
      },
    });

    await prisma.post.delete({
      where: {
        id: post?.id,
      },
    });

    if (post && post?.Media.length > 0) {
      const filenames = post.Media.map((media) => `/upload/photo/${media.fileName}`);
      await deleteFiles(filenames);
    }
  } catch (error) {
    console.error("Error deleting post", error);
    return {
      errors: {
        photo: ["Could not delete photo"],
      },
    };
  }
};

export const getPost = async (postId: string) => {
  const post = await prisma.post.findFirst({
    include: {
      Media: true,
      vibeSong: true,
      user: true,
    },
    where: {
      id: Number.parseInt(postId),
    },
  });

  return post;
}