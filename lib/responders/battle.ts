import { WebClient, WebAPICallResult } from "@slack/web-api";
import { PrismaClient, Roll } from "@prisma/client";

import { MentionEvent } from "../slack";
import { Responder } from "./";
import { POKEMON, emojiFor } from "../pokemon";

type SlackUser = {
  id: string;
  is_bot: boolean;
};

type PostMessageResult = WebAPICallResult & {
  ts: string;
};

export default {
  id: "battle",
  triggerPhrase: "Battle",
  respond: async (
    event: MentionEvent,
    client: WebClient,
    prisma: PrismaClient
  ) => {
    const usersPokemon = await pokeForUser(prisma, event.team, event.user);

    if (!usersPokemon) {
      await client.chat.postMessage({
        channel: event.channel,
        text: `<@${event.user}> You don't have a Pokémon!`,
      });
      return;
    }

    const currentPokemon = POKEMON[usersPokemon.pokemonNumber - 1];

    console.log("Event text", event.text);

    Promise.all(
      Array.from(event.text.matchAll(/<@(\w+)>/g)).map(async (m) => {
        console.log("Fetching ", m[1]);
        const response = await client.users.info({ user: m[1] });
        return response.user as SlackUser;
      })
    ).then(async (rawOpponents) => {
      console.log(JSON.stringify(rawOpponents, null, 2));

      const opponents = rawOpponents.filter((o) => !o.is_bot);

      if (opponents.length === 0) {
        await client.chat.postMessage({
          channel: event.channel,
          text: `<@${event.user}> You have to pick a human to battle!`,
        });
      }

      if (opponents.length > 1) {
        await client.chat.postMessage({
          channel: event.channel,
          text: `<@${event.user}> You can't battle more than one person`,
        });
      }

      const opponent = opponents[0];
      const opponentsPokemon = await pokeForUser(
        prisma,
        event.team,
        opponent.id
      );

      if (!opponentsPokemon) {
        await client.chat.postMessage({
          channel: event.channel,
          text: `<@${event.user}> Sorry, <@${opponent.id}> doesn't have a Pokémon!`,
        });
        return;
      }

      const opponentsCurrentPokemon =
        POKEMON[opponentsPokemon.pokemonNumber - 1];

      const rsp = (await client.chat.postMessage({
        channel: event.channel,
        text: `<@${event.user}>: Let's battle your :${emojiFor(
          currentPokemon
        )}: ${currentPokemon.name.english} against <@${
          opponent.id
        }>'s :${emojiFor(opponentsCurrentPokemon)}: ${
          opponentsCurrentPokemon.name.english
        }`,
      })) as PostMessageResult;

      await client.chat.postMessage({
        channel: event.channel,
        thread_ts: rsp.ts,
        text: `You'll have to <https://pokemon-battle.herokuapp.com/|battle yourselves>, I'm not that clever yet.`,
      });
    });
  },
} as Responder;

const pokeForUser = async (
  prisma: PrismaClient,
  teamId: string,
  userId: string
): Promise<Roll> => {
  const r = await prisma.roll.findMany({
    where: { teamId, userId },
    orderBy: { createdAt: "desc" },
    take: 1,
  });
  return r[0];
};
