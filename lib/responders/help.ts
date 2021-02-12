import { Responder, RespondParams } from "./";

export default {
  id: "help",
  triggerPhrase: "Help",
  respond: async ({ event, client }: RespondParams) => {
    await client.chat.postMessage({
      channel: event.channel,
      text: `<@${event.user}> There is no help, just roll a damn Pokémon already`,
    });
  },
} as Responder;
