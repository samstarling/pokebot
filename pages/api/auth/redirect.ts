import type { NextApiRequest, NextApiResponse } from "next";

import { InstallProvider, Installation } from "@slack/oauth";
import { createClient } from "redis";

const client = createClient(process.env.REDIS_URL || "");

const installer = new InstallProvider({
  clientId: process.env.SLACK_CLIENT_ID || "",
  clientSecret: process.env.SLACK_CLIENT_SECRET || "",
  stateSecret: "my-state-secret",
  installationStore: {
    storeInstallation: (installation) => {
      client.set(installation.team.id, JSON.stringify(installation));
      return Promise.resolve();
    },
    fetchInstallation: (installQuery) => {
      client.get(installQuery.teamId, function (err, reply) {
        const installation: Installation = JSON.parse(reply || "");
        return Promise.resolve(installation);
      });

      return Promise.reject();
    },
  },
});

export default function (req: NextApiRequest, res: NextApiResponse) {
  installer.handleCallback(req, res);
}