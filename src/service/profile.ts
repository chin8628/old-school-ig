import { prisma } from "@/repository/db";
import { deleteFiles, uploadFiles } from "@/repository/s3";
import { Session } from "next-auth";

const AVATAR_PATH = "/upload/avatar";
const AVATAR_BASE_URL = `${process.env.MINIO_PATH!}${AVATAR_PATH}`;

export type ProfileInfo = {
  displayName: string;
  shortBio: string;
  avatarUrl: string;
};

export const getProfileInfoByUsername = async (username: string): Promise<ProfileInfo | null> => {
  const profile = await prisma.user.findFirst({
    where: {
      username,
    },
    select: {
      displayName: true,
      shortBio: true,
      avatarUrl: true,
    },
  });

  if (!profile) {
    return null;
  }

  return {
    displayName: profile.displayName,
    shortBio: profile.shortBio,
    avatarUrl: profile.avatarUrl ? `${AVATAR_BASE_URL}/${profile.avatarUrl}` : "/images/avatar.jpg",
  };
};

export type UpdateProfileInfoPayload = {
  displayName: string;
  shortBio: string;
  avatar: File;
};

export const updateProfileInfo = async (
  session: Session,
  newProfileInfo: UpdateProfileInfoPayload
): Promise<ProfileInfo> => {
  if (!session.user?.name) {
    throw new Error("User is not authenticated");
  }

  const user = await prisma.user.findFirstOrThrow({
    where: {
      username: session.user.name,
    },
  });

  let fileName = null;
  if (newProfileInfo.avatar) {
    try {
      const files = await uploadFiles("/upload/avatar/", [newProfileInfo.avatar]);
      fileName = files[0].fileName;
    } catch (e) {
      console.error("Failed to upload avatar", e);
      throw new Error("Failed to upload avatar");
    }

    try {
      await deleteFiles([`${AVATAR_PATH}/${user.avatarUrl}`]);
    } catch (error) {
      console.error("Cannot delete avatar", error);
    }
  }

  const updatedProfile = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      displayName: newProfileInfo.displayName,
      shortBio: newProfileInfo.shortBio,
      avatarUrl: fileName,
    },
  });

  return {
    displayName: updatedProfile.displayName,
    shortBio: updatedProfile.shortBio,
    avatarUrl: user.avatarUrl || "/images/avatar.jpg",
  };
};
