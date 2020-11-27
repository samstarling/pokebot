import { WebClient } from "@slack/web-api";
import { PrismaClient } from "@prisma/client";

import { MentionEvent } from "../slack";
import { Responder } from "./";
import { assignPokemonToUser } from "../pokemon";

export default {
  id: "rowlet",
  triggerPhrase: "Who's that Pokemon?",
  respond: async (
    event: MentionEvent,
    client: WebClient,
    prisma: PrismaClient
  ) => {
    assignPokemonToUser(prisma, event.team, event.user, 722).then((roll) => {
      client.chat.postMessage({
        channel: event.channel,
        text: `<@${event.user}>: :rowlet: :rowlet: :rowlet: :rowlet: :rowlet: :rowlet: :rowlet: :rowlet: :rowlet: rowlet: :rowlet: It's a gosh darn rowlet!!! :rowlet: :rowlet: :rowlet: :rowlet: :rowlet: :rowlet: :rowlet: :rowlet: :rowlet: :rowlet: :rowlet:`,
      });
    });
  },
} as Responder;
