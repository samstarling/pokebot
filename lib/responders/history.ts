import { WebClient } from "@slack/web-api";
import { PrismaClient, Pokemon } from "@prisma/client";

import { emojiFor } from "../pokemon";
import { MentionEvent } from "../slack";
import { Responder } from "./";

export default {
  id: "history",
  triggerPhrase: "History",
  respond: async (
    event: MentionEvent,
    client: WebClient,
    prisma: PrismaClient
  ) => {
    await prisma.roll
      .findMany({
        where: { userId: event.user },
        include: { Pokemon: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      })
      .then(async (rolls) => {
        const text = rolls.map((r) => descriptionFor(r.Pokemon)).join(", ");
        await client.chat.postMessage({
          channel: event.channel,
          text: `<@${event.user}> Your most recent Pokémon were ${text}`,
        });
      });
  },
} as Responder;

const descriptionFor = (p: Pokemon): string => `:${emojiFor(p)}: ${p.name}`;
