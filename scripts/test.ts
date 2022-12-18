import "reflect-metadata";
import getDataSource from "../lib/database";
import { Pokemon, Roll } from "../lib/database/entity";
import { assignRandomPokemon } from "../lib/pokemon";

async function test() {
  const connection = await getDataSource();

  try {
    const pokeRepo = connection.getRepository(Pokemon);
    const rollRepo = connection.getRepository(Roll);
    const poke = await assignRandomPokemon(
      pokeRepo,
      rollRepo,
      "T0116S2F8QY",
      "U011DEMMVE0",
      {}
    );
    console.log(poke);
  } catch (e) {
    console.error(e);
  } finally {
    connection.destroy();
  }
}

test();
