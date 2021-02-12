import "reflect-metadata";
import { createConnection } from "typeorm";
import { Pokemon, Roll } from "../src/entity";

export default createConnection({
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: [Pokemon, Roll],
  schema: "public",
  synchronize: false,
  logging: true,
});
