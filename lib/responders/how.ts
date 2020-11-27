const GIFS = [
  "https://media.giphy.com/media/xuXzcHMkuwvf2/giphy.gif",
  "https://media.giphy.com/media/tlKTIYel9FlTO/giphy.gif",
  "https://media.giphy.com/media/10LKovKon8DENq/giphy.gif",
  "https://media.giphy.com/media/slVWEctHZKvWU/giphy.gif",
  "https://media.giphy.com/media/U2nN0ridM4lXy/giphy.gif",
  "https://media.giphy.com/media/LxSFsOTa3ytEY/giphy.gif",
  "https://media.giphy.com/media/jXOxSiAx5UVnq/giphy.gif",
  "https://media.giphy.com/media/QzxONYL3xbj6E/giphy.gif",
  "https://media.giphy.com/media/tVlVQSoY7g8H6/giphy.gif",
  "https://media.giphy.com/media/3xgR6JaucMaXe/giphy.gif",
  "https://media.giphy.com/media/2KOUaMezKiaic/giphy.gif",
  "https://media.giphy.com/media/Tf3mp01bfrrUc/giphy.gif",
  "https://media.giphy.com/media/Rz7prL2OpPqAE/giphy.gif",
  "https://media.giphy.com/media/7ISIRaCMrgFfa/giphy.gif",
  "https://media.giphy.com/media/68kKd6gmSKYww/giphy.gif",
  "https://media.giphy.com/media/ubEwB9ZVYtfyg/giphy.gif",
  "https://media.giphy.com/media/SeysxkSfenHY4/giphy.gif",
  "https://media.giphy.com/media/xpimAN70XUNkQ/giphy.gif",
  "https://media.giphy.com/media/FfeRInbWdg0nu/giphy.gif",
  "https://media.giphy.com/media/5Qr4fbn9mCMc8/giphy.gif",
  "https://media.giphy.com/media/eeeg01PfnAR68/giphy.gif",
  "https://media.giphy.com/media/hQHmYXd8D56ww/giphy.gif",
  "https://media.giphy.com/media/2zQ9XninYAmNa/giphy.gif",
  "https://media.giphy.com/media/DzPuv2b9H6nao/giphy.gif",
  "https://media.giphy.com/media/zBqMY5R0QtIKk/giphy.gif",
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
      text: gif,
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
