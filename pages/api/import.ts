import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

import csv from "csv-parser";
import fs from "fs";

import type { NextApiRequest, NextApiResponse } from "next";

export default (req: NextApiRequest, res: NextApiResponse) => {
  const results: Array<{
    name: string;
    pokedex_number: string;
    generation: string;
  }> = [];

  fs.createReadStream("./data/pokemon.csv")
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", () => {
      results.forEach(async (row) => {
        await prisma.pokemon.upsert({
          where: { number: parseInt(row.pokedex_number) },
          create: {
            name: row.name,
            generation: parseInt(row.generation),
            number: parseInt(row.pokedex_number),
          },
          update: {
            name: row.name,
            generation: parseInt(row.generation),
            number: parseInt(row.pokedex_number),
          },
        });
      });

      res.status(200).json({ results: results });
    });
};
