import "reflect-metadata";
import { DataSource } from "typeorm";
import fs from "fs";
import * as csv from "fast-csv";
import * as dotenv from "dotenv";
import { Installation, Pokemon, Roll } from "../lib/database/entity";

dotenv.config();
type CsvRow = {
  name: string;
  pokedex_number: string;
  generation: string;
  hp: string;
  attack: string;
  defense: string;
  speed: string;
  classification: string;
  sp_attack: string;
  sp_defense: string;
  type1: string;
  type2: string;
  is_legendary: string;
  fusion_name_first?: string;
  fusion_name_second?: string;
  emoji?: string;
};

const synchronize = process.env.CREATE_TABLES === "true";
async function importPokes() {
  try {
    const connection = new DataSource({
      type: "postgres",
      host: process.env.DATABASE_HOST,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      port: process.env.DATABASE_PORT,
      entities: [Pokemon, Roll, Installation],
      schema: "public",
      synchronize,
      logging: ["error"],
      ssl: false,
    });
    await connection.initialize();
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
          }

          poke.name = row.name;
          poke.generation = parseInt(row.generation);
          poke.number = parseInt(row.pokedex_number);
          poke.classification = row.classification;
          poke.primaryType = row.type1;
          poke.hp = parseInt(row.hp);
          poke.attack = parseInt(row.attack);
          poke.defense = parseInt(row.defense);
          poke.speed = parseInt(row.speed);
          poke.specialAttack = parseInt(row.sp_attack);
          poke.specialDefense = parseInt(row.sp_defense);
          poke.isLegendary = row.is_legendary === "1";
          poke.emoji = row.emoji;
          if (row.type2 !== "") {
            poke.secondaryType = row.type2;
          }
          if (poke.generation === 1) {
            poke.fusionNameFirst = row.fusion_name_first;
            poke.fusionNameSecond = row.fusion_name_second;
          }

          console.log(`Loading ${row.name}`);
          await pokeRepo.save(poke);
        } catch (e) {
          console.error(e);
        }
      })
      .on("error", (err) => {
        console.error(err);
      });
  } catch (err) {
    console.error(err);
  }
}

importPokes();
