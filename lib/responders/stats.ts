import { WebClient } from "@slack/web-api";
import { PrismaClient, Pokemon } from "@prisma/client";

import { MentionEvent } from "../slack";
import { Responder } from "./";
import { emojiFor, pickOne } from "../pokemon";

const statusFor = (pokemon: Pokemon): string => {
  const { name, classification } = pokemon;
  return pickOne([
    `*${name}* (${classification}) is doing OK, thanks for checking in.`,
    `*${name}* (${classification}) is great – but a little hungry.`,
    `*${name}* (${classification}) is annoyed that you forgot their birthday last week.`,
    `*${name}* (${classification}) is good.`,
    `*${name}* (${classification}) is alright.`,
    `*${name}* (${classification}) is great.`,
    `*${name}* (${classification}) is excellent.`,
    `*${name}* (${classification}) is lovely.`,
    `*${name}* (${classification}) is completing mandatory training – Fs in chat please.`,
    `*${name}* (${classification}) has been better, actually.`,
    `*${name}* (${classification}) has the sniffles.`,
    `*${name}* (${classification}) is doing well.`,
    `*${name}* (${classification}) is doing OK.`,
    `*${name}* (${classification}) is just fine.`,
    `*${name}* (${classification}) is having a rough day.`,
    `*${name}* (${classification}) would like a hug.`,
    `*${name}* (${classification}) could do with a holiday.`,
    `Shit, that's a hench *${name}* (${classification}).`,
    `Looks like *${name}* (${classification}) is happy.`,
    `Your *${name}* (${classification}) is looking healthy.`,
    `Your *${name}* (${classification}) is well.`,
    `Your *${name}* (${classification}) is just great.`,
    `Your *${name}* (${classification}) is swell.`,
  ]);
};

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
    const emoji = emojiFor(roll.Pokemon);

    await client.chat.postMessage({
      channel: event.channel,
      text: `<@${event.user}>: :${emoji}: ${roll.Pokemon.name}`,
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
