import { WebClient, WebAPICallResult } from "@slack/web-api";
import { PrismaClient } from "@prisma/client";

import { MentionEvent } from "../slack";
import { Responder } from "./";
import {
  emojiFor,
  statusFor,
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
    const day = new Date().getDay();

    let generation = 1;
    if (day === 4) {
      generation = 2;
    }

    assignRandomPokemon(prisma, event.team, event.user, generation).then(
      async (roll) => {
        let message = `:${emojiFor(roll.Pokemon)}: It’s me, ${
          roll.Pokemon.name
        }!`;

        if (generation === 2) {
          message = `:${emojiFor(
            roll.Pokemon
          )}: Thursday means 2nd gen Pokés for everyone: it’s me, ${
            roll.Pokemon.name
          }!`;
        }

        const firstMessage = (await client.chat.postMessage({
          channel: event.channel,
          text: `<@${event.user}>: ${message}`,
          icon_url: `https://pokeres.bastionbot.org/images/pokemon/${roll.Pokemon.number}.png`,
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
                image_url: `https://pokeres.bastionbot.org/images/pokemon/${roll.Pokemon.number}.png`,
                alt_text: roll.Pokemon.name,
              },
            },
          ],
        });
      }
    );
  },
} as Responder;
