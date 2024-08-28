import { PrismaClient } from '@prisma/client'

declare const globalThis: {
  prismaGlobal: PrismaClient;
} & typeof global;

console.debug("🚀 ~ globalThis.prismaGlobal:", globalThis.prismaGlobal)
export const prisma = globalThis.prismaGlobal ?? new PrismaClient();

export const runThenClose = async (queryFunc: Promise<any>) => {
  try {
    return await queryFunc;
  } catch (e) {
    console.error(e);
    throw e;
  } finally {
    await prisma.$disconnect();
  }
};
