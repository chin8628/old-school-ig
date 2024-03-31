import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

let instance: Database<sqlite3.Database, sqlite3.Statement> | null = null;

export const getSqliteInstance = async (): Promise<Database<sqlite3.Database, sqlite3.Statement>> => {
  if (!instance) {
    instance = await open({
      filename: "./db/local.db",
      driver: sqlite3.cached.Database,
    });
  }

  return instance;
};
