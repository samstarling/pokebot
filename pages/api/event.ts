import { createEventAdapter } from "@slack/events-api";
import { WebClient } from "@slack/web-api";
import { PrismaClient } from "@prisma/client";

import { installer } from "../../lib/slack/installer";
import { POKEMON, emojiFor } from "../../lib/pokemon";
import { type } from "os";

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

type Responder = {
  id: string;
  triggerPhrase: string;
  respond: (event: MentionEvent, client: WebClient) => void;
};

const AssignPokemon: Responder = {
  id: "whos-that-pokemon",
  triggerPhrase: "Who's that Pokémon?",
  respond: async (event: MentionEvent, client: WebClient) => {
    const result = pickOne(POKEMON);

    await prisma.roll.create({
      data: {
        teamId: event.team,
        userId: event.user,
        pokemonNumber: result.id,
      },
    });

    await client.chat.postMessage({
      channel: event.channel,
      text: `<@${event.user}>: :${emojiFor(result)}: It’s ${
        result.name.english
      }!`,
    });
  },
};

const QueryLatest: Responder = {
  id: "query-latest-pokemon",
  triggerPhrase: "Who's my Pokémon?",
  respond: async (event: MentionEvent, client: WebClient) => {
    const rolls = await prisma.roll.findMany({
      where: { teamId: event.team, userId: event.user },
      orderBy: { createdAt: "desc" },
      take: 1,
    });

    if (rolls[0] == null) {
      await client.chat.postMessage({
        channel: event.channel,
        text: `<@${event.user}>: You don't have one!`,
      });
      return;
    }

    const roll = rolls[0];
    const result = POKEMON[roll.pokemonNumber - 1];
    await client.chat.postMessage({
      channel: event.channel,
      text: `<@${event.user}>: Your last roll was :${emojiFor(result)}: ${
        result.name.english
      }`,
    });
  },
};

const QueryStats: Responder = {
  id: "query-stats",
  triggerPhrase: "How's my Pokémon?",
  respond: async (event: MentionEvent, client: WebClient) => {
    const rolls = await prisma.roll.findMany({
      where: { teamId: event.team, userId: event.user },
      orderBy: { createdAt: "desc" },
      take: 1,
    });

    if (rolls[0] == null) {
      await client.chat.postMessage({
        channel: event.channel,
        text: `<@${event.user}>: You don't have one!`,
      });
      return;
    }

    const roll = rolls[0];
    const result = POKEMON[roll.pokemonNumber - 1];
    const emoji = result.emoji || result.name.english.toLowerCase();
    await client.chat.postMessage({
      channel: event.channel,
      text: [
        `<@${event.user}>: :${emoji}: ${result.name.english}`,
        `*HP:* ${result.base.HP}`,
        `*Attack:* ${result.base.Attack}`,
        `*Defense:* ${result.base.Defense}`,
      ].join("\n"),
    });
  },
};

const Thanks: Responder = {
  id: "thanks",
  triggerPhrase: "Thanks",
  respond: async (event: MentionEvent, client: WebClient) => {
    await client.chat.postMessage({
      channel: event.channel,
      text: `<@${event.user}> ${pickOne(THANK_YOUS)}`,
    });
  },
};

const Reroll: Responder = {
  id: "reroll",
  triggerPhrase: "Reroll",
  respond: async (event: MentionEvent, client: WebClient) => {
    if (new Date().getDay() == 5) {
      var result = pickOne(POKEMON);
      await client.chat.postMessage({
        channel: event.channel,
        text: `<@${event.user}>: :${
          result.emoji ?? result.name.english.toLowerCase()
        }: It’s ${result.name.english}!`,
      });
    } else {
      await client.chat.postMessage({
        channel: event.channel,
        text: `<@${event.user}> Sorry, only on a Friday`,
      });
    }
  },
};

const Help: Responder = {
  id: "help",
  triggerPhrase: "Help",
  respond: async (event: MentionEvent, client: WebClient) => {
    await client.chat.postMessage({
      channel: event.channel,
      text: `<@${event.user}> There is no help, just roll a damn Pokémon already`,
    });
  },
};

slackEvents.on("app_mention", async (event: MentionEvent) => {
  const installData = await installer.authorize({ teamId: event.team });
  const web = new WebClient(installData.botToken);

  [AssignPokemon, QueryLatest, QueryStats, Thanks, Reroll, Help].forEach(
    async (r) => {
      const sanitizedText = event.text.toLowerCase().replace("’", "'");
      if (sanitizedText.includes(r.triggerPhrase.toLowerCase())) {
        r.respond(event, web);
      }
    }
  );
});

export default slackEvents.requestListener();

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};
