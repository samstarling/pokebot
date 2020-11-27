import { WebClient } from "@slack/web-api";
import { PrismaClient } from "@prisma/client";

import { MentionEvent } from "../slack";
import { Responder } from "./";
import { pickOne, emojiFor } from "../pokemon";

export default {
  id: "fusion",
  triggerPhrase: "Who's that fusion?",
  respond: async (
    event: MentionEvent,
    client: WebClient,
    prisma: PrismaClient
  ) => {
    const firstPoke = await prisma.pokemon
      .findMany({ where: { generation: 1 } })
      .then((pokes) => pickOne(pokes));

    const secondPoke = await prisma.pokemon
      .findMany({ where: { generation: 1, number: { not: firstPoke.number } } })
      .then((pokes) => pickOne(pokes));

    const text = `<@${event.user}> It's a :${emojiFor(
      firstPoke
    )}: crossed with a :${emojiFor(secondPoke)}:`;

    await client.chat.postMessage({
      channel: event.channel,
      text,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text,
          },
        },
        {
          type: "image",
          alt_text: "What a monstrosity",
          image_url: `https://images.alexonsager.net/pokemon/fused/${firstPoke.number}/${firstPoke.number}.${secondPoke.number}.png`,
        },
      ],
    });
  },
} as Responder;
