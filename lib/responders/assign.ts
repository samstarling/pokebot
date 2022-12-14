import {
  WebAPICallResult,
  PlainTextElement,
  MrkdwnElement,
} from "@slack/web-api";
import { FindOptionsWhere, In } from "typeorm";
import { Pokemon } from "../database/entity";
import { DateTime } from "luxon";

import { randomDigimon } from "../pokemon/digimon";
import { Responder, RespondParams } from "./";
import {
  emojiFor,
  statusFor,
  imageFor,
  pickOne,
  renderType,
  assignRandomPokemon,
} from "../pokemon";

type PostMessageResult = WebAPICallResult & {
  ts: string;
};

export default {
  id: "whos-that-pokemon",
  triggerPhrase: "Who's that Pokémon?",
  respond: async ({ event, client, pokeRepo, rollRepo }: RespondParams) => {
    const today = DateTime.local();
    let where: FindOptionsWhere<Pokemon> = { generation: 1 };

    // Generation 2 Thursdays
    if (today.weekday === 4) {
      where.generation = 2;
    }

    // Legendary Christmas Day
    if (today.day === 25 && today.month === 12) {
      where.generation = undefined;
      where.isLegendary = true;
    }

    // Trolling
    if (today.day === 1 && today.month === 4) {
      const digimon = randomDigimon();

      const firstMessage = (await client.chat
        .postMessage({
          channel: event.channel,
          text: `<@${event.user}>: It’s me, ${digimon.name}!`,
          icon_url: digimon.img,
          username: digimon.name,
        })
        .catch((e) => console.error(e))) as PostMessageResult;

      const msg = pickOne([
        "Your Digimon is alright. It doesn't have any stats or anything.",
        "What do you want to know? It's a Digimon. Get outta here.",
        "That's all there is to say.",
        "It's a digital monster, now get on with your day.",
        "Digimon is a Japanese media franchise encompassing virtual pet toys, anime, manga, video games, films and a trading card game.",
        "https://i.pinimg.com/originals/6b/f9/bd/6bf9bdd37a0f2245d3260386ed482ebc.jpg",
        "https://i.pinimg.com/originals/3e/b6/08/3eb6088b3d6b55687c0d8e0866aa4dcd.jpg",
        "https://i.pinimg.com/originals/2e/71/05/2e71055ddad4e6be828464ec636bf68c.jpg",
        "https://i.pinimg.com/originals/26/f0/c8/26f0c85c44786c65d5207b7397259878.jpg",
        "Hello",
        "You won't find any of those yellow mice here mate.",
        "Did you know there's a Digimon called 'Pumpkinmon'? I mean, for fuck's sake...",
      ]);

      await client.chat.postMessage({
        channel: event.channel,
        text: msg,
        thread_ts: firstMessage.ts,
        icon_url: `https://upload.wikimedia.org/wikipedia/en/a/a2/TaiKamiyavtamer01.png`,
        username: "Tai Kamiya",
      });

      return;
    }

    // Mystery
    if (today.day === 14 && today.month === 2) {
      where = {
        number: In([
          594, 113, 242, 35, 173, 222, 108, 440, 370, 517, 79, 759, 40, 199,
          463, 151, 238,
        ]),
      };
    }

    await assignRandomPokemon(
      pokeRepo,
      rollRepo,
      event.team,
      event.user,
      where
    ).then(async (roll) => {
      if (!roll) {
        return;
      }

      const message = `:${emojiFor(roll.pokemon)}: It’s me, ${
        roll.pokemon.name
      }!`;

      const firstMessage = (await client.chat
        .postMessage({
          channel: event.channel,
          text: `<@${event.user}>: ${message}`,
          icon_url: imageFor(roll.pokemon),
          username: roll.pokemon.name,
        })
        .catch((e) => console.error(e))) as PostMessageResult;

      const status = statusFor(roll.pokemon);
      let fields: (PlainTextElement | MrkdwnElement)[] = [];
      if (roll.pokemon.isLegendary) {
        fields.push({
          type: "mrkdwn",
          text: ":sparkles: Legendary",
        });
      }
      fields = fields.concat([
        {
          type: "mrkdwn",
          text: renderType(roll.pokemon),
        },
        {
          type: "mrkdwn",
          text: `*HP*: ${roll.pokemon.hp}`,
        },
        {
          type: "mrkdwn",
          text: `*Attack*: ${roll.pokemon.attack}`,
        },
        {
          type: "mrkdwn",
          text: `*Defense*: ${roll.pokemon.defense}`,
        },
        {
          type: "mrkdwn",
          text: `*Speed*: ${roll.pokemon.speed}`,
        },
        {
          type: "mrkdwn",
          text: `*Sp. Attack*: ${roll.pokemon.specialAttack}`,
        },
        {
          type: "mrkdwn",
          text: `*Sp. Defense*: ${roll.pokemon.specialDefense}`,
        },
      ]);
      await client.chat.postMessage({
        channel: event.channel,
        text: `<@${event.user}>: ${status}`,
        thread_ts: firstMessage.ts,
        icon_url: `https://gravel-pokebot.herokuapp.com/oak.png`,
        username: "Professor Oak",
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: status,
            },
            fields,
            accessory: {
              type: "image",
              image_url: imageFor(roll.pokemon),
              alt_text: roll.pokemon.name,
            },
          },
        ],
      });
    });
  },
} as Responder;
