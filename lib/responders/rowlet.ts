import { Responder } from "./";

export default {
  id: "rowlet",
  triggerPhrase: "Who's that Pokemon?",
  respond: async () => {
    // await pokeRepo.findOne({ where: { number: 722 } }).then((poke) => {
    //   assignPokemonToUser(rollRepo, event.team, event.user, poke).then(() => {
    //     client.chat.postMessage({
    //       channel: event.channel,
    //       text: `<@${event.user}>: :rowlet: :rowlet: :rowlet: :rowlet: :rowlet: :rowlet: :rowlet: :rowlet: :rowlet: rowlet: :rowlet: It's a gosh darn rowlet!!! :rowlet: :rowlet: :rowlet: :rowlet: :rowlet: :rowlet: :rowlet: :rowlet: :rowlet: :rowlet: :rowlet:`,
    //     });
    //   });
    // });
  },
} as Responder;
