import { InstallProvider, Installation } from "@slack/oauth";
import { createClient } from "redis";

const client = createClient(process.env.REDIS_URL || "");

export const installer = new InstallProvider({
  clientId: process.env.SLACK_CLIENT_ID || "",
  clientSecret: process.env.SLACK_CLIENT_SECRET || "",
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
