import { createEventAdapter } from "@slack/events-api";
import { WebClient } from "@slack/web-api";
import { PrismaClient } from "@prisma/client";

import { installer } from "../../lib/slack/installer";
import { MentionEvent } from "../../lib/slack";
import { RESPONDERS } from "../../lib/responders";

const prisma = new PrismaClient();

const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET || "");

slackEvents.on("app_mention", async (event: MentionEvent) => {
  const installData = await installer.authorize({ teamId: event.team });
  const web = new WebClient(installData.botToken);

  RESPONDERS.forEach(async (r) => {
    const sanitizedText = event.text.toLowerCase().replace("’", "'");
    if (sanitizedText.includes(r.triggerPhrase.toLowerCase())) {
      r.respond(event, web, prisma);
    }
  });
});

export default slackEvents.requestListener();

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};
