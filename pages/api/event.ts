import { createEventAdapter } from "@slack/events-api";
import { WebClient } from "@slack/web-api";
import { PrismaClient } from "@prisma/client";

import { installer } from "../../lib/slack/installer";
import { POKEMON } from "../../lib/pokemon";

const prisma = new PrismaClient();

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
    const result = pickOne(POKEMON);

    await prisma.roll.create({
      data: {
        teamId: event.team,
        userId: event.user,
        pokemonNumber: result.id,
      },
    });

    const emoji = result.emoji || result.name.english.toLowerCase();
    await web.chat.postMessage({
      channel: event.channel,
      text: `<@${event.user}>: :${emoji}: It’s ${result.name.english}!`,
    });
  }

  if (
    event.text.toLowerCase().includes("Who’s my Pokémon?".toLowerCase()) ||
    event.text.toLowerCase().includes("Who's my Pokémon?".toLowerCase())
  ) {
    const rolls = await prisma.roll.findMany({
      where: { teamId: event.team, userId: event.user },
      orderBy: { createdAt: "desc" },
      take: 1,
    });

    if (rolls[0] == null) {
      await web.chat.postMessage({
        channel: event.channel,
        text: `<@${event.user}>: You don't have one!`,
      });
      return;
    }

    const roll = rolls[0];
    const result = POKEMON[roll.pokemonNumber - 1];
    const emoji = result.emoji || result.name.english.toLowerCase();
    await web.chat.postMessage({
      channel: event.channel,
      text: `<@${event.user}>: Your last roll was :${emoji}: ${result.name.english}`,
    });
  }

  if (
    event.text.toLowerCase().includes("How’s my Pokémon?".toLowerCase()) ||
    event.text.toLowerCase().includes("How's my Pokémon?".toLowerCase())
  ) {
    const rolls = await prisma.roll.findMany({
      where: { teamId: event.team, userId: event.user },
      orderBy: { createdAt: "desc" },
      take: 1,
    });

    if (rolls[0] == null) {
      await web.chat.postMessage({
        channel: event.channel,
        text: `<@${event.user}>: You don't have one!`,
      });
      return;
    }

    const roll = rolls[0];
    const result = POKEMON[roll.pokemonNumber - 1];
    const emoji = result.emoji || result.name.english.toLowerCase();
    await web.chat.postMessage({
      channel: event.channel,
      text: [
        `<@${event.user}>: :${emoji}: ${result.name.english}`,
        `*HP:* ${result.base.HP}`,
        `*Attack:* ${result.base.Attack}`,
        `*Defense:* ${result.base.Defense}`,
      ].join("\n"),
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
        text: `<@${event.user}>: :${
          result.emoji ?? result.name.english.toLowerCase()
        }: It’s ${result.name.english}!`,
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
