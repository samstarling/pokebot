import { WebClient } from "@slack/web-api";
import { PrismaClient } from "@prisma/client";

import { MentionEvent } from "../slack";
import {
  GEN_ONE_POKEMON,
  pickOne,
  emojiFor,
  assignPokemonToUser,
} from "../pokemon";
import { Responder } from "./";

export default {
  id: "reroll",
  triggerPhrase: "Reroll",
  respond: async (
    event: MentionEvent,
    client: WebClient,
    prisma: PrismaClient
  ) => {
    if (new Date().getDay() !== 5) {
      await client.chat.postMessage({
        channel: event.channel,
        text: `<@${event.user}> Sorry, you can only reroll on a Friday`,
      });
      return;
    }

    var pokemon = pickOne(GEN_ONE_POKEMON);
    assignPokemonToUser(prisma, event.team, event.user, pokemon).then(() => {
      const message = `:${emojiFor(pokemon)}: It’s ${pokemon.name.english}!`;
      client.chat.postMessage({
        channel: event.channel,
        text: `<@${event.user}>: ${message}`,
      });
    });
  },
} as Responder;
