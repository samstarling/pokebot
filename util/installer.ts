import { InstallProvider, Installation } from "@slack/oauth";
import { createClient } from "redis";

const client = createClient(process.env.REDIS_URL || "");

export const installer = new InstallProvider({
  clientId: process.env.SLACK_CLIENT_ID || "",
  clientSecret: process.env.SLACK_CLIENT_SECRET || "",
  stateSecret: "hehe-gravel-lol",
  installationStore: {
    storeInstallation: async (installation) => {
      console.log("Client set", installation.team.id);
      client.set(
        installation.team.id,
        JSON.stringify(installation),
        function (err, reply) {
          console.log("Reply is", reply);
          console.error("Error is", err);
        }
      );
      return Promise.resolve();
    },
    fetchInstallation: async (installQuery) => {
      console.log("Client get", installQuery.teamId);
      client.get(installQuery.teamId, function (err, reply) {
        console.log("Reply is", reply);
        console.error("Error is", err);

        if (reply == null) {
          return Promise.reject();
        }

        const installation: Installation = JSON.parse(reply);
        return Promise.resolve(installation);
      });

      return Promise.reject();
    },
  },
});
