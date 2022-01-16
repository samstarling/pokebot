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

    const firstHalf = firstPoke.fusionNameFirst;
    let secondHalf = secondPoke.fusionNameSecond;

    if (firstHalf.charAt(firstHalf.length - 1) === secondHalf.charAt(0)) {
      secondHalf = secondHalf.slice(1); // chop off the first letter to avoid doubles
    }

    // If the first poke is Mr Mime, make sure the second half has the first letter capitalised.
    const fusionName =
      firstPoke.number === MR_MIME
        ? firstHalf + toSentenceCase(secondHalf)
        : firstHalf + secondHalf;

    const forbiddenVowelRepeats = /(aaa|eee|ii|ooo|uu)/gi;

    fusionName.replace(forbiddenVowelRepeats, (match) => match.slice(1));

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
