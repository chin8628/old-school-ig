import sqlite3 from "sqlite3";

// TODO: Need to get away from sqlite3 -> Prisma
let instance: sqlite3.Database | null = null;

export const getSqliteInstance = (): sqlite3.Database => {
  if (!instance) {
    instance = new sqlite3.Database("./db/local.db");
  }

  return instance;
};
