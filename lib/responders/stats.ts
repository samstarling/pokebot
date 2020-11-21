import { WebClient } from "@slack/web-api";
import { PrismaClient } from "@prisma/client";

import { MentionEvent } from "../slack";
import { Responder } from "./";
import { GEN_ONE_POKEMON, emojiFor } from "../pokemon";

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
    const pokemon = GEN_ONE_POKEMON[roll.pokemonNumber - 1];
    const emoji = emojiFor(pokemon);

    await client.chat.postMessage({
      channel: event.channel,
      text: `<@${event.user}>: :${emoji}: ${pokemon.name.english}`,
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: `It's ${pokemon.name.english}!`,
          },
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: "*HP*",
            },
            {
              type: "mrkdwn",
              text: "*Attack*",
            },
            {
              type: "plain_text",
              text: `${pokemon.base.HP}`,
            },
            {
              type: "plain_text",
              text: `${pokemon.base.Attack}`,
            },
            {
              type: "mrkdwn",
              text: "*Defense*",
            },
            {
              type: "mrkdwn",
              text: "*Speed*",
            },
            {
              type: "plain_text",
              text: `${pokemon.base.Defense}`,
            },
            {
              type: "plain_text",
              text: `${pokemon.base.Speed}`,
            },
          ],
          accessory: {
            type: "image",
            image_url: `https://pokeres.bastionbot.org/images/pokemon/${pokemon.id}.png`,
            alt_text: pokemon.name.english,
          },
        },
      ],
    });
  },
} as Responder;
