import { PrismaClient, Pokemon } from "@prisma/client";

const prisma = new PrismaClient();

import csv from "csv-parser";
import fs from "fs";

import type { NextApiRequest, NextApiResponse } from "next";

export default (req: NextApiRequest, res: NextApiResponse) => {
  const results: Array<{}> = [];

  fs.createReadStream("./data/pokemon.csv")
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", () => {
      res.status(200).json({ results: results });
    });
};
