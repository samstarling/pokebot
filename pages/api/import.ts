import { PrismaClient, PokemonUpdateInput } from "@prisma/client";

const prisma = new PrismaClient();

import csv from "csv-parser";
import fs from "fs";

import type { NextApiRequest, NextApiResponse } from "next";

export default (req: NextApiRequest, res: NextApiResponse) => {
  const results: Array<{
    name: string;
    pokedex_number: string;
    generation: string;
    hp: string;
    attack: string;
    defense: string;
    speed: string;
    classfication: string; // Yes, there's a typo in the CSV heading
    sp_attack: string;
    sp_defense: string;
    type1: string;
    type2: string;
  }> = [];

  fs.createReadStream("./data/pokemon.csv")
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", () => {
      results.forEach(async (row) => {
        console.log(row.name, row.type1);

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
        };

        if (row.type2 !== "") {
          update.secondaryType = row.type2;
        }

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

      res.status(200).json({ results: results });
    });
};
