import { WebClient } from "@slack/web-api";
import { PrismaClient } from "@prisma/client";

import { emojiFor, Roll } from "../pokemon";
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
        const last = rolls.pop();
        const text =
          rolls.map(descriptionFor).join(", ") + " and " + descriptionFor(last);

        await client.chat.postMessage({
          channel: event.channel,
          text: `<@${event.user}> Your most recent Pokémon were ${text}`,
        });
      });
  },
} as Responder;

const descriptionFor = (r: Roll): string =>
  `:${emojiFor(r.Pokemon)}: ${r.Pokemon.name}`;
