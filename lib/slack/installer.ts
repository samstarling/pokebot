import { InstallProvider } from "@slack/oauth";
import getDataSource from "../database";
import db from "../database";
import { Installation } from "../database/entity";

export const installer = new InstallProvider({
  clientId: process.env.SLACK_CLIENT_ID || "",
  clientSecret: process.env.SLACK_CLIENT_SECRET || "",
  stateSecret: "hehe-gravel-lol",
  installationStore: {
    storeInstallation: async (installation) => {
      if (!installation.isEnterpriseInstall && installation.team != null) {
        const db = await getDataSource();
        db.createQueryBuilder()
          .insert()
          .into(Installation)
          .values({
            teamId: installation.team.id,
            installation: JSON.stringify(installation),
          })
          .orUpdate(["installation"], ["teamId"])
          .execute();
      } else {
        throw new Error("Not supported");
      }
    },
    fetchInstallation: async (installQuery) => {
      if (!installQuery.isEnterpriseInstall && installQuery.teamId != null) {
        const db = await getDataSource();

        const installation = await db
          .getRepository(Installation)
          .createQueryBuilder("installation")
          .where("installation.teamId = :id", { id: installQuery.teamId })
          .getOne();
        return JSON.parse(installation.installation);
      } else {
        throw new Error("Not supported");
      }
    },
  },
});
