import { v4 as uuidv4 } from "uuid";
import { prisma } from "@/repository/db";
import { Session } from "next-auth";
import { deleteFileFromMinio, uploadFileToMinio } from "@/repository/s3";

const AVATAR_PATH = "/upload/avatar";
const AVATAR_BASE_URL = `${process.env.MINIO_PATH!}${AVATAR_PATH}`;

export type ProfileInfo = {
  displayName: string;
  shortBio: string;
  avatarUrl: string;
};

export const getProfileInfoByUsername = async (username: string): Promise<ProfileInfo | null> => {
  const profile = await prisma.profile.findFirst({
    where: {
      user: {
        username,
      },
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
    avatarUrl: `${AVATAR_BASE_URL}/${profile.avatarUrl}` || "/images/avatar.jpg",
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

  const profile = await prisma.profile.findFirstOrThrow({
    where: {
      user: {
        username: session.user.name,
      },
    },
  });

  let fileName = null;
  if (newProfileInfo.avatar) {
    const generatedFileName = `${uuidv4()}.jpg`;
    const fileBuffer = Buffer.from(await newProfileInfo.avatar.arrayBuffer());
    try {
      await uploadFileToMinio(fileBuffer, `${AVATAR_PATH}/${generatedFileName}`);
      fileName = generatedFileName;
    } catch (e) {
      console.error("Failed to upload avatar", e);
      throw new Error("Failed to upload avatar");
    }

    try {
      await deleteFileFromMinio(`${AVATAR_PATH}/${profile.avatarUrl}`);
    } catch (error) {
      console.error("Cannot delete avatar", error);
    }
  }

  const updatedProfile = await prisma.profile.update({
    where: {
      id: profile.id,
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
    avatarUrl: profile.avatarUrl || "/images/avatar.jpg",
  };
};
