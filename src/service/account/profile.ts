import { prisma } from "@/repository/db";

export type ProfileInfo = {
  displayName: string;
  shortBio: string;
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
    },
  });

  if (!profile) {
    return null;
  }

  return {
    displayName: profile.displayName,
    shortBio: profile.shortBio,
  };
};

export const updateProfileInfo = async (newProfileInfo: ProfileInfo): Promise<ProfileInfo> => {
  const profile = await prisma.profile.findFirst();
  if (!profile) {
    throw new Error("Profile not found");
  }

  const updatedProfile = await prisma.profile.update({
    where: { id: profile.id },
    data: newProfileInfo,
  });

  return {
    displayName: updatedProfile.displayName,
    shortBio: updatedProfile.shortBio,
  };
};
