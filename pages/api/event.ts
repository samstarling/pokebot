import "reflect-metadata";

import { Pokemon, Roll } from "../../lib/database/entity";
import { createEventAdapter } from "@slack/events-api";
import { WebClient } from "@slack/web-api";
import { installer } from "../../lib/slack/installer";
import { MentionEvent } from "../../lib/slack";
import { RESPONDERS } from "../../lib/responders";
import getDataSource from "../../lib/database";

const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET || "");

slackEvents.on("app_mention", async (event: MentionEvent) => {
  const connection = await getDataSource();
  const pokeRepo = connection.getRepository(Pokemon);
  const rollRepo = connection.getRepository(Roll);

  const installData = await installer.authorize({
    teamId: event.team,
    isEnterpriseInstall: false,
    enterpriseId: event.enterprise_id,
  });
  const client = new WebClient(installData.botToken);
  const sanitizedText = event.text.toLowerCase().replace("’", "'");

  console.log("Recieved app mention:", sanitizedText);

  for (const r of RESPONDERS) {
    if (sanitizedText.includes(r.triggerPhrase.toLowerCase())) {
      await r.respond({ event, client, pokeRepo, rollRepo });
    }
  }
});

export default slackEvents.requestListener();

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};
