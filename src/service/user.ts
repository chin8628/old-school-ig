import { prisma } from "@/repository/db";
import { hashPasswordWithSalt } from "@/service/auth";
import { Prisma } from "@prisma/client";
import { randomUUID } from "crypto";

export const createUser = async (username: string, password: string) => {
  const { hash, salt } = await hashPasswordWithSalt(password);

  try {
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
  } catch (error) {
    console.error(error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new Error("Username already exists");
      }
    }

    throw error;
  }
};
