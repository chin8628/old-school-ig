import { randomBytes } from "crypto";
import argon2 from "argon2";
import { prisma } from "@/repository/db";

export const hashPasswordWithSalt = async (password: string) => {
  const salt = randomBytes(16).toString("hex");
  const encodedPassword = password + salt;
  const hash = await argon2.hash(encodedPassword);
  return { hash, salt };
};

export const verifyPasswordToGetUser = async (username: string, password: string) => {
  const user = await prisma.user.findFirst({
    where: {
      username,
    },
  });
  if (!user) return false;

  const salt = user.salt;
  const encodedPassword = password + salt;
  if (!(await argon2.verify(user.password, encodedPassword))) return false;

  return user;
};

export const changePassword = async (username: string, password: string) => {
  const { hash, salt } = await hashPasswordWithSalt(password);
  await prisma.user.update({
    where: {
      username,
    },
    data: {
      password: hash,
      salt,
    },
  });
};
