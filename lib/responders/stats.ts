import { WebClient } from "@slack/web-api";
import { PrismaClient } from "@prisma/client";

import { MentionEvent } from "../slack";
import { Responder } from "./";
import { POKEMON, emojiFor } from "../pokemon";

export default {
  id: "query-stats",
  triggerPhrase: "How's my Pokémon?",
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
    const result = POKEMON[roll.pokemonNumber - 1];
    const emoji = emojiFor(result);
    await client.chat.postMessage({
      channel: event.channel,
      text: [
        `<@${event.user}>: :${emoji}: ${result.name.english}`,
        `*HP:* ${result.base.HP}`,
        `*Attack:* ${result.base.Attack}`,
        `*Defense:* ${result.base.Defense}`,
      ].join("\n"),
    });
  },
} as Responder;
