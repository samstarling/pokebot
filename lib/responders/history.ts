import { emojiFor } from "../pokemon";
import { Responder, RespondParams } from "./";

import { Pokemon } from "../database/entity";

export default {
  id: "history",
  triggerPhrase: "History",
  respond: async ({ event, client, rollRepo }: RespondParams) => {
    await rollRepo
      .find({
        where: { userId: event.user },
        relations: ["pokemon"],
        order: { createdAt: "DESC" },
        take: 5,
      })
      .then(async (rolls) => {
        const text = rolls.map((r) => descriptionFor(r.pokemon)).join(", ");
        await client.chat.postMessage({
          channel: event.channel,
          text: `<@${event.user}> Your most recent Pokémon were ${text}`,
        });
      });
  },
} as Responder;

const descriptionFor = (p: Pokemon): string => `:${emojiFor(p)}: ${p.name}`;
