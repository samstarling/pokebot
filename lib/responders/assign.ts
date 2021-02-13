import {
  WebAPICallResult,
  PlainTextElement,
  MrkdwnElement,
} from "@slack/web-api";
import { FindConditions, In } from "typeorm";
import { Pokemon } from "../../src/entity";
import { DateTime } from "luxon";

import { Responder, RespondParams } from "./";
import {
  emojiFor,
  statusFor,
  imageFor,
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
    let where: FindConditions<Pokemon> = { generation: 1 };

    // Generation 2 Thursdays
    if (today.weekday === 4) {
      where.generation = 2;
    }

    // Legendary Christmas Day
    if (today.day === 25 && today.month === 12) {
      where.generation = undefined;
      where.isLegendary = true;
    }

    // Mystery
    if (today.day === 14 && today.month === 2) {
      where = {
        number: In([
          594,
          113,
          242,
          35,
          173,
          222,
          108,
          440,
          370,
          517,
          79,
          759,
          40,
          199,
          463,
          151,
          238,
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
