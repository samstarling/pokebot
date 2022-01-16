import "reflect-metadata";
import { Connection, createConnection } from "typeorm";
import { Pokemon, Roll } from "../src/entity";

const initializeDatabase = (): Promise<Connection> => {
  return createConnection({
    type: "postgres",
    url: "postgres://tbjhwvjdsskjvl:75a59ba797a04931ac4d3b19848ea64bf783f1f9f12eefe6cc27f88519ff1619@ec2-52-208-138-246.eu-west-1.compute.amazonaws.com:5432/dcpsv7uri07328",
    entities: [Pokemon, Roll],
    schema: "public",
    synchronize: false,
    logging: ["query", "error"],
    ssl: true,
    extra: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  });
};

export default initializeDatabase;
