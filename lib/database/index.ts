import "reflect-metadata";
import { DataSource } from "typeorm";
import { Installation, Pokemon, Roll } from "./entity";

const db = new DataSource({
  type: "postgres",
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: process.env.DATABASE_PORT,
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
