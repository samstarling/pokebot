import "reflect-metadata";
import { createConnection } from "typeorm";
import { Pokemon, Roll } from "./src/entity";

createConnection({
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: [Pokemon, Roll],
  schema: "public",
  synchronize: false,
  logging: true,
})
  .then(async (connection) => {
    const pokeRepo = connection.getRepository(Pokemon);
    const pokes = await pokeRepo.find();
    console.log(pokes);

    const rollRepo = connection.getRepository(Roll);
    const rolls = await rollRepo.find({ relations: ["pokemon"] });
    console.log(rolls);

    return;
  })
  .catch((error) => console.log(error));
