import { WebClient } from "@slack/web-api";
import { PrismaClient } from "@prisma/client";

import { MentionEvent } from "../slack";
import { Responder } from ".";
import { emojiFor, assignRandomPokemon } from "../pokemon";

function getNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}

export default {
  id: "whos-that-pokemon-2",
  triggerPhrase: "Who's that Pokémon? 2",
  respond: async (
    event: MentionEvent,
    client: WebClient,
    prisma: PrismaClient
  ) => {
    assignRandomPokemon(prisma, event.team, event.user, 2).then((roll) => {
      if (!roll) {
        return;
      }

      const message = `:${emojiFor(roll.Pokemon)}: It’s ${roll.Pokemon.name}!`;
      client.chat.postMessage({
        channel: event.channel,
        text: `<@${event.user}>: ${message}`,
      });
    });
  },
} as Responder;
