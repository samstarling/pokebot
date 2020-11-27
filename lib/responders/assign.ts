import { WebClient } from "@slack/web-api";
import { PrismaClient } from "@prisma/client";

import { MentionEvent } from "../slack";
import { Responder } from "./";
import { emojiFor, assignRandomPokemon } from "../pokemon";

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
      (roll) => {
        let message = `:${emojiFor(roll.Pokemon)}: It’s ${roll.Pokemon.name}!`;
        if (generation === 2) {
          message = `:${emojiFor(
            roll.Pokemon
          )}: Thursday means 2nd gen Pokés for everyone: it’s ${
            roll.Pokemon.name
          }!`;
        }

        client.chat.postMessage({
          channel: event.channel,
          text: `<@${event.user}>: ${message}`,
        });
      }
    );
  },
} as Responder;
