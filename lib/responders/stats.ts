import { WebClient } from "@slack/web-api";
import { PrismaClient, Pokemon } from "@prisma/client";

import { MentionEvent } from "../slack";
import { Responder } from "./";
import { emojiFor, pickOne } from "../pokemon";

const statusFor = (pokemon: Pokemon): string => {
  const { name } = pokemon;
  return pickOne([
    `${name} is doing OK, thanks for checking in.`,
    `${name} is great – but a little hungry.`,
    `${name} is annoyed that you forgot their birthday last week.`,
    `${name} is good.`,
    `${name} is alright.`,
    `${name} is great.`,
    `${name} is excellent.`,
    `${name} is lovely.`,
    `${name} is completing mandatory training – F in chat please.`,
    `${name} has been better, actually.`,
    `${name} has the sniffles.`,
    `${name} is doing well.`,
    `${name} is doing OK.`,
    `${name} is just fine.`,
    `${name} is having a rough day.`,
    `${name} would like a hug.`,
    `${name} could do with a holiday.`,
    `Shit, that's a hench ${name}.`,
    `Looks like ${name} is happy.`,
    `Your ${name} is looking healthy.`,
    `Your ${name} is well.`,
    `Your ${name} is just great.`,
    `Your ${name} is swell.`,
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
