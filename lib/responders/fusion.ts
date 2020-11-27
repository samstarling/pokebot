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

    console.log(
      `https://images.alexonsager.net/pokemon/fused/${firstPoke.number}/${secondPoke.number}.1.png`
    );

    await client.chat.postMessage({
      channel: event.channel,
      text: `<@${event.user}> It's a :${emojiFor(
        firstPoke
      )} crossed with a ${secondPoke}`,
      blocks: [
        {
          type: "image",
          alt_text: "Gosh",
          image_url: `https://images.alexonsager.net/pokemon/fused/${firstPoke.number}/${secondPoke.number}.1.png`,
        },
      ],
    });
  },
} as Responder;
