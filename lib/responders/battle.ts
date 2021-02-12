import { WebClient, WebAPICallResult } from "@slack/web-api";

import { Responder, RespondParams } from "./";
import { currentPokemonForUser, emojiFor } from "../pokemon";

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
  respond: async ({ event, client, rollRepo }: RespondParams) => {
    const usersPokemon = await currentPokemonForUser(
      rollRepo,
      event.team,
      event.user
    );

    if (!usersPokemon) {
      await client.chat.postMessage({
        channel: event.channel,
        text: `<@${event.user}> You don't have a Pokémon!`,
      });
      return;
    }

    usersFromMessage(event.text, client).then(async (rawOpponents) => {
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
      const opponentsPokemon = await currentPokemonForUser(
        rollRepo,
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

      const rsp = (await client.chat.postMessage({
        channel: event.channel,
        text: `<@${event.user}>: Let's battle your :${emojiFor(
          usersPokemon
        )}: ${usersPokemon.name} against <@${opponent.id}>'s :${emojiFor(
          opponentsPokemon
        )}: ${opponentsPokemon.name}`,
      })) as PostMessageResult;

      await client.chat.postMessage({
        channel: event.channel,
        thread_ts: rsp.ts,
        text: `You'll have to <https://pokemon-battle.herokuapp.com/|battle yourselves>, I'm not that clever yet.`,
      });
    });
  },
} as Responder;

const usersFromMessage = (
  text: string,
  client: WebClient
): Promise<SlackUser[]> => {
  return Promise.all(
    Array.from(text.matchAll(/<@(\w+)>/g)).map(async (m) => {
      console.log("Fetching ", m[1]);
      const response = await client.users.info({ user: m[1] });
      return response.user as SlackUser;
    })
  );
};
