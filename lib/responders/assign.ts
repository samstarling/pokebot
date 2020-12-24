import { WebClient, WebAPICallResult } from "@slack/web-api";
import { PrismaClient, PokemonWhereInput } from "@prisma/client";
import { DateTime } from "luxon";

import { MentionEvent } from "../slack";
import { Responder } from "./";
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
  respond: async (
    event: MentionEvent,
    client: WebClient,
    prisma: PrismaClient
  ) => {
    const today = DateTime.local();

    const where: PokemonWhereInput = {
      generation: 1,
    };

    // Generation 2 Thursdays
    if (today.weekday === 4) {
      where.generation = 2;
    }

    // Legendary Christmas Day
    if (today.day === 25 && today.month === 12) {
      where.generation = undefined;
      where.isLegendary = true;
    }

    assignRandomPokemon(prisma, event.team, event.user, where).then(
      async (roll) => {
        let message = `:${emojiFor(roll.Pokemon)}: It’s me, ${
          roll.Pokemon.name
        }!`;

        const firstMessage = (await client.chat.postMessage({
          channel: event.channel,
          text: `<@${event.user}>: ${message}`,
          icon_url: imageFor(roll.Pokemon),
          username: roll.Pokemon.name,
        })) as PostMessageResult;

        const status = statusFor(roll.Pokemon);

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
              fields: [
                {
                  type: "mrkdwn",
                  text: renderType(roll.Pokemon),
                },
                {
                  type: "mrkdwn",
                  text: `*HP*: ${roll.Pokemon.hp}`,
                },
                {
                  type: "mrkdwn",
                  text: `*Attack*: ${roll.Pokemon.attack}`,
                },
                {
                  type: "mrkdwn",
                  text: `*Defense*: ${roll.Pokemon.defense}`,
                },
                {
                  type: "mrkdwn",
                  text: `*Speed*: ${roll.Pokemon.speed}`,
                },
                {
                  type: "mrkdwn",
                  text: `*Sp. Attack*: ${roll.Pokemon.specialAttack}`,
                },
                {
                  type: "mrkdwn",
                  text: `*Sp. Defense*: ${roll.Pokemon.specialDefense}`,
                },
              ],
              accessory: {
                type: "image",
                image_url: imageFor(roll.Pokemon),
                alt_text: roll.Pokemon.name,
              },
            },
          ],
        });
      }
    );
  },
} as Responder;
