import type { NextApiRequest, NextApiResponse } from "next";

import { installer } from "../../../lib/slack/installer";

export default async function (_: NextApiRequest, res: NextApiResponse) {
  const result = await installer.generateInstallUrl({
    scopes: [
      "app_mentions:read",
      "chat:write",
      "chat:write.customize",
      "users:read",
    ],
    userScopes: ["users:read"],
  });
  res.status(200).json({ url: result });
}
