import { WebClient } from "@slack/web-api";
import { PrismaClient } from "@prisma/client";

import { MentionEvent } from "../slack";
import { Responder } from "./";
import { emojiFor, statusFor } from "../pokemon";

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
      include: {
        Pokemon: true,
      },
    });

    if (rolls[0] == null) {
      await client.chat.postMessage({
        channel: event.channel,
        text: `<@${event.user}>: You don't have one!`,
      });
      return;
    }

    const roll = rolls[0];

    await client.chat.postMessage({
      channel: event.channel,
      text: `<@${event.user}>: :${emojiFor(roll.Pokemon)}: ${
        roll.Pokemon.name
      }`,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: statusFor(roll.Pokemon),
          },
          fields: [
            {
              type: "mrkdwn",
              text: `*HP*: ${roll.Pokemon.hp}`,
            },
            {
              type: "mrkdwn",
              text: `*Attack*: ${roll.Pokemon.attack}`,
            },
            {
              type: "mrkdwn",
              text: `*Defense*: ${roll.Pokemon.defense}`,
            },
            {
              type: "mrkdwn",
              text: `*Speed*: ${roll.Pokemon.speed}`,
            },
            {
              type: "mrkdwn",
              text: `*Sp. Attack*: ${roll.Pokemon.specialAttack}`,
            },
            {
              type: "mrkdwn",
              text: `*Sp. Defense*: ${roll.Pokemon.specialDefense}`,
            },
          ],
          accessory: {
            type: "image",
            image_url: `https://pokeres.bastionbot.org/images/pokemon/${roll.Pokemon.number}.png`,
            alt_text: roll.Pokemon.name,
          },
        },
      ],
    });
  },
} as Responder;
