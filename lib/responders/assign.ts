import { WebClient } from "@slack/web-api";
import { PrismaClient } from "@prisma/client";

import { MentionEvent } from "../slack";
import { Responder } from "./";
import {
  GEN_ONE_POKEMON,
  TERRIBLE_POKEMON,
  pickOne,
  emojiFor,
  assignPokemonToUser,
} from "../pokemon";

export default {
  id: "whos-that-pokemon",
  triggerPhrase: "Who's that Pokémon?",
  respond: async (
    event: MentionEvent,
    client: WebClient,
    prisma: PrismaClient
  ) => {
    let pokemon = pickOne(GEN_ONE_POKEMON);
    if (event.user === "U0118G54YLT") {
      pokemon = pickOne(TERRIBLE_POKEMON);
    }

    assignPokemonToUser(prisma, event.team, event.user, pokemon).then(() => {
      const message = `:${emojiFor(pokemon)}: It’s ${pokemon.name.english}!`;
      client.chat.postMessage({
        channel: event.channel,
        text: `<@${event.user}>: ${message}`,
      });
    });
  },
} as Responder;
