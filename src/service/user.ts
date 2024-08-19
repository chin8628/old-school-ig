import { prisma } from "@/repository/db";
import { hashPasswordWithSalt } from "@/service/auth";
import { Prisma } from "@prisma/client";
import { randomUUID } from "crypto";

export const createUser = async (username: string, password: string, email: string) => {
  const { hash, salt } = await hashPasswordWithSalt(password);

  try {
    await prisma.user.create({
      data: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        publicUserId: randomUUID().toString(),
        email,
        username,
        password: hash,
        salt,
        displayName: username,
        shortBio: "",
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

export const getUserByResetPasswordToken = async (token: string) => {
  const user = await prisma.user.findFirst({
    where: {
      resetPassword: {
        some: {
          token,
          expireAt: {
            gte: new Date().toISOString(),
          },
        },
      },
    },
  });

  if (!user) {
    throw new Error("Invalid token");
  }

  return user;
};
