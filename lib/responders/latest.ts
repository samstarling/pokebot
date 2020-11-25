import { WebClient } from "@slack/web-api";
import { PrismaClient } from "@prisma/client";

import { MentionEvent } from "../slack";
import { Responder } from "./";
import { emojiFor, currentPokemonForUser } from "../pokemon";

export default {
  id: "query-latest-pokemon",
  triggerPhrase: "Who's my Pokémon?",
  respond: async (
    event: MentionEvent,
    client: WebClient,
    prisma: PrismaClient
  ) => {
    currentPokemonForUser(prisma, event.team, event.user).then((poke) => {
      let message = `You've not rolled a Pokémon yet`;
      if (poke) {
        message = `Your last roll was :${emojiFor(poke)}: ${poke.name}`;
      }

      client.chat.postMessage({
        channel: event.channel,
        text: `<@${event.user}>: ${message}`,
      });
    });
  },
} as Responder;
