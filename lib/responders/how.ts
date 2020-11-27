const GIFS = [
  "https://media.giphy.com/media/xuXzcHMkuwvf2/200.gif",
  "https://media.giphy.com/media/tlKTIYel9FlTO/200.gif",
  "https://media.giphy.com/media/10LKovKon8DENq/200.gif",
  "https://media.giphy.com/media/slVWEctHZKvWU/200.gif",
  "https://media.giphy.com/media/U2nN0ridM4lXy/200.gif",
  "https://media.giphy.com/media/LxSFsOTa3ytEY/200.gif",
  "https://media.giphy.com/media/jXOxSiAx5UVnq/200.gif",
  "https://media.giphy.com/media/QzxONYL3xbj6E/200.gif",
  "https://media.giphy.com/media/tVlVQSoY7g8H6/200.gif",
  "https://media.giphy.com/media/3xgR6JaucMaXe/200.gif",
  "https://media.giphy.com/media/2KOUaMezKiaic/200.gif",
  "https://media.giphy.com/media/Tf3mp01bfrrUc/200.gif",
  "https://media.giphy.com/media/Rz7prL2OpPqAE/200.gif",
  "https://media.giphy.com/media/7ISIRaCMrgFfa/200.gif",
  "https://media.giphy.com/media/68kKd6gmSKYww/200.gif",
  "https://media.giphy.com/media/ubEwB9ZVYtfyg/200.gif",
  "https://media.giphy.com/media/SeysxkSfenHY4/200.gif",
  "https://media.giphy.com/media/xpimAN70XUNkQ/200.gif",
  "https://media.giphy.com/media/FfeRInbWdg0nu/200.gif",
  "https://media.giphy.com/media/5Qr4fbn9mCMc8/200.gif",
  "https://media.giphy.com/media/eeeg01PfnAR68/200.gif",
  "https://media.giphy.com/media/hQHmYXd8D56ww/200.gif",
  "https://media.giphy.com/media/2zQ9XninYAmNa/200.gif",
  "https://media.giphy.com/media/DzPuv2b9H6nao/200.gif",
  "https://media.giphy.com/media/zBqMY5R0QtIKk/200.gif",
];

export const pickOne = <T>(items: T[]): T => {
  return items[Math.floor(Math.random() * items.length)];
};

import { WebClient } from "@slack/web-api";
import { MentionEvent } from "../slack";
import { Responder } from "./";

export default {
  id: "help",
  triggerPhrase: "How's that Pokémon?",
  respond: async (event: MentionEvent, client: WebClient) => {
    const gif = pickOne(GIFS);
    await client.chat.postMessage({
      channel: event.channel,
      text: "",
      blocks: [
        {
          type: "image",
          image_url: gif,
          alt_text: "It's a GIF of a Pokémon, OK?",
        },
      ],
    });
  },
} as Responder;
