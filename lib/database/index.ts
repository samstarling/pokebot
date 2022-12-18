import "reflect-metadata";
import { DataSource } from "typeorm";
import { Installation, Pokemon, Roll } from "./entity";

const dbUrl = new URL(process.env.DATABASE_URL);
const routingId = dbUrl.searchParams.get("options");
dbUrl.searchParams.delete("options");

export const db = new DataSource({
  type: "cockroachdb",
  url: dbUrl.toString(),
  ssl: true,
  entities: [Pokemon, Roll, Installation],
  extra: {
    options: routingId
  },
});

export default async function getDataSource(): Promise<DataSource> {
  console.log("1");
  if (db.isInitialized) return db;
  console.log("2");
  await db.initialize();
  console.log("3");
  return db;
}
