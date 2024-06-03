import { prisma } from "@/repository/db";
import { hashPasswordWithSalt } from "@/service/auth";
import { randomUUID } from "crypto";

export const createUser = async (username: string, password: string) => {
  const { hash, salt } = await hashPasswordWithSalt(password);
  await prisma.user.create({
    data: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publicUserId: randomUUID().toString(),
      email: "",
      username,
      password: hash,
      salt,
      profile: {
        create: {
          displayName: username,
          shortBio: "",
        },
      },
    },
  });
};
