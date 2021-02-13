import "reflect-metadata";
import { Connection, createConnection } from "typeorm";
import { Pokemon, Roll } from "../src/entity";

const initializeDatabase = (): Promise<Connection> => {
  return createConnection({
    type: "postgres",
    url: process.env.DATABASE_URL,
    entities: [Pokemon, Roll],
    schema: "public",
    synchronize: false,
    logging: ["query", "error"],
  });
};

export default initializeDatabase;
