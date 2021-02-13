import { Responder, RespondParams } from "./";
import { emojiFor, imageFor, renderType, statusFor } from "../pokemon";

export default {
  id: "query-stats",
  triggerPhrase: "How's my Pokémon?",
  respond: async ({ event, client, rollRepo }: RespondParams) => {
    const rolls = await rollRepo.find({
      where: { teamId: event.team, userId: event.user },
      order: { createdAt: "DESC" },
      take: 1,
      relations: ["pokemon"],
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
      text: `<@${event.user}>: :${emojiFor(roll.pokemon)}: ${
        roll.pokemon.name
      }`,
      icon_url: `https://gravel-pokebot.herokuapp.com/oak.png`,
      username: "Professor Oak",
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: statusFor(roll.pokemon),
          },
          fields: [
            {
              type: "mrkdwn",
              text: renderType(roll.pokemon),
            },
            {
              type: "mrkdwn",
              text: `*HP*: ${roll.pokemon.hp}`,
            },
            {
              type: "mrkdwn",
              text: `*Attack*: ${roll.pokemon.attack}`,
            },
            {
              type: "mrkdwn",
              text: `*Defense*: ${roll.pokemon.defense}`,
            },
            {
              type: "mrkdwn",
              text: `*Speed*: ${roll.pokemon.speed}`,
            },
            {
              type: "mrkdwn",
              text: `*Sp. Attack*: ${roll.pokemon.specialAttack}`,
            },
            {
              type: "mrkdwn",
              text: `*Sp. Defense*: ${roll.pokemon.specialDefense}`,
            },
          ],
          accessory: {
            type: "image",
            image_url: imageFor(roll.pokemon),
            alt_text: roll.pokemon.name,
          },
        },
      ],
    });
  },
} as Responder;
