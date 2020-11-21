import { WebClient } from "@slack/web-api";
import { MentionEvent } from "../slack";
import { POKEMON, pickOne, emojiFor } from "../pokemon";
import { Responder } from "./";

export default {
  id: "reroll",
  triggerPhrase: "Reroll",
  respond: async (event: MentionEvent, client: WebClient) => {
    if (new Date().getDay() == 5) {
      var result = pickOne(POKEMON);
      await client.chat.postMessage({
        channel: event.channel,
        text: `<@${event.user}>: :${emojiFor(result)}: It’s ${
          result.name.english
        }!`,
      });
    } else {
      await client.chat.postMessage({
        channel: event.channel,
        text: `<@${event.user}> Sorry, only on a Friday`,
      });
    }
  },
} as Responder;
