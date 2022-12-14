import "reflect-metadata";
import { DataSource } from "typeorm";
import { Installation, Pokemon, Roll } from "./entity";

const db = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: [Pokemon, Roll, Installation],
  schema: "public",
  synchronize: false,
  logging: true,
});

export default async function getDataSource(): Promise<DataSource> {
  if (db.isInitialized) return db;
  await db.initialize();
  return db;
}
