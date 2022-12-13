import { InstallProvider } from "@slack/oauth";
import db from "../database";
import { Installation } from "../database/entity";

export const installer = new InstallProvider({
  clientId: process.env.SLACK_CLIENT_ID || "",
  clientSecret: process.env.SLACK_CLIENT_SECRET || "",
  stateSecret: "hehe-gravel-lol",
  installationStore: {
    storeInstallation: async (installation) => {
      if (!installation.isEnterpriseInstall && installation.team != null) {
        db.createQueryBuilder()
          .insert()
          .into(Installation)
          .values({
            teamId: installation.team.id,
            installation: JSON.stringify(installation),
          })
          .execute();
      } else {
        throw new Error("Not supported");
      }
    },
    fetchInstallation: async (installQuery) => {
      if (!installQuery.isEnterpriseInstall && installQuery.teamId != null) {
        const installation = await db
          .getRepository(Installation)
          .createQueryBuilder("installation")
          .where("teamId = :id", { id: installQuery.teamId })
          .getOne();
        return JSON.parse(installation.installation);
      } else {
        throw new Error("Not supported");
      }
    },
  },
});
