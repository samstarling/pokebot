import "reflect-metadata";

import { createEventAdapter } from "@slack/events-api";
import { WebClient } from "@slack/web-api";

import { installer } from "../../lib/slack/installer";
import { MentionEvent } from "../../lib/slack";
import { RESPONDERS } from "../../lib/responders";

import { createConnection } from "typeorm";
import { Pokemon, Roll } from "../../src/entity";

const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET || "");

createConnection({
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: [Pokemon, Roll],
  schema: "public",
  synchronize: false,
  logging: true,
})
  .then(async (connection) => {
    const pokeRepo = connection.getRepository(Pokemon);
    const rollRepo = connection.getRepository(Roll);

    slackEvents.on("app_mention", async (event: MentionEvent) => {
      const installData = await installer.authorize({
        teamId: event.team,
        isEnterpriseInstall: false,
        enterpriseId: event.enterprise_id,
      });
      const client = new WebClient(installData.botToken);

      RESPONDERS.forEach(async (r) => {
        const sanitizedText = event.text.toLowerCase().replace("’", "'");
        if (sanitizedText.includes(r.triggerPhrase.toLowerCase())) {
          r.respond({ event, client, pokeRepo, rollRepo });
        }
      });
    });
  })
  .catch((error) => console.log(error));

export default slackEvents.requestListener();

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};
