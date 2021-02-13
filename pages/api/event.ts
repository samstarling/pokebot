import "reflect-metadata";

import { Pokemon, Roll } from "../../src/entity";
import { createEventAdapter } from "@slack/events-api";
import { WebClient } from "@slack/web-api";
import { installer } from "../../lib/slack/installer";
import { MentionEvent } from "../../lib/slack";
import { RESPONDERS } from "../../lib/responders";
import initializeDatabase from "../../initializers/database";

const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET || "");

slackEvents.on("app_mention", async (event: MentionEvent) => {
  console.log("Start mention");

  const connection = await initializeDatabase();
  const pokeRepo = connection.getRepository(Pokemon);
  const rollRepo = connection.getRepository(Roll);

  const installData = await installer.authorize({
    teamId: event.team,
    isEnterpriseInstall: false,
    enterpriseId: event.enterprise_id,
  });
  const client = new WebClient(installData.botToken);
  const sanitizedText = event.text.toLowerCase().replace("’", "'");

  for (const r of RESPONDERS) {
    if (sanitizedText.includes(r.triggerPhrase.toLowerCase())) {
      const x = await r.respond({ event, client, pokeRepo, rollRepo });
      console.log(x);
    }
  }

  console.log("Close");
  await connection.close();
});

export default slackEvents.requestListener();

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};
