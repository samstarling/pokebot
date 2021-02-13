import { Pokemon, Roll } from "./src/entity";
import initializeDatabase from "./initializers/database";

initializeDatabase()
  .then(async (connection) => {
    const pokeRepo = connection.getRepository(Pokemon);
    const pokes = await pokeRepo.find({ relations: ["rolls"] });
    console.log(pokes);

    const rollRepo = connection.getRepository(Roll);
    const rolls = await rollRepo.find({ relations: ["pokemon"] });
    console.log(rolls);

    await connection.close();
  })
  .catch((error) => console.log(error));
