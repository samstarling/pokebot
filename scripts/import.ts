import { PrismaClient, PokemonUpdateInput } from "@prisma/client";

const prisma = new PrismaClient();

import csv from "csv-parser";
import fs from "fs";

const results: Array<{
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
}> = [];

fs.createReadStream("./data/pokemon.csv")
  .pipe(csv())
  .on("data", (data) => results.push(data))
  .on("end", () => {
    results.forEach(async (row) => {
      const update: PokemonUpdateInput = {
        name: row.name,
        generation: parseInt(row.generation),
        number: parseInt(row.pokedex_number),
        classification: row.classfication,
        primaryType: row.type1,
        hp: parseInt(row.hp),
        attack: parseInt(row.attack),
        defense: parseInt(row.defense),
        speed: parseInt(row.speed),
        specialAttack: parseInt(row.sp_attack),
        specialDefense: parseInt(row.sp_defense),
        isLegendary: row.is_legendary === "1",
      };

      if (row.type2 !== "") {
        update.secondaryType = row.type2;
      }

      console.log(`Loading ${row.name}`);
      await prisma.pokemon.upsert({
        where: { number: parseInt(row.pokedex_number) },
        create: {
          name: row.name,
          generation: parseInt(row.generation),
          number: parseInt(row.pokedex_number),
        },
        update,
      });
    });

    process.exit(0);
  });
