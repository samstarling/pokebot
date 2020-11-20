import { InstallProvider, Installation } from "@slack/oauth";
import { createClient } from "redis";

const client = createClient(process.env.REDIS_URL || "");

export const installer = new InstallProvider({
  clientId: process.env.SLACK_CLIENT_ID || "",
  clientSecret: process.env.SLACK_CLIENT_SECRET || "",
  stateSecret: "hehe-gravel-lol",
  installationStore: {
    storeInstallation: (installation) => {
      return new Promise(function (resolve, _) {
        console.log("Client set", installation);
        client.set(
          installation.team.id,
          JSON.stringify(installation),
          function (err, reply) {
            console.log("Reply is", reply);
            console.error("Error is", err);
          }
        );
        resolve();
      });
    },
    fetchInstallation: (installQuery) => {
      return new Promise(function (resolve, reject) {
        console.log("Client get", installQuery.teamId);
        client.get(installQuery.teamId, function (err, reply) {
          console.log("Reply is", reply);
          console.error("Error is", err);

          if (reply == null) {
            return reject();
          }

          const installation: Installation = JSON.parse(reply);
          return resolve(installation);
        });
      });
    },
  },
});
