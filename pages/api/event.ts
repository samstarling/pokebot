import { createEventAdapter } from "@slack/events-api";
import { WebClient } from "@slack/web-api";

import { installer } from "../../util/installer";

const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET || "");

const TERRIBLE_POKEMON = ["Rattata", "Weedle", "Metapod", "Pidgey"];

const THANK_YOUS = [
  "You're very welcome",
  "No problem",
  "No worries mate",
  "Any time",
];

const POKEMON = [
  "Bulbasaur",
  "Ivysaur",
  "Venusaur",
  "Charmander",
  "Charmeleon",
  "Charizard",
  "Squirtle",
  "Wartortle",
  "Blastoise",
  "Caterpie",
  "Metapod",
  "Butterfree",
  "Weedle",
  "Kakuna",
  "Beedrill",
  "Pidgey",
  "Pidgeotto",
  "Pidgeot",
  "Rattata",
  "Raticate",
  "Spearow",
  "Fearow",
  "Ekans",
  "Arbok",
  "Pikachu",
  "Raichu",
  "Sandshrew",
  "Sandslash",
  "Nidoran♀",
  "Nidorina",
  "Nidoqueen",
  "Nidoran♂",
  "Nidorino",
  "Nidoking",
  "Clefairy",
  "Clefable",
  "Vulpix",
  "Ninetales",
  "Jigglypuff",
  "Wigglytuff",
  "Zubat",
  "Golbat",
  "Oddish",
  "Gloom",
  "Vileplume",
  "Paras",
  "Parasect",
  "Venonat",
  "Venomoth",
  "Diglett",
  "Dugtrio",
  "Meowth",
  "Persian",
  "Psyduck",
  "Golduck",
  "Mankey",
  "Primeape",
  "Growlithe",
  "Arcanine",
  "Poliwag",
  "Poliwhirl",
  "Poliwrath",
  "Abra",
  "Kadabra",
  "Alakazam",
  "Machop",
  "Machoke",
  "Machamp",
  "Bellsprout",
  "Weepinbell",
  "Victreebel",
  "Tentacool",
  "Tentacruel",
  "Geodude",
  "Graveler",
  "Golem",
  "Ponyta",
  "Rapidash",
  "Slowpoke",
  "Slowbro",
  "Magnemite",
  "Magneton",
  "Farfetch'd",
  "Doduo",
  "Dodrio",
  "Seel",
  "Dewgong",
  "Grimer",
  "Muk",
  "Shellder",
  "Cloyster",
  "Gastly",
  "Haunter",
  "Gengar",
  "Onix",
  "Drowzee",
  "Hypno",
  "Krabby",
  "Kingler",
  "Voltorb",
  "Electrode",
  "Exeggcute",
  "Exeggutor",
  "Cubone",
  "Marowak",
  "Hitmonlee",
  "Hitmonchan",
  "Lickitung",
  "Koffing",
  "Weezing",
  "Rhyhorn",
  "Rhydon",
  "Chansey",
  "Tangela",
  "Kangaskhan",
  "Horsea",
  "Seadra",
  "Goldeen",
  "Seaking",
  "Staryu",
  "Starmie",
  "Mr. Mime",
  "Scyther",
  "Jynx",
  "Electabuzz",
  "Magmar",
  "Pinsir",
  "Tauros",
  "Magikarp",
  "Gyarados",
  "Lapras",
  "Ditto",
  "Eevee",
  "Vaporeon",
  "Jolteon",
  "Flareon",
  "Porygon",
  "Omanyte",
  "Omastar",
  "Kabuto",
  "Kabutops",
  "Aerodactyl",
  "Snorlax",
  "Articuno",
  "Zapdos",
  "Moltres",
  "Dratini",
  "Dragonair",
  "Dragonite",
  "Mewtwo",
  "Mew",
];

type MentionEvent = {
  channel: string;
  text: string;
  user: string;
  team: string;
  enterprise_id: string;
};

const pickOne = (items: string[]): string => {
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
    if (event.user === "U0118G54YLT") {
      result = pickOne(TERRIBLE_POKEMON);
    }

    await web.chat.postMessage({
      channel: event.channel,
      text: `<@${event.user}>: :${result.toLowerCase()}: It’s ${result}!`,
    });
  }

  if (
    event.text.toLowerCase().includes("thanks") ||
    event.text.toLowerCase().includes("thank you")
  ) {
    await web.chat.postMessage({
      channel: event.channel,
      text: `<@${event.user}>: ${pickOne(THANK_YOUS)}`,
    });
  }
};

const logError = (error: {}) => {
  console.error("Error:", error);
};

slackEvents.on("app_mention", pickPokemon);
slackEvents.on("error", logError);

export default slackEvents.requestListener();

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};
