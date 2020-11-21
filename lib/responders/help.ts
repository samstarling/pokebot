import { WebClient } from "@slack/web-api";
import { MentionEvent } from "../slack";
import { Responder } from "./";

export default {
  id: "help",
  triggerPhrase: "Help",
  respond: async (event: MentionEvent, client: WebClient) => {
    await client.chat.postMessage({
      channel: event.channel,
      text: `<@${event.user}> There is no help, just roll a damn Pokémon already`,
    });
  },
} as Responder;
