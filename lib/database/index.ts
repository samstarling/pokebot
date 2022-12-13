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

db.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });
export default db;
