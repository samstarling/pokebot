import "reflect-metadata";
import { createConnection } from "typeorm";
import fs from "fs";
import * as csv from "fast-csv";

import { Pokemon, Roll } from "../src/entity";

type CsvRow = {
  name: string;
  pokedex_number: string;
  generation: string;
  hp: string;
  attack: string;
  defense: string;
  speed: string;
  classfication: string; // There's a typo in the CSV heading
  sp_attack: string;
  sp_defense: string;
  type1: string;
  type2: string;
  is_legendary: string;
};

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

    fs.createReadStream("./data/pokemon.csv")
      .pipe(csv.parse({ headers: true }))
      .on("data", async (row: CsvRow) => {
        try {
          const num = parseInt(row.pokedex_number);
          let poke = await pokeRepo.findOne({
            where: { number: num },
          });

          if (!poke) {
            poke = new Pokemon();
            poke.number = num;
            await pokeRepo.save(poke);
          }

          poke.name = row.name;
          poke.generation = parseInt(row.generation);
          poke.number = parseInt(row.pokedex_number);
          poke.classification = row.classfication;
          poke.primaryType = row.type1;
          poke.hp = parseInt(row.hp);
          poke.attack = parseInt(row.attack);
          poke.defense = parseInt(row.defense);
          poke.speed = parseInt(row.speed);
          poke.specialAttack = parseInt(row.sp_attack);
          poke.specialDefense = parseInt(row.sp_defense);
          poke.isLegendary = row.is_legendary === "1";

          if (row.type2 !== "") {
            poke.secondaryType = row.type2;
          }

          console.log(`Loading ${row.name}`);
          await pokeRepo.save(poke);
        } catch (e) {
          console.log(e);
        }
      })
      .on("end", () => {
        process.exit(0);
      })
      .on("error", console.log);
  })
  .catch((error) => console.log(error));
