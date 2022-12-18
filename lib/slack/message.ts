import { Block, KnownBlock, MrkdwnElement } from "@slack/web-api";

import { Pokemon } from "../database/entity";
import { imageFor, renderType } from "../pokemon";

export const blocksFor = (
  pokemon: Pokemon,
  status: string
): (Block | KnownBlock)[] => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: status,
      },
      fields: fieldsFor(pokemon),
      accessory: {
        type: "image",
        image_url: imageFor(pokemon),
        alt_text: pokemon.name,
      },
    },
  ];
};

export const fieldsFor = (pokemon: Pokemon): MrkdwnElement[] => {
  let fields: MrkdwnElement[] = [];
  if (pokemon.isLegendary) {
    fields.push({
      type: "mrkdwn",
      text: ":sparkles: Legendary",
    });
  }
  fields = fields.concat([
    {
      type: "mrkdwn",
      text: renderType(pokemon),
    },
    {
      type: "mrkdwn",
      text: `*HP*: ${pokemon.hp}`,
    },
    {
      type: "mrkdwn",
      text: `*Attack*: ${pokemon.attack}`,
    },
    {
      type: "mrkdwn",
      text: `*Defense*: ${pokemon.defense}`,
    },
    {
      type: "mrkdwn",
      text: `*Speed*: ${pokemon.speed}`,
    },
    {
      type: "mrkdwn",
      text: `*Sp. Attack*: ${pokemon.specialAttack}`,
    },
    {
      type: "mrkdwn",
      text: `*Sp. Defense*: ${pokemon.specialDefense}`,
    },
  ]);

  return fields;
};
