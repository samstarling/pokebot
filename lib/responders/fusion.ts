import { Responder, RespondParams } from "./";
import { pickOne, emojiFor } from "../pokemon";
import { Not } from "typeorm";

const MR_MIME = 122;
export default {
  id: "fusion",
  triggerPhrase: "Who's that fusion?",
  respond: async ({ event, client, pokeRepo }: RespondParams) => {
    const firstPoke = await pokeRepo
      .find({ where: { generation: 1 } })
      .then((pokes) => pickOne(pokes));

    const secondPoke = await pokeRepo
      .find({ where: { generation: 1, number: Not(firstPoke.number) } })
      .then((pokes) => pickOne(pokes));

    const text = `A :${emojiFor(firstPoke)}: crossed with a :${emojiFor(
      secondPoke
    )}:`;

    // If the first poke is Mr Mime, make sure the second half has the first letter capitalised.
    const fusionName =
      firstPoke.number === MR_MIME
        ? firstPoke.fusionNameFirst +
          toSentenceCase(secondPoke.fusionNameSecond)
        : firstPoke.fusionNameFirst + secondPoke.fusionNameSecond;

    await client.chat.postMessage({
      channel: event.channel,
      text,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `<@${event.user}> It's *${fusionName}*!`,
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text,
          },
        },
        {
          type: "image",
          alt_text: "What a monstrosity",
          image_url: `https://images.alexonsager.net/pokemon/fused/${firstPoke.number}/${firstPoke.number}.${secondPoke.number}.png`,
        },
      ],
    });
  },
} as Responder;

function toSentenceCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
