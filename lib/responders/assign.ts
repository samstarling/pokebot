import { WebClient } from "@slack/web-api";
import { PrismaClient } from "@prisma/client";

import { MentionEvent } from "../slack";
import { Responder } from "./";
import { GEN_ONE_POKEMON, pickOne, emojiFor } from "../pokemon";

export default {
  id: "whos-that-pokemon",
  triggerPhrase: "Who's that Pokémon?",
  respond: async (
    event: MentionEvent,
    client: WebClient,
    prisma: PrismaClient
  ) => {
    const result = pickOne(GEN_ONE_POKEMON);

    await prisma.roll.create({
      data: {
        teamId: event.team,
        userId: event.user,
        pokemonNumber: result.id,
      },
    });

    await client.chat.postMessage({
      channel: event.channel,
      text: `<@${event.user}>: :${emojiFor(result)}: It’s ${
        result.name.english
      }!`,
    });
  },
} as Responder;
