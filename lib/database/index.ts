import { URL } from "url";
import { DataSource } from "typeorm";
import { Installation, Pokemon, Roll } from "./entity";

export default async function getDataSource(): Promise<DataSource> {
  console.log("Database URL:", process.env.DATABASE_URL)
  const dbUrl = new URL(process.env.DATABASE_URL);
  const routingId = dbUrl.searchParams.get("options");
  dbUrl.searchParams.delete("options");

  const db = new DataSource({
    type: "cockroachdb",
    url: dbUrl.toString(),
    ssl: true,
    entities: [Pokemon, Roll, Installation],
    extra: {
      options: routingId,
    },
  });

  if (db.isInitialized) return db;
  await db.initialize();
  return db;
}
