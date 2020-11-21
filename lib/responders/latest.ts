import { WebClient } from "@slack/web-api";
import { PrismaClient } from "@prisma/client";

import { MentionEvent } from "../slack";
import { Responder } from "./";
import { GEN_ONE_POKEMON, emojiFor } from "../pokemon";

export default {
  id: "query-latest-pokemon",
  triggerPhrase: "Who's my Pokémon?",
  respond: async (
    event: MentionEvent,
    client: WebClient,
    prisma: PrismaClient
  ) => {
    const rolls = await prisma.roll.findMany({
      where: { teamId: event.team, userId: event.user },
      orderBy: { createdAt: "desc" },
      take: 1,
    });

    if (rolls[0] == null) {
      await client.chat.postMessage({
        channel: event.channel,
        text: `<@${event.user}>: You don't have one!`,
      });
      return;
    }

    const roll = rolls[0];
    const result = GEN_ONE_POKEMON[roll.pokemonNumber - 1];
    await client.chat.postMessage({
      channel: event.channel,
      text: `<@${event.user}>: Your last roll was :${emojiFor(result)}: ${
        result.name.english
      }`,
    });
  },
} as Responder;
