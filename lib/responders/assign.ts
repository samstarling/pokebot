import { WebClient } from "@slack/web-api";
import { PrismaClient } from "@prisma/client";

import { MentionEvent } from "../slack";
import { Responder } from "./";
import { emojiFor, assignPokemonToUser } from "../pokemon";

function getNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}

export default {
  id: "whos-that-pokemon",
  triggerPhrase: "Who's that Pokémon?",
  respond: async (
    event: MentionEvent,
    client: WebClient,
    prisma: PrismaClient
  ) => {
    const pokeNumber = getNumber(1, 151);

    assignPokemonToUser(prisma, event.team, event.user, pokeNumber).then(
      (roll) => {
        const message = `:${emojiFor(roll.Pokemon)}: It’s ${
          roll.Pokemon.name
        }!`;
        client.chat.postMessage({
          channel: event.channel,
          text: `<@${event.user}>: ${message}`,
        });
      }
    );
  },
} as Responder;
