import { createEventAdapter } from "@slack/events-api";
import { WebClient } from "@slack/web-api";

import { installer } from "../../lib/slack/installer";
import { POKEMON, TERRIBLE_POKEMON } from "../../lib/pokemon";

const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET || "");

const THANK_YOUS = [
  "You're very welcome",
  "No problem",
  "No worries mate",
  "Any time",
];

type MentionEvent = {
  channel: string;
  text: string;
  user: string;
  team: string;
  enterprise_id: string;
};

const pickOne = <T>(items: T[]): T => {
  return items[Math.floor(Math.random() * items.length)];
};

const pickPokemon = async (event: MentionEvent) => {
  const installData = await installer.authorize({ teamId: event.team });
  const web = new WebClient(installData.botToken);

  if (
    event.text.toLowerCase().includes("Who’s that Pokémon?".toLowerCase()) ||
    event.text.toLowerCase().includes("Who's that Pokémon?".toLowerCase())
  ) {
    var result = pickOne(POKEMON);

    await web.chat.postMessage({
      channel: event.channel,
      text: `<@${event.user}>: :${result.name.english.toLowerCase()}: It’s ${
        result.name.english
      }!`,
    });
  }

  if (
    event.text.toLowerCase().includes("thanks") ||
    event.text.toLowerCase().includes("thank you")
  ) {
    await web.chat.postMessage({
      channel: event.channel,
      text: `<@${event.user}> ${pickOne(THANK_YOUS)}`,
    });
  }

  if (event.text.toLowerCase().includes("reroll")) {
    if (new Date().getDay() == 5) {
      var result = pickOne(POKEMON);
      await web.chat.postMessage({
        channel: event.channel,
        text: `<@${event.user}>: :${result.name.english.toLowerCase()}: It’s ${
          result.name.english
        }!`,
      });
    } else {
      await web.chat.postMessage({
        channel: event.channel,
        text: `<@${event.user}> Sorry, only on a Friday`,
      });
    }
  }

  if (event.text.toLowerCase().includes("help")) {
    await web.chat.postMessage({
      channel: event.channel,
      text: `<@${event.user}> There is no help, just roll a damn Pokémon already`,
    });
  }
};

slackEvents.on("app_mention", pickPokemon);

export default slackEvents.requestListener();

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};
