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
              text: "*HP*",
            },
            {
              type: "plain_text",
              text: `${roll.Pokemon.hp}`,
            },
            {
              type: "mrkdwn",
              text: "*Attack*",
            },
            {
              type: "plain_text",
              text: `${roll.Pokemon.attack}`,
            },
            {
              type: "mrkdwn",
              text: "*Defense*",
            },
            {
              type: "plain_text",
              text: `${roll.Pokemon.defense}`,
            },
            {
              type: "mrkdwn",
              text: "*Speed*",
            },
            {
              type: "plain_text",
              text: `${roll.Pokemon.speed}`,
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
